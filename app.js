"use strict";
const root=document.documentElement;
const screen=document.querySelector(".screen");
const viewport=document.querySelector("#viewport");
const output=document.querySelector("#terminal-output");
const form=document.querySelector("#terminal-form");
const input=document.querySelector("#command");
const sound=document.querySelector("#sound-toggle");
const soundtrack=document.querySelector("#soundtrack");
const panel=document.querySelector("#console-panel");
const toggle=document.querySelector("#console-toggle");
const close=document.querySelector("#console-close");
const breadcrumb=document.querySelector("#breadcrumb");
const state=document.querySelector("#screen-state");
const decodeName=document.querySelector("#decode-name");
const rain=document.querySelector(".glitch-rain");
const reduced=matchMedia("(prefers-reduced-motion: reduce)");
const environment=root.dataset.environment||"gateway";
const envNames={gateway:"NEXUS",dtp:"ARCHIVE",automation:"TOOLCHAIN"};
const envName=envNames[environment];
const pageTitle=document.title;
const prompt="visitor@"+envName.toLowerCase()+":~$ ";
const modules=Object.fromEntries([...document.querySelectorAll(".module")].map(s=>[s.id,document.querySelector('[data-module="'+s.id+'"]')?.dataset.label||"HOME"]));
const routes=environment==="dtp"?{home:"home",works:"archive",archive:"archive",skills:"skills",contact:"contact"}:environment==="automation"?{home:"home",projects:"toolchain",toolchain:"toolchain",stack:"skills",skills:"skills",lab:"lab",contact:"contact"}:{home:"home"};
const external=environment==="gateway"?{dtp:"./dtp/",dev:"./automation/",automation:"./automation/"}:{nexus:"../",gateway:"../",dtp:"../dtp/",dev:"../automation/",automation:"../automation/"};
const responses={
 help:"COMMANDS\nhelp · whoami · ls · "+Object.keys(routes).join(" · ")+" · "+Object.keys(external).join(" · ")+" · clear",
 whoami:environment==="dtp"?"REDDEQ / DTP · Document Engineering":environment==="automation"?"REDDEQ / Automation · Development":"REDDEQ / NEXUS — DTP & Automation",
 ls:environment==="gateway"?"/dtp  DTP Archive\n/automation  Toolchain":Object.entries(modules).map(([id,label])=>"/"+id+"  "+label).join("\n"),
 manul:"SECRET NODE FOUND\nฅ(•ㅅ•)ฅ MANUL.EXE is running..."
};
const owns=(obj,key)=>Object.prototype.hasOwnProperty.call(obj,key);
let activeModule=null,swapTimer=0,endTimer=0,sequence=0,departure=0;
function routeFor(hash){
 let id=hash.replace(/^#/,"");
 try{id=decodeURIComponent(id);}catch{return {module:"home",target:null};}
 if(id==="terminal"||id==="main")return {module:activeModule||"home",target:null};
 if(owns(modules,id))return {module:id,target:null};
 const el=document.getElementById(id);
 const parent=el?.closest(".module");
 return parent&&owns(modules,parent.id)?{module:parent.id,target:el}:{module:"home",target:null};
}
function consoleOpen(open,focus=false){
 panel.hidden=!open;toggle.setAttribute("aria-expanded",String(open));
 if(focus||(!open&&panel.contains(document.activeElement)))(open?input:toggle).focus({preventScroll:true});
 if(open)output.scrollTop=output.scrollHeight;
}
function line(value,className){
 const p=document.createElement("p");p.textContent=value;if(className)p.className=className;
 output.append(p);while(output.children.length>80)output.firstElementChild.remove();output.scrollTop=output.scrollHeight;
}
function apply(route){
 const previous=document.activeElement?.closest(".module");
 for(const section of document.querySelectorAll(".module"))section.hidden=section.id!==route.module;
 for(const link of document.querySelectorAll("[data-module]")){
   if(link.dataset.module===route.module)link.setAttribute("aria-current","page");
   else link.removeAttribute("aria-current");
 }
 if(previous&&previous.id!==route.module)screen.focus({preventScroll:true});
 activeModule=route.module;breadcrumb.textContent=envName+" / "+modules[activeModule];
 document.title=activeModule==="home"?pageTitle:modules[activeModule]+" | "+pageTitle;
 for(const card of document.querySelectorAll("[data-selected]"))card.removeAttribute("data-selected");
 viewport.scrollTop=0;
 if(route.target){
   const card=route.target.closest(".project");
   if(card){
     card.setAttribute("data-selected","");
     const details=card.querySelector("details");if(details)details.open=true;
     // A linked preview should load immediately even during the module transition.
     for(const image of card.querySelectorAll(".case-pair img[loading=lazy]"))image.loading="eager";
   }
   viewport.scrollTop=route.target.getBoundingClientRect().top-viewport.getBoundingClientRect().top+viewport.scrollTop-16;
 }
}
function stopTransition(){
 clearTimeout(swapTimer);clearTimeout(endTimer);screen.classList.remove("switching");
 state.textContent="MODULE READY";
}
function makeRain(){
 const glyphs="01アイウエオカキクケコサシスセソΞΔλ<>/×";
 const frag=document.createDocumentFragment();
 const width=rain.clientWidth||viewport.clientWidth||320;
 const height=rain.clientHeight||viewport.clientHeight||300;
 const columns=Math.max(1,Math.floor(width/14));
 const rows=Math.max(42,Math.ceil(height*2.25/15));
 rain.style.setProperty("--columns",String(columns));
 for(let i=0;i<columns;i++){
   const col=document.createElement("span");col.className="rain-column";col.style.setProperty("--lag",-(i%7)*19+"ms");
   col.textContent=Array.from({length:rows},()=>glyphs[Math.floor(Math.random()*glyphs.length)]).join("\n");
   frag.append(col);
 }
 rain.replaceChildren(frag);
}
function navigate(hash,initial=false){
 if(typeof departure!=="undefined"&&departure){clearTimeout(departure);departure=0;}
 const route=routeFor(hash),token=++sequence;
 stopTransition();
 if(hash==="#terminal")consoleOpen(true,!initial);
 if(initial||activeModule===route.module||!root.classList.contains("netrunner")||reduced.matches){apply(route);return;}
 decodeName.textContent=modules[route.module];state.textContent="DECODING...";
 makeRain();void screen.offsetWidth;screen.classList.add("switching");
 swapTimer=setTimeout(()=>{if(token===sequence)apply(route);},145);
 endTimer=setTimeout(()=>{if(token===sequence)stopTransition();},400);
}
function go(id){const hash="#"+id;if(location.hash===hash)navigate(hash);else location.hash=hash;}
function execute(raw){
 const command=raw.trim().toLowerCase();if(!command)return;
 if(command==="clear"){output.replaceChildren();return;}
 line(prompt+raw,"entered");
 if(owns(routes,command)){line("Opening /"+routes[command]);consoleOpen(false);go(routes[command]);}
 else if(owns(external,command)){line("Connecting /"+command);consoleOpen(false);connect(external[command],command==="dtp"?"ARCHIVE":command==="dev"||command==="automation"?"TOOLCHAIN":"NEXUS");}
 else {line(owns(responses,command)?responses[command]:"Unknown command. Type help.");consoleOpen(true);}
}
function setUpSound(){
 const preference="nexus-sound", position="nexus-sound-position";
 let requested=false, attempt=0;
 function show(playing){
   sound.textContent=playing?"SOUND ON":"SOUND OFF";
   sound.setAttribute("aria-pressed",String(playing));
 }
 function savePosition(){
   try{sessionStorage.setItem(position,String(soundtrack.currentTime));}catch{}
 }
 function restorePosition(){
   let saved=0;try{saved=Number(sessionStorage.getItem(position));}catch{}
   if(Number.isFinite(saved)&&saved>0&&saved<soundtrack.duration)soundtrack.currentTime=saved;
 }
 async function play(){
   const token=++attempt;requested=true;
   try{await soundtrack.play();}
   catch{
     if(token===attempt){requested=false;show(false);}
   }
 }
 function restorePreference(){
   try{if(localStorage.getItem(preference)==="on")play();}catch{}
 }
 soundtrack.volume=.25;
 soundtrack.addEventListener("loadedmetadata",restorePosition,{once:true});
 soundtrack.addEventListener("playing",()=>show(!soundtrack.paused));
 soundtrack.addEventListener("pause",()=>show(!soundtrack.paused));
 sound.addEventListener("click",()=>{
   const enable=!requested;
   try{localStorage.setItem(preference,enable?"on":"off");}catch{}
   if(enable){play();return;}
   ++attempt;requested=false;soundtrack.pause();show(false);savePosition();
 });
 window.addEventListener("pagehide",()=>{savePosition();++attempt;requested=false;soundtrack.pause();});
 window.addEventListener("pageshow",event=>{if(event.persisted){restorePosition();restorePreference();}});
 sound.hidden=false;
 restorePreference();
}
form.addEventListener("submit",event=>{event.preventDefault();execute(input.value);input.value="";});
document.querySelectorAll("[data-command]").forEach(button=>button.addEventListener("click",()=>execute(button.dataset.command)));
toggle.addEventListener("click",()=>consoleOpen(panel.hidden,true));
close.addEventListener("click",()=>consoleOpen(false,true));
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&!panel.hidden){consoleOpen(false,true);}});
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener("click",event=>{
 const hash=link.getAttribute("href");
 if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 if(hash==="#main"){event.preventDefault();screen.focus();return;}
 if(hash==="#terminal"){event.preventDefault();consoleOpen(true,true);return;}
 if(hash===location.hash){event.preventDefault();navigate(hash);}
 if(link.matches("[data-module]"))consoleOpen(false);
}));
window.addEventListener("hashchange",()=>navigate(location.hash));
reduced.addEventListener?.("change",()=>{if(reduced.matches&&screen.classList.contains("switching"))navigate(location.hash,true);});
root.classList.add("netrunner");
setUpSound();
root.classList.add("js");navigate(location.hash,true);

// Cross-environment navigation uses real URLs; normal links work without JS.
function connect(url,label){
 if(departure)clearTimeout(departure);
 if(!root.classList.contains("netrunner")||reduced.matches){location.assign(url);return;}
 ++sequence;stopTransition();consoleOpen(false);decodeName.textContent=label;state.textContent="CONNECTING...";
 makeRain();void screen.offsetWidth;screen.classList.add("switching");
 departure=setTimeout(()=>{departure=0;location.assign(url);},260);
}
document.querySelectorAll("a[data-environment]").forEach(link=>link.addEventListener("click",event=>{
 if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
 event.preventDefault();connect(link.href,link.dataset.environment);
}));
window.addEventListener("pageshow",event=>{if(event.persisted){clearTimeout(departure);departure=0;stopTransition();navigate(location.hash,true);}});
const legacyDtp=["archive","july","apo100","chinese"];
const legacyDev=["toolchain","lab","pdfconverter","overlay","office","utility","pocket","desktop"];
if(environment==="gateway"){
 const id=location.hash.slice(1);
 if(legacyDtp.includes(id))location.replace("./dtp/"+location.hash);
 else if(legacyDev.includes(id))location.replace("./automation/"+location.hash);
}

