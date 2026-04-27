import React, { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CHECKOUT_URL = "https://checkout-the-crystal.vercel.app";

const B = {
  navy:"#0A1628",blue:"#1E3A5F",midBlue:"#2B5C8A",lightBlue:"#4A90D9",
  skyBlue:"#E8F4FD",ice:"#F0F6FC",white:"#FFFFFF",
  border:"rgba(74,144,217,0.15)",shadow:"0 2px 12px rgba(10,22,40,0.06)",
  shadowHover:"0 10px 32px rgba(10,22,40,0.13)",text:"#0D1B2A",
  textMuted:"#5A7080",textLight:"#8899AA",green:"#1B7A3D",greenBg:"#E6F4EA",
};
const F = "'Montserrat', sans-serif";
const primaryBtn = { background:`linear-gradient(135deg,${B.navy} 0%,${B.midBlue} 100%)`,color:"#fff",border:"none",borderRadius:8,fontFamily:F,fontWeight:700,fontSize:13,cursor:"pointer",padding:"9px 20px",transition:"all 0.18s" };
const ghostBtn   = { background:"transparent",color:B.textMuted,border:`1px solid ${B.border}`,borderRadius:8,fontFamily:F,fontWeight:600,fontSize:12,cursor:"pointer",padding:"8px 16px",transition:"all 0.18s" };
const cardStyle  = { background:B.white,border:`1px solid ${B.border}`,borderRadius:12,boxShadow:B.shadow };

const AGENTS = [
  { id:1,  name:"Sage",        title:"the Strategist",         icon:"◈", tagline:"Angles. Hooks. Dominance.",     desc:"Deconstructs any brief and generates conversion-ranked ad angles with emotional triggers, pattern interrupts, and scoring." },
  { id:2,  name:"Petunia",     title:"the Copywriter",         icon:"✦", tagline:"Script. Copy. Convert.",        desc:"Transforms angles into production-ready ad scripts: scene direction, captions, b-roll guides, hook variations." },
  { id:3,  name:"Ivy",         title:"the Business Developer", icon:"◉", tagline:"Find. Target. Outreach.",       desc:"Discovers ideal clients, builds hyper-targeted prospect lists, and drafts personalised outreach sequences at scale." },
  { id:4,  name:"Basil",       title:"the Producer",           icon:"⬡", tagline:"Direction. Clarity. Speed.",    desc:"Maps your entire content calendar from a single brief. 90 days of strategy in 90 seconds." },
  { id:5,  name:"Clover",      title:"the Moneymaker",         icon:"⬟", tagline:"Revenue. Offer. Scale.",        desc:"Handles pricing strategy, offer architecture, upsell sequences, and monetisation frameworks." },
  { id:6,  name:"Olive",       title:"the Closer",             icon:"⬢", tagline:"Funnel. Convert. Win.",         desc:"Designs complete marketing funnels: landing pages, email sequences, lead magnets, and ad sets." },
  { id:7,  name:"Juniper",     title:"the Analytical",         icon:"◬", tagline:"Data. Insight. Action.",        desc:"Reads your channel analytics across every platform and delivers clear, data-backed next steps." },
  { id:8,  name:"Flora",       title:"the Publisher",          icon:"◈", tagline:"Create. Schedule. Distribute.", desc:"Adapts any content across every platform and format. Write once, publish everywhere." },
  { id:9,  name:"Laurel",      title:"the Generator",          icon:"✦", tagline:"Volume. Speed. Quality.",       desc:"Generates high-volume creative output: concepts, headlines, hooks, angles — at scale and on-brief." },
  { id:10, name:"Orchid",      title:"the Searcher",           icon:"◉", tagline:"Find. Surface. Report.",        desc:"Finds competitors, gaps, trends, audiences, and data others miss. Delivers it structured and actionable." },
  { id:11, name:"Jasmine",     title:"the Administrator",      icon:"⬡", tagline:"SOPs. Contracts. Order.",       desc:"Handles SOPs, contracts, briefs, templates, meeting notes, and project tracking." },
  { id:12, name:"The Crystal", title:"All Twelve. One Mind.",  icon:"∞", tagline:"The complete stack.",           desc:"All 12 agents as one unified mind. The complete Prëmo AI stack.", special:true },
];

const TIERS = [
  { count:1,  price:97,   badge:null,           desc:"Your first agent. One petal, fully active.",         cta:"Get 1 Fragment" },
  { count:3,  price:297,  badge:null,           desc:"Three agents. The creative core begins.",            cta:"Get 3 Fragments" },
  { count:6,  price:597,  badge:"Most Popular", desc:"Half the vault. Production, strategy, and scale.",   cta:"Get 6 Fragments" },
  { count:12, price:1297, badge:"Full Crystal", desc:"All twelve agents. The full Rosa ecosystem.",        cta:"Get the Fragments" },
];

// ── Crystal mark ──────────────────────────────────────────────
function CrystalMark({ size, spinning }) {
  const ref = useRef(null);
  const rot = useRef(0);
  const raf = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const draw = () => {
      const ctx = c.getContext("2d"); ctx.clearRect(0,0,c.width,c.height);
      const cx=c.width/2,cy=c.height/2,maxR=(size/2)*0.88,N=24;
      const layers=[[1,"#5AABEF",0.92],[0.82,"#4A90D9",1],[0.65,"#2B5C8A",1],[0.5,"#1E3A5F",1],[0.36,"#0A1628",1]];
      for(let li=layers.length-1;li>=0;li--){
        const[rR,color,op]=layers[li],R=maxR*rR,r=R*0.38;
        ctx.globalAlpha=op; ctx.beginPath();
        for(let i=0;i<N*2;i++){const a=(i*Math.PI/N)+rot.current-Math.PI/2,rad=i%2===0?R:r;i===0?ctx.moveTo(cx+rad*Math.cos(a),cy+rad*Math.sin(a)):ctx.lineTo(cx+rad*Math.cos(a),cy+rad*Math.sin(a));}
        ctx.closePath(); ctx.fillStyle=color; ctx.fill();
      }
      ctx.globalAlpha=1; ctx.beginPath(); ctx.arc(cx,cy,maxR*0.21,0,Math.PI*2); ctx.fillStyle=B.navy; ctx.fill();
    };
    if(spinning){const loop=()=>{rot.current+=0.007;draw();raf.current=requestAnimationFrame(loop);};loop();}else draw();
    return()=>{if(raf.current)cancelAnimationFrame(raf.current);};
  },[size,spinning]);
  return <canvas ref={ref} width={size} height={size} style={{display:"block"}}/>;
}

