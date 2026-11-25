"use strict";
const root=document.documentElement;
const screen=document.querySelector(".screen");
const viewport=document.querySelector("#viewport");
const output=document.querySelector("#terminal-output");
const form=document.querySelector("#terminal-form");
const input=document.querySelector("#command");
const mode=document.querySelector("#mode");
const panel=document.querySelector("#console-panel");
const toggle=document.querySelector("#console-toggle");
const close=document.querySelector("#console-close");
const breadcrumb=document.querySelector("#breadcrumb");
const state=document.querySelector("#screen-state");
const decodeName=document.querySelector("#decode-name");
const rain=document.querySelector(".glitch-rain");
const reduced=matchMedia("(prefers-reduced-motion: reduce)");
const modules={home:"NEXUS",archive:"ARCHIVE",toolchain:"TOOLCHAIN",lab:"LABORATORY",contact:"UPLINK"};
const routes={dtp:"archive",archive:"archive",dev:"toolchain",toolchain:"toolchain",lab:"lab",contact:"contact",home:"home",nexus:"home",uplink:"contact"};
const responses={
 help:"COMMANDS\nhelp · whoami · ls · dtp · dev · lab · contact · home · clear\nКоманды открывают модули внутри экрана.",
 whoami:"REDDEQ / Document Engineering · DTP · Automation",
 ls:"/archive     DTP & Design\n/toolchain   Automation\n/lab         Laboratory\n/contact     Uplink",
 manul:"SECRET NODE FOUND\nฅ(•ㅅ•)ฅ MANUL.EXE is running..."
};
const owns=(obj,key)=>Object.prototype.hasOwnProperty.call(obj,key);
let activeModule=null,swapTimer=0,endTimer=0,sequence=0;
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
 activeModule=route.module;breadcrumb.textContent="ROOT / "+modules[activeModule];
 document.title="REDDEQ // "+modules[activeModule]+" — DTP & Automation";
 for(const card of document.querySelectorAll("[data-selected]"))card.removeAttribute("data-selected");
 viewport.scrollTop=0;
 if(route.target){
   const card=route.target.closest(".project");
   if(card){card.setAttribute("data-selected","");const details=card.querySelector("details");if(details)details.open=true;}
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
 for(let i=0;i<24;i++){
   const col=document.createElement("span");col.className="rain-column";col.style.setProperty("--lag",-(i%5)*35+"ms");
   col.textContent=Array.from({length:42},()=>glyphs[Math.floor(Math.random()*glyphs.length)]).join("\n");
   frag.append(col);
 }
 rain.replaceChildren(frag);
}
function navigate(hash,initial=false){
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
 line("visitor@nexus:~$ "+raw,"entered");
 if(owns(routes,command)){line("Opening /"+routes[command]);consoleOpen(false);go(routes[command]);}
 else {line(owns(responses,command)?responses[command]:"Unknown command. Type help.");consoleOpen(true);}
}
function setMode(active){
 root.classList.toggle("netrunner",active);mode.setAttribute("aria-pressed",String(active));mode.textContent="NETRUNNER: "+(active?"ON":"OFF");
 try{localStorage.setItem("nexus-mode",active?"on":"off");}catch{}
 if(!active&&screen.classList.contains("switching"))navigate(location.hash,true);
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
let enabled=true;try{enabled=localStorage.getItem("nexus-mode")!=="off";}catch{}
setMode(enabled);
mode.addEventListener("click",()=>setMode(mode.getAttribute("aria-pressed")!=="true"));
root.classList.add("js");navigate(location.hash,true);
