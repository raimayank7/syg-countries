(function(){'use strict';var d=document,S=window.SYG,$=function(s){return d.querySelector(s)};
var ff=$('[data-filter]');if(ff){var rows=[].slice.call(d.querySelectorAll(ff.getAttribute('data-filter')));ff.addEventListener('input',function(){var q=ff.value.trim().toLowerCase();rows.forEach(function(r){r.hidden=!!q&&r.textContent.toLowerCase().indexOf(q)<0})})}
var box=$('#h-in'),res=$('#h-res'),DATA=null;if(!box)return;
function load(){if(DATA)return Promise.resolve();return S.json('/hscode/data/hts.json').then(function(j){DATA=j})}
function run(){var q=box.value.trim().toLowerCase();if(!q){res.hidden=true;return}var qd=q.replace(/[^0-9]/g,''),out;
 if(qd.length>=4&&/^[0-9. ]+$/.test(q)){out=DATA.filter(function(r){return r[0].replace(/\./g,'').indexOf(qd)===0})}else{var ws=q.split(/\s+/);out=DATA.filter(function(r){var k=r[1].toLowerCase();return ws.every(function(w){return k.indexOf(w)>-1})})}
 res.hidden=false;if(!out.length){res.innerHTML='<p class="hint">Nothing matches "'+S.esc(q)+'". Try a simpler word (for example "coffee" or "bicycle") or the first digits of a code.</p>';return}
 res.innerHTML='<ul class="h-res">'+out.slice(0,40).map(function(r){return '<li><a href="'+r[3]+'"><b class="h-code">'+S.esc(r[0])+'</b> '+S.esc(r[1])+'<br><small>General duty: '+S.esc(r[2]||'see subheading')+'</small></a></li>'}).join('')+'</ul>'+(out.length>40?'<p class="hint">'+out.length+' matches; showing 40. Add a word to narrow.</p>':'')}
var t;box.addEventListener('input',function(){clearTimeout(t);t=setTimeout(function(){load().then(run)},150)});box.addEventListener('focus',function(){load()},{once:true});
var fm=$('#h-form');if(fm)fm.addEventListener('submit',function(e){e.preventDefault();load().then(run)})})();