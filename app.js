"use strict";
const output=document.querySelector("#terminal-output");
const form=document.querySelector("#terminal-form");
const input=document.querySelector("#command");
const mode=document.querySelector("#mode");
const routes={dtp:"archive",dev:"toolchain",lab:"lab",contact:"contact",home:"home"};
const responses={
  help:"COMMANDS\nhelp · whoami · ls · dtp · dev · lab · contact · home · clear\nИспользуй команды для перехода к разделам.",
  whoami:"REDDEQ / Document Engineering · DTP · Automation",
  ls:"/archive     DTP & Design\n/toolchain   Automation\n/lab         Laboratory\n/contact     Uplink",
  manul:"SECRET NODE FOUND\nฅ(•ㅅ•)ฅ MANUL.EXE is running..."
};
function line(value,className){const p=document.createElement("p");p.textContent=value;if(className)p.className=className;output.append(p);while(output.children.length>80)output.firstElementChild.remove();output.scrollTop=output.scrollHeight;}
function execute(raw){const command=raw.trim().toLowerCase();if(!command)return;if(command==="clear"){output.replaceChildren();return;}line("visitor@nexus:~$ "+raw,"entered");if(Object.prototype.hasOwnProperty.call(routes,command)){line("Opening /"+routes[command]);location.hash=routes[command];}else if(Object.prototype.hasOwnProperty.call(responses,command)){line(responses[command]);}else{line("Unknown command. Type help.");}}
form.addEventListener("submit",event=>{event.preventDefault();execute(input.value);input.value="";});
document.querySelectorAll("[data-command]").forEach(button=>button.addEventListener("click",()=>execute(button.dataset.command)));
function setMode(active){document.documentElement.classList.toggle("netrunner",active);mode.setAttribute("aria-pressed",String(active));mode.textContent="NETRUNNER: "+(active?"ON":"OFF");try{localStorage.setItem("nexus-mode",active?"on":"off");}catch{}}
let active=false;try{active=localStorage.getItem("nexus-mode")==="on";}catch{}setMode(active);
mode.addEventListener("click",()=>setMode(mode.getAttribute("aria-pressed")!=="true"));
