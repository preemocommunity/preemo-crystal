import React, { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

// ── EXACT SAME DESIGN SYSTEM AS ALL PRËMO PLATFORMS ──
const B = {
  navy:"#0A1628", blue:"#1E3A5F", midBlue:"#2B5C8A", lightBlue:"#4A90D9",
  skyBlue:"#E8F4FD", ice:"#F0F6FC", white:"#FFFFFF",
  border:"rgba(74,144,217,0.15)", shadow:"0 2px 12px rgba(10,22,40,0.06)",
  shadowHover:"0 8px 28px rgba(10,22,40,0.11)", text:"#0D1B2A",
  textMuted:"#5A7080", textLight:"#8899AA",
};

const primaryBtn = { background:`linear-gradient(135deg,${B.navy} 0%,${B.midBlue} 100%)`, color:"#fff", border:"none", borderRadius:8, fontFamily:"'Montserrat',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", padding:"9px 20px" };
const ghostBtn   = { background:"transparent", color:B.textMuted, border:`1px solid ${B.border}`, borderRadius:8, fontFamily:"'Montserrat',sans-serif", fontWeight:600, fontSize:12, cursor:"pointer", padding:"8px 16px" };
const inp        = { width:"100%", background:B.ice, border:`1px solid ${B.border}`, borderRadius:8, padding:"11px 14px", fontSize:14, color:B.text, fontFamily:"'Montserrat',sans-serif", boxSizing:"border-box", outline:"none", marginBottom:12, letterSpacing:"2px", fontWeight:700 };
const card       = { background:B.white, border:`1px solid ${B.border}`, borderRadius:12, padding:"20px 22px", boxShadow:B.shadow };

// ── FRAGMENT GEM SVG (from the F7 reference) ──
function FragmentGem({ size = 48, tier = "I" }) {
  const colors = {
    I:   ["#8DCFFF","#4A90D9","#2B5C8A","#0A2A50","#00E5FF"],
    III: ["#6BB5FF","#3A80D9","#1E5C8A","#0A1E50","#00CFFF"],
    VII: ["#4A90D9","#2B5C8A","#1E3A5F","#0A1628","#4A90D9"],
    XII: ["#8DCFFF","#5AABEF","#4A90D9","#0A1628","#00FFFF"],
  };
  const [c1,c2,c3,c4,c5] = colors[tier] || colors.I;
  const w = size, h = size * 1.3;
  const cx = w/2, top = h*0.05, bot = h*0.95, mid = h*0.42, midLow = h*0.62;
  const left = w*0.08, right = w*0.92, cLeft = w*0.22, cRight = w*0.78;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display:"block"}}>
      {/* Outer gem shape */}
      <polygon points={`${cx},${top} ${right},${mid} ${cx},${bot} ${left},${mid}`} fill={c2} />
      {/* Top facet */}
      <polygon points={`${cx},${top} ${cRight},${h*0.28} ${cx},${h*0.38} ${cLeft},${h*0.28}`} fill={c5} opacity="0.85" />
      {/* Left upper */}
      <polygon points={`${left},${mid} ${cx},${top} ${cLeft},${h*0.28} ${cx},${h*0.38}`} fill={c1} opacity="0.8" />
      {/* Right upper */}
      <polygon points={`${right},${mid} ${cx},${top} ${cRight},${h*0.28} ${cx},${h*0.38}`} fill={c1} opacity="0.55" />
      {/* Center facet */}
      <polygon points={`${cx},${h*0.38} ${cRight},${h*0.28} ${cRight},${midLow} ${cx},${midLow}`} fill={c2} opacity="0.7" />
      <polygon points={`${cx},${h*0.38} ${cLeft},${h*0.28} ${cLeft},${midLow} ${cx},${midLow}`} fill={c1} opacity="0.6" />
      {/* Lower facets */}
      <polygon points={`${left},${mid} ${cx},${h*0.38} ${cLeft},${midLow} ${cx},${bot}`} fill={c3} opacity="0.85" />
      <polygon points={`${right},${mid} ${cx},${h*0.38} ${cRight},${midLow} ${cx},${bot}`} fill={c4} opacity="0.8" />
      {/* Bottom */}
      <polygon points={`${cLeft},${midLow} ${cRight},${midLow} ${cx},${bot}`} fill={c4} opacity="0.9" />
      {/* Edge glow */}
      <polygon points={`${cx},${top} ${right},${mid} ${cx},${bot} ${left},${mid}`} fill="none" stroke={c5} strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

