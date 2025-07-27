<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>California SGIP Eligibility & Rebate Estimator (v16)</title>
  <style>
    :root{--primary:#fdb813;--secondary:#003c71;--accent:#005eb8;--bg:#f9f9f9;--text:#333;--muted:#666;--card:#fff}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,Helvetica,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;padding:1rem 0}
    .wrapper{max-width:960px;margin:0 auto;padding:0 1rem}
    h1{text-align:center;color:var(--primary);margin-bottom:1rem;font-size:2rem}
    .note{font-size:.95rem;color:var(--muted);text-align:center;margin-bottom:1.5rem}
    .stepper{display:flex;counter-reset:step;list-style:none;margin-bottom:2rem}
    .stepper li{flex:1;text-align:center;position:relative;padding:0 .5rem}
    .stepper li::before{counter-increment:step;content:counter(step);display:inline-block;width:2rem;height:2rem;line-height:2rem;background:var(--secondary);color:#fff;border-radius:50%;margin-bottom:.5rem}
    .stepper li.active::before{background:var(--primary)}
    .stepper li:not(:last-child)::after{content:"";position:absolute;top:1rem;right:-50%;width:100%;height:2px;background:var(--muted)}
    .card, fieldset{background:var(--card);box-shadow:0 2px 6px rgba(0,0,0,0.1);border:none;border-radius:6px;padding:1rem;margin-bottom:1rem}
    legend{font-weight:600;color:var(--secondary);padding:0 .5rem}
    label{display:block;font-weight:600;color:var(--secondary);margin:.8rem 0 .3rem}
    select,input{width:100%;padding:10px;border:1px solid #ccc;border-radius:4px;font-size:1rem}
    small,#thresholdHint{display:block;margin-top:4px;color:var(--muted);font-size:.85rem}
    .tooltip{margin-left:.3rem;cursor:help;color:var(--accent);border-bottom:1px dotted var(--accent)}
    .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
    @media(max-width:768px){.grid-2{display:block}}
    details{margin-top:1rem}
    summary{font-weight:600;cursor:pointer}
    iframe{width:100%;height:250px;border:none}
    .actions{display:flex;gap:1rem;position:sticky;bottom:0;background:var(--bg);padding:1rem 0;justify-content:space-between}
    .primary-btn,.secondary-btn{flex:1;padding:12px;font-size:1rem;border-radius:4px;font-weight:600;cursor:pointer;transition:background .3s}
    .primary-btn{background:var(--primary);border:none;color:#fff}
    .primary-btn:hover{background:var(--accent)}
    .secondary-btn{background:transparent;border:1px solid var(--secondary);color:var(--secondary)}
    #incomeResult,#result{display:none;margin-top:1rem;padding:18px;background:#f0f8ff;border-left:5px solid var(--primary);border-radius:4px;font-size:1rem;opacity:0;transform:translateY(-10px);transition:opacity .3s,transform .3s}
    #incomeResult.show,#result.show{display:block;opacity:1;transform:translateY(0)}
    .badge{display:inline-block;background:var(--secondary);color:#fff;padding:.25rem .55rem;border-radius:3px;font-size:.78rem;margin-right:6px}
    .track{margin-bottom:1.5rem}
    .contact{margin-top:1rem;padding-top:1rem;border-top:1px solid #ddd}
    footer{text-align:center;color:var(--muted);font-size:.85rem;margin:3rem 0}
  </style>
</head>
<body>
  <div class="wrapper">
    <h1>California SGIP Rebate Estimator</h1>
    <p class="note">Answer a few questions to see every SGIP track and rebate estimate.</p>
    <ul class="stepper">
      <li class="active">Project</li><li>Customer</li><li>Resiliency</li><li>Size</li><li>Contact</li>
    </ul>
    <form id="calcForm" autocomplete="off" novalidate>
      <!-- 1. Project Details -->
      <div class="card">
        <fieldset>
          <legend>1. Project details</legend>
          <label for="address">Installation address <em>(optional)</em></label>
          <input id="address" name="address" placeholder="1234 Main St, Fresno CA">
          <label for="utility">Utility company</label>
          <select id="utility" name="utility" required>
            <option value="">Choose…</option><option>CSE</option><option>SCE</option><option>SCG</option><option>PG&E</option><option>LADWP</option>
          </select>
          <label for="county">County <em>(for income test)</em></label>
          <select id="county" name="county" required></select>
          <label for="hhSize">Household size</label>
          <input id="hhSize" name="hhSize" type="number" min="1" max="8" value="4">
          <label for="hhIncome">Annual household income <em class="tooltip" title="Optional for businesses">(optional)</em></label>
          <input id="hhIncome" name="hhIncome" type="number" min="0" step="1000" placeholder="e.g. 95000">
          <small id="thresholdHint"></small>
          <details>
            <summary>View SGIP Maps</summary>
            <div style="display:grid;gap:1rem">
              <iframe src="https://experience.arcgis.com/experience/1c21c53da8de48f1b946f3402fbae55c/page/SB-535-Disadvantaged-Communities/" title="Disadvantaged Communities"></iframe>
              <iframe src="https://capuc.maps.arcgis.com/apps/webappviewer/index.html?id=5bdb921d747a46929d9f00dbdb6d0fa2" title="High Fire Threat Districts"></iframe>
              <iframe src="https://capuc.maps.arcgis.com/apps/dashboards/ecd21b1c204f47da8b1fcc4c5c3b7d3a" title="PSPS Events Dashboard"></iframe>
            </div>
          </details>
        </fieldset>
      </div>
      <!-- 2 & 3 -->
      <div class="grid-2">
        <div class="card"><fieldset>
          <legend>2. Customer</legend>
          <label for="custType">Customer type</label>
          <select id="custType" name="custType" required>
            <option value="">Choose…</option><option value="single">Home – Single Family</option><option value="multi">Home – Multifamily</option><option value="nonres">Business / Non-Res</option>
          </select>
          <label for="critFlag">Medical Baseline or critical well-pump?<span class="tooltip" title="Medical baseline or critical well-pump customers">?</span></label>
          <select id="critFlag" name="critFlag" required><option value="">Choose…</option><option value="yes">Yes</option><option value="no">No</option></select>
        </fieldset></div>
        <div class="card"><fieldset>
          <legend>3. Resiliency</legend>
          <label for="dacFlag">DAC or HFTD?<span class="tooltip" title="Disadvantaged Community or High Fire Threat District">?</span></label>
          <select id="dacFlag" name="dacFlag" required><option value="">Choose…</option><option value="yes">Yes</option><option value="no">No / Unsure</option></select>
          <label for="pspsFlag">≥ 2 PSPS shut‑offs?<span class="tooltip" title="Public Safety Power Shutoff events">?</span></label>
          <select id="pspsFlag" name="pspsFlag" required><option value="">Choose…</option><option value="yes">Yes</option><option value="no">No / Unsure</option></select>
          <label for="sjvFlag">SJ Valley pilot city?<span class="tooltip" title="SJ Valley pilot cities">?</span></label>
          <select id="sjvFlag" name="sjvFlag" required><option value="">Choose…</option><option value="yes">Yes</option><option value="no">No</option></select>
        </fieldset></div>
      </div>
      <!-- 4 & 5 -->
      <div class="grid-2">
        <div class="card"><fieldset>
          <legend>4. System size</legend>
          <label for="storageKWh">Battery capacity (kWh)</label>
          <input id="storageKWh" name="storageKWh" type="number" min="0" step="0.1" required>
          <label for="solarKW">Solar array (kW) <em>(optional)</em></label>
          <input id="solarKW" name="solarKW" type="number" min="0" step="0.1">
        </fieldset></div>
        <div class="card"><fieldset>
          <legend>5. Contact details</legend>
          <label for="contactName">Full name</label><input id="contactName" name="contactName" required>
          <label for="contactPhone">Phone</label><input id="contactPhone" name="contactPhone" type="tel" required>
          <label for="contactEmail">Email</label><input id="contactEmail" name="contactEmail" type="email" required>
        </fieldset></div>
      </div>
      <div class="actions"><button type="reset" class="secondary-btn">Reset</button><button type="submit" class="primary-btn">Calculate & save</button></div>
    </form>
    <div id="incomeResult"></div>
    <div id="result"></div>
    <footer>Unofficial tool – rates as of July 27 2025. Actual rebate subject to SGIP budget & PA review.</footer>
  </div>
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDKI-mieU9BWhgNyQleYgDHHXxlNVRK_XU&libraries=places"></script>
  <script>
    const $=s=>document.querySelector(s);
    const money=v=>v.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
    const rateFmt=v=>`$${v.toFixed(2)}`;

    const COUNTY_AMI={"Alameda":159800,"Alpine":129500,"Amador":109900,"Butte":96600,"Calaveras":101500,"Colusa":96400,"Contra Costa":159800,"Del Norte":93900,"El Dorado":120800,"Fresno":93900,"Glenn":93900,"Humboldt":93900,"Imperial":93900,"Inyo":97200,"Kern":93900,"Kings":93900,"Lake":93900,"Lassen":93900,"Los Angeles":106600,"Madera":93900,"Marin":186600,"Mariposa":93900,"Mendocino":93900,"Merced":93900,"Modoc":93900,"Mono":118500,"Monterey":104500,"Napa":146700,"Nevada":124600,"Orange":136600,"Placer":120800,"Plumas":95300,"Riverside":103900,"Sacramento":120800,"San Benito":140200,"San Bernardino":103900,"San Diego":130800,"San Francisco":186600,"San Joaquin":104600,"San Luis Obispo":125600,"San Mateo":186600,"Santa Barbara":119100,"Santa Clara":195200,"Santa Cruz":132800,"Shasta":101800,"Sierra":93900,"Siskiyou":93900,"Solano":124600,"Sonoma":132000,"Stanislaus":98500,"Sutter":98900,"Tehama":93900,"Trinity":93900,"Tulare":93900,"Tuolumne":101600,"Ventura":131300,"Yolo":135900,"Yuba":98900};
    const RATES={smallRes:0.15,largeScale:0.25,largeScaleAdder:0.15,equityStorage:0.85,equitySolarStorage:1.10,equitySolarAdder:3.10,equityResiliency:1.00,nonResEquity:0.85,sjvRes:1.10,gen:2.00,genResAdd:2.50};
    function catalog(){return[
      {key:'equitySolarStorage',name:'Equity Solar+Storage',badge:'Eq S+S',elig:u=>u.isLowIncome&&u.dac,rate:`${rateFmt(RATES.equitySolarStorage)}/Wh + ${rateFmt(RATES.equitySolarAdder)}/W`,calc:u=>u.stWh*RATES.equitySolarStorage+u.solW*RATES.equitySolarAdder,description:'Low-income residential in DAC with solar+storage pairing.',docs:['Reservation Form','Income proof','Equity proof','Utility bill','Equipment specs']},
      {key:'equityStorage',name:'Equity Storage-only',badge:'Eq Storage',elig:u=>u.isLowIncome&&u.dac,rate:`${rateFmt(RATES.equityStorage)}/Wh`,calc:u=>u.stWh*RATES.equityStorage,description:'Low-income residential in DAC storage-only.',docs:['Reservation Form','Income proof','Equity proof','Utility bill','Equipment specs']},
      {key:'equityResiliency',name:'Equity Resiliency',badge:'Eq Resil.',elig:u=>u.isLowIncome&&(u.psps||u.dac||u.crit),rate:`${rateFmt(RATES.equityResiliency)}/Wh`,calc:u=>u.stWh*RATES.equityResiliency,description:'Low-income meeting PSPS/DAC/medical.',docs:['Reservation Form','Income proof','Resiliency attestation','PSPS/DAC/Medical proof','Equipment specs']},
      {key:'sjvRes',name:'SJ Valley Equity',badge:'SJ Valley',elig:u=>u.sjv&&u.isLowIncome,rate:`${rateFmt(RATES.sjvRes)}/Wh`,calc:u=>u.stWh*RATES.sjvRes,description:'Low-income in SJ Valley pilot cities.',docs:['Reservation Form','Pilot proof','Income proof','Equipment specs']},
      {key:'nonResEquity',name:'Non-Res Equity',badge:'NonRes',elig:u=>u.custType==='nonres'&&u.isLowIncome,rate:`${rateFmt(RATES.nonResEquity)}/Wh`,calc:u=>u.stWh*RATES.nonResEquity,description:'Low-income non-residential entities.',docs:['Reservation Form','Tax-exempt/SB affidavit','Census tract proof','Equipment specs']},
      {key:'gen',name:'Gen Base Incentive',badge:'Gen',elig:u=>u.solW>0,rate:`${rateFmt(RATES.gen)}/W`,calc:u=>u.solW*RATES.gen,description:'Incentive for on-site generation.',docs:['Reservation Form','Utility bill','Equipment specs','Interconnection PTO','Monitoring plan']},
      {key:'genRes',name:'Gen Resiliency Adder',badge:'Gen Res.',elig:u=>u.solW>0&&(u.psps||u.dac||u.crit),rate:`${rateFmt(RATES.gen+RATES.genResAdd)}/W`,calc:u=>u.solW*(RATES.gen+RATES.genResAdd),description:'Resiliency adder for generation.',docs:['Reservation Form','PSPS/DAC/Medical proof','AHJ islanding plan','Interconnection PTO','Equipment specs']}
    ];}
    const SIZE_FACTOR=[0.7,0.8,0.9,1,1.08,1.16,1.24,1.32];
    function calc80(county,size){const b=COUNTY_AMI[county];if(!b)return null;const idx=Math.min(Math.max(size-1,0),SIZE_FACTOR.length-1);return b*SIZE_FACTOR[idx]*0.8;}
    function populateCounties(){const sel=$('#county');sel.innerHTML='<option value="">Choose county…</option>'+Object.keys(COUNTY_AMI).sort().map(c=>`<option value="${c}">${c}</option>`).join('');}
    function updateThresholdHint(){if($('#custType').value==='nonres'){$('#thresholdHint').textContent='';return;}const c=$('#county').value,s=parseInt($('#hhSize').value,10)||0,t=calc80(c,s);$('#thresholdHint').textContent=t?`80% AMI (${c},${s}): ${money(t)}`:'';}
    window.addEventListener('DOMContentLoaded',()=>{populateCounties();updateThresholdHint();$('#county').addEventListener('change',updateThresholdHint);$('#hhSize').addEventListener('input',updateThresholdHint);$('#custType').addEventListener('change',updateThresholdHint);const ac=new google.maps.places.Autocomplete($('#address'),{types:['address'],componentRestrictions:{country:'us'}});ac.addListener('place_changed',()=>{const p=ac.getPlace(),comp=p.address_components.find(c=>c.types.includes('administrative_area_level_2'));if(comp){const cn=comp.long_name.replace(/ County$/,'');if(COUNTY_AMI[cn]){$('#county').value=cn;updateThresholdHint();}}});$('#calcForm').addEventListener('submit',e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target).entries());localStorage.setItem('sgipDraft',JSON.stringify(d));const hhSize=parseInt(d.hhSize,10),hhInc=parseFloat(d.hhIncome)||0;const stWh=(parseFloat(d.storageKWh)||0)*1000,solW=(parseFloat(d.solarKW)||0)*1000;const threshold=calc80(d.county,hhSize);const isLow=threshold&&hhInc>0&&hhInc<=threshold;const user={...d,hhSize,hhInc,stWh,solW,isLowIncome:isLow,dac:d.dacFlag==='yes',psps:d.pspsFlag==='yes',crit:d.critFlag==='yes',sjv:d.sjvFlag==='yes'};const incEl=$('#incomeResult'),resEl=$('#result');if(d.custType==='nonres'){incEl.innerHTML='<h3>Non-Residential</h3><p>Income test not required.</p>';}else{incEl.innerHTML=`<h3>Income eligibility</h3><p>Threshold: <strong>${money(threshold)}</strong></p><p>Your income: <strong>${money(hhInc)}</strong> — <strong>${isLow?'Low Income':'Above limit'}</strong></p>`;}incEl.classList.add('show');resEl.innerHTML='<h3>Estimated SGIP Rebates</h3>';catalog().filter(t=>t.elig(user)).forEach(t=>{const amt=money(t.calc(user));let html=`<div class="track"><span class="badge">${t.badge}</span> <strong>${t.name}</strong>: ${amt}<ul><li><strong>Rate:</strong> ${t.rate}</li><li><strong>Amount:</strong> ${amt}</li><li><strong>Note:</strong> ${t.description}</li><li><strong>Docs:</strong><ul>`;t.docs.forEach(d=>html+=`<li>${d}</li>`);html+='</ul></li></ul></div>';resEl.innerHTML+=html;});resEl.innerHTML+=`<div class="contact"><h3>Contact Details</h3><p><strong>Name:</strong> ${d.contactName}</p><p><strong>Phone:</strong> ${d.contactPhone}</p><p><strong>Email:</strong> ${d.contactEmail}</p></div>`;resEl.classList.add('show');});});
  </script>
</body>
</html>
