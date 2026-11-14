(function(){'use strict';var d=document,S=window.SYG,$=function(s){return d.querySelector(s)};
var ff=$('[data-filter]');if(ff){var rows=[].slice.call(d.querySelectorAll(ff.getAttribute('data-filter')));ff.addEventListener('input',function(){var q=ff.value.trim().toLowerCase();rows.forEach(function(r){r.hidden=!!q&&r.textContent.toLowerCase().indexOf(q)<0})})}
var box=$('#n-in'),res=$('#n-res'),DATA=null;if(!box)return;
function load(){if(DATA)return Promise.resolve();return S.json('/naics/data/naics.json').then(function(j){DATA=j})}
function run(){var q=box.value.trim().toLowerCase();if(!q){res.hidden=true;return}var digits=/^[0-9]+$/.test(q),ws=q.split(/\s+/),out;
 if(digits)out=DATA.filter(function(r){return r[0].indexOf(q)===0}).slice(0,60);else out=DATA.filter(function(r){var k=r[1].toLowerCase();return ws.every(function(w){return k.indexOf(w)>-1})});
 if(!digits)out.sort(function(a,b){function sc(r){var k=r[1].toLowerCase();return (k.indexOf(q)===0?0:(' '+k).indexOf(' '+q)>-1&&k.indexOf('except')<0?1:2)*1000+k.length}return sc(a)-sc(b)});
 var seen={},list=[];out.forEach(function(r){var k=r[2]+'|'+r[0];if(!seen[k]){seen[k]=1;list.push(r)}});
 res.hidden=false;if(!list.length){res.innerHTML='<p class="hint">Nothing matches "'+S.esc(q)+'". Try a simpler word, for example "bakery" or "software", or the first digits of a code.</p>';return}
 res.innerHTML='<ul class="n-res">'+list.slice(0,40).map(function(r){return '<li><a href="'+S.esc(r[3])+'"><b class="n-code">'+S.esc(r[0])+'</b> '+S.esc(r[1])+(r[2]?'<br><small>'+S.esc(r[2])+'</small>':'')+'</a></li>'}).join('')+'</ul>'+(list.length>40?'<p class="hint">'+list.length+' matches; showing 40.</p>':'')}
var t;box.addEventListener('input',function(){clearTimeout(t);t=setTimeout(function(){load().then(run)},150)});box.addEventListener('focus',function(){load()},{once:true});
var fm=$('#n-form');if(fm)fm.addEventListener('submit',function(e){e.preventDefault();load().then(run)})})();