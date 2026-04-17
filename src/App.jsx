import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const BRAND = {
  navy: "#0A1628", blue: "#1E3A5F", midBlue: "#2B5C8A", lightBlue: "#4A90D9",
  accentBlue: "#6BB5FF", skyBlue: "#E8F4FD", ice: "#F0F6FC", white: "#FFFFFF",
  glass: "rgba(255,255,255,0.72)", glassBorder: "rgba(74,144,217,0.18)",
  glassHover: "rgba(255,255,255,0.92)", shadow: "0 8px 32px rgba(10,22,40,0.08)",
  shadowHover: "0 12px 40px rgba(10,22,40,0.14)", text: "#1A2A3A",
  textMuted: "#5A7080", textLight: "#8899AA",
};

const inp = { width: "100%", background: BRAND.ice, border: `1px solid ${BRAND.glassBorder}`, borderRadius: 10, padding: "12px 16px", fontSize: 14, color: BRAND.text, fontFamily: "'Montserrat', sans-serif", boxSizing: "border-box", outline: "none", marginBottom: 12, letterSpacing: "2px", fontWeight: 700 };
const primaryBtn = { background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.midBlue} 100%)`, color: "#fff", border: "none", borderRadius: 10, fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 16px rgba(10,22,40,0.2)", padding: "10px 24px" };
const ghostBtn = { background: "transparent", color: BRAND.textMuted, border: `1px solid ${BRAND.glassBorder}`, borderRadius: 10, fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer", padding: "10px 18px" };

const PETALS = [
  { id:1,  name:"The Strategist", tagline:"Angles. Hooks. Dominance.",   icon:"◈", desc:"Deconstructs any brief and generates 15 conversion-ranked ad angles with emotional triggers, pattern interrupts, and scoring. Your media buyer brain, on demand." },
  { id:2,  name:"The Scribe",     tagline:"Script. Copy. Convert.",      icon:"✦", desc:"Transforms angles into production-ready ad scripts with scene direction, captions, b-roll guides, and hook variations. Hook to CTA in seconds." },
  { id:3,  name:"The Scout",      tagline:"Find. Target. Outreach.",     icon:"◉", desc:"Discovers your ideal clients, builds hyper-targeted prospect lists, and drafts personalised outreach sequences at scale." },
  { id:4,  name:"The Compass",    tagline:"Direction. Clarity. Speed.",  icon:"⬡", desc:"Maps your entire content calendar from a single brief. 90 days of strategy in 90 seconds, calibrated to your brand voice and platform." },
  { id:5,  name:"The Pipeline",   tagline:"Brief → Delivered.",          icon:"⬟", desc:"End-to-end ad production workflow — brief ingestion through angles, scripts, execution, client review, and delivery. Automated." },
  { id:6,  name:"The Architect",  tagline:"Build. Convert. Scale.",      icon:"⬢", desc:"Designs complete marketing funnels — landing pages, email sequences, lead magnets, and ad sets — from a single product brief." },
  { id:7,  name:"The Analyst",    tagline:"Data. Insight. Action.",      icon:"◬", desc:"Reads your channel analytics across every connected platform and tells you exactly what to do next. No dashboards. Just decisions." },
  { id:8,  name:"The Outreach",   tagline:"Connect. Pitch. Close.",      icon:"◈", desc:"Manages your full sales pipeline. Finds prospects, writes personalised sequences, tracks conversations, and closes on your behalf." },
  { id:9,  name:"The Publisher",  tagline:"Create. Schedule. Dominate.", icon:"✦", desc:"Adapts any piece of content across every platform and format. Write once, publish everywhere, in every language." },
  { id:10, name:"Rosa",           tagline:"IP. Rights. Legacy.",         icon:"◉", desc:"Manages your intellectual property across all platforms. Registers, protects, licenses, and monetises your creative output on-chain." },
  { id:11, name:"The Negotiator", tagline:"Deal. Term. Win.",            icon:"⬡", desc:"Builds pitch decks, proposal documents, brand partnership frameworks, and deal terms. Structures, negotiates, and closes on your behalf." },
  { id:12, name:"The Crystal",    tagline:"All Twelve. One Mind.",       icon:"∞", desc:"The master intelligence. All 12 petals working as a single unified system. The self-made billionaire AI stack — reserved for Fragment XII holders only.", special:true },
];

const TIERS = {
  I:   { label:"Seed",         petals:[1,2,3],                         price:97,   desc:"Your first three petals. The creative core begins." },
  III: { label:"Core",         petals:[1,2,3,4,5,6],                   price:297,  desc:"Six petals. Production, strategy, and scale." },
  VII: { label:"Arc",          petals:[1,2,3,4,5,6,7,8,9],            price:597,  desc:"Nine petals. The complete production-to-distribution arc." },
  XII: { label:"Full Crystal", petals:[1,2,3,4,5,6,7,8,9,10,11,12], price:1297, desc:"All twelve petals. The full crystal unlocked." },
};

function drawCrystal(canvas, rotation, darkCore) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const cx=canvas.width/2, cy=canvas.height/2;
  const maxR=(Math.min(canvas.width,canvas.height)/2)*0.9;
  const N=24;
  const layers=[
    [1.00,0,"#5AABEF",0.95],[0.82,Math.PI/48,"#4A90D9",1],
    [0.65,Math.PI/32,"#2B5C8A",1],[0.50,Math.PI/24,"#1E3A5F",1],
    [0.36,Math.PI/18,"#0D1E3A",1]
  ];
  for(let li=layers.length-1;li>=0;li--){
    const [rR,rot,color,op]=layers[li];
    const R=maxR*rR, r=R*0.38;
    ctx.globalAlpha=op;
    ctx.beginPath();
    for(let i=0;i<N*2;i++){
      const a=(i*Math.PI/N)+rot+rotation-Math.PI/2;
      const rad=i%2===0?R:r;
      if(i===0)ctx.moveTo(cx+rad*Math.cos(a),cy+rad*Math.sin(a));
      else ctx.lineTo(cx+rad*Math.cos(a),cy+rad*Math.sin(a));
    }
    ctx.closePath(); ctx.fillStyle=color; ctx.fill();
  }
  ctx.globalAlpha=1;
  ctx.beginPath(); ctx.arc(cx,cy,maxR*0.22,0,Math.PI*2);
  ctx.fillStyle=darkCore?"#050A14":BRAND.navy; ctx.fill();
  ctx.globalAlpha=0.4;
  ctx.beginPath(); ctx.arc(cx,cy-maxR*0.07,maxR*0.1,0,Math.PI*2);
  ctx.fillStyle="#8DCFFF"; ctx.fill();
  ctx.globalAlpha=1;
}

function CrystalMark({size, spinning=false, dark=false}){
  const ref=useRef(null);
  const rotRef=useRef(0);
  const rafRef=useRef(null);
  useEffect(()=>{
    if(!ref.current)return;
    if(spinning){
      const loop=()=>{ rotRef.current+=0.007; drawCrystal(ref.current,rotRef.current,dark); rafRef.current=requestAnimationFrame(loop); };
      loop();
    } else drawCrystal(ref.current,0,dark);
    return()=>{if(rafRef.current)cancelAnimationFrame(rafRef.current);};
  },[size,spinning,dark]);
  return <canvas ref={ref} width={size} height={size} style={{display:"block"}} />;
}

function KpiCard({label,value,accent}){
  return(
    <div style={{background:BRAND.glass,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:`1px solid ${BRAND.glassBorder}`,borderRadius:14,padding:"18px 22px",boxShadow:BRAND.shadow}}>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:BRAND.textLight,marginBottom:6}}>{label}</div>
      <div style={{fontSize:28,fontWeight:800,color:accent?BRAND.lightBlue:BRAND.navy}}>{value}</div>
    </div>
  );
}

function PetalCard({petal,unlocked,onClick}){
  const [h,setH]=useState(false);
  return(
    <div onClick={()=>unlocked&&onClick(petal)}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:h&&unlocked?BRAND.glassHover:BRAND.glass,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:`1.5px solid ${h&&unlocked?BRAND.lightBlue:BRAND.glassBorder}`,borderRadius:16,padding:"22px 20px",cursor:unlocked?"pointer":"default",transition:"all 0.2s",boxShadow:h&&unlocked?BRAND.shadowHover:BRAND.shadow,transform:h&&unlocked?"translateY(-4px)":"none",opacity:unlocked?1:0.42}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
        <span style={{fontSize:20,color:unlocked?BRAND.lightBlue:BRAND.textLight,lineHeight:1}}>{petal.icon}</span>
        <div style={{display:"flex",gap:6}}>
          {!unlocked&&<span style={{fontSize:10,color:BRAND.textLight}}>🔒</span>}
          {petal.special&&unlocked&&<span style={{fontSize:8,fontWeight:700,letterSpacing:"1.5px",padding:"3px 8px",borderRadius:20,background:BRAND.skyBlue,color:BRAND.midBlue}}>MASTER</span>}
        </div>
      </div>
      <div style={{fontSize:14,fontWeight:800,color:unlocked?BRAND.navy:BRAND.textLight,marginBottom:4,letterSpacing:"-0.2px"}}>{petal.name}</div>
      <div style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:unlocked?BRAND.lightBlue:BRAND.textLight,marginBottom:10}}>{unlocked?petal.tagline:"LOCKED"}</div>
      <div style={{fontSize:12,color:BRAND.textMuted,lineHeight:1.65}}>{unlocked?petal.desc:"Acquire a higher Fragment to unlock this petal."}</div>
      {unlocked&&<div style={{display:"flex",alignItems:"center",gap:6,marginTop:14,color:BRAND.lightBlue}}><span style={{fontSize:11,fontWeight:700}}>Launch Agent</span><span>→</span></div>}
    </div>
  );
}

function Landing({onEnter,onGet}){
  return(
    <div>
      {/* Dark hero — same as Infinitely Me */}
      <div style={{background:`linear-gradient(160deg,${BRAND.navy} 0%,#0D2140 60%,${BRAND.blue} 100%)`,padding:"72px 24px 64px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-30%",right:"-10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(74,144,217,0.1) 0%,transparent 65%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"-20%",left:"-5%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(107,181,255,0.06) 0%,transparent 65%)",pointerEvents:"none"}}/>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(74,144,217,0.15)",border:"1px solid rgba(74,144,217,0.3)",borderRadius:20,padding:"5px 16px",marginBottom:28}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:BRAND.lightBlue}}/>
          <span style={{fontSize:9,fontWeight:700,letterSpacing:"2.5px",textTransform:"uppercase",color:BRAND.accentBlue}}>Prëmo Inc. · AI Agent Vault</span>
        </div>
        <div style={{display:"flex",justifyContent:"center",marginBottom:28}}><CrystalMark size={140} spinning dark/></div>
        <h1 style={{fontSize:"clamp(44px,8vw,80px)",fontWeight:800,color:"#fff",letterSpacing:"-3px",lineHeight:0.95,marginBottom:18}}>THE<br/><span style={{color:BRAND.accentBlue}}>CRYSTAL</span></h1>
        <p style={{fontSize:15,color:"rgba(255,255,255,0.55)",maxWidth:420,margin:"0 auto 14px",lineHeight:1.8}}>A vault of AI agents.<br/>Each one a petal.<br/>Unlocked by a Fragment.</p>
        <p style={{fontSize:10,color:"rgba(255,255,255,0.25)",marginBottom:40,letterSpacing:"2px",textTransform:"uppercase"}}>12 Agents · 4 Tiers · One Key</p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:52}}>
          <button onClick={onGet} style={{...primaryBtn,background:BRAND.lightBlue,padding:"13px 32px",fontSize:14,borderRadius:12}}>Acquire a Fragment →</button>
          <button onClick={onEnter} style={{...ghostBtn,color:"rgba(255,255,255,0.65)",border:"1px solid rgba(255,255,255,0.2)",padding:"13px 24px",borderRadius:12}}>Enter Fragment Code</button>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:36,flexWrap:"wrap"}}>
          {[["12","Agents"],["4","Tiers"],["∞","Potential"],["1","Fragment"]].map(([v,l])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontSize:26,fontWeight:800,color:"#fff",letterSpacing:"-1px"}}>{v}</div>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div style={{overflow:"hidden",background:BRAND.navy,borderBottom:`1px solid ${BRAND.glassBorder}`,padding:"11px 0"}}>
        <style>{`@keyframes marq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
        <div style={{display:"flex",animation:"marq 30s linear infinite",width:"max-content"}}>
          {[...["The Strategist","The Scribe","The Scout","The Compass","The Pipeline","The Architect","The Analyst","The Outreach","The Publisher","Rosa","The Negotiator","The Crystal","Fragment Access","Lifetime License"],...["The Strategist","The Scribe","The Scout","The Compass","The Pipeline","The Architect","The Analyst","The Outreach","The Publisher","Rosa","The Negotiator","The Crystal","Fragment Access","Lifetime License"]].map((item,i)=>(
            <React.Fragment key={i}>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",whiteSpace:"nowrap",padding:"0 20px"}}>{item}</span>
              <span style={{color:BRAND.lightBlue,fontSize:9,opacity:0.4}}>◆</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Signature light section */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"56px 24px 80px"}}>
        <div style={{marginBottom:52}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:BRAND.lightBlue,marginBottom:8}}>The Architecture</div>
          <h2 style={{fontSize:28,fontWeight:800,color:BRAND.navy,letterSpacing:"-0.5px",marginBottom:28}}>Fragment → Petal → Agent</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
            {[["◆","The Fragment","Your access key. Each Fragment holds a tier — I, III, VII, or XII — determining how many petals you unlock inside the vault."],["⬡","The Petal","Each petal is a fully-operational AI agent. Specialised. Precise. Built for a specific function in your media empire."],["∞","The Crystal","All 12 petals working as one unified system. The self-made billionaire AI stack. Reserved for Fragment XII holders only."]].map(([icon,title,desc])=>(
              <div key={title} style={{background:BRAND.glass,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:`1px solid ${BRAND.glassBorder}`,borderRadius:14,padding:"24px 22px",boxShadow:BRAND.shadow}}>
                <div style={{fontSize:22,color:BRAND.lightBlue,marginBottom:12}}>{icon}</div>
                <div style={{fontSize:14,fontWeight:700,color:BRAND.navy,marginBottom:8}}>{title}</div>
                <div style={{fontSize:12,color:BRAND.textMuted,lineHeight:1.7}}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:BRAND.lightBlue,marginBottom:8}}>The 12 Petals</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12,marginBottom:24}}>
            <h2 style={{fontSize:28,fontWeight:800,color:BRAND.navy,letterSpacing:"-0.5px"}}>Your AI Agent Stack</h2>
            <p style={{fontSize:13,color:BRAND.textMuted}}>Acquire a Fragment to unlock what's inside.</p>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(248px,1fr))",gap:12,marginBottom:56}}>
          {PETALS.map(p=><PetalCard key={p.id} petal={p} unlocked={false} onClick={()=>{}}/>)}
        </div>

        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:BRAND.lightBlue,marginBottom:8}}>Fragment Tiers</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12,marginBottom:24}}>
            <h2 style={{fontSize:28,fontWeight:800,color:BRAND.navy,letterSpacing:"-0.5px"}}>Choose Your Depth</h2>
            <p style={{fontSize:13,color:BRAND.textMuted}}>One-time purchase. Lifetime access.</p>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:14,marginBottom:48}}>
          {Object.entries(TIERS).map(([tier,data])=>{
            const [h,setH]=useState(false);
            const isTop=tier==="XII";
            return(
              <div key={tier} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onGet}
                style={{background:isTop?"rgba(74,144,217,0.07)":h?BRAND.glassHover:BRAND.glass,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:`1.5px solid ${isTop?BRAND.lightBlue:h?BRAND.lightBlue:BRAND.glassBorder}`,borderRadius:16,padding:"24px 20px",cursor:"pointer",transition:"all 0.2s",transform:h?"translateY(-3px)":"none",boxShadow:h?BRAND.shadowHover:BRAND.shadow}}>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:BRAND.lightBlue,marginBottom:4}}>Fragment {tier}</div>
                <div style={{fontSize:12,fontWeight:600,color:BRAND.textMuted,marginBottom:8}}>{data.label}</div>
                <div style={{fontSize:28,fontWeight:800,color:BRAND.navy,letterSpacing:"-1px",marginBottom:4}}>${data.price}</div>
                <div style={{fontSize:11,color:BRAND.textLight,marginBottom:10}}>{data.petals.length} of 12 petals</div>
                <div style={{fontSize:12,color:BRAND.textMuted,lineHeight:1.6,marginBottom:14}}>{data.desc}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:16}}>
                  {[...Array(12)].map((_,i)=>(<div key={i} style={{width:10,height:10,borderRadius:3,background:data.petals.includes(i+1)?BRAND.lightBlue:BRAND.skyBlue}}/>))}
                </div>
                <div style={{fontSize:11,fontWeight:700,color:isTop?BRAND.lightBlue:BRAND.midBlue}}>Get Fragment {tier} →</div>
              </div>
            );
          })}
        </div>
        <div style={{textAlign:"center"}}><button onClick={onGet} style={{...primaryBtn,padding:"14px 40px",fontSize:14}}>Acquire Your Fragment →</button></div>
      </div>
    </div>
  );
}

function FragmentEntry({onBack,onUnlock}){
  const [code,setCode]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const attempt=async()=>{
    if(!code.trim())return;
    setLoading(true);setError("");
    const{data,error:err}=await supabase.from("crystal_fragments").select("*").eq("code",code.trim().toUpperCase()).eq("active",true).single();
    setLoading(false);
    if(err||!data){setError("Fragment not recognised. Check your code and try again.");return;}
    await supabase.from("crystal_access_log").insert({fragment_code:data.code});
    onUnlock(data);
  };
  return(
    <div style={{maxWidth:480,margin:"0 auto",padding:"60px 24px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:BRAND.textMuted,fontFamily:"'Montserrat',sans-serif",fontSize:12,cursor:"pointer",marginBottom:36}}>← Back</button>
      <div style={{background:BRAND.glass,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",border:`1px solid ${BRAND.glassBorder}`,borderRadius:20,padding:36,boxShadow:BRAND.shadow,textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:20}}><CrystalMark size={72}/></div>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:BRAND.lightBlue,marginBottom:8}}>Fragment Authentication</div>
        <h2 style={{fontSize:24,fontWeight:800,color:BRAND.navy,letterSpacing:"-0.5px",marginBottom:8}}>Enter Your Fragment</h2>
        <p style={{fontSize:13,color:BRAND.textMuted,lineHeight:1.75,marginBottom:28}}>Each Fragment is a unique access code. Enter yours to unlock your petals.</p>
        <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} onKeyDown={e=>e.key==="Enter"&&attempt()} placeholder="CRYSTAL-XXXX-XXXX" autoFocus style={{...inp,textAlign:"center"}}/>
        {error&&<div style={{fontSize:12,color:"#E24B4A",marginBottom:14}}>{error}</div>}
        <button onClick={attempt} disabled={loading||!code.trim()} style={{...primaryBtn,padding:"13px 0",width:"100%",opacity:loading||!code.trim()?0.5:1,fontSize:14}}>
          {loading?"Authenticating...":"Unlock the Crystal →"}
        </button>
      </div>
    </div>
  );
}

function Vault({fragment,onLogout}){
  const [activePetal,setActivePetal]=useState(null);
  const tierData=TIERS[fragment.tier];
  const unlocked=tierData?.petals||[];
  return(
    <div style={{maxWidth:1100,margin:"0 auto",padding:"36px 24px 100px"}}>
      <div style={{background:`linear-gradient(135deg,${BRAND.navy} 0%,${BRAND.midBlue} 100%)`,borderRadius:18,padding:"22px 28px",marginBottom:28,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <CrystalMark size={52} spinning dark/>
          <div>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:BRAND.accentBlue,marginBottom:3}}>Fragment {fragment.tier} · {tierData?.label}</div>
            <div style={{fontSize:20,fontWeight:800,color:"#fff",letterSpacing:"-0.5px"}}>The Crystal — Vault</div>
            {fragment.holder_name&&<div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:2}}>{fragment.holder_name}</div>}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:28,fontWeight:800,color:"#fff",letterSpacing:"-1px"}}>{unlocked.length}<span style={{fontSize:14,color:"rgba(255,255,255,0.4)",fontWeight:400}}>/12</span></div>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:"1.5px",textTransform:"uppercase"}}>Petals Active</div>
          </div>
          <button onClick={onLogout} style={{...ghostBtn,color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.15)",padding:"8px 16px",fontSize:11}}>Exit Vault</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:14,marginBottom:32}}>
        <KpiCard label="Petals Unlocked" value={unlocked.length} accent/>
        <KpiCard label="Petals Locked" value={12-unlocked.length}/>
        <KpiCard label="Fragment Tier" value={fragment.tier}/>
        <KpiCard label="Access" value="Active" accent/>
      </div>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:BRAND.textLight,marginBottom:18}}>Your Petals</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(256px,1fr))",gap:14}}>
        {PETALS.map(p=><PetalCard key={p.id} petal={p} unlocked={unlocked.includes(p.id)} onClick={setActivePetal}/>)}
      </div>
      {fragment.tier!=="XII"&&(
        <div style={{background:BRAND.glass,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:`1px solid ${BRAND.glassBorder}`,borderRadius:14,padding:"22px 24px",marginTop:28,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14,boxShadow:BRAND.shadow}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:BRAND.navy,marginBottom:4}}>{12-unlocked.length} petals still locked</div>
            <div style={{fontSize:12,color:BRAND.textMuted}}>Upgrade your Fragment to unlock the full crystal.</div>
          </div>
          <button style={primaryBtn}>Upgrade Fragment →</button>
        </div>
      )}
      {activePetal&&(
        <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{position:"absolute",inset:0,background:"rgba(10,22,40,0.5)",backdropFilter:"blur(12px)"}} onClick={()=>setActivePetal(null)}/>
          <div style={{position:"relative",background:BRAND.white,border:`1px solid ${BRAND.glassBorder}`,borderRadius:20,padding:36,maxWidth:520,width:"100%",boxShadow:"0 24px 80px rgba(10,22,40,0.2)",maxHeight:"90vh",overflowY:"auto"}}>
            <button onClick={()=>setActivePetal(null)} style={{position:"absolute",top:16,right:16,background:"none",border:"none",fontSize:20,cursor:"pointer",color:BRAND.textLight}}>✕</button>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
              <div style={{width:52,height:52,borderRadius:14,background:BRAND.skyBlue,border:`1px solid ${BRAND.glassBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,color:BRAND.lightBlue,flexShrink:0}}>{activePetal.icon}</div>
              <div>
                <div style={{fontSize:20,fontWeight:800,color:BRAND.navy,letterSpacing:"-0.5px"}}>{activePetal.name}</div>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:BRAND.lightBlue}}>{activePetal.tagline}</div>
              </div>
            </div>
            <p style={{fontSize:14,color:BRAND.textMuted,lineHeight:1.75,marginBottom:22}}>{activePetal.desc}</p>
            <div style={{background:BRAND.ice,borderRadius:10,padding:"14px 16px",marginBottom:22}}>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:BRAND.textLight,marginBottom:6}}>Agent Status</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:BRAND.lightBlue}}/>
                <span style={{fontSize:12,color:BRAND.midBlue,fontWeight:600}}>{activePetal.special?"Master integration — all 12 petals synced":"Integration in progress — full launch Q2 2026"}</span>
              </div>
            </div>
            <button onClick={()=>setActivePetal(null)} style={{...primaryBtn,padding:"13px 0",width:"100%",fontSize:14}}>{activePetal.special?"The Crystal — All Systems":`Coming Soon — ${activePetal.name}`}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function GetFragment({onBack}){
  return(
    <div style={{maxWidth:960,margin:"0 auto",padding:"52px 24px 80px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:BRAND.textMuted,fontFamily:"'Montserrat',sans-serif",fontSize:12,cursor:"pointer",marginBottom:36}}>← Back</button>
      <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:BRAND.lightBlue,marginBottom:8}}>Acquire a Fragment</div>
      <h2 style={{fontSize:30,fontWeight:800,color:BRAND.navy,letterSpacing:"-0.5px",marginBottom:6}}>Choose Your Depth</h2>
      <p style={{fontSize:13,color:BRAND.textMuted,marginBottom:36}}>One-time purchase. Lifetime access. No subscriptions. Upgrade by paying the difference.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:14,marginBottom:40}}>
        {Object.entries(TIERS).map(([tier,data])=>{
          const [h,setH]=useState(false);
          const isTop=tier==="XII";
          return(
            <div key={tier} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
              style={{background:isTop?"rgba(74,144,217,0.07)":h?BRAND.glassHover:BRAND.glass,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:`1.5px solid ${isTop?BRAND.lightBlue:h?BRAND.lightBlue:BRAND.glassBorder}`,borderRadius:16,padding:"26px 22px",cursor:"pointer",transition:"all 0.2s",transform:h?"translateY(-3px)":"none",boxShadow:h?BRAND.shadowHover:BRAND.shadow}}>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:BRAND.lightBlue,marginBottom:4}}>Fragment {tier}</div>
              <div style={{fontSize:12,fontWeight:600,color:BRAND.textMuted,marginBottom:8}}>{data.label}</div>
              <div style={{fontSize:30,fontWeight:800,color:BRAND.navy,letterSpacing:"-1.5px",marginBottom:4}}>${data.price}</div>
              <div style={{fontSize:11,color:BRAND.textLight,marginBottom:12}}>{data.petals.length} of 12 petals</div>
              <div style={{fontSize:12,color:BRAND.textMuted,lineHeight:1.65,marginBottom:16}}>{data.desc}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:18}}>
                {[...Array(12)].map((_,i)=>(<div key={i} style={{width:10,height:10,borderRadius:3,background:data.petals.includes(i+1)?BRAND.lightBlue:BRAND.skyBlue}}/>))}
              </div>
              <button style={{width:"100%",background:isTop?`linear-gradient(135deg,${BRAND.navy},${BRAND.midBlue})`:"transparent",color:isTop?"#fff":BRAND.midBlue,border:`1px solid ${isTop?"transparent":BRAND.glassBorder}`,borderRadius:8,padding:"10px 0",fontFamily:"'Montserrat',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>
                Get Fragment {tier}
              </button>
            </div>
          );
        })}
      </div>
      <div style={{background:BRAND.glass,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",border:`1px solid ${BRAND.glassBorder}`,borderRadius:12,padding:"18px 22px",textAlign:"center",boxShadow:BRAND.shadow}}>
        <div style={{fontSize:12,color:BRAND.textMuted,lineHeight:1.7}}>Payment via Stripe · Fragment code delivered instantly to your email<br/>No subscriptions · No renewal fees · Access never expires</div>
      </div>
    </div>
  );
}

