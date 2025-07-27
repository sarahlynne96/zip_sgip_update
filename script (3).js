// === Revised SGIP Calculator Script ===
// Dependencies: Google Maps JS API (places & geocoder) & html2pdf.js

// --- County AMI Data ---
const COUNTY_AMI = { /* ... same as before ... */ };
const SIZE_ADJ = [0.7,0.8,0.9,1,1.08,1.16,1.24,1.32];

// --- Utility Functions ---
const money = val => isNaN(val)? 'N/A' : val.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
const rateFmt = val => isNaN(val)? 'N/A' : `$${val.toFixed(2)}`;

// --- Populate counties dropdown ---
function populateCounties(){
  const sel = document.getElementById('county');
  if(!sel) return;
  const options = Object.keys(COUNTY_AMI)
    .sort()
    .map(c => `<option value="${c}">${c}</option>`)
    .join('');
  sel.innerHTML = '<option value="" disabled selected>Choose county…</option>' + options;
}

// --- Compute low-income threshold ---
function lowIncomeThreshold(county,size){
  const base = COUNTY_AMI[county];
  if(!base || isNaN(size)) return null;
  const idx = Math.min(Math.max(size-1,0), SIZE_ADJ.length-1);
  return base * SIZE_ADJ[idx] * 0.8;
}

// --- ArcGIS feature query ---
async function fetchFeatures(url){
  try {
    const resp = await fetch(url);
    if(!resp.ok) throw new Error('Network response not ok');
    const data = await resp.json();
    return data.features || [];
  } catch (err) {
    console.error('ArcGIS fetch error:', err);
    return [];
  }
}
async function checkDAC(lat,lng){
  const url = `https://gis.data.ca.gov/...&geometry=${lng},${lat}&...`; // full URL
  const feats = await fetchFeatures(url);
  return feats.some(f => f.attributes.SB535 === 'Y');
}
async function checkHFTD(lat,lng){
  const url = `https://services2.arcgis.com/...FHSZONES&geometry=${lng},${lat}&...`;
  const feats = await fetchFeatures(url);
  return feats.some(f => ['2','3'].includes(String(f.attributes.FHSZONES)));
}
async function checkPSPS(lat,lng){
  const url = `https://services2.arcgis.com/.../PSPS_Events_Layer/...&geometry=${lng},${lat}&...`;
  const feats = await fetchFeatures(url);
  return feats.length > 0;
}

// --- Geocoding address ---
function geocodeAddress(address){
  return new Promise(resolve => {
    if(!window.google || !google.maps) return resolve(null);
    new google.maps.Geocoder().geocode({address}, (results, status) => {
      if(status==='OK' && results[0]){
        const loc = results[0].geometry.location;
        resolve({lat: loc.lat(), lng: loc.lng()});
      } else {
        console.warn('Geocode failed:', status);
        resolve(null);
      }
    });
  });
}

// --- Form submission handler ---
async function onSubmit(e){
  e.preventDefault();
  const form = e.target;
  const out = document.getElementById('result');
  const btn = form.querySelector('button[type=submit]');
  out.innerHTML = ''; out.style.display = 'none';
  btn.disabled = true;

  const data = Object.fromEntries(new FormData(form));
  const county = data.county;
  const size = parseInt(data.hhSize,10);
  const income = parseFloat(data.hhIncome);
  const custType = data.custType;

  // Validate inputs
  if(!county || isNaN(size) || isNaN(income) || !custType){
    alert('Please complete all required fields.');
    btn.disabled = false;
    return;
  }

  // Income threshold
  const thresh = lowIncomeThreshold(county,size);
  const isLow = income <= thresh;

  // Build results array
  const results = [];
  if(isLow) results.push(`Low-income Equity Storage track`);
  if(data.dacFlag==='yes' || data.pspsFlag==='yes') results.push(`Equity Resiliency track`);
  if(custType==='single' && !isLow) results.push(`General Market Storage track`);
  if(results.length===0) results.push('No tracks found for these inputs.');

  // Map checks
  let mapNotes = '';
  if(data.address){
    const geo = await geocodeAddress(data.address);
    if(geo){
      const [dac, psps, hftd] = await Promise.all([
        checkDAC(geo.lat,geo.lng),
        checkPSPS(geo.lat,geo.lng),
        checkHFTD(geo.lat,geo.lng)
      ]);
      mapNotes = `<p><strong>Map Flags:</strong> DAC=${dac}, PSPS=${psps}, HFTD=${hftd}</p>`;
    }
  }

  // Render output
  out.style.display = 'block';
  out.innerHTML = `
    <h3>Your SGIP Estimate</h3>
    <p>Total income: ${money(income)}</p>
    <p>Low-income threshold: ${money(thresh)}</p>
    <ul>${results.map(r=>`<li>${r}</li>`).join('')}</ul>
    ${mapNotes}
    <p>Contact: ${data.contactName||'N/A'} | ${data.contactPhone||'N/A'} | ${data.contactEmail||'N/A'}</p>
  `;

  // PDF download
  let pdfBtn = document.getElementById('downloadBtn');
  if(!pdfBtn){
    pdfBtn = document.createElement('button');
    pdfBtn.id = 'downloadBtn';
    pdfBtn.textContent = 'Download PDF';
    pdfBtn.addEventListener('click', () => html2pdf().from(out).set({filename:'SGIP_Estimate.pdf'}).save());
    out.appendChild(pdfBtn);
  }

  btn.disabled = false;
}

// --- Initialize on DOM ready ---
document.addEventListener('DOMContentLoaded', ()=>{
  populateCounties();
  const form = document.getElementById('calcForm');
  if(form) form.addEventListener('submit', onSubmit);
  // Setup Google Places Autocomplete
  if(window.google && google.maps && google.maps.places){
    new google.maps.places.Autocomplete(document.getElementById('address'), {types:['address'], componentRestrictions:{country:'us'}});
  }
});
