(function(){'use strict';var d=document,S=window.SYG,$=function(s){return d.querySelector(s)};
var ff=$('[data-filter]');if(ff){var rows=[].slice.call(d.querySelectorAll(ff.getAttribute('data-filter')));ff.addEventListener('input',function(){var q=ff.value.trim().toLowerCase();rows.forEach(function(r){r.hidden=!!q&&r.textContent.toLowerCase().indexOf(q)<0})})}
var box=$('#s-in'),res=$('#s-res'),DATA=null;if(!box)return;
function load(){if(DATA)return Promise.resolve();return S.json('/species/data/species.json').then(function(j){DATA=j})}
function run(){var q=box.value.trim().toLowerCase();if(!q){res.hidden=true;return}var ws=q.split(/\s+/);
 var out=DATA.filter(function(r){var k=(r[1]+' '+r[2]+' '+r[3]).toLowerCase();return ws.every(function(w){return k.indexOf(w)>-1})});
 res.hidden=false;if(!out.length){res.innerHTML='<p class="hint">No species matches "'+S.esc(q)+'". Try the common name (lion) or the scientific name (Panthera leo).</p>';return}
 res.innerHTML='<ul class="s-res">'+out.slice(0,40).map(function(r){return '<li><a href="/species/species/'+S.esc(r[0])+'/"><span><b>'+S.esc(r[2]||r[1])+'</b><br><small><i>'+S.esc(r[1])+'</i></small></span><small>'+S.esc(r[3])+'</small></a></li>'}).join('')+'</ul>'}
var t;box.addEventListener('input',function(){clearTimeout(t);t=setTimeout(function(){load().then(run)},120)});box.addEventListener('focus',function(){load()},{once:true});
var fm=$('#s-form');if(fm)fm.addEventListener('submit',function(e){e.preventDefault();load().then(run)})})();