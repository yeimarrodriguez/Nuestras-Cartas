(() => {
"use strict";
const cfg=window.CARTAS_CONFIG||{}, KEY="cartas_amor_v2";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const views={home:$("#homeView"),reader:$("#readerView"),memory:$("#memoryView"),admin:$("#adminView")};
let letters=load(), editingId=null;

function clone(v){return JSON.parse(JSON.stringify(v))}
function load(){try{let x=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(x)&&x.length)return x}catch{}return clone(cfg.defaultLetters||[])}
function save(){localStorage.setItem(KEY,JSON.stringify(letters))}
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function paras(t=""){return esc(t).split(/\n\s*\n/).map(p=>`<p>${p.replace(/\n/g,"<br>")}</p>`).join("")}
function seal(t){return t==="initial"?(cfg.receiverName||"♥").charAt(0).toUpperCase():t==="star"?"✦":"♥"}
function show(v){Object.values(views).forEach(x=>x.classList.remove("active"));views[v].classList.add("active");window.scrollTo({top:0,behavior:"smooth"})}

function renderShelf(){
 $("#envelopeShelf").innerHTML=letters.map((l,i)=>`
 <button class="envelope-wrap theme-${esc(l.theme||"burgundy")}" data-open="${esc(l.id)}" style="--delay:${i*100}ms">
  <div class="envelope-shadow"></div><div class="envelope">
   <div class="envelope-back"></div><div class="envelope-paper"><span>${esc(l.title)}</span></div>
   <div class="flap"></div><div class="envelope-front"></div><div class="seal">${seal(l.seal)}</div>
  </div><span class="envelope-label">${esc(l.title)}</span><small>${esc(l.date||"")}</small>
 </button>`).join("");
 $$(".envelope-wrap").forEach(el=>{
  el.onclick=()=>openLetter(el.dataset.open);
  el.onpointermove=e=>{let r=el.getBoundingClientRect();el.style.setProperty("--rx",`${((e.clientY-r.top)/r.height-.5)*-8}deg`);el.style.setProperty("--ry",`${((e.clientX-r.left)/r.width-.5)*10}deg`)};
  el.onpointerleave=()=>{el.style.setProperty("--rx","0deg");el.style.setProperty("--ry","0deg")}
 })
}

function openLetter(id){
 let l=letters.find(x=>String(x.id)===String(id));if(!l)return;
 show("reader");
 $("#readerStage").innerHTML=`
 <div class="scene theme-${esc(l.theme||"burgundy")}">
  <div class="table-light"></div><div class="open-envelope"><div class="open-back"></div><div class="open-flap"></div><div class="open-front"></div></div>
  <div class="letter-paper">
   <div class="paper-fold fold-a"></div><div class="paper-fold fold-b"></div>
   <div class="paper-inner">
    <div class="letter-meta"><span>${esc(l.date||"")}</span><span>Para: ${esc(l.to||cfg.receiverName||"")}</span></div>
    <div class="letter-content"><h1>${esc(l.title)}</h1>${paras(l.message)}</div>
    <div class="letter-signature"><span>${esc(l.from||cfg.senderName||"")}</span></div>
    <button class="paper-heart secret-trigger" title="Hay algo escondido">${seal(l.seal)}</button>
   </div>
  </div>
 </div>`;
 setTimeout(()=>$(".scene").classList.add("opened"),350);
 $(".secret-trigger").onclick=e=>{e.stopPropagation(); if(l.secret) showSecret(l.secret,l.title); else showSecret("Todavía no hay un secreto aquí. Puedes añadir uno editando esta carta.","Pequeño secreto")}
}

function showSecret(text,title){$("#secretTitle").textContent=title||"Un secreto";$("#secretText").textContent=text;$("#secretModal").classList.remove("hidden")}
$("#closeSecret").onclick=()=>$("#secretModal").classList.add("hidden");
$("#secretModal").onclick=e=>{if(e.target.id==="secretModal")$("#secretModal").classList.add("hidden")};

function renderMemory(){
 let arr=cfg.memories||[];
 $("#memoryGrid").innerHTML=arr.map((m,i)=>`
 <article class="memory-card">
  <div class="memory-photo ${m.image?"has-image":""}" ${m.image?`style="background-image:url('${esc(m.image)}')"`:""}>
   ${m.image?"":"<span>♥</span>"}
  </div><div class="memory-body"><span>${esc(m.date||"")}</span><h3>${esc(m.title||"Recuerdo")}</h3><p>${esc(m.text||"")}</p></div>
 </article>`).join("");
}

function renderManager(){
 $("#letterManager").innerHTML=letters.length?letters.map(l=>`
 <article class="manager-card theme-${esc(l.theme||"burgundy")}"><div class="mini-envelope"><span class="mini-seal">${seal(l.seal)}</span></div>
 <div class="manager-info"><h3>${esc(l.title)}</h3><p>${esc(l.date||"Sin fecha")}</p><small>${esc((l.message||"").slice(0,110))}${(l.message||"").length>110?"…":""}</small></div>
 <div class="manager-actions"><button data-edit="${esc(l.id)}" class="ghost-btn">Editar</button><button data-delete="${esc(l.id)}" class="danger-btn">Eliminar</button></div></article>`).join(""):`<div class="empty">Todavía no tienes cartas.</div>`;
 $$("[data-edit]").forEach(b=>b.onclick=()=>edit(b.dataset.edit));$$("[data-delete]").forEach(b=>b.onclick=()=>del(b.dataset.delete));
}
function openEditor(l=null){
 editingId=l?.id||null;$("#editorTitle").textContent=l?"Editar carta":"Nueva carta";
 $("#letterId").value=l?.id||"";$("#fTitle").value=l?.title||"";$("#fDate").value=l?.date||"";$("#fTo").value=l?.to||cfg.receiverName||"";
 $("#fFrom").value=l?.from||cfg.senderName||"";$("#fMessage").value=l?.message||"";$("#fTheme").value=l?.theme||"burgundy";$("#fSeal").value=l?.seal||"heart";$("#fSecret").value=l?.secret||"";
 $("#editorModal").classList.remove("hidden");setTimeout(()=>$("#fTitle").focus(),50)
}
function edit(id){let l=letters.find(x=>String(x.id)===String(id));if(l)openEditor(l)}
function del(id){let l=letters.find(x=>String(x.id)===String(id));if(!l)return;if(confirm(`¿Eliminar "${l.title}"?`)){letters=letters.filter(x=>String(x.id)!==String(id));save();renderShelf();renderManager();toast("Carta eliminada")}}
function formData(){return{id:editingId||`letter-${Date.now()}`,title:$("#fTitle").value.trim(),date:$("#fDate").value.trim(),to:$("#fTo").value.trim(),from:$("#fFrom").value.trim(),message:$("#fMessage").value.trim(),theme:$("#fTheme").value,seal:$("#fSeal").value,secret:$("#fSecret").value.trim()}}
function closeEditor(){$("#editorModal").classList.add("hidden")}
$("#letterForm").onsubmit=e=>{e.preventDefault();let d=formData();if(!d.title||!d.message)return;let i=letters.findIndex(x=>String(x.id)===String(d.id));i>=0?letters[i]=d:letters.unshift(d);save();renderShelf();renderManager();closeEditor();toast("Carta guardada")}
$("#previewBtn").onclick=()=>{let d=formData();if(!d.title||!d.message)return toast("Escribe título y mensaje");closeEditor();openTemporary(d)}
function openTemporary(l){
 show("reader");$("#readerStage").innerHTML=`<div class="scene theme-${esc(l.theme)}"><div class="table-light"></div><div class="open-envelope"><div class="open-back"></div><div class="open-flap"></div><div class="open-front"></div></div><div class="letter-paper"><div class="paper-inner"><div class="letter-meta"><span>${esc(l.date)}</span><span>Para: ${esc(l.to)}</span></div><div class="letter-content"><h1>${esc(l.title)}</h1>${paras(l.message)}</div><div class="letter-signature">${esc(l.from)}</div><button class="paper-heart secret-trigger">${seal(l.seal)}</button></div></div></div>`;
setTimeout(()=>$(".scene").classList.add("opened"),200);$(".secret-trigger").onclick=()=>showSecret(l.secret||"Sin secreto todavía.",l.title)
}
function toast(m){let t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2200)}

$("#enterBtn").onclick=()=>{$("#introScreen").classList.add("gone");document.body.classList.add("entered");setTimeout(()=>$("#introScreen").remove(),1000)}
$("#adminBtn").onclick=()=>{renderManager();show("admin")}
$("#memoryBtn").onclick=()=>{renderMemory();show("memory")}
$("#newLetterBtn").onclick=()=>openEditor();
$("#closeEditor").onclick=closeEditor;
$("#editorModal").onclick=e=>{if(e.target.id==="editorModal")closeEditor()}
$("#backHome").onclick=()=>show("home");$("#backMemory").onclick=()=>show("home");

document.addEventListener("mousemove",e=>{$("#cursorGlow").style.transform=`translate(${e.clientX-100}px,${e.clientY-100}px)`});
renderShelf();renderManager();
})();