export default function App(){
  const [view,setView]=useState("landing");
  const [fragment,setFragment]=useState(null);
  return(
    <div style={{fontFamily:"'Montserrat',sans-serif",minHeight:"100vh",background:`linear-gradient(165deg,${BRAND.white} 0%,${BRAND.ice} 40%,${BRAND.skyBlue} 100%)`,color:BRAND.text,position:"relative",overflow:"hidden"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} body{background:#F0F6FC;} button:hover{opacity:0.88;} input::placeholder{color:#8899AA;} input,select,textarea,button{font-family:'Montserrat',sans-serif;}`}</style>
      <div style={{position:"fixed",top:"-20%",right:"-10%",width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(74,144,217,0.06) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:"-15%",left:"-5%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(30,58,95,0.05) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <header style={{position:"sticky",top:0,zIndex:100,background:BRAND.glass,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:`1px solid ${BRAND.glassBorder}`,padding:"14px 32px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>setView("landing")}>
          <CrystalMark size={38}/>
          <div>
            <div style={{fontSize:18,fontWeight:700,color:BRAND.navy,letterSpacing:"1.5px"}}>THE CRYSTAL</div>
            <div style={{fontSize:9,color:BRAND.textMuted,letterSpacing:"2.5px",textTransform:"uppercase"}}>AI Agent Vault · Prëmo Inc.</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {view!=="enter"&&view!=="vault"&&<button onClick={()=>setView("enter")} style={{...ghostBtn,padding:"8px 16px",fontSize:12}}>Enter Fragment</button>}
          {view==="vault"&&<button onClick={()=>{setFragment(null);setView("landing");}} style={{...ghostBtn,padding:"8px 16px",fontSize:12}}>← Exit Vault</button>}
          {view!=="get"&&<button onClick={()=>setView("get")} style={{...primaryBtn,padding:"9px 18px",fontSize:12}}>Acquire Fragment</button>}
          <span style={{fontSize:9,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",padding:"5px 12px",borderRadius:20,background:BRAND.skyBlue,color:BRAND.midBlue}}>Crystal</span>
        </div>
      </header>
      <div style={{position:"relative",zIndex:1}}>
        {view==="landing"&&<Landing onEnter={()=>setView("enter")} onGet={()=>setView("get")}/>}
        {view==="enter"&&<FragmentEntry onBack={()=>setView("landing")} onUnlock={data=>{setFragment(data);setView("vault");}}/>}
        {view==="vault"&&fragment&&<Vault fragment={fragment} onLogout={()=>{setFragment(null);setView("landing");}}/>}
        {view==="get"&&<GetFragment onBack={()=>setView("landing")}/>}
      </div>
      {view!=="vault"&&<div style={{textAlign:"center",padding:"32px 24px",fontSize:11,color:BRAND.textLight,letterSpacing:"1px",position:"relative",zIndex:1}}>THE CRYSTAL · PRËMO INC. · CANGGU, BALI · {new Date().getFullYear()}</div>}
    </div>
  );
}