// ── CRYSTAL MARK for header icon ──
function CrystalMark({ size, spinning=false }) {
  const ref = useRef(null);
  const rot = useRef(0);
  const raf = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const draw = () => {
      const ctx = c.getContext("2d");
      ctx.clearRect(0,0,c.width,c.height);
      const cx=c.width/2, cy=c.height/2;
      const maxR=(size/2)*0.88, N=24;
      const layers=[[1,"#5AABEF",0.92],[0.82,"#4A90D9",1],[0.65,"#2B5C8A",1],[0.5,"#1E3A5F",1],[0.36,"#0A1628",1]];
      const offsets=[0,Math.PI/48,Math.PI/32,Math.PI/24,Math.PI/18];
      for(let li=layers.length-1;li>=0;li--){
        const [rR,color,op]=layers[li];
        const R=maxR*rR, r=R*0.38;
        ctx.globalAlpha=op; ctx.beginPath();
        for(let i=0;i<N*2;i++){
          const a=(i*Math.PI/N)+offsets[li]+rot.current-Math.PI/2;
          const rad=i%2===0?R:r;
          if(i===0)ctx.moveTo(cx+rad*Math.cos(a),cy+rad*Math.sin(a));
          else ctx.lineTo(cx+rad*Math.cos(a),cy+rad*Math.sin(a));
        }
        ctx.closePath(); ctx.fillStyle=color; ctx.fill();
      }
      ctx.globalAlpha=1;
      ctx.beginPath(); ctx.arc(cx,cy,maxR*0.21,0,Math.PI*2);
      ctx.fillStyle=B.navy; ctx.fill();
    };
    if(spinning){ const loop=()=>{ rot.current+=0.007; draw(); raf.current=requestAnimationFrame(loop); }; loop(); }
    else draw();
    return()=>{ if(raf.current)cancelAnimationFrame(raf.current); };
  },[size,spinning]);
  return <canvas ref={ref} width={size} height={size} style={{display:"block"}}/>;
}

