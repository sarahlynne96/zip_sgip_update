// === Revised SGIP Calculator Script with Median Income Note ===
// Dependencies: Google Maps JS API (places & geocoder) & html2pdf.js

// --- County AMI Data (4-person AMI) ---
const COUNTY_AMI = {"Alameda":159800,"Alpine":129500, /* ... all counties ... */ "Yolo":135900,"Yuba":98900};
const SIZE_ADJ = [0.7,0.8,0.9,1,1.08,1.16,1.24,1.32];

// --- Utility ---
const money = val => isNaN(val)? 'N/A' : val.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});

// --- Populate counties and add median note ---
function populateCounties(){
  const sel = document.getElementById('county');
  sel.innerHTML = '<option value="" disabled selected>Choose county…</option>' +
    Object.keys(COUNTY_AMI).sort().map(c=>`<option value="${c}">${c}</option>`).join('');

  // Insert median note element if missing
  if(!document.getElementById('medianNote')){
    const note = document.createElement('small');
    note.id = 'medianNote';
    note.className = 'note';
    sel.parentNode.insertBefore(note, sel.nextSibling);
  }
}

// --- Low-income threshold ---
function lowIncomeThreshold(county,size){
  const base=COUNTY_AMI[county]; if(!base||isNaN(size)) return null;
  const idx=Math.min(Math.max(size-1,0),SIZE_ADJ.length-1);
  return base * SIZE_ADJ[idx] * 0.8;
}

// --- Update median note ---
function updateMedianNote(county){
  const noteEl=document.getElementById('medianNote');
  if(county && COUNTY_AMI[county]){
    noteEl.textContent = `Area Median Income (4‑person) for ${county}: ${money(COUNTY_AMI[county])}`;
  } else {
    noteEl.textContent = '';
  }
}

// --- ArcGIS & geocode functions omitted for brevity ---
// (checkDAC, checkPSPS, checkHFTD, geocodeAddress, fetchFeatures)

// --- Form submission ---
async function onSubmit(e){ /* unchanged */ }

// --- Initialize ---
document.addEventListener('DOMContentLoaded',()=>{
  populateCounties();
  // Show median when user picks county
  document.getElementById('county').addEventListener('change', e=>{
    updateMedianNote(e.target.value);
  });
  // Attach form
  const form=document.getElementById('calcForm'); if(form) form.addEventListener('submit',onSubmit);
  // Autocomplete
  if(window.google && google.maps && google.maps.places){
    new google.maps.places.Autocomplete(document.getElementById('address'),{types:['address'],componentRestrictions:{country:'us'}});
  }
});
