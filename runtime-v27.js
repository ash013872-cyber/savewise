(()=>{
'use strict';
const $=id=>document.getElementById(id);
const isPage=el=>el&&el.classList&&el.classList.contains('sw-page-layer');
const visible=()=>document.querySelector('.sw-page-layer.show');
let internal=false;
function hide(el){if(!isPage(el))return;el.classList.remove('show');el.setAttribute('aria-hidden','true')}
function closeLayer(id){const el=$(id);hide(el);document.body.style.overflow='';}
function openLayer(id,push=true){const el=$(id);if(!isPage(el))return false;document.querySelectorAll('.sw-page-layer.show').forEach(hide);el.classList.add('show');el.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';if(push){history.pushState({swLayer:id},'',location.href)}return true}
function goHome(replace=true){document.querySelectorAll('.sw-page-layer.show').forEach(hide);const ai=$('aiPanel');if(ai)ai.classList.remove('show');const im=$('insightsModal');if(im)im.classList.remove('show');document.body.style.overflow='';if(replace)history.replaceState({},'',location.href)}
function handleBack(){const current=visible();if(current){internal=true;history.back();setTimeout(()=>{if(internal){goHome(false);internal=false}},80);return true}return false}
// Patch existing close buttons: close the current layer without letting the old handler fight history.
document.addEventListener('click',e=>{
 const close=e.target.closest('[data-close-page]');
 if(close){e.preventDefault();e.stopImmediatePropagation();handleBack();return;}
 const ai=e.target.closest('#aiBtn,.aiBtn,[data-ai],button,a');
 if(ai){const text=(ai.textContent||'').trim();if(/\b(ai|insight|smart coach|coach)\b/i.test(text)){e.preventDefault();e.stopImmediatePropagation();if(window.SaveWiseAI){window.SaveWiseAI()}else{openAI()}return;}}
},true);
// Wrap the app's page opener so every opening gets a browser history entry.
const originalOpen=window.SaveWiseOpenPage||window.openPage;
if(originalOpen){window.SaveWiseOpenPage=function(id){return openLayer(id,true)};window.openPage=window.SaveWiseOpenPage;}
function openAI(){const panel=$('aiPanel')||document.createElement('div');panel.id='aiPanel';panel.className='sw-ai-overlay show';panel.innerHTML='<div class="sw-ai-sheet"><div class="sw-ai-kicker">SMART MONEY CHECK</div><h2>AI Money Coach</h2><p class="sw-ai-copy">Your AI coach is ready. Add or review your recent transactions to get a personalized spending check.</p><div class="sw-ai-tip"><b>What I can check</b><p>Monthly spending, highest expense category, income vs spending, savings rate, and your next practical money move.</p></div><button class="btn primary" id="runtimeAiDone">Done</button></div>';if(!panel.parentNode)document.body.appendChild(panel);panel.onclick=e=>{if(e.target===panel||e.target.closest('#runtimeAiDone'))panel.classList.remove('show')};}
// Android/system/browser Back: close SaveWise overlays/pages first; only leave app when already on home.
window.addEventListener('popstate',()=>{internal=false;goHome(false)});
// Some Android WebViews expose back through history only; create a disposable home state on load.
if(!history.state||!history.state.savewiseRoot){history.replaceState({savewiseRoot:true},'',location.href)}
// Fix direct old navigation state and accessibility for page layers.
document.querySelectorAll('.sw-page-layer').forEach(el=>{if(!el.classList.contains('show'))el.setAttribute('aria-hidden','true')});
// Kill the previous navigation patch's capture handler if possible by neutralizing its side effects through this final capture layer.
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&visible()){e.preventDefault();handleBack()}},true);
})();