// ── DATA ──
const PETALS = [
  {id:1,  name:"The Strategist", tagline:"Angles. Hooks. Dominance.",    icon:"◈", desc:"Deconstructs any brief and generates 15 conversion-ranked ad angles with emotional triggers, pattern interrupts, and scoring. Your media buyer brain, on demand."},
  {id:2,  name:"The Scribe",     tagline:"Script. Copy. Convert.",       icon:"✦", desc:"Transforms angles into production-ready ad scripts with scene direction, captions, b-roll guides, and hook variations. Hook to CTA in seconds."},
  {id:3,  name:"The Scout",      tagline:"Find. Target. Outreach.",      icon:"◉", desc:"Discovers your ideal clients, builds hyper-targeted prospect lists, and drafts personalised outreach sequences at scale."},
  {id:4,  name:"The Compass",    tagline:"Direction. Clarity. Speed.",   icon:"⬡", desc:"Maps your entire content calendar from a single brief. 90 days of strategy in 90 seconds, calibrated to your brand voice and platform."},
  {id:5,  name:"The Pipeline",   tagline:"Brief → Delivered.",           icon:"⬟", desc:"End-to-end ad production workflow — brief ingestion through angles, scripts, execution, client review, and delivery. Automated."},
  {id:6,  name:"The Architect",  tagline:"Build. Convert. Scale.",       icon:"⬢", desc:"Designs complete marketing funnels — landing pages, email sequences, lead magnets, and ad sets — from a single product brief."},
  {id:7,  name:"The Analyst",    tagline:"Data. Insight. Action.",       icon:"◬", desc:"Reads your channel analytics across every connected platform and tells you exactly what to do next. No dashboards. Just decisions."},
  {id:8,  name:"The Outreach",   tagline:"Connect. Pitch. Close.",       icon:"◈", desc:"Manages your full sales pipeline. Finds prospects, writes personalised sequences, tracks conversations, and closes on your behalf."},
  {id:9,  name:"The Publisher",  tagline:"Create. Schedule. Dominate.",  icon:"✦", desc:"Adapts any piece of content across every platform and format. Write once, publish everywhere, in every language."},
  {id:10, name:"Rosa",           tagline:"IP. Rights. Legacy.",          icon:"◉", desc:"Manages your intellectual property across all platforms. Registers, protects, licenses, and monetises your creative output on-chain."},
  {id:11, name:"The Negotiator", tagline:"Deal. Term. Win.",             icon:"⬡", desc:"Builds pitch decks, proposal documents, brand partnership frameworks, and deal terms. Structures, negotiates, and closes on your behalf."},
  {id:12, name:"The Crystal",    tagline:"All Twelve. One Mind.",        icon:"∞", desc:"The master intelligence. All 12 petals working as a single unified system. The self-made billionaire AI stack — reserved for Fragment XII holders only.", special:true},
];

const TIERS = {
  I:   {label:"Seed",         petals:[1,2,3],                        price:97,   desc:"Your first three petals. The creative core begins."},
  III: {label:"Core",         petals:[1,2,3,4,5,6],                  price:297,  desc:"Six petals. Production, strategy, and scale."},
  VII: {label:"Arc",          petals:[1,2,3,4,5,6,7,8,9],           price:597,  desc:"Nine petals. The complete production-to-distribution arc."},
  XII: {label:"Full Crystal", petals:[1,2,3,4,5,6,7,8,9,10,11,12], price:1297, desc:"All twelve petals. The full crystal unlocked."},
};

// ── PETAL CARD ──
function PetalCard({petal, unlocked, onClick}) {
  const [h,setH]=useState(false);
  return (
    <div onClick={()=>unlocked&&onClick(petal)}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{...card, cursor:unlocked?"pointer":"default", opacity:unlocked?1:0.4,
        border:`1px solid ${h&&unlocked?B.lightBlue:B.border}`,
        boxShadow:h&&unlocked?B.shadowHover:B.shadow,
        transform:h&&unlocked?"translateY(-3px)":"none", transition:"all 0.2s"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
        <div style={{width:36,height:36,borderRadius:8,background:B.skyBlue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:unlocked?B.lightBlue:B.textLight}}>
          {petal.icon}
        </div>
        {!unlocked&&<span style={{fontSize:11,color:B.textLight}}>🔒</span>}
        {petal.special&&unlocked&&<span style={{fontSize:8,fontWeight:700,letterSpacing:"1.5px",padding:"3px 8px",borderRadius:20,background:B.skyBlue,color:B.midBlue}}>MASTER</span>}
      </div>
      <div style={{fontSize:14,fontWeight:700,color:unlocked?B.text:B.textLight,marginBottom:3}}>{petal.name}</div>
      <div style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:unlocked?B.lightBlue:B.textLight,marginBottom:8}}>{unlocked?petal.tagline:"Locked"}</div>
      <div style={{fontSize:12,color:B.textMuted,lineHeight:1.65}}>{unlocked?petal.desc:"Acquire a higher-tier Fragment to unlock this petal."}</div>
      {unlocked&&<div style={{marginTop:12,fontSize:11,fontWeight:700,color:B.lightBlue}}>Launch Agent →</div>}
    </div>
  );
}

