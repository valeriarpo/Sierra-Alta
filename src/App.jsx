import { useState, useMemo, useEffect } from "react";
import {
  Search, Plus, Home, List, Calendar as CalIcon,
  ChevronRight, ChevronLeft, Edit3, Save, Moon, Sun,
  Heart, Activity, AlertTriangle, Baby, ArrowLeft,
  Check, Beef, Droplets, Stethoscope, Clipboard, Tag,
  GitBranch, Mountain, XCircle, Trash2, RefreshCw,
  Database, Cloud, LogOut, LogIn, UserPlus, Eye, EyeOff
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

var SU="https://xnfeccamgzluybxhvqac.supabase.co";
var SK="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZmVjY2FtZ3psdXlieGh2cWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2NzI0MTksImV4cCI6MjEwMDI0ODQxOX0.IkFGCpvc8AymhRO4Tvedwzc-7bkNF1x98SkHeZ1LraU";
function hd(t){var h={"apikey":SK,"Content-Type":"application/json","Prefer":"return=representation"};if(t)h["Authorization"]="Bearer "+t;return h;}
async function sAuth(ep,body){var r;try{r=await fetch(SU+"/auth/v1/"+ep,{method:"POST",headers:{"apikey":SK,"Content-Type":"application/json"},body:JSON.stringify(body)});}catch(netErr){throw new Error("Error de red: no se pudo conectar a Supabase. Verifica tu conexión a internet.");}var d;try{d=await r.json();}catch(parseErr){throw new Error("Respuesta inválida del servidor (HTTP "+r.status+")");}if(!r.ok)throw new Error(d.error_description||d.msg||d.message||"Error HTTP "+r.status);return d;}
async function sGet(tb,q,t){var r=await fetch(SU+"/rest/v1/"+tb+"?"+q,{headers:hd(t)});if(!r.ok){var e=await r.json();throw new Error(e.message||"Error");}return r.json();}
async function sPost(tb,b,t){var r=await fetch(SU+"/rest/v1/"+tb,{method:"POST",headers:hd(t),body:JSON.stringify(b)});if(!r.ok){var e=await r.json();throw new Error(e.message||"Error");}return r.json();}
async function sPatch(tb,q,b,t){var r=await fetch(SU+"/rest/v1/"+tb+"?"+q,{method:"PATCH",headers:hd(t),body:JSON.stringify(b)});if(!r.ok){var e=await r.json();throw new Error(e.message||"Error");}return r.json();}
async function sDel(tb,q,t){var r=await fetch(SU+"/rest/v1/"+tb+"?"+q,{method:"DELETE",headers:hd(t)});if(!r.ok){var e=await r.json();throw new Error(e.message||"Error");}}

var LT={bg:"#F7F6F3",sf:"#FFFFFF",sa:"#F0EDE6",tx:"#1B1B18",t2:"#7A7A6E",t3:"#A5A599",bd:"#E8E5DD",bl:"#F0EDE8",gn:"#2D6A1E",gl:"#E8F5E2",am:"#92710C",al:"#FEF9E7",rd:"#B83232",rl:"#FDF2F2",bu:"#2563EB",ul:"#EFF6FF",br:"#6B4F2E",wl:"#FAF5EE",sh:"0 1px 3px rgba(0,0,0,0.06)",ip:"#FFFFFF",ib:"#DBD8D0",nv:"rgba(255,255,255,0.92)"};
var DK={bg:"#191A17",sf:"#232420",sa:"#2B2D26",tx:"#E5E4DF",t2:"#9B9B8F",t3:"#6B6B60",bd:"#383A32",bl:"#303228",gn:"#5CB83B",gl:"#253020",am:"#D4A830",al:"#33301C",rd:"#F87171",rl:"#3A2222",bu:"#60A5FA",ul:"#1E2D44",br:"#C4A06A",wl:"#2E2820",sh:"0 1px 3px rgba(0,0,0,0.2)",ip:"#2B2D26",ib:"#45473E",nv:"rgba(25,26,23,0.95)"};
var CATS=["Vaca","Novilla","Ternera","Toro","Ternero"];
var STATS=["Activa","Preñada","Seca","Vendida","Muerta","Descartada"];
function fmtD(d){if(!d)return"—";return new Date(d+"T12:00:00").toLocaleDateString("es-CO",{day:"2-digit",month:"short",year:"numeric"});}
function dBtw(a,b){if(!a||!b)return 0;return Math.floor((new Date(b)-new Date(a))/86400000);}
function gEnd(s){if(!s)return"";var d=new Date(s);d.setDate(d.getDate()+283);return d.toISOString().split("T")[0];}
function cAge(b){if(!b)return"—";var d=dBtw(b,new Date().toISOString().split("T")[0]);if(d<0)return"—";if(d<30)return d+"d";if(d<365)return Math.floor(d/30)+"m";var y=Math.floor(d/365),m=Math.floor((d%365)/30);return m>0?y+"a "+m+"m":y+"a";}
function tdy(){return new Date().toISOString().split("T")[0];}
function sClr(s){return s==="Activa"?"green":s==="Preñada"?"amber":s==="Vendida"?"blue":"red";}
var spn="@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}";

function Bdg({children,v,T}){var c={green:{b:T.gl,f:T.gn},amber:{b:T.al,f:T.am},red:{b:T.rl,f:T.rd},blue:{b:T.ul,f:T.bu},brown:{b:T.wl,f:T.br}};var cc=c[v]||c.green;return <span style={{display:"inline-block",padding:"2px 9px",borderRadius:18,fontSize:10,fontWeight:600,background:cc.b,color:cc.f}}>{children}</span>;}

function SC({icon:I,label,value,v,T}){var c={green:{b:T.gl,f:T.gn},amber:{b:T.al,f:T.am},red:{b:T.rl,f:T.rd},blue:{b:T.ul,f:T.bu}};var cc=c[v]||c.green;return <div style={{background:T.sf,border:"1px solid "+T.bd,borderRadius:12,padding:12,boxShadow:T.sh,flex:"1 1 120px",minWidth:110}}><div style={{width:28,height:28,borderRadius:7,background:cc.b,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6}}><I size={14} color={cc.f}/></div><div style={{fontSize:22,fontWeight:800,color:T.tx,lineHeight:1}}>{value}</div><div style={{fontSize:9,color:T.t2,marginTop:2}}>{label}</div></div>;}

function TI({label,value,onChange,type,placeholder,T,disabled}){return <div style={{marginBottom:10}}>{label&&<label style={{display:"block",fontSize:10,fontWeight:600,color:T.t2,marginBottom:2,textTransform:"uppercase",letterSpacing:0.4}}>{label}</label>}<input type={type||"text"} value={value||""} onChange={function(e){onChange(e.target.value);}} placeholder={placeholder} disabled={disabled} style={{width:"100%",padding:"8px 10px",borderRadius:9,border:"1px solid "+T.ib,background:disabled?T.sa:T.ip,color:T.tx,fontSize:13,outline:"none",boxSizing:"border-box"}}/></div>;}

function SI({label,value,onChange,options,T}){return <div style={{marginBottom:10}}>{label&&<label style={{display:"block",fontSize:10,fontWeight:600,color:T.t2,marginBottom:2,textTransform:"uppercase",letterSpacing:0.4}}>{label}</label>}<select value={value||""} onChange={function(e){onChange(e.target.value);}} style={{width:"100%",padding:"8px 10px",borderRadius:9,border:"1px solid "+T.ib,background:T.ip,color:T.tx,fontSize:13,outline:"none",boxSizing:"border-box",appearance:"auto"}}><option value="">—</option>{options.map(function(o){return <option key={o} value={o}>{o}</option>;})}</select></div>;}

function TB({tabs,active,onChange,T}){return <div style={{display:"flex",overflowX:"auto",borderBottom:"2px solid "+T.bd,marginBottom:12}}>{tabs.map(function(n){var a=active===n;return <button key={n} onClick={function(){onChange(n);}} style={{padding:"8px 12px",fontSize:11,fontWeight:a?700:500,border:"none",background:"none",cursor:"pointer",color:a?T.gn:T.t2,borderBottom:a?"2px solid "+T.gn:"2px solid transparent",marginBottom:-2,whiteSpace:"nowrap"}}>{n}</button>;})}</div>;}

function Em({icon:I,title,sub,T}){return <div style={{textAlign:"center",padding:"28px 14px"}}><div style={{width:40,height:40,borderRadius:10,background:T.sa,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:8}}><I size={18} color={T.t3}/></div><div style={{fontSize:12,fontWeight:600,color:T.t2}}>{title}</div><div style={{fontSize:10,color:T.t3}}>{sub}</div></div>;}

function Av({cow,size,T}){var s=size||38;return <div style={{width:s,height:s,borderRadius:10,background:T.gl,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:s*0.32,fontWeight:800,color:T.gn}}>{cow.name?cow.name[0].toUpperCase():cow.number}</div>;}

function bt(T,v){var b={padding:"8px 12px",borderRadius:9,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:4};if(v==="p")return Object.assign({},b,{background:T.gn,color:"#fff"});if(v==="d")return Object.assign({},b,{background:T.rl,color:T.rd});return Object.assign({},b,{background:T.sa,color:T.tx,border:"1px solid "+T.bd});}

export default function SierraAlta(){
var _u=useState,ds=_u(false),dk=ds[0],sDk=ds[1];var T=dk?DK:LT;
var ss=_u(null),se=ss[0],sSe=ss[1];
var av=_u("login"),aV=av[0],sAV=av[1];
var em=_u(""),eml=em[0],sEm=em[1];
var pw=_u(""),pwd=pw[0],sPw=pw[1];
var fn=_u(""),fNm=fn[0],sFn=fn[1];
var sp=_u(false),shP=sp[0],sSP=sp[1];
var ae=_u(""),aEr=ae[0],sAE=ae[1];
var al=_u(false),aLd=al[0],sAL=al[1];
var fc=_u(null),fca=fc[0],sFca=fc[1];
var fl=_u([]),fcs=fl[0],sFcs=fl[1];
var nf=_u(""),nFN=nf[0],sNF=nf[1];
var fL=_u(false),fLd=fL[0],sFLd=fL[1];
var ct=_u([]),ctl=ct[0],sCt=ct[1];
var ld=_u(true),ldg=ld[0],sLd=ld[1];
var vw=_u("dash"),viw=vw[0],sVw=vw[1];
var si=_u(null),sId=si[0],sSi=si[1];
var sr=_u(""),sch=sr[0],sSr=sr[1];
var fc2=_u("Todas"),fC=fc2[0],sFC=fc2[1];
var fs=_u("Todos"),fS=fs[0],sFS=fs[1];
var at=_u("General"),aT=at[0],sAT=at[1];
var ed=_u(false),edg=ed[0],sEd=ed[1];
var eb=_u(null),eBf=eb[0],sEB=eb[1];
var ts=_u(null),tst=ts[0],sTs=ts[1];
var cm=_u(new Date().getMonth()),cM=cm[0],sCM=cm[1];
var cy=_u(new Date().getFullYear()),cY=cy[0],sCY=cy[1];
var rp=_u([]),rps=rp[0],sRp=rp[1];
var pd=_u([]),pds=pd[0],sPd=pd[1];
var hl=_u([]),hls=hl[0],sHl=hl[1];
var ev=_u([]),evs=ev[0],sEv=ev[1];

var sel=ctl.find(function(c){return c.id===sId;});
var tk=se?se.access_token:null;
function toast(m,c){sTs({msg:m,color:c||"green"});setTimeout(function(){sTs(null);},2500);}

async function doLogin(){sAL(true);sAE("");try{var d=await sAuth("token?grant_type=password",{email:eml,password:pwd});sSe(d);}catch(e){sAE(String(e&&e.message?e.message:e)||"No se pudo conectar a Supabase. Verifica tu conexión.");}sAL(false);}
async function doSignup(){if(!eml||!pwd||pwd.length<6){sAE("Email y contraseña (mín 6 caracteres) son obligatorios");return;}sAL(true);sAE("");try{var d=await sAuth("signup",{email:eml,password:pwd,options:{data:{full_name:fNm,role:"admin"}}});if(d.access_token){sSe(d);}else if(d.id||d.user){sAV("confirm");}else{sAE("Respuesta inesperada: "+JSON.stringify(d));}}catch(e){sAE(String(e&&e.message?e.message:e)||"No se pudo conectar a Supabase. Verifica tu conexión.");}sAL(false);}
function doLogout(){sSe(null);sFca(null);sCt([]);sVw("dash");sAV("login");}

async function ldFincas(){if(!tk)return;sFLd(true);try{var d=await sGet("finca_members","select=finca_id,role,fincas(id,name,location)&user_id=eq."+se.user.id,tk);var l=d.map(function(m){return Object.assign({},m.fincas,{userRole:m.role});});sFcs(l);if(l.length===1)sFca(l[0]);}catch(e){console.error(e);}sFLd(false);}
async function mkFinca(){if(!nFN.trim()||!tk)return;sFLd(true);try{var d=await sPost("fincas",{name:nFN.trim(),owner_id:se.user.id},tk);var f=d[0];await sPost("finca_members",{finca_id:f.id,user_id:se.user.id,role:"admin"},tk);sFca(f);sNF("");toast("Finca creada");}catch(e){toast(e.message,"red");}sFLd(false);}
useEffect(function(){if(se)ldFincas();},[se]);

async function ldCattle(){if(!tk||!fca)return;sLd(true);try{var d=await sGet("animales","finca_id=eq."+fca.id+"&order=created_at.asc",tk);sCt(d);}catch(e){toast(e.message,"red");}sLd(false);}
useEffect(function(){if(fca&&tk)ldCattle();},[fca]);

async function addCow(f){try{var r=Object.assign({},f,{finca_id:fca.id,created_by:se.user.id});var d=await sPost("animales",r,tk);sCt(function(p){return p.concat(d);});sVw("list");toast("#"+f.number+" "+(f.name||"")+" registrado");}catch(e){toast(e.message,"red");}}
async function updCow(id,u){try{var d=await sPatch("animales","id=eq."+id,u,tk);sCt(function(p){return p.map(function(c){return c.id===id?d[0]:c;});});}catch(e){toast(e.message,"red");}}
async function delCow(id){if(!confirm("¿Eliminar permanentemente?"))return;try{await sDel("animales","id=eq."+id,tk);sCt(function(p){return p.filter(function(c){return c.id!==id;});});goBk();toast("Eliminado","red");}catch(e){toast(e.message,"red");}}

async function ldRepro(){if(!sel)return;try{var d=await sGet("reproducciones","animal_id=eq."+sel.id+"&order=created_at.asc",tk);sRp(d);}catch(e){}}
async function addRepro(){try{await sPost("reproducciones",{animal_id:sel.id,finca_id:fca.id,created_by:se.user.id},tk);await ldRepro();toast("Registro agregado");}catch(e){toast(e.message,"red");}}
async function updRepro(id,f,v){try{var b={};b[f]=v||null;await sPatch("reproducciones","id=eq."+id,b,tk);await ldRepro();}catch(e){toast(e.message,"red");}}
async function delRepro(id){if(!confirm("¿Eliminar?"))return;try{await sDel("reproducciones","id=eq."+id,tk);await ldRepro();}catch(e){toast(e.message,"red");}}

async function ldProd(){if(!sel)return;try{var d=await sGet("produccion","animal_id=eq."+sel.id+"&order=fecha.asc&limit=30",tk);sPd(d);}catch(e){}}
async function addProd(){var am=parseFloat(prompt("Litros AM:")||"0"),pm=parseFloat(prompt("Litros PM:")||"0");if(!am&&!pm)return;try{await sPost("produccion",{animal_id:sel.id,finca_id:fca.id,fecha:tdy(),litros_am:am,litros_pm:pm,created_by:se.user.id},tk);await ldProd();toast((am+pm)+"L registrados");}catch(e){toast(e.message,"red");}}

async function ldHlth(){if(!sel)return;try{var d=await sGet("sanidad","animal_id=eq."+sel.id+"&order=fecha.desc",tk);sHl(d);}catch(e){}}
async function addHlth(tipo){var desc=prompt(tipo+" — descripción:");if(!desc)return;try{await sPost("sanidad",{animal_id:sel.id,finca_id:fca.id,tipo:tipo,description:desc,fecha:tdy(),created_by:se.user.id},tk);await ldHlth();toast(tipo+" registrada");}catch(e){toast(e.message,"red");}}

async function ldEvts(){if(!sel)return;try{var d=await sGet("eventos","animal_id=eq."+sel.id+"&order=fecha.desc",tk);sEv(d);}catch(e){}}
async function addEvt(){var tipo=prompt("Tipo (Venta, Nacimiento, Aborto, Muerte, Otro):"),desc=prompt("Descripción:");if(!desc)return;try{await sPost("eventos",{animal_id:sel.id,finca_id:fca.id,tipo:tipo||"Otro",description:desc,fecha:tdy(),created_by:se.user.id},tk);await ldEvts();toast("Evento registrado");}catch(e){toast(e.message,"red");}}

useEffect(function(){if(sel&&tk){ldRepro();ldProd();ldHlth();ldEvts();}},[sId]);

function opCow(id){sSi(id);sVw("detail");sAT("General");sEd(false);}
function goBk(){sVw("list");sSi(null);sEd(false);}
function stEd(){sEB(Object.assign({},sel));sEd(true);}
async function svEd(){if(!eBf)return;await updCow(eBf.id,{number:eBf.number,name:eBf.name,sex:eBf.sex,status:eBf.status,category:eBf.category,breed:eBf.breed,color:eBf.color,weight:eBf.weight||null,birth_date:eBf.birth_date||null,father_name:eBf.father_name,mother_name:eBf.mother_name,genetic_line:eBf.genetic_line,observations:eBf.observations});sEd(false);toast("Guardado");}

function fCh(cow){if(!cow.name)return[];return ctl.filter(function(c){return c.mother_name&&c.mother_name.toLowerCase()===cow.name.toLowerCase();});}
function fMo(cow){if(!cow.mother_name)return null;return ctl.find(function(c){return c.name&&c.name.toLowerCase()===cow.mother_name.toLowerCase();})||null;}
function fSb(cow){if(!cow.mother_name)return[];return ctl.filter(function(c){return c.mother_name&&c.mother_name.toLowerCase()===cow.mother_name.toLowerCase()&&c.id!==cow.id;});}

var stats=useMemo(function(){var s={total:0,act:0,prg:0,dry:0,nov:0,clv:0,bul:0,sld:0,ded:0,cow:0};ctl.forEach(function(c){s.total++;if(c.status==="Activa"||c.status==="Preñada"||c.status==="Seca")s.act++;if(c.status==="Vendida")s.sld++;if(c.status==="Muerta")s.ded++;if(c.status==="Preñada")s.prg++;if(c.status==="Seca")s.dry++;if(c.category==="Vaca")s.cow++;if(c.category==="Novilla")s.nov++;if(c.category==="Ternera"||c.category==="Ternero")s.clv++;if(c.category==="Toro")s.bul++;});return s;},[ctl]);

var filt=useMemo(function(){var r=ctl;if(fC!=="Todas")r=r.filter(function(c){return c.category===fC;});if(fS!=="Todos")r=r.filter(function(c){return c.status===fS;});if(sch){var q=sch.toLowerCase();r=r.filter(function(c){return c.name.toLowerCase().includes(q)||c.number.includes(q)||(c.breed||"").toLowerCase().includes(q)||(c.mother_name||"").toLowerCase().includes(q)||(c.father_name||"").toLowerCase().includes(q);});}return r;},[ctl,sch,fC,fS]);

var MW=500,ps={padding:"12px 14px"};

// AUTH SCREEN
if(!se){return(
<div style={{minHeight:"100vh",background:T.bg,fontFamily:"Inter,-apple-system,system-ui,sans-serif",display:"flex",alignItems:"center",justifyContent:"center"}}>
<style>{spn}</style>
<div style={{width:"100%",maxWidth:360,padding:20}}>
<div style={{textAlign:"center",marginBottom:24}}><Mountain size={36} color={T.gn}/><div style={{fontSize:22,fontWeight:800,color:T.tx,marginTop:6}}>Sierra Alta</div><div style={{fontSize:11,color:T.t2}}>Software Ganadero</div></div>
{aV==="confirm"?(
<div style={{background:T.sf,borderRadius:14,padding:20,border:"1px solid "+T.bd,textAlign:"center"}}><Check size={32} color={T.gn}/><div style={{fontSize:14,fontWeight:700,color:T.tx,marginTop:8}}>Revisa tu email</div><div style={{fontSize:11,color:T.t2,marginTop:4}}>Confirma tu cuenta y luego inicia sesión</div><button onClick={function(){sAV("login");}} style={Object.assign({},bt(T,"p"),{marginTop:14,width:"100%",justifyContent:"center"})}>Ir a iniciar sesión</button></div>
):(
<div style={{background:T.sf,borderRadius:14,padding:20,border:"1px solid "+T.bd}}>
<div style={{fontSize:14,fontWeight:700,color:T.tx,marginBottom:14}}>{aV==="login"?"Iniciar Sesión":"Crear Cuenta"}</div>
{aV==="signup"&&<TI label="Nombre completo" value={fNm} onChange={sFn} T={T} placeholder="Tu nombre"/>}
<TI label="Email" value={eml} onChange={sEm} T={T} placeholder="correo@ejemplo.com" type="email"/>
<div style={{position:"relative"}}><TI label="Contraseña" value={pwd} onChange={sPw} T={T} placeholder="Mínimo 6 caracteres" type={shP?"text":"password"}/><button onClick={function(){sSP(!shP);}} style={{position:"absolute",right:8,top:22,background:"none",border:"none",cursor:"pointer"}}>{shP?<EyeOff size={14} color={T.t3}/>:<Eye size={14} color={T.t3}/>}</button></div>
{aEr&&<div style={{background:T.rl,color:T.rd,padding:"6px 10px",borderRadius:8,fontSize:10,marginBottom:8}}>{aEr}</div>}
<button onClick={aV==="login"?doLogin:doSignup} disabled={aLd} style={Object.assign({},bt(T,"p"),{width:"100%",justifyContent:"center",padding:10,opacity:aLd?0.6:1})}>{aLd?<RefreshCw size={13} style={{animation:"spin 1s linear infinite"}}/>:aV==="login"?<LogIn size={13}/>:<UserPlus size={13}/>}{aV==="login"?"Entrar":"Registrarse"}</button>
<div style={{textAlign:"center",marginTop:12}}><button onClick={function(){sAV(aV==="login"?"signup":"login");sAE("");}} style={{background:"none",border:"none",cursor:"pointer",fontSize:11,color:T.gn,fontWeight:600}}>{aV==="login"?"¿No tienes cuenta? Regístrate":"¿Ya tienes cuenta? Inicia sesión"}</button></div>
</div>)}
</div></div>);}

// FINCA SELECT
if(!fca){return(
<div style={{minHeight:"100vh",background:T.bg,fontFamily:"Inter,-apple-system,system-ui,sans-serif",display:"flex",alignItems:"center",justifyContent:"center"}}>
<style>{spn}</style>
<div style={{width:"100%",maxWidth:360,padding:20}}>
<div style={{textAlign:"center",marginBottom:20}}><Mountain size={30} color={T.gn}/><div style={{fontSize:18,fontWeight:800,color:T.tx,marginTop:4}}>Selecciona tu Finca</div><div style={{fontSize:10,color:T.t2}}>{se.user.email}</div></div>
{fLd?<div style={{textAlign:"center"}}><RefreshCw size={18} color={T.gn} style={{animation:"spin 1s linear infinite"}}/></div>:(
<div>
{fcs.map(function(f){return <button key={f.id} onClick={function(){sFca(f);}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:14,marginBottom:7,background:T.sf,border:"1px solid "+T.bd,borderRadius:12,cursor:"pointer",textAlign:"left"}}><Mountain size={18} color={T.gn}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:T.tx}}>{f.name}</div><div style={{fontSize:9,color:T.t2}}>{f.location||""}</div></div><ChevronRight size={14} color={T.t3}/></button>;})}
<div style={{background:T.sf,borderRadius:12,padding:14,border:"1px solid "+T.bd,marginTop:14}}><div style={{fontSize:12,fontWeight:700,color:T.tx,marginBottom:8}}>Crear nueva finca</div><TI label="Nombre" value={nFN} onChange={sNF} T={T} placeholder="Ej: Sierra Alta"/><button onClick={mkFinca} style={Object.assign({},bt(T,"p"),{width:"100%",justifyContent:"center"})}><Plus size={13}/>Crear Finca</button></div>
<button onClick={doLogout} style={Object.assign({},bt(T,"s"),{width:"100%",justifyContent:"center",marginTop:10})}><LogOut size={13}/>Cerrar sesión</button>
</div>)}
</div></div>);}

