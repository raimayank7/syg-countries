(function(){'use strict';var d=document,S=window.SYG,$=function(s){return d.querySelector(s)};
var f=$('[data-filter]');if(f){var rows=[].slice.call(d.querySelectorAll(f.getAttribute('data-filter'))),none=$('[data-none]'),sel=$('[data-typesel]');
 function go(){var q=f.value.trim().toLowerCase().replace(/^\./,''),t=sel?sel.value:'',n=0;rows.forEach(function(r){var k=r.getAttribute('data-k')||'';var hit=(!q||k.indexOf(q)>-1)&&(!t||r.getAttribute('data-t')===t);r.hidden=!hit;if(hit)n++});if(none)none.hidden=n>0;var c=$('[data-count]');if(c)c.textContent=n}
 f.addEventListener('input',go);if(sel)sel.addEventListener('change',go)}
var box=$('#t-in'),res=$('#t-res'),DATA=null;
function load(){if(DATA)return Promise.resolve();return S.json('/tld/data/tld.json').then(function(j){DATA=j})}
function run(){var q=box.value.trim().toLowerCase().replace(/^\./,'');if(!q){res.hidden=true;return}
 var out=[];for(var i=0;i<DATA.length;i++){var r=DATA[i];if(r[5].indexOf(q)>-1){var s=r[0]===q||r[1]===q?0:r[0].indexOf(q)===0?1:(r[3]||'').toLowerCase().indexOf(q)===0?2:r[4].toLowerCase().indexOf(q)===0?3:4;out.push([s,r])}}
 out.sort(function(a,b){return a[0]-b[0]});out=out.slice(0,40).map(function(x){return x[1]});
 res.hidden=false;if(!out.length){res.innerHTML='<p class="hint">No extension matches "'+S.esc(q)+'". Search by the extension (for example in), a country, or the name of the company that runs it.</p>';return}
 res.innerHTML='<ul class="t-res">'+out.map(function(r){return '<li><a href="/tld/tld/'+S.esc(r[0])+'/"><span><b>.'+S.esc(r[1])+'</b><br><small>'+S.esc(r[2])+(r[3]?' &middot; '+S.esc(r[3]):'')+'</small></span><small>'+S.esc(r[4])+'</small></a></li>'}).join('')+'</ul>'}
if(box){var t;box.addEventListener('input',function(){clearTimeout(t);t=setTimeout(function(){load().then(run)},120)});box.addEventListener('focus',function(){load()},{once:true});var fm=$('#t-form');if(fm)fm.addEventListener('submit',function(e){e.preventDefault();load().then(run)})}
})();