// ── TIER CARD ──
function TierCard({tier, data, onSelect}) {
  const [h,setH]=useState(false);
  const isTop=tier==="XII";
  return (
    <div onClick={onSelect} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{...card, cursor:"pointer", border:`1px solid ${isTop?B.lightBlue:h?B.lightBlue:B.border}`,
        boxShadow:h?B.shadowHover:B.shadow, transform:h?"translateY(-3px)":"none", transition:"all 0.2s",
        background:isTop?B.skyBlue:B.white}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:B.lightBlue}}>Fragment {tier}</div>
          <div style={{fontSize:12,fontWeight:600,color:B.textMuted}}>{data.label}</div>
        </div>
        <FragmentGem size={36} tier={tier}/>
      </div>
      <div style={{fontSize:26,fontWeight:800,color:B.text,letterSpacing:"-1px",marginBottom:4}}>${data.price}</div>
      <div style={{fontSize:11,color:B.textLight,marginBottom:10}}>{data.petals.length} of 12 petals</div>
      <div style={{fontSize:12,color:B.textMuted,lineHeight:1.6,marginBottom:14}}>{data.desc}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:14}}>
        {[...Array(12)].map((_,i)=>(
          <div key={i} style={{width:9,height:9,borderRadius:2,background:data.petals.includes(i+1)?B.lightBlue:B.skyBlue}}/>
        ))}
      </div>
      <button style={{...primaryBtn,width:"100%",padding:"10px 0"}}>Get Fragment {tier}</button>
    </div>
  );
}

