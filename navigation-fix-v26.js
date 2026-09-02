(()=>{
'use strict';
const $=id=>document.getElementById(id);
let lastPage=null;
function visiblePage(){return document.querySelector('.sw-page-layer.show')}
function closeAll(){document.querySelectorAll('.sw-page-layer.show').forEach(x=>{x.classList.remove('show');x.setAttribute('aria-hidden','true')});document.body.style.overflow='';if(window.closeInsights)window.closeInsights()}
function openWithHistory(id){if(window.SaveWiseOpenPage)window.SaveWiseOpenPage(id);else if(window.openPage)window.openPage(id);if(history.state?.savewisePage!==id)history.pushState({savewisePage:id},'',location.href);lastPage=id}
function back(){if(history.state?.savewisePage){history.back()}else closeAll()}
window.addEventListener('popstate',()=>{closeAll();lastPage=null});
document.addEventListener('click',e=>{
 const close=e.target.closest('[data-close-page]');
 if(close){e.preventDefault();e.stopImmediatePropagation();back();return}
 const ai=e.target.closest('button,a');
 if(ai && /\b(ai|insight|smart coach|coach)\b/i.test((ai.textContent||'').trim())){
  e.preventDefault();e.stopImmediatePropagation();
  if(window.SaveWiseAI)window.SaveWiseAI();
  return;
 }
 const nav=e.target.closest('#settingsNav,#goalsNav,#swProfileBtn,#swNotifyBtn,#swBackupBtn,#headerAvatar');
 if(nav){setTimeout(()=>{const p=visiblePage();if(p)openWithHistory(p.id)},0)}
},true);
const observer=new MutationObserver(()=>{
 const p=visiblePage();
 if(p && p.id!==lastPage && history.state?.savewisePage!==p.id){history.pushState({savewisePage:p.id},'',location.href);lastPage=p.id}
 if(!p)lastPage=null;
});
observer.observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['class']});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&visiblePage())back()});
})();
