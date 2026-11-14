(function(){'use strict';var d=document,S=window.SYG,$=function(s){return d.querySelector(s)};
var fi=$('[data-filter]');if(fi){var rows=[].slice.call(d.querySelectorAll(fi.getAttribute('data-filter')));fi.addEventListener('input',function(){var q=fi.value.trim().toLowerCase();rows.forEach(function(r){r.hidden=!!q&&r.textContent.toLowerCase().indexOf(q)<0})})}
var box=$('#a-in'),res=$('#a-res'),DATA=null;if(!box)return;
function load(){if(DATA)return Promise.resolve();return S.json('/aqi/data/c.json').then(function(j){DATA=j})}
function run(){var q=box.value.trim().toLowerCase();if(!q){res.hidden=true;return}var ws=q.split(/\s+/);
 var out=DATA.c.filter(function(r){var k=(r[0]+' '+DATA.s[r[1]][0]).toLowerCase();return ws.every(function(w){return k.indexOf(w)>-1})});
 res.hidden=false;if(!out.length){res.innerHTML='<p class="hint">No monitored county matches "'+S.esc(q)+'". Only counties with an air monitor are in the data. Try a county name and a state, for example "los angeles california".</p>';return}
 res.innerHTML='<ul class="a-res">'+out.slice(0,40).map(function(r){return '<li><a href="/aqi/county/'+DATA.s[r[1]][1]+'/'+r[2]+'/"><span><b>'+S.esc(r[0])+'</b><br><small>'+S.esc(DATA.s[r[1]][0])+'</small></span><small>'+r[3]+'</small></a></li>'}).join('')+'</ul>'+(out.length>40?'<p class="hint">'+out.length+' matches; showing 40.</p>':'')}
var t;box.addEventListener('input',function(){clearTimeout(t);t=setTimeout(function(){load().then(run)},120)});box.addEventListener('focus',function(){load()},{once:true});
$('#a-form').addEventListener('submit',function(e){e.preventDefault();load().then(run)})})();