// LOADING
if(ldg){return(
<div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Inter,-apple-system,system-ui,sans-serif"}}>
<style>{spn}</style>
<div style={{textAlign:"center"}}><Mountain size={36} color={T.gn}/><div style={{fontSize:18,fontWeight:800,color:T.tx,marginTop:8}}>Sierra Alta</div><div style={{fontSize:11,color:T.t2,marginTop:4}}>Cargando {fca.name}...</div><RefreshCw size={16} color={T.gn} style={{marginTop:12,animation:"spin 1s linear infinite"}}/></div>
</div>);}

// DASHBOARD
function rDash(){
var pie=[{name:"Vacas",value:stats.cow,color:T.gn},{name:"Novillas",value:stats.nov,color:T.am},{name:"Crías",value:stats.clv,color:T.bu},{name:"Toros",value:stats.bul,color:T.br}].filter(function(d){return d.value>0;});
var bar=[{name:"Activas",value:stats.act},{name:"Preñadas",value:stats.prg},{name:"Secas",value:stats.dry},{name:"Vendidas",value:stats.sld},{name:"Muertas",value:stats.ded}].filter(function(d){return d.value>0;});
return(<div style={ps}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
<div style={{display:"flex",alignItems:"center",gap:6}}><Mountain size={18} color={T.gn}/><div><div style={{fontSize:16,fontWeight:800,color:T.tx,lineHeight:1}}>{fca.name}</div><div style={{fontSize:9,color:T.t2}}>{se.user.email}</div></div></div>
<div style={{display:"flex",gap:3}}><button onClick={ldCattle} style={{background:"none",border:"none",cursor:"pointer"}}><RefreshCw size={13} color={T.gn}/></button><button onClick={doLogout} style={{background:"none",border:"none",cursor:"pointer"}}><LogOut size={13} color={T.t3}/></button></div>
</div>
<div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:7}}><SC icon={Beef} label="Total" value={stats.total} v="green" T={T}/><SC icon={Heart} label="Activas" value={stats.act} v="green" T={T}/><SC icon={Baby} label="Preñadas" value={stats.prg} v="amber" T={T}/><SC icon={Droplets} label="Secas" value={stats.dry} v="blue" T={T}/></div>
<div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:14}}><SC icon={Tag} label="Vendidas" value={stats.sld} v="amber" T={T}/><SC icon={AlertTriangle} label="Muertas" value={stats.ded} v="red" T={T}/><SC icon={Activity} label="Novillas" value={stats.nov} v="green" T={T}/><SC icon={GitBranch} label="Toros" value={stats.bul} v="blue" T={T}/></div>
{pie.length>0&&<div style={{background:T.sf,border:"1px solid "+T.bd,borderRadius:12,padding:12,marginBottom:12,boxShadow:T.sh}}><div style={{fontSize:12,fontWeight:700,marginBottom:8,color:T.tx}}>Composición</div><div style={{display:"flex",alignItems:"center",gap:10}}><ResponsiveContainer width="48%" height={110}><PieChart><Pie data={pie} cx="50%" cy="50%" innerRadius={24} outerRadius={44} dataKey="value" stroke="none">{pie.map(function(e,i){return <Cell key={i} fill={e.color}/>;})}</Pie></PieChart></ResponsiveContainer><div style={{flex:1}}>{pie.map(function(i){return <div key={i.name} style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}><div style={{width:7,height:7,borderRadius:2,background:i.color}}/><span style={{fontSize:10,color:T.t2,flex:1}}>{i.name}</span><span style={{fontSize:11,fontWeight:700,color:T.tx}}>{i.value}</span></div>;})}</div></div></div>}
{bar.length>0&&<div style={{background:T.sf,border:"1px solid "+T.bd,borderRadius:12,padding:12,marginBottom:12,boxShadow:T.sh}}><div style={{fontSize:12,fontWeight:700,marginBottom:8,color:T.tx}}>Estado</div><ResponsiveContainer width="100%" height={120}><BarChart data={bar} barSize={20}><CartesianGrid strokeDasharray="3 3" stroke={T.bd} vertical={false}/><XAxis dataKey="name" tick={{fontSize:9,fill:T.t2}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:9,fill:T.t2}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:T.sf,border:"1px solid "+T.bd,borderRadius:8,fontSize:10}}/><Bar dataKey="value" fill={T.gn} radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div>}
<div style={{background:T.sf,border:"1px solid "+T.bd,borderRadius:12,padding:12,boxShadow:T.sh}}><div style={{display:"flex",alignItems:"center",gap:6}}><Database size={14} color={T.gn}/><span style={{fontSize:12,fontWeight:700,color:T.tx}}>Supabase</span><Bdg v="green" T={T}>Conectada</Bdg></div><div style={{fontSize:10,color:T.t2,marginTop:3}}>{ctl.length} animales · Tiempo real</div></div>
</div>);}