// ── Auth ──────────────────────────────────────────────────────
function AuthScreen() {
  const [email,setEmail]=useState(""); const [sent,setSent]=useState(false);
  const [loading,setLoading]=useState(false); const [err,setErr]=useState("");
  const send = async () => {
    if(!email.trim())return; setLoading(true); setErr("");
    const{error}=await supabase.auth.signInWithOtp({email:email.trim(),options:{emailRedirectTo:window.location.href}});
    setLoading(false);
    if(error)setErr(error.message); else setSent(true);
  };
  return (
    <div style={{minHeight:"100vh",background:B.ice,display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:F}}>
      <div style={{maxWidth:420,width:"100%",...cardStyle,padding:"40px 36px",textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><CrystalMark size={52}/></div>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:B.lightBlue,marginBottom:6,fontFamily:F}}>The Crystal · Prëmo Inc.</div>
        <h2 style={{fontSize:22,fontWeight:800,color:B.text,marginBottom:6,fontFamily:F}}>Enter Your Vault</h2>
        {sent?(
          <><p style={{fontSize:13,color:B.textMuted,lineHeight:1.75,marginBottom:20,fontFamily:F}}>Magic link sent to <strong>{email}</strong>. Check your inbox and click the link.</p>
          <button onClick={()=>setSent(false)} style={{...ghostBtn,fontSize:12}}>Use a different email</button></>
        ):(
          <><p style={{fontSize:13,color:B.textMuted,lineHeight:1.75,marginBottom:24,fontFamily:F}}>Enter the email you used when purchasing your Fragments. We'll send a magic link — no password needed.</p>
          <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="your@email.com" type="email" autoFocus style={{width:"100%",background:B.ice,border:`1px solid ${B.border}`,borderRadius:8,padding:"11px 14px",fontSize:14,color:B.text,fontFamily:F,boxSizing:"border-box",outline:"none",marginBottom:12,textAlign:"center"}}/>
          {err&&<div style={{fontSize:12,color:"#E24B4A",marginBottom:10,fontFamily:F}}>{err}</div>}
          <button onClick={send} disabled={loading||!email.trim()} style={{...primaryBtn,padding:"12px 0",width:"100%",fontSize:14,opacity:loading||!email.trim()?0.5:1}}>{loading?"Sending...":"Send Magic Link →"}</button>
          <div style={{marginTop:16,fontSize:11,color:B.textLight,fontFamily:F}}>Don't have fragments?{" "}<a href={CHECKOUT_URL} style={{color:B.lightBlue,textDecoration:"none",fontWeight:700}}>Acquire Fragments →</a></div></>
        )}
      </div>
    </div>
  );
}

