(function(){'use strict';var d=document,S=window.SYG,$=function(s){return d.querySelector(s)};
var fi=$('[data-filter]');if(fi){var rows=[].slice.call(d.querySelectorAll(fi.getAttribute('data-filter')));fi.addEventListener('input',function(){var q=fi.value.trim().toLowerCase();rows.forEach(function(r){r.hidden=!!q&&r.textContent.toLowerCase().indexOf(q)<0})})}
var box=$('#v-in'),res=$('#v-res'),DATA=null;if(!box)return;
function load(){if(DATA)return Promise.resolve();return S.json('/volcano/data/v.json').then(function(j){DATA=j.v.map(function(r){return{n:r[0],c:r[1],t:r[2],p:r[3],k:(r[0]+' '+r[1]+' '+r[2]).toLowerCase()}})})}
function run(){var q=box.value.trim().toLowerCase();if(!q){res.hidden=true;return}var ws=q.split(/\s+/);var out=DATA.filter(function(r){return ws.every(function(w){return r.k.indexOf(w)>-1})});
 out.sort(function(a,b){function sc(r){var n=r.n.toLowerCase();return n.indexOf(q)===0?0:(n.indexOf(q)>-1?1:(r.k.indexOf(q)>-1?2:3))}return sc(a)-sc(b)});
 res.hidden=false;if(!out.length){res.innerHTML='<p class="hint">No volcano matches "'+S.esc(q)+'". Try part of the name or the country.</p>';return}
 res.innerHTML='<ul class="v-res">'+out.slice(0,40).map(function(r){return '<li><a href="'+r.p+'"><span><b>'+S.esc(r.n)+'</b><br><small>'+S.esc(r.c)+'</small></span><small>'+S.esc(r.t)+'</small></a></li>'}).join('')+'</ul>'+(out.length>40?'<p class="hint">'+out.length+' matches; showing 40.</p>':'')}
var t;box.addEventListener('input',function(){clearTimeout(t);t=setTimeout(function(){load().then(run)},120)});box.addEventListener('focus',function(){load()},{once:true});
$('#v-form').addEventListener('submit',function(e){e.preventDefault();load().then(run)})})();