// ── LANDING ──
function Landing({onEnter, onGet}) {
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"40px 32px 80px"}}>

      {/* Hero — same pattern as all dashboards: eyebrow + big title + subtitle + KPIs */}
      <div style={{marginBottom:40}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:B.lightBlue,marginBottom:10}}>AI Agent Vault · Prëmo Inc.</div>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:16,marginBottom:14}}>
          <div>
            <h1 style={{fontSize:"clamp(32px,5vw,52px)",fontWeight:800,color:B.text,letterSpacing:"-1.5px",lineHeight:1.05,marginBottom:6}}>
              The Crystal
            </h1>
            <p style={{fontSize:15,color:B.textMuted,maxWidth:520,lineHeight:1.7}}>
              A vault of AI agents. Each one a petal. Unlocked by a Fragment.
            </p>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={onEnter} style={ghostBtn}>Enter Fragment</button>
            <button onClick={onGet} style={primaryBtn}>Acquire Fragment →</button>
          </div>
        </div>
      </div>

      {/* KPI row — exactly like Data Room and Media Dashboard */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:14,marginBottom:14}}>
        {[["12","AI Agents"],["4","Fragment Tiers"],["∞","Potential"],["1","Access Key"]].map(([v,l])=>(
          <div key={l} style={card}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:B.textLight,marginBottom:8}}>{l}</div>
            <div style={{fontSize:30,fontWeight:800,color:v==="∞"||v==="12"?B.lightBlue:B.text,letterSpacing:"-1px"}}>{v}</div>
          </div>
        ))}
      </div>

      {/* Progress bar — same as data room */}
      <div style={{marginBottom:48}}>
        <div style={{height:3,background:B.skyBlue,borderRadius:2,marginBottom:6}}>
          <div style={{height:"100%",width:"33%",background:`linear-gradient(90deg,${B.lightBlue},${B.accentBlue||"#6BB5FF"})`,borderRadius:2}}/>
        </div>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:B.textLight}}>Fragment I unlocks 3 of 12 petals</div>
      </div>

      {/* Architecture — 3 cards */}
      <div style={{marginBottom:44}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:B.lightBlue,marginBottom:6}}>The Architecture</div>
        <h2 style={{fontSize:22,fontWeight:700,color:B.text,marginBottom:20}}>Fragment → Petal → Agent</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
          {[
            {icon:"◆",tier:"I",  title:"The Fragment", desc:"Your access key. Each Fragment holds a tier — I, III, VII, or XII — determining how many petals you unlock inside the vault."},
            {icon:"⬡",tier:"VII",title:"The Petal",    desc:"Each petal is a fully-operational AI agent. Specialised. Precise. Built for a specific function inside your media empire."},
            {icon:"∞",tier:"XII",title:"The Crystal",  desc:"All 12 petals working as one unified system. The self-made billionaire AI stack. Reserved for Fragment XII holders only."},
          ].map(item=>(
            <div key={item.title} style={card}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <div style={{width:40,height:40,borderRadius:8,background:B.skyBlue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:B.lightBlue}}>{item.icon}</div>
                <div style={{fontSize:14,fontWeight:700,color:B.text}}>{item.title}</div>
              </div>
              <div style={{fontSize:12,color:B.textMuted,lineHeight:1.7}}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Petals grid — locked */}
      <div style={{marginBottom:44}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:10,marginBottom:20}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:B.lightBlue,marginBottom:4}}>The 12 Petals</div>
            <h2 style={{fontSize:22,fontWeight:700,color:B.text}}>Your AI Agent Stack</h2>
          </div>
          <p style={{fontSize:12,color:B.textMuted}}>Acquire a Fragment to reveal what's inside.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(232px,1fr))",gap:12}}>
          {PETALS.map(p=><PetalCard key={p.id} petal={p} unlocked={false} onClick={()=>{}}/>)}
        </div>
      </div>

      {/* Fragment tiers */}
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:10,marginBottom:20}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:B.lightBlue,marginBottom:4}}>Fragment Tiers</div>
            <h2 style={{fontSize:22,fontWeight:700,color:B.text}}>Choose Your Depth</h2>
          </div>
          <p style={{fontSize:12,color:B.textMuted}}>One-time purchase. Lifetime access.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:14}}>
          {Object.entries(TIERS).map(([tier,data])=>(
            <TierCard key={tier} tier={tier} data={data} onSelect={onGet}/>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── FRAGMENT ENTRY ──
function FragmentEntry({onBack, onUnlock}) {
  const [code,setCode]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const attempt=async()=>{
    if(!code.trim())return;
    setLoading(true); setError("");
    const {data,error:err}=await supabase.from("crystal_fragments").select("*").eq("code",code.trim().toUpperCase()).eq("active",true).single();
    setLoading(false);
    if(err||!data){setError("Fragment not recognised. Check your code and try again.");return;}
    await supabase.from("crystal_access_log").insert({fragment_code:data.code});
    onUnlock(data);
  };
  return (
    <div style={{maxWidth:460,margin:"60px auto",padding:"0 24px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:B.textMuted,fontFamily:"'Montserrat',sans-serif",fontSize:12,cursor:"pointer",marginBottom:28}}>← Back</button>
      <div style={{...card,padding:36,textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
          <CrystalMark size={56}/>
        </div>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:B.lightBlue,marginBottom:6}}>Fragment Authentication</div>
        <h2 style={{fontSize:22,fontWeight:700,color:B.text,marginBottom:6}}>Enter Your Fragment</h2>
        <p style={{fontSize:13,color:B.textMuted,lineHeight:1.75,marginBottom:24}}>Each Fragment is a unique access code. Enter yours to unlock your petals.</p>
        <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} onKeyDown={e=>e.key==="Enter"&&attempt()} placeholder="CRYSTAL-XXXX-XXXX" autoFocus style={{...inp,textAlign:"center"}}/>
        {error&&<div style={{fontSize:12,color:"#E24B4A",marginBottom:12}}>{error}</div>}
        <button onClick={attempt} disabled={loading||!code.trim()} style={{...primaryBtn,padding:"12px 0",width:"100%",opacity:loading||!code.trim()?0.5:1,fontSize:14}}>
          {loading?"Authenticating...":"Unlock the Crystal →"}
        </button>
      </div>
    </div>
  );
}

// ── VAULT ──
function Vault({fragment, onLogout}) {
  const [activePetal,setActivePetal]=useState(null);
  const tierData=TIERS[fragment.tier];
  const unlocked=tierData?.petals||[];
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"36px 32px 100px"}}>

      {/* Vault header card — same dark strip as other platforms' "how it works" section */}
      <div style={{background:`linear-gradient(135deg,${B.navy},${B.midBlue})`,borderRadius:14,padding:"20px 28px",marginBottom:28,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <CrystalMark size={44} spinning/>
          <div>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"rgba(255,255,255,0.45)",marginBottom:2}}>Fragment {fragment.tier} · {tierData?.label}</div>
            <div style={{fontSize:18,fontWeight:700,color:"#fff"}}>The Crystal — Vault</div>
            {fragment.holder_name&&<div style={{fontSize:11,color:"rgba(255,255,255,0.45)",marginTop:1}}>{fragment.holder_name}</div>}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:24,fontWeight:800,color:"#fff"}}>{unlocked.length}<span style={{fontSize:13,color:"rgba(255,255,255,0.35)",fontWeight:400}}>/12</span></div>
            <div style={{fontSize:8,color:"rgba(255,255,255,0.35)",letterSpacing:"1.5px",textTransform:"uppercase"}}>Petals Active</div>
          </div>
          <button onClick={onLogout} style={{...ghostBtn,color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.15)",padding:"7px 14px",fontSize:11}}>Exit</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:28}}>
        {[["Unlocked",unlocked.length,true],["Locked",12-unlocked.length,false],["Tier",fragment.tier,false],["Status","Active",true]].map(([l,v,ac])=>(
          <div key={l} style={card}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:B.textLight,marginBottom:6}}>{l}</div>
            <div style={{fontSize:24,fontWeight:800,color:ac?B.lightBlue:B.text}}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:B.textLight,marginBottom:16}}>Your Petals</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
        {PETALS.map(p=><PetalCard key={p.id} petal={p} unlocked={unlocked.includes(p.id)} onClick={setActivePetal}/>)}
      </div>

      {fragment.tier!=="XII"&&(
        <div style={{...card,marginTop:24,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:B.text,marginBottom:3}}>{12-unlocked.length} petals still locked</div>
            <div style={{fontSize:12,color:B.textMuted}}>Upgrade your Fragment to unlock the full crystal.</div>
          </div>
          <button style={primaryBtn}>Upgrade Fragment →</button>
        </div>
      )}

      {/* Petal modal */}
      {activePetal&&(
        <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{position:"absolute",inset:0,background:"rgba(10,22,40,0.45)",backdropFilter:"blur(8px)"}} onClick={()=>setActivePetal(null)}/>
          <div style={{position:"relative",background:B.white,border:`1px solid ${B.border}`,borderRadius:16,padding:32,maxWidth:500,width:"100%",boxShadow:"0 24px 60px rgba(10,22,40,0.18)",maxHeight:"90vh",overflowY:"auto"}}>
            <button onClick={()=>setActivePetal(null)} style={{position:"absolute",top:14,right:14,background:"none",border:"none",fontSize:18,cursor:"pointer",color:B.textLight}}>✕</button>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
              <div style={{width:48,height:48,borderRadius:10,background:B.skyBlue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:B.lightBlue,flexShrink:0}}>{activePetal.icon}</div>
              <div>
                <div style={{fontSize:18,fontWeight:700,color:B.text}}>{activePetal.name}</div>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:B.lightBlue}}>{activePetal.tagline}</div>
              </div>
            </div>
            <p style={{fontSize:13,color:B.textMuted,lineHeight:1.75,marginBottom:20}}>{activePetal.desc}</p>
            <div style={{background:B.ice,borderRadius:8,padding:"12px 14px",marginBottom:20}}>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:B.textLight,marginBottom:5}}>Agent Status</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:B.lightBlue}}/>
                <span style={{fontSize:12,color:B.midBlue,fontWeight:600}}>{activePetal.special?"Master integration — all 12 petals synced":"Integration in progress — full launch Q2 2026"}</span>
              </div>
            </div>
            <button onClick={()=>setActivePetal(null)} style={{...primaryBtn,padding:"12px 0",width:"100%",fontSize:14}}>
              {activePetal.special?"The Crystal — All Systems":`Coming Soon — ${activePetal.name}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── GET FRAGMENT ──
function GetFragment({onBack}) {
  return (
    <div style={{maxWidth:960,margin:"0 auto",padding:"40px 32px 80px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:B.textMuted,fontFamily:"'Montserrat',sans-serif",fontSize:12,cursor:"pointer",marginBottom:32}}>← Back</button>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:B.lightBlue,marginBottom:6}}>Acquire a Fragment</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12,marginBottom:32}}>
        <h2 style={{fontSize:28,fontWeight:700,color:B.text,letterSpacing:"-0.5px"}}>Choose Your Depth</h2>
        <p style={{fontSize:12,color:B.textMuted}}>One-time purchase. Lifetime access. No subscriptions.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:14,marginBottom:32}}>
        {Object.entries(TIERS).map(([tier,data])=><TierCard key={tier} tier={tier} data={data} onSelect={()=>{}}/>)}
      </div>
      <div style={{...card,textAlign:"center",padding:"18px 24px"}}>
        <div style={{fontSize:12,color:B.textMuted,lineHeight:1.7}}>Payment via Stripe · Fragment code delivered instantly to your email · No subscriptions · Access never expires</div>
      </div>
    </div>
  );
}

// ── ROOT ──
export default function App() {
  const [view,setView]=useState("landing");
  const [fragment,setFragment]=useState(null);
  return (
    <div style={{fontFamily:"'Montserrat',sans-serif",minHeight:"100vh",background:B.ice,color:B.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} body{background:${B.ice};} button:hover{opacity:0.85;} input::placeholder{color:${B.textLight};}`}</style>

      {/* ── HEADER — pixel-perfect match to all other platforms ── */}
      <header style={{background:B.white,borderBottom:`1px solid ${B.border}`,padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setView("landing")}>
          {/* Same square icon style as Data Room "P" and Creator's Compass compass */}
          <div style={{width:38,height:38,borderRadius:9,background:B.navy,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <CrystalMark size={28}/>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:B.text,letterSpacing:"1px",lineHeight:1}}>THE CRYSTAL</div>
            <div style={{fontSize:9,color:B.textLight,letterSpacing:"1.5px",textTransform:"uppercase"}}>AI Agent Vault · Prëmo Inc.</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {view==="vault"&&<button onClick={()=>{setFragment(null);setView("landing");}} style={ghostBtn}>← Exit Vault</button>}
          {view!=="vault"&&view!=="enter"&&<button onClick={()=>setView("enter")} style={ghostBtn}>Enter Fragment</button>}
          {view!=="get"&&<button onClick={()=>setView("get")} style={primaryBtn}>Acquire Fragment</button>}
          <span style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",padding:"5px 12px",borderRadius:20,background:B.skyBlue,color:B.midBlue,border:`1px solid ${B.border}`}}>Vault</span>
        </div>
      </header>

      {view==="landing"&&<Landing onEnter={()=>setView("enter")} onGet={()=>setView("get")}/>}
      {view==="enter"&&<FragmentEntry onBack={()=>setView("landing")} onUnlock={data=>{setFragment(data);setView("vault");}}/>}
      {view==="vault"&&fragment&&<Vault fragment={fragment} onLogout={()=>{setFragment(null);setView("landing");}}/>}
      {view==="get"&&<GetFragment onBack={()=>setView("landing")}/>}

      {view!=="vault"&&<div style={{textAlign:"center",padding:"28px",fontSize:10,color:B.textLight,letterSpacing:"1px",borderTop:`1px solid ${B.border}`,background:B.white}}>
        THE CRYSTAL · PRËMO INC. · CANGGU, BALI · {new Date().getFullYear()}
      </div>}
    </div>
  );
}