// ── Agent modal (chat) ────────────────────────────────────────
function AgentModal({ agent, userEmail, onClose }) {
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [booting,setBooting]=useState(true);
  const [systemPrompt,setSystemPrompt]=useState("");
  const bottomRef=useRef(null);
  const taRef=useRef(null);

  useEffect(()=>{
    (async()=>{
      // Load agent system prompt
      const{data:cfg}=await supabase.from("crystal_agent_configs").select("system_prompt").eq("agent_id",agent.id).single();
      if(cfg)setSystemPrompt(cfg.system_prompt);
      // Load existing conversation — query by email match since RLS is now open to authenticated users
      const{data:cu}=await supabase.from("crystal_users").select("id").eq("email",userEmail).maybeSingle();
      if(cu){
        const{data:sess}=await supabase.from("crystal_agent_sessions").select("messages").eq("user_id",cu.id).eq("agent_id",agent.id).maybeSingle();
        if(sess?.messages)setMessages(sess.messages);
      }
      setBooting(false);
    })();
  },[agent.id,userEmail]);

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages,loading]);

  const save = async (msgs) => {
    const{data:cu}=await supabase.from("crystal_users").select("id").eq("email",userEmail).maybeSingle();
    if(!cu)return;
    await supabase.from("crystal_agent_sessions").upsert(
      {user_id:cu.id,agent_id:agent.id,agent_name:agent.name,messages:msgs,updated_at:new Date().toISOString()},
      {onConflict:"user_id,agent_id"}
    );
  };

  const send = async () => {
    const text=input.trim(); if(!text||loading||!systemPrompt)return;
    const userMsg={role:"user",content:text};
    const newMsgs=[...messages,userMsg];
    setMessages(newMsgs); setInput("");
    if(taRef.current)taRef.current.style.height="auto";
    setLoading(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1024,system:systemPrompt,messages:newMsgs.map(m=>({role:m.role,content:m.content}))}),
      });
      const data=await res.json();
      const reply=data.content?.[0]?.text||"...";
      const final=[...newMsgs,{role:"assistant",content:reply}];
      setMessages(final); await save(final);
    }catch{setMessages(p=>[...p,{role:"assistant",content:"Something went wrong. Try again."}]);}
    setLoading(false);
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{position:"absolute",inset:0,background:"rgba(10,22,40,0.5)",backdropFilter:"blur(8px)"}} onClick={onClose}/>
      <div style={{position:"relative",background:B.white,border:`1px solid ${B.border}`,borderRadius:16,width:"100%",maxWidth:620,height:"80vh",display:"flex",flexDirection:"column",boxShadow:"0 24px 60px rgba(10,22,40,0.18)",overflow:"hidden",fontFamily:F}}>
        {/* Header */}
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${B.border}`,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <div style={{width:40,height:40,borderRadius:10,background:B.skyBlue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:B.lightBlue,flexShrink:0}}>{agent.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:700,color:B.text,fontFamily:F}}>{agent.name}</div>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:B.lightBlue,fontFamily:F}}>{agent.title}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginRight:8}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:B.green}}/>
            <span style={{fontSize:10,color:B.textLight,fontFamily:F}}>Active</span>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:B.textLight,padding:4}}>✕</button>
        </div>
        {/* Messages */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 20px 10px"}}>
          {booting?<div style={{textAlign:"center",padding:40,color:B.textLight,fontSize:12,fontFamily:F}}>Loading...</div>
          :messages.length===0?(
            <div style={{textAlign:"center",padding:"32px 20px"}}>
              <div style={{fontSize:32,marginBottom:12}}>{agent.icon}</div>
              <div style={{fontSize:15,fontWeight:700,color:B.text,fontFamily:F,marginBottom:6}}>{agent.name}</div>
              <div style={{fontSize:12,color:B.textMuted,lineHeight:1.7,fontFamily:F,maxWidth:320,margin:"0 auto"}}>{agent.desc}</div>
              <div style={{marginTop:12,fontSize:11,fontStyle:"italic",color:B.textLight,fontFamily:F}}>{agent.tagline}</div>
            </div>
          ):messages.map((m,i)=>(
            <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:16}}>
              {m.role==="assistant"&&<div style={{width:28,height:28,borderRadius:7,background:B.skyBlue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:B.lightBlue,flexShrink:0,marginRight:8,marginTop:2}}>{agent.icon}</div>}
              <div style={{maxWidth:"78%",padding:"10px 14px",borderRadius:m.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px",background:m.role==="user"?`linear-gradient(135deg,${B.navy},${B.midBlue})`:B.ice,color:m.role==="user"?"#fff":B.text,fontSize:13,lineHeight:1.7,fontFamily:F,whiteSpace:"pre-wrap"}}>{m.content}</div>
            </div>
          ))}
          {loading&&<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
            <div style={{width:28,height:28,borderRadius:7,background:B.skyBlue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:B.lightBlue,flexShrink:0}}>{agent.icon}</div>
            <div style={{display:"flex",gap:5,padding:"10px 14px",background:B.ice,borderRadius:"12px 12px 12px 4px"}}>
              {[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:B.textLight,animation:`blink 1.3s ease ${i*0.2}s infinite`}}/>)}
            </div>
          </div>}
          <div ref={bottomRef}/>
        </div>
        {/* Input */}
        <div style={{padding:"12px 16px",borderTop:`1px solid ${B.border}`,flexShrink:0}}>
          {!systemPrompt&&!booting&&<div style={{fontSize:11,color:"#E24B4A",textAlign:"center",marginBottom:8,fontFamily:F}}>Agent config not found — run 02_seed_agents.sql in Supabase</div>}
          <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
            <textarea ref={taRef} value={input} onChange={e=>{setInput(e.target.value);e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";}} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder={`Message ${agent.name}...`} rows={1} style={{flex:1,background:B.ice,border:`1px solid ${B.border}`,borderRadius:8,padding:"10px 12px",fontSize:13,color:B.text,fontFamily:F,outline:"none",resize:"none",maxHeight:120,lineHeight:1.5}}/>
            <button onClick={send} disabled={loading||!input.trim()||!systemPrompt} style={{...primaryBtn,padding:"10px 16px",flexShrink:0,opacity:loading||!input.trim()||!systemPrompt?0.5:1}}>→</button>
          </div>
          <div style={{fontSize:9,color:B.textLight,fontFamily:F,marginTop:6,textAlign:"center"}}>Enter to send · Shift+Enter for new line</div>
        </div>
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:0.5}50%{opacity:0.1}}`}</style>
    </div>
  );
}