// INVENTORY
function rList(){return(<div style={ps}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}><h2 style={{fontSize:16,fontWeight:800,color:T.tx,margin:0}}>Inventario</h2><button onClick={function(){sVw("add");}} style={bt(T,"p")}><Plus size={13}/>Nuevo</button></div>
<div style={{position:"relative",marginBottom:8}}><Search size={14} style={{position:"absolute",left:10,top:9,color:T.t3}}/><input value={sch} onChange={function(e){sSr(e.target.value);}} placeholder="Nombre, número, raza, madre…" style={{width:"100%",padding:"8px 8px 8px 30px",borderRadius:9,border:"1px solid "+T.ib,background:T.ip,color:T.tx,fontSize:12,outline:"none",boxSizing:"border-box"}}/>{sch&&<button onClick={function(){sSr("");}} style={{position:"absolute",right:8,top:8,background:"none",border:"none",cursor:"pointer"}}><XCircle size={14} color={T.t3}/></button>}</div>
<div style={{display:"flex",gap:4,overflowX:"auto",marginBottom:5}}>{["Todas"].concat(CATS).map(function(c){var a=fC===c;return <button key={c} onClick={function(){sFC(c);}} style={{padding:"3px 9px",borderRadius:16,fontSize:9,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",border:"1px solid "+(a?T.gn:T.bd),background:a?T.gl:T.sf,color:a?T.gn:T.t2}}>{c}</button>;})}</div>
<div style={{display:"flex",gap:4,overflowX:"auto",marginBottom:8}}>{["Todos"].concat(STATS).map(function(s){var a=fS===s;return <button key={s} onClick={function(){sFS(s);}} style={{padding:"3px 9px",borderRadius:16,fontSize:9,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",border:"1px solid "+(a?T.am:T.bd),background:a?T.al:T.sf,color:a?T.am:T.t2}}>{s}</button>;})}</div>
<div style={{fontSize:9,color:T.t3,marginBottom:6}}>{filt.length} de {ctl.length}</div>
{filt.map(function(cow){return <div key={cow.id} onClick={function(){opCow(cow.id);}} style={{display:"flex",alignItems:"center",gap:9,padding:10,marginBottom:5,background:T.sf,borderRadius:11,border:"1px solid "+T.bd,cursor:"pointer",boxShadow:T.sh}}><Av cow={cow} size={36} T={T}/><div style={{flex:1,minWidth:0}}><div><span style={{fontSize:12,fontWeight:700,color:T.tx}}>{cow.name||"Sin nombre"}</span><span style={{fontSize:9,color:T.t3,marginLeft:4}}>#{cow.number}</span></div><div style={{fontSize:9,color:T.t2,marginTop:1}}>{cow.category}{cow.breed?" · "+cow.breed:""}{cow.birth_date?" · "+cAge(cow.birth_date):""}</div></div><Bdg v={sClr(cow.status)} T={T}>{cow.status}</Bdg></div>;})}
{filt.length===0&&<Em icon={Search} title="Sin resultados" sub="Intenta otro término" T={T}/>}
</div>);}

// ADD
function rAdd(){
var _f=useState({number:"",name:"",sex:"Hembra",status:"Activa",category:"Vaca",breed:"",color:"",weight:"",birth_date:"",father_name:"",mother_name:"",genetic_line:"",observations:""});var form=_f[0],sF=_f[1];
function up(k,v){sF(function(p){var n=Object.assign({},p);n[k]=v;return n;});}
return(<div style={ps}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><button onClick={function(){sVw("list");}} style={{background:"none",border:"none",cursor:"pointer",color:T.t2,padding:0}}><ArrowLeft size={18}/></button><h2 style={{fontSize:16,fontWeight:800,color:T.tx,margin:0}}>Registrar Animal</h2></div>
<div style={{background:T.sf,border:"1px solid "+T.bd,borderRadius:12,padding:14}}>
<TI label="Número *" value={form.number} onChange={function(v){up("number",v);}} T={T} placeholder="Ej: 295"/>
<TI label="Nombre" value={form.name} onChange={function(v){up("name",v);}} T={T} placeholder="Opcional"/>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}><SI label="Sexo" value={form.sex} onChange={function(v){up("sex",v);}} options={["Hembra","Macho"]} T={T}/><SI label="Categoría" value={form.category} onChange={function(v){up("category",v);}} options={CATS} T={T}/></div>
<SI label="Estado" value={form.status} onChange={function(v){up("status",v);}} options={STATS} T={T}/>
<TI label="Raza" value={form.breed} onChange={function(v){up("breed",v);}} T={T}/>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}><TI label="Color" value={form.color} onChange={function(v){up("color",v);}} T={T}/><TI label="Peso (kg)" value={form.weight} onChange={function(v){up("weight",v);}} T={T} type="number"/></div>
<TI label="Nacimiento" value={form.birth_date} onChange={function(v){up("birth_date",v);}} T={T} type="date"/>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}><TI label="Padre" value={form.father_name} onChange={function(v){up("father_name",v);}} T={T}/><TI label="Madre" value={form.mother_name} onChange={function(v){up("mother_name",v);}} T={T}/></div>
<button onClick={function(){if(!form.number){alert("Número obligatorio");return;}addCow(form);}} style={Object.assign({},bt(T,"p"),{width:"100%",justifyContent:"center",padding:10})}><Save size={13}/>Guardar</button>
</div></div>);}

// DETAIL
function rDet(){
if(!sel)return null;var cow=edg?eBf:sel;var ch=fCh(sel),mo=fMo(sel),sb=fSb(sel);
var tabs=["General","Reproducción","Producción","Sanidad","Eventos","Familia"];
function uf(k,v){sEB(function(p){var n=Object.assign({},p);n[k]=v;return n;});}
return(<div style={ps}>
<div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
<button onClick={goBk} style={{background:"none",border:"none",cursor:"pointer",color:T.t2,padding:0}}><ArrowLeft size={18}/></button>
<Av cow={cow} size={36} T={T}/>
<div style={{flex:1}}><div style={{fontSize:14,fontWeight:800,color:T.tx,lineHeight:1.1}}>{cow.name||"Sin nombre"}</div><div style={{fontSize:10,color:T.t2}}>#{cow.number} · {cow.category}</div></div>
{!edg?<button onClick={stEd} style={bt(T,"s")}><Edit3 size={11}/>Editar</button>:<button onClick={svEd} style={bt(T,"p")}><Save size={11}/>Guardar</button>}
</div>
<div style={{display:"flex",gap:4,marginBottom:5,flexWrap:"wrap"}}><Bdg v={sClr(cow.status)} T={T}>{cow.status}</Bdg>{cow.birth_date&&<Bdg v="brown" T={T}>{cAge(cow.birth_date)}</Bdg>}{cow.breed&&<Bdg v="blue" T={T}>{cow.breed}</Bdg>}</div>
{cow.observations&&<div style={{background:T.sa,borderRadius:7,padding:7,marginBottom:8,fontSize:10,color:T.t2,fontStyle:"italic"}}>{cow.observations}</div>}
<TB tabs={tabs} active={aT} onChange={sAT} T={T}/>

{aT==="General"&&<div style={{background:T.sf,borderRadius:12,padding:12,border:"1px solid "+T.bd}}>
{edg?<div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}><TI label="Número" value={eBf.number} onChange={function(v){uf("number",v);}} T={T}/><TI label="Nombre" value={eBf.name} onChange={function(v){uf("name",v);}} T={T}/></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}><SI label="Sexo" value={eBf.sex} onChange={function(v){uf("sex",v);}} options={["Hembra","Macho"]} T={T}/><SI label="Categoría" value={eBf.category} onChange={function(v){uf("category",v);}} options={CATS} T={T}/></div>
<SI label="Estado" value={eBf.status} onChange={function(v){uf("status",v);}} options={STATS} T={T}/>
<TI label="Raza" value={eBf.breed} onChange={function(v){uf("breed",v);}} T={T}/>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}><TI label="Color" value={eBf.color} onChange={function(v){uf("color",v);}} T={T}/><TI label="Peso" value={eBf.weight} onChange={function(v){uf("weight",v);}} T={T} type="number"/></div>
<TI label="Nacimiento" value={eBf.birth_date} onChange={function(v){uf("birth_date",v);}} T={T} type="date"/>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}><TI label="Padre" value={eBf.father_name} onChange={function(v){uf("father_name",v);}} T={T}/><TI label="Madre" value={eBf.mother_name} onChange={function(v){uf("mother_name",v);}} T={T}/></div>
<TI label="Línea genética" value={eBf.genetic_line} onChange={function(v){uf("genetic_line",v);}} T={T}/>
<button onClick={function(){delCow(sel.id);}} style={Object.assign({},bt(T,"d"),{marginTop:8})}><Trash2 size={11}/>Eliminar</button>
</div>:<div>
{[["Raza",cow.breed],["Color",cow.color],["Peso",cow.weight?cow.weight+" kg":""],["Nacimiento",cow.birth_date?fmtD(cow.birth_date)+" ("+cAge(cow.birth_date)+")":""],["Padre",cow.father_name],["Madre",cow.mother_name],["Línea genética",cow.genetic_line],["Categoría",cow.category]].map(function(p){return <div key={p[0]} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid "+T.bl}}><span style={{fontSize:11,color:T.t2}}>{p[0]}</span><span style={{fontSize:11,fontWeight:p[1]?600:400,color:p[1]?T.tx:T.t3,maxWidth:"55%",textAlign:"right"}}>{p[1]||"—"}</span></div>;})}
</div>}
</div>}

{aT==="Reproducción"&&<div style={{background:T.sf,borderRadius:12,padding:12,border:"1px solid "+T.bd}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:12,fontWeight:700,color:T.tx}}>Historial</span><button onClick={addRepro} style={bt(T,"s")}><Plus size={11}/>Agregar</button></div>
{rps.length===0?<Em icon={Heart} title="Sin registros" sub="Agrega servicio o parto" T={T}/>:rps.map(function(rec,idx){
var flds=[["Parto","parto"],["Servicio","servicio"],["+1","servicio_1"],["+2","servicio_2"],["+3","servicio_3"],["9 Meses","nueve_meses"]];
return <div key={rec.id} style={{background:T.sa,borderRadius:9,padding:9,marginBottom:7}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:10,fontWeight:700,color:T.gn}}>#{idx+1}</span><button onClick={function(){delRepro(rec.id);}} style={{background:"none",border:"none",cursor:"pointer"}}><Trash2 size={11} color={T.rd}/></button></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>{flds.map(function(f){return <div key={f[1]}><div style={{fontSize:8,color:T.t3}}>{f[0]}</div><input type="date" value={rec[f[1]]||""} onChange={function(e){updRepro(rec.id,f[1],e.target.value);}} style={{width:"100%",padding:"4px 5px",borderRadius:6,border:"1px solid "+T.ib,background:T.ip,color:T.tx,fontSize:10,boxSizing:"border-box"}}/></div>;})}</div>
{rec.servicio&&<div style={{marginTop:5,padding:5,background:T.al,borderRadius:6}}><div style={{fontSize:9,fontWeight:600,color:T.am}}>Parto: {fmtD(gEnd(rec.servicio))} · {dBtw(rec.servicio,tdy())}d gestación</div></div>}
<div style={{marginTop:5}}><div style={{fontSize:8,color:T.t3}}>Resultado</div><input value={rec.resultado||""} onChange={function(e){updRepro(rec.id,"resultado",e.target.value);}} placeholder="Ej: Hembra viva" style={{width:"100%",padding:"4px 5px",borderRadius:6,border:"1px solid "+T.ib,background:T.ip,color:T.tx,fontSize:10,boxSizing:"border-box"}}/></div>
</div>;})}
</div>}

{aT==="Producción"&&<div style={{background:T.sf,borderRadius:12,padding:12,border:"1px solid "+T.bd}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:12,fontWeight:700,color:T.tx}}>Leche</span><button onClick={addProd} style={bt(T,"s")}><Plus size={11}/>Registrar</button></div>
{pds.length===0?<Em icon={Droplets} title="Sin registros" sub="Registra producción diaria" T={T}/>:<div>
<ResponsiveContainer width="100%" height={100}><AreaChart data={pds.slice(-14)}><CartesianGrid strokeDasharray="3 3" stroke={T.bd} vertical={false}/><XAxis dataKey="fecha" tick={{fontSize:7,fill:T.t3}} axisLine={false} tickLine={false} tickFormatter={function(d){return d.slice(5);}}/><YAxis tick={{fontSize:7,fill:T.t3}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:T.sf,border:"1px solid "+T.bd,borderRadius:6,fontSize:9}}/><Area type="monotone" dataKey="litros_am" stackId="1" stroke={T.gn} fill={T.gl} name="AM"/><Area type="monotone" dataKey="litros_pm" stackId="1" stroke={T.am} fill={T.al} name="PM"/></AreaChart></ResponsiveContainer>
{pds.slice(-5).reverse().map(function(p){return <div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid "+T.bl,fontSize:10}}><span style={{color:T.t2}}>{fmtD(p.fecha)}</span><span style={{color:T.t2}}>AM:{p.litros_am}L</span><span style={{color:T.t2}}>PM:{p.litros_pm}L</span><span style={{fontWeight:700,color:T.tx}}>{(parseFloat(p.litros_am)+parseFloat(p.litros_pm)).toFixed(1)}L</span></div>;})}
</div>}
</div>}

{aT==="Sanidad"&&<div style={{background:T.sf,borderRadius:12,padding:12,border:"1px solid "+T.bd}}>
<div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>{["Vacuna","Vitamina","Desparasitación","Medicamento","Diagnóstico"].map(function(t){return <button key={t} onClick={function(){addHlth(t);}} style={bt(T,"s")}><Plus size={10}/>{t}</button>;})}</div>
{hls.length===0?<Em icon={Stethoscope} title="Sin registros" sub="Agrega vacunas o tratamientos" T={T}/>:hls.map(function(h){return <div key={h.id} style={{padding:"6px 0",borderBottom:"1px solid "+T.bl}}><div style={{display:"flex",justifyContent:"space-between"}}><Bdg v={h.tipo==="Vacuna"?"green":"amber"} T={T}>{h.tipo}</Bdg><span style={{fontSize:9,color:T.t3}}>{fmtD(h.fecha)}</span></div><div style={{fontSize:11,color:T.tx,marginTop:2}}>{h.description}</div></div>;})}
</div>}

{aT==="Eventos"&&<div style={{background:T.sf,borderRadius:12,padding:12,border:"1px solid "+T.bd}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:12,fontWeight:700,color:T.tx}}>Eventos</span><button onClick={addEvt} style={bt(T,"s")}><Plus size={11}/>Agregar</button></div>
{evs.length===0?<Em icon={Clipboard} title="Sin eventos" sub="Registra ventas, nacimientos, etc." T={T}/>:evs.map(function(ev){return <div key={ev.id} style={{padding:"6px 0",borderBottom:"1px solid "+T.bl}}><div style={{display:"flex",justifyContent:"space-between"}}><Bdg v="brown" T={T}>{ev.tipo}</Bdg><span style={{fontSize:9,color:T.t3}}>{fmtD(ev.fecha)}</span></div><div style={{fontSize:11,color:T.tx,marginTop:2}}>{ev.description}</div></div>;})}
</div>}

{aT==="Familia"&&<div style={{background:T.sf,borderRadius:12,padding:12,border:"1px solid "+T.bd}}>
<div style={{fontSize:10,fontWeight:700,color:T.t2,textTransform:"uppercase",marginBottom:5}}>Padres</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:14}}>
<div style={{background:T.sa,borderRadius:7,padding:8}}><div style={{fontSize:8,color:T.t3}}>Padre</div><div style={{fontSize:12,fontWeight:600,color:cow.father_name?T.tx:T.t3}}>{cow.father_name||"—"}</div></div>
<div onClick={function(){if(mo)opCow(mo.id);}} style={{background:T.sa,borderRadius:7,padding:8,cursor:mo?"pointer":"default"}}><div style={{fontSize:8,color:T.t3}}>Madre</div><div style={{fontSize:12,fontWeight:600,color:cow.mother_name?T.gn:T.t3}}>{cow.mother_name||"—"}{mo?" →":""}</div></div>
</div>
<div style={{fontSize:10,fontWeight:700,color:T.t2,textTransform:"uppercase",marginBottom:5}}>Crías ({ch.length})</div>
{ch.length===0?<p style={{fontSize:10,color:T.t3}}>Sin crías</p>:ch.map(function(c){return <div key={c.id} onClick={function(){opCow(c.id);}} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 0",borderBottom:"1px solid "+T.bl,cursor:"pointer"}}><Av cow={c} size={28} T={T}/><div style={{flex:1}}><span style={{fontSize:11,fontWeight:600,color:T.tx}}>{c.name||"Sin nombre"}</span><span style={{fontSize:9,color:T.t3}}> #{c.number}</span></div><ChevronRight size={12} color={T.t3}/></div>;})}
{sb.length>0&&<div><div style={{fontSize:10,fontWeight:700,color:T.t2,textTransform:"uppercase",marginTop:14,marginBottom:5}}>Hermanas ({sb.length})</div>{sb.map(function(s){return <div key={s.id} onClick={function(){opCow(s.id);}} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 0",borderBottom:"1px solid "+T.bl,cursor:"pointer"}}><Av cow={s} size={28} T={T}/><div style={{flex:1}}><span style={{fontSize:11,fontWeight:600,color:T.tx}}>{s.name||"Sin nombre"}</span><span style={{fontSize:9,color:T.t3}}> #{s.number}</span></div><ChevronRight size={12} color={T.t3}/></div>;})}</div>}
</div>}

</div>);}

// CALENDAR
function rCal(){
var mn=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
var dn=["L","M","M","J","V","S","D"];var fd=new Date(cY,cM,1).getDay();var off=fd===0?6:fd-1;var td=new Date(cY,cM+1,0).getDate();var today=new Date();
var cells=[];for(var i=0;i<off;i++)cells.push(null);for(var d=1;d<=td;d++)cells.push(d);
return(<div style={ps}><h2 style={{fontSize:16,fontWeight:800,color:T.tx,margin:"0 0 12px"}}>Calendario</h2>
<div style={{background:T.sf,borderRadius:12,border:"1px solid "+T.bd,padding:12,boxShadow:T.sh}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><button onClick={function(){if(cM===0){sCM(11);sCY(cY-1);}else sCM(cM-1);}} style={{background:"none",border:"none",cursor:"pointer",color:T.t2}}><ChevronLeft size={16}/></button><span style={{fontSize:13,fontWeight:700,color:T.tx}}>{mn[cM]} {cY}</span><button onClick={function(){if(cM===11){sCM(0);sCY(cY+1);}else sCM(cM+1);}} style={{background:"none",border:"none",cursor:"pointer",color:T.t2}}><ChevronRight size={16}/></button></div>
<div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,textAlign:"center"}}>{dn.map(function(n,i){return <div key={i} style={{fontSize:9,fontWeight:600,color:T.t3,padding:3}}>{n}</div>;})}{cells.map(function(day,i){var isT=day===today.getDate()&&cM===today.getMonth()&&cY===today.getFullYear();return <div key={i} style={{padding:5,borderRadius:6,fontSize:11,fontWeight:isT?700:400,background:isT?T.gn:"transparent",color:isT?"#fff":day?T.tx:"transparent"}}>{day||""}</div>;})}</div>
</div></div>);}

function NB({icon:I,label,target}){var a=viw===target||(target==="list"&&(viw==="detail"||viw==="add"));return <button onClick={function(){sVw(target);if(target!=="detail")sSi(null);}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:0,background:"none",border:"none",cursor:"pointer",padding:"2px 10px",color:a?T.gn:T.t3,fontWeight:a?700:400,fontSize:9}}><I size={18} strokeWidth={a?2.5:1.5}/>{label}</button>;}

return(
<div style={{minHeight:"100vh",background:T.bg,color:T.tx,fontFamily:"Inter,-apple-system,system-ui,sans-serif",maxWidth:MW,margin:"0 auto",position:"relative",paddingBottom:64}}>
<style>{spn}</style>
<div style={{padding:"8px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid "+T.bd,background:T.nv,backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:20}}>
<div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:26,height:26,borderRadius:6,background:T.gl,display:"flex",alignItems:"center",justifyContent:"center"}}><Mountain size={14} color={T.gn}/></div><span style={{fontSize:13,fontWeight:800,color:T.tx}}>Sierra Alta</span><Cloud size={10} color={T.gn}/></div>
<button onClick={function(){sDk(!dk);}} style={{width:28,height:28,borderRadius:6,background:T.sa,border:"1px solid "+T.bd,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{dk?<Sun size={13} color={T.tx}/>:<Moon size={13} color={T.tx}/>}</button>
</div>
{tst&&<div style={{position:"fixed",top:48,left:"50%",transform:"translateX(-50%)",zIndex:30,padding:"6px 14px",borderRadius:9,background:tst.color==="red"?T.rl:T.gl,color:tst.color==="red"?T.rd:T.gn,fontSize:11,fontWeight:600,boxShadow:T.sh,display:"flex",alignItems:"center",gap:5}}>{tst.color==="red"?<AlertTriangle size={12}/>:<Check size={12}/>}{tst.msg}</div>}
{viw==="dash"&&rDash()}
{viw==="list"&&rList()}
{viw==="detail"&&rDet()}
{viw==="add"&&rAdd()}
{viw==="cal"&&rCal()}
<div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:MW,background:T.nv,backdropFilter:"blur(12px)",borderTop:"1px solid "+T.bd,display:"flex",justifyContent:"space-around",padding:"4px 0 max(env(safe-area-inset-bottom),4px)",zIndex:20}}>
<NB icon={Home} label="Inicio" target="dash"/>
<NB icon={List} label="Inventario" target="list"/>
<NB icon={CalIcon} label="Calendario" target="cal"/>
</div>
</div>);}
