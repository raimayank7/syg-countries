(function(){'use strict';var d=document,S=window.SYG,$=function(s){return d.querySelector(s)};
var ff=$('[data-filter]');if(ff){var rows=[].slice.call(d.querySelectorAll(ff.getAttribute('data-filter')));ff.addEventListener('input',function(){var q=ff.value.trim().toLowerCase();rows.forEach(function(r){r.hidden=!!q&&r.textContent.toLowerCase().indexOf(q)<0})})}
var box=$('#x-in'),res=$('#x-res'),DATA=null;if(!box)return;
function load(){if(DATA)return Promise.resolve();return S.json('/planets/data/planets.json').then(function(j){DATA=j})}
function run(){var q=box.value.trim().toLowerCase();if(!q){res.hidden=true;return}var ws=q.split(/\s+/);
 var out=DATA.filter(function(r){var k=r[1].toLowerCase()+' '+r[2].toLowerCase();return ws.every(function(w){return k.indexOf(w)>-1})});
 out.sort(function(a,b){var an=a[1].toLowerCase()===q?0:1,bn=b[1].toLowerCase()===q?0:1;return an-bn||a[1].length-b[1].length});
 res.hidden=false;if(!out.length){res.innerHTML='<p class="hint">No planet or star matches "'+S.esc(q)+'". Try a part of the name, such as Kepler-22 or TRAPPIST.</p>';return}
 res.innerHTML='<ul class="x-res">'+out.slice(0,40).map(function(r){return '<li><a href="/planets/planet/'+S.esc(r[0])+'/"><span><b>'+S.esc(r[1])+'</b><br><small>'+S.esc(r[3])+(r[4]?' &middot; '+S.esc(r[4])+' light years away':'')+' &middot; found '+r[5]+'</small></span></a></li>'}).join('')+'</ul>'+(out.length>40?'<p class="hint">'+out.length+' matches; showing 40. Add more letters to narrow.</p>':'')}
var t;box.addEventListener('input',function(){clearTimeout(t);t=setTimeout(function(){load().then(run)},120)});box.addEventListener('focus',function(){load()},{once:true});
var fm=$('#x-form');if(fm)fm.addEventListener('submit',function(e){e.preventDefault();load().then(run)})})();