// ── Petal card ────────────────────────────────────────────────
function PetalCard({ agent, unlocked, onActivate }) {
  const [hov,setHov]=useState(false);
  return (
    <div onMouseEnter={()=>unlocked&&setHov(true)} onMouseLeave={()=>unlocked&&setHov(false)} onClick={()=>unlocked&&onActivate(agent)}
      style={{...cardStyle,padding:20,cursor:unlocked?"pointer":"default",opacity:unlocked?1:0.5,border:`1px solid ${hov?B.lightBlue:B.border}`,boxShadow:hov?B.shadowHover:B.shadow,transform:hov?"translateY(-4px)":"none",transition:"all 0.22s",position:"relative",overflow:"hidden",background:hov?B.skyBlue:B.white}}>
      {hov&&<div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${B.lightBlue}06,${B.skyBlue}40)`,borderRadius:12,pointerEvents:"none"}}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,position:"relative"}}>
        <div style={{width:36,height:36,borderRadius:8,background:hov?`${B.lightBlue}22`:B.skyBlue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:hov?B.lightBlue:B.textLight,transition:"all 0.2s"}}>{agent.icon}</div>
        {unlocked&&<div style={{width:7,height:7,borderRadius:"50%",background:B.green,marginTop:4}}/>}
        {!unlocked&&<span style={{fontSize:12,color:B.textLight}}>🔒</span>}
        {agent.special&&unlocked&&<span style={{fontSize:8,fontWeight:700,letterSpacing:"1.5px",padding:"3px 8px",borderRadius:20,background:B.skyBlue,color:B.midBlue,position:"absolute",top:0,right:0,fontFamily:F}}>MASTER</span>}
      </div>
      <div style={{fontSize:14,fontWeight:700,color:unlocked?B.text:B.textLight,marginBottom:3,fontFamily:F}}>{agent.name}</div>
      <div style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:unlocked?B.lightBlue:B.textLight,marginBottom:8,fontFamily:F}}>{agent.title}</div>
      {unlocked?(<>
        <div style={{fontSize:12,color:B.textMuted,lineHeight:1.65,marginBottom:12,fontFamily:F}}>{agent.tagline}</div>
        <div style={{fontSize:12,fontWeight:700,color:B.lightBlue,fontFamily:F}}>{hov?"Open Agent →":"Activate"}</div>
      </>):(
        <div style={{fontSize:12,color:B.textLight,lineHeight:1.65,fontFamily:F}}>Acquire a Fragment to unlock this agent.</div>
      )}
    </div>
  );
}

// ── Tier card ─────────────────────────────────────────────────
function TierCard({ tier }) {
  const [hov,setHov]=useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={()=>window.open(`${CHECKOUT_URL}?count=${tier.count}`,"_blank")}
      style={{...cardStyle,padding:22,cursor:"pointer",border:`1px solid ${hov?B.lightBlue:B.border}`,boxShadow:hov?B.shadowHover:B.shadow,transform:hov?"translateY(-3px)":"none",transition:"all 0.2s",position:"relative"}}>
      {tier.badge&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",fontSize:9,fontWeight:800,letterSpacing:"1.5px",textTransform:"uppercase",padding:"3px 12px",borderRadius:20,background:hov?B.navy:B.lightBlue,color:"#fff",fontFamily:F,whiteSpace:"nowrap"}}>{tier.badge}</div>}
      <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:12}}>
        {AGENTS.map(a=><div key={a.id} style={{width:9,height:9,borderRadius:2,background:a.id<=tier.count?B.lightBlue:B.skyBlue}}/>)}
      </div>
      <div style={{fontSize:9,fontWeight:600,color:B.textLight,fontFamily:F,marginBottom:4}}>{tier.count} of 12 petals</div>
      <div style={{fontSize:26,fontWeight:900,color:B.text,letterSpacing:"-1px",fontFamily:F,marginBottom:4}}>${tier.price.toLocaleString()}<span style={{fontSize:12,fontWeight:400,color:B.textLight,marginLeft:4}}>/mo</span></div>
      <div style={{fontSize:12,color:B.textMuted,fontFamily:F,lineHeight:1.6,marginBottom:14}}>{tier.desc}</div>
      <button style={{...primaryBtn,width:"100%",padding:"10px 0",fontSize:12}}>{tier.cta}</button>
    </div>
  );
}

// ── Vault (logged in) ─────────────────────────────────────────
function VaultView({ authUser, onLogout }) {
  const [fragments,setFragments]=useState([]);
  const [activeAgent,setActiveAgent]=useState(null);
  const [loaded,setLoaded]=useState(false);

  useEffect(()=>{
    (async()=>{
      // Get crystal_users row by email
      const{data:cu}=await supabase.from("crystal_users").select("id,email,name").eq("email",authUser.email).maybeSingle();
      if(cu){
        const{data:frags}=await supabase.from("crystal_fragments").select("*").eq("user_id",cu.id).eq("active",true).order("purchased_at",{ascending:true});
        setFragments(frags||[]);
      }
      setLoaded(true);
    })();
  },[authUser.email]);

  const unlockedIds=[...new Set(fragments.map(f=>f.agent_id).filter(Boolean))];

  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"40px 28px 80px",fontFamily:F}}>
      {/* Profile header */}
      <div style={{background:`linear-gradient(135deg,${B.navy},${B.midBlue})`,borderRadius:14,padding:"22px 28px",marginBottom:28,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <CrystalMark size={44} spinning/>
          <div>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",color:"rgba(255,255,255,0.4)",marginBottom:2,fontFamily:F}}>Your Vault</div>
            <div style={{fontSize:18,fontWeight:700,color:"#fff",fontFamily:F}}>{authUser.email}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:2,fontFamily:F}}>{unlockedIds.length} agent{unlockedIds.length!==1?"s":""} unlocked · {fragments.length} fragment{fragments.length!==1?"s":""} collected</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" style={{...primaryBtn,textDecoration:"none",fontSize:12}}>Acquire More Fragments →</a>
          <button onClick={onLogout} style={{...ghostBtn,color:"rgba(255,255,255,0.5)",border:"1px solid rgba(255,255,255,0.15)"}}>Exit</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:28}}>
        {[["Agents Unlocked",loaded?unlockedIds.length:"…",true],["Agents Locked",loaded?12-unlockedIds.length:"…",false],["Fragments",loaded?fragments.length:"…",false],["Status",loaded?(unlockedIds.length>0?"Active":"Inactive"):"…",unlockedIds.length>0]].map(([l,v,ac])=>(
          <div key={l} style={{...cardStyle,padding:"16px 18px"}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:B.textLight,marginBottom:6,fontFamily:F}}>{l}</div>
            <div style={{fontSize:24,fontWeight:800,color:ac?B.lightBlue:B.text,fontFamily:F}}>{v}</div>
          </div>
        ))}
      </div>

      {/* Fragment list */}
      {fragments.length>0&&(
        <div style={{marginBottom:28}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:B.textLight,marginBottom:14,fontFamily:F}}>Your Fragments</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {fragments.map(f=>{const a=AGENTS.find(x=>x.id===f.agent_id);return(
              <div key={f.id} style={{...cardStyle,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:f.active?B.green:B.border,flexShrink:0}}/>
                <span style={{fontSize:12,fontWeight:700,color:B.textLight,fontFamily:F,letterSpacing:"1px"}}>{f.code}</span>
                <span style={{fontSize:11,color:B.textMuted,fontFamily:F}}>→</span>
                <span style={{fontSize:13,fontWeight:600,color:B.text,fontFamily:F}}>{a?.name||"Unknown"}</span>
                <span style={{fontSize:10,color:B.textLight,fontFamily:F}}>{a?.title}</span>
                <span style={{marginLeft:"auto",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:20,background:f.active?B.greenBg:"#f5f5f5",color:f.active?B.green:B.textLight,fontFamily:F}}>{f.active?"Active":"Inactive"}</span>
              </div>
            );})}
          </div>
        </div>
      )}

      {/* Agents grid */}
      <div style={{fontSize:10,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:B.textLight,marginBottom:16,fontFamily:F}}>
        Your 12 Petals — {loaded?unlockedIds.length:"…"} Unlocked
      </div>
      {!loaded&&<div style={{textAlign:"center",padding:40,color:B.textLight,fontSize:12,fontFamily:F}}>Loading your agents...</div>}
      {loaded&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:12}}>
          {AGENTS.map(a=><PetalCard key={a.id} agent={a} unlocked={unlockedIds.includes(a.id)} onActivate={setActiveAgent}/>)}
        </div>
      )}

      {/* Upsell tiers */}
      {loaded&&unlockedIds.length<12&&(
        <div style={{marginTop:40}}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:B.lightBlue,marginBottom:4,fontFamily:F}}>Fragment Tiers</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:20,flexWrap:"wrap",gap:10}}>
            <h2 style={{fontSize:22,fontWeight:700,color:B.text,fontFamily:F}}>Unlock More Agents</h2>
            <p style={{fontSize:12,color:B.textMuted,fontFamily:F}}>{12-unlockedIds.length} agents still locked.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:14}}>
            {TIERS.map(t=><TierCard key={t.count} tier={t}/>)}
          </div>
        </div>
      )}

      {activeAgent&&<AgentModal agent={activeAgent} userEmail={authUser.email} onClose={()=>setActiveAgent(null)}/>}
    </div>
  );
}

// ── Landing ───────────────────────────────────────────────────
function Landing({ onEnter }) {
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"40px 28px 80px",fontFamily:F}}>
      <div style={{marginBottom:40}}>
        <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:B.lightBlue,marginBottom:10,fontFamily:F}}>AI Agent Vault · Prëmo Inc.</div>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:16,marginBottom:14}}>
          <div>
            <h1 style={{fontSize:"clamp(32px,5vw,52px)",fontWeight:900,color:B.text,letterSpacing:"-1.5px",lineHeight:1.05,marginBottom:6,fontFamily:F}}>The Crystal</h1>
            <p style={{fontSize:15,color:B.textMuted,maxWidth:520,lineHeight:1.7,fontFamily:F}}>A vault of AI agents. Each one a petal. Unlocked by a Fragment.</p>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={onEnter} style={ghostBtn}>Enter Vault</button>
            <a href={CHECKOUT_URL} style={{...primaryBtn,textDecoration:"none"}}>Acquire Fragments →</a>
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:14,marginBottom:40}}>
        {[["12","AI Agents"],["4","Fragment Tiers"],["∞","Potential"],["1×","Per Agent"]].map(([v,l])=>(
          <div key={l} style={{...cardStyle,padding:"18px 20px"}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:B.textLight,marginBottom:8,fontFamily:F}}>{l}</div>
            <div style={{fontSize:28,fontWeight:900,color:B.lightBlue,letterSpacing:"-1px",fontFamily:F}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{marginBottom:40}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:20,flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:B.lightBlue,marginBottom:4,fontFamily:F}}>The 12 Agents</div>
            <h2 style={{fontSize:22,fontWeight:700,color:B.text,fontFamily:F}}>Your AI Agent Stack</h2>
          </div>
          <p style={{fontSize:12,color:B.textMuted,fontFamily:F}}>Log in to see your unlocked agents.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:12}}>
          {AGENTS.map(a=><PetalCard key={a.id} agent={a} unlocked={false} onActivate={()=>{}}/>)}
        </div>
      </div>
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:20,flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:B.lightBlue,marginBottom:4,fontFamily:F}}>Fragment Tiers</div>
            <h2 style={{fontSize:22,fontWeight:700,color:B.text,fontFamily:F}}>Pick Your Depth</h2>
          </div>
          <p style={{fontSize:12,color:B.textMuted,fontFamily:F}}>Subscription. Cancel anytime.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:14}}>
          {TIERS.map(t=><TierCard key={t.count} tier={t}/>)}
        </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────
export default function App() {
  const [authUser,setAuthUser]=useState(null);
  const [view,setView]=useState("landing");
  const [booting,setBooting]=useState(true);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user){setAuthUser(session.user);setView("vault");}
      setBooting(false);
    });
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>{
      if(session?.user){setAuthUser(session.user);setView("vault");}
      else{setAuthUser(null);setView("landing");}
    });
    return()=>subscription.unsubscribe();
  },[]);

  const logout=async()=>{await supabase.auth.signOut();setView("landing");};

  return (
    <div style={{fontFamily:F,minHeight:"100vh",background:B.ice,color:B.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} body{background:${B.ice};font-family:'Montserrat',sans-serif;} button:hover:not(:disabled){opacity:0.85;} a:hover{opacity:0.85;} input::placeholder,textarea::placeholder{color:${B.textLight};} input:focus,textarea:focus{outline:none;border-color:${B.lightBlue}!important;} ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:${B.border};border-radius:2px;}`}</style>

      <header style={{background:B.white,borderBottom:`1px solid ${B.border}`,padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setView(authUser?"vault":"landing")}>
          <div style={{width:36,height:36,borderRadius:9,background:B.navy,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><CrystalMark size={28}/></div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:B.text,letterSpacing:"1px",lineHeight:1,fontFamily:F}}>THE CRYSTAL</div>
            <div style={{fontSize:9,color:B.textLight,letterSpacing:"1.5px",textTransform:"uppercase",fontFamily:F}}>AI Agent Vault · Prëmo Inc.</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {authUser?(
            <><span style={{fontSize:10,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",padding:"5px 12px",borderRadius:20,background:B.greenBg,color:B.green,fontFamily:F}}>Vault Active</span>
            <button onClick={logout} style={ghostBtn}>Exit</button></>
          ):(
            <>{view!=="auth"&&<button onClick={()=>setView("auth")} style={ghostBtn}>Enter Vault</button>}
            <a href={CHECKOUT_URL} style={{...primaryBtn,textDecoration:"none",fontSize:12}}>Acquire Fragments</a></>
          )}
        </div>
      </header>

      {booting&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",color:B.textLight,fontSize:12,letterSpacing:"2px",fontFamily:F}}>Loading...</div>}
      {!booting&&view==="landing"&&<Landing onEnter={()=>setView("auth")}/>}
      {!booting&&view==="auth"&&<AuthScreen/>}
      {!booting&&view==="vault"&&authUser&&<VaultView authUser={authUser} onLogout={logout}/>}

      {view!=="vault"&&<div style={{textAlign:"center",padding:"24px",fontSize:10,color:B.textLight,fontFamily:F,letterSpacing:"1px",borderTop:`1px solid ${B.border}`,background:B.white}}>
        THE CRYSTAL · PRËMO INC. · CANGGU, BALI · {new Date().getFullYear()}
      </div>}
    </div>
  );
}
