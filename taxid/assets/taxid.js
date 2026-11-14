(function(){'use strict';var d=document,T=window.TAXID,$=function(s){return d.querySelector(s)};
var form=$('#x-form');if(!form||!T)return;var sel=$('#x-type'),inp=$('#x-in'),out=$('#x-out'),fixed=form.getAttribute('data-key');
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function box(cls,html){out.hidden=false;out.innerHTML='<div class="x-res '+cls+'">'+html+'</div>'}
function run(){var raw=inp.value.trim();if(!raw){out.hidden=true;return}var key=fixed||sel.value;
 if(key==='auto'){var hits=[],nc=[];Object.keys(T.V).forEach(function(k){var r=T.check(k,raw);if(r.ok===true)hits.push(k);else if(r.ok===null)nc.push(k)});
  if(!hits.length){box('x-bad','<p><b>This number passes none of the '+Object.keys(T.V).length+' checks.</b> It may have a typing mistake, or belong to a type that is not covered. Pick the type yourself to see the reason.</p>');return}
  box('x-ok','<p><b>Passes the check of:</b> '+hits.map(function(k){return '<a href="/taxid/id/'+k.toLowerCase()+'/">'+esc(T.V[k].name+' '+T.V[k].kind)+'</a>'}).join('; ')+'.</p><p class="hint">The same digits can pass several checks by chance. A pass means the shape and check digit are right, not that the business exists.</p>'+(nc.length?'<p class="hint">Not checked for: '+nc.map(function(k){return esc(T.V[k].name)}).join(', ')+' (variants this site does not test).</p>':''));return}
 var r=T.check(key,raw),e=T.V[key],cl=T.clean(raw,key);
 if(r.ok===true)box('x-ok','<p><b>The shape and check digit are correct</b> for '+esc(e.name+' '+e.kind)+': <span class="x-mono">'+esc(cl)+'</span>.</p><p class="hint">This does not show that the number is registered or belongs to a real business. Use the official check linked below.</p>');
 else if(r.ok===false)box('x-bad','<p><b>This is not a valid '+esc(e.name+' '+e.kind)+'.</b></p><p>'+esc(r.why)+'</p>');
 else box('x-nc','<p><b>Not checked.</b> '+esc(r.why)+'</p>')}
form.addEventListener('submit',function(ev){ev.preventDefault();run()});if(sel)sel.addEventListener('change',run);
d.querySelectorAll('[data-fill]').forEach(function(b){b.addEventListener('click',function(){inp.value=b.getAttribute('data-fill');if(sel&&b.getAttribute('data-type'))sel.value=b.getAttribute('data-type');run()})});
var qs=location.search.match(/[?&]n=([^&]+)/);if(qs){inp.value=decodeURIComponent(qs[1]);run()}})();