<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>California SGIP Eligibility & Rebate Estimator (v16)</title>
  <style>
    :root{--primary:#fdb813;--secondary:#003c71;--accent:#005eb8;--bg:#f9f9f9;--text:#333;--muted:#666}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,Helvetica,sans-serif;background:var(--bg);color:var(--text);line-height:1.45;padding-bottom:4rem}
    h1{font-size:2rem;font-weight:700;color:var(--primary);text-align:center;margin:1.4rem 0}
    .wrapper{max-width:960px;margin:0 auto;padding:0 1rem}
    fieldset{border:1px solid #ddd;border-radius:6px;padding:1rem;margin-bottom:1rem}
    legend{font-weight:600;color:var(--secondary);padding:0 .5rem}
    label{display:block;font-weight:600;color:var(--secondary);margin:.9rem 0 .4rem}
    select,input{width:100%;padding:10px;border:1px solid #ccc;border-radius:4px;font-size:1rem}
    small{display:block;margin-top:4px;color:var(--muted);font-size:.85rem}
    button{display:block;width:100%;background:var(--primary);color:#fff;border:none;padding:12px;font-size:1rem;border-radius:4px;font-weight:600;cursor:pointer;transition:background .3s;margin-top:1rem}
    button:hover{background:var(--accent)}button:disabled{opacity:.6;cursor:not-allowed}
    #incomeResult,#result{display:none;margin-top:22px;padding:18px;background:#fff;border-left:5px solid var(--primary);border-radius:4px;font-size:1rem}
    #result h3,#incomeResult h3{margin-top:0;color:var(--secondary)}
    .badge{display:inline-block;background:var(--secondary);color:#fff;padding:.25rem .55rem;border-radius:3px;font-size:.78rem;margin-right:6px}
    .track{margin-bottom:1rem}
    footer{font-size:.85rem;color:var(--muted);text-align:center;margin:3rem 0}
    ul{margin:0.5rem 0 0 1.2rem}
  </style>
</head>
<body>
  <h1>California SGIP Rebate Estimator</h1>
  <div class="wrapper">
    <p style="margin:0 0 1rem;font-size:.95rem;color:var(--muted)">Answer a few questions to see every SGIP track you may qualify for and a ball‑park rebate estimate.</p>

    <form id="calcForm" autocomplete="off" novalidate>
      <!-- form fields unchanged -->
    </form>

    <div id="incomeResult"></div>
    <div id="result"></div>
  </div>

  <footer>Unofficial tool – rates current as of July 27 2025. Actual rebate subject to SGIP budget availability & PA review.</footer>

  <script>
    const $ = s => document.querySelector(s);
    const money = v => v.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
    const rateFmt = v => `$${v.toFixed(2)}`;

    // County AMI data
    const COUNTY_AMI = {"Alameda":159800,"Alpine":129500,"Amador":109900,"Butte":96600,"Calaveras":101500,
      "Colusa":96400,"Contra Costa":159800,"Del Norte":93900,"El Dorado":120800,"Fresno":93900,"Glenn":93900,
      "Humboldt":93900,"Imperial":93900,"Inyo":97200,"Kern":93900,"Kings":93900,"Lake":93900,"Lassen":93900,
      "Los Angeles":106600,"Madera":93900,"Marin":186600,"Mariposa":93900,"Mendocino":93900,"Merced":93900,
      "Modoc":93900,"Mono":118500,"Monterey":104500,"Napa":146700,"Nevada":124600,"Orange":136600,
      "Placer":120800,"Plumas":95300,"Riverside":103900,"Sacramento":120800,"San Benito":140200,
      "San Bernardino":103900,"San Diego":130800,"San Francisco":186600,"San Joaquin":104600,
      "San Luis Obispo":125600,"San Mateo":186600,"Santa Barbara":119100,"Santa Clara":195200,
      "Santa Cruz":132800,"Shasta":101800,"Sierra":93900,"Siskiyou":93900,"Solano":124600,
      "Sonoma":132000,"Stanislaus":98500,"Sutter":98900,"Tehama":93900,"Trinity":93900,
      "Tulare":93900,"Tuolumne":101600,"Ventura":131300,"Yolo":135900,"Yuba":98900};

    // SGIP rate catalogue
    const RATES = {
      smallRes:0.15, largeScale:0.25, largeScaleAdder:0.15,
      equityStorage:0.85, equitySolarStorage:1.10, equitySolarAdder:3.10,
      equityResiliency:1.00, nonResEquity:0.85, sjvRes:1.10, sjvNonRes:1.00,
      gen:2.00, genResAdd:2.50
    };

    function catalog() {
      return [
        {
          key:'equitySolarStorage', name:'Equity Solar + Storage', badge:'Equity S+S',
          elig:u=>u.isLowIncome&&u.res, rate:`${rateFmt(RATES.equitySolarStorage)}/Wh + ${rateFmt(RATES.equitySolarAdder)}/W`,
          calc:u=>u.stWh*RATES.equitySolarStorage + u.solW*RATES.equitySolarAdder,
          description:'Low-income residential in disadvantaged community with solar + storage pairing.',
          docs:[
            'Online Reservation Request Form',
            'Proof of Income Qualification (IRS Form 1040)',
            'Proof of Equity Eligibility (e.g., deed restriction or CARE letter)',
            'Proof of utility service (recent bill)',
            'Equipment specifications and signed contract'
          ]
        },
        {
          key:'equityStorage', name:'Equity Storage-Only', badge:'Equity Storage',
          elig:u=>u.isLowIncome&&u.res, rate:`${rateFmt(RATES.equityStorage)}/Wh`,
          calc:u=>u.stWh*RATES.equityStorage,
          description:'Low-income residential in disadvantaged community for storage-only projects.',
          docs:[
            'Online Reservation Request Form',
            'Proof of Income Qualification',
            'Proof of Equity Eligibility',
            'Proof of utility service',
            'Equipment specifications and contract'
          ]
        },
        {
          key:'equityResiliency', name:'Equity Resiliency', badge:'Equity Resil.',
          elig:u=>u.isLowIncome&&(u.psps||u.dac||u.crit), rate:`${rateFmt(RATES.equityResiliency)}/Wh`,
          calc:u=>u.stWh*RATES.equityResiliency,
          description:'Low-income residential meeting resiliency criteria (PSPS/DAC/medical).',
          docs:[
            'Online Reservation Request Form',
            'Proof of Income Qualification',
            'Customer Resiliency Attestation',
            'Proof of PSPS or HFTD status or Medical Baseline',
            'Equipment specifications'
          ]
        },
        {
          key:'sjvRes', name:'SJ Valley Equity', badge:'SJ Valley',
          elig:u=>u.sjv&&u.isLowIncome, rate:`${rateFmt(RATES.sjvRes)}/Wh`,
          calc:u=>u.stWh*RATES.sjvRes,
          description:'Low-income residential in San Joaquin Valley pilot cities.',
          docs:[
            'Online Reservation Request Form',
            'Proof of pilot city location (e.g., Allensworth)',
            'Proof of low-income status',
            'Proof of pilot participation requirements',
            'Equipment specifications'
          ]
        },
        {
          key:'nonResEquity', name:'Non-Res Equity', badge:'NonRes Eq.',
          elig:u=>u.custType==='nonres'&&u.isLowIncome, rate:`${rateFmt(RATES.nonResEquity)}/Wh`,
          calc:u=>u.stWh*RATES.nonResEquity,
          description:'Low-income non-residential entities meeting equity criteria.',
          docs:[
            'Online Reservation Request Form',
            'Proof of Tax-Exempt Status or Small Business Affidavit',
            'Proof of disadvantaged community or 50% census tract',
            'Equipment specifications'
          ]
        },
        {
          key:'gen', name:'Generation Base Incentive', badge:'Generation',
          elig:u=>u.solW>0, rate:`${rateFmt(RATES.gen)}/W`,
          calc:u=>u.solW*RATES.gen,
          description:'Incentive for on-site renewable generation (PV, wind, CHP).',
          docs:[
            'Online Reservation Request Form',
            'Proof of utility service',
            'Equipment specifications',
            'Interconnection Permission to Operate',
            'Monitoring Plan (if PBI applicable)'
          ]
        },
        {
          key:'genRes', name:'Generation Resiliency Adder', badge:'Gen Res.',
          elig:u=>u.solW>0&&(u.psps||u.dac||u.crit), rate:`${rateFmt(RATES.gen + RATES.genResAdd)}/W`,
          calc:u=>u.solW*(RATES.gen + RATES.genResAdd),
          description:'Resiliency adder for generation systems meeting resiliency criteria.',
          docs:[
            'Online Reservation Request Form',
            'Proof of PSPS/DAC/Medical Baseline status',
            'AHJ islanding plan approval',
            'Interconnection Permission to Operate',
            'Equipment specifications'
          ]
        }
      ];
    }

    // AMI threshold calc
    const SIZE_FACTOR=[0.7,0.8,0.9,1,1.08,1.16,1.24,1.32];
    function calc80(county,size){
      const base=COUNTY_AMI[county]; if(!base) return null;
      const idx=Math.max(0,Math.min(size-1,SIZE_FACTOR.length-1));
      return base*SIZE_FACTOR[idx]*0.8;
    }

    // Populate counties dropdown
    function populateCounties(){
      const sel=$('#county'); sel.innerHTML='<option value="">Choose county…</option>'+
        Object.keys(COUNTY_AMI).sort().map(c=>`<option>${c}</option>`).join('');
    }
    // Restore form draft
    function restoreDraft(){
      const d=localStorage.getItem('sgipDraft'); if(!d) return;
      Object.entries(JSON.parse(d)).forEach(([k,v])=>{ const el=$(`[name="${k}"]`); if(el) el.value=v; });
    }

    // Handle form submission
    window.addEventListener('DOMContentLoaded',()=>{
      populateCounties(); restoreDraft();
      $('#calcForm').addEventListener('submit',e=>{
        e.preventDefault();
        const data=Object.fromEntries(new FormData(e.target).entries());
        localStorage.setItem('sgipDraft',JSON.stringify(data));
        const hhSize=parseInt(data.hhSize,10), hhInc=parseFloat(data.hhIncome)||0;
        const stWh=(parseFloat(data.storageKWh)||0)*1000, solW=(parseFloat(data.solarKW)||0)*1000;
        const threshold=calc80(data.county,hhSize);
        const isLow=threshold&&hhInc>0&&hhInc<=threshold;
        const user={...data, hhSize, hhInc, stWh, solW, isLowIncome:isLow,
          res:data.dacFlag==='yes', psps:data.pspsFlag==='yes', crit:data.critFlag==='yes', sjv:data.sjvFlag==='yes'
        };
        // Display income eligibility
        const incEl=$('#incomeResult'); incEl.style.display='block';
        incEl.innerHTML=`<h3>Income eligibility</h3><p>80% AMI threshold (${data.county}, ${hhSize}): <strong>${money(threshold)}</strong></p>`+
          `<p>Your income: <strong>${money(hhInc)}</strong> — <strong>${isLow?'Low Income':'Above limit'}</strong></p>`;
        // Calculate and display rebates
        const resEl=$('#result'); resEl.style.display='block';
        resEl.innerHTML='<h3>Estimated SGIP Rebates</h3>';
        catalog().filter(t=>t.elig(user)).forEach(t=>{
          const amt=money(t.calc(user));
          resEl.innerHTML+=`<div class="track"><span class="badge">${t.badge}</span> <strong>${t.name}</strong>: ${amt}`+
            `<ul>`+
              `<li><strong>Rate:</strong> ${t.rate}</li>`+
              `<li><strong>Estimated Amount:</strong> ${amt}</li>`+
              `<li><strong>Eligibility:</strong> ${t.description}</li>`+
              `<li><strong>Required Documentation:</strong><ul>${t.docs.map(doc=>`<li>${doc}</li>`).join('')}</ul></li>`+
            `</ul></div>`;
        });
      });
    });
  </script>
</body>
</html>
