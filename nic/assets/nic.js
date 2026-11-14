(function(){'use strict';var d=document,S=window.SYG,$=function(s){return d.querySelector(s)};
var ff=$('[data-filter]');if(ff){var rows=[].slice.call(d.querySelectorAll(ff.getAttribute('data-filter')));ff.addEventListener('input',function(){var q=ff.value.trim().toLowerCase();rows.forEach(function(r){r.hidden=!!q&&r.textContent.toLowerCase().indexOf(q)<0})})}
var box=$('#n-in'),res=$('#n-res'),DATA=null;if(!box)return;
function load(){if(DATA)return Promise.resolve();return S.json('/nic/data/nic.json').then(function(j){DATA=j})}
function run(){var q=box.value.trim().toLowerCase();if(!q){res.hidden=true;return}var digits=/^[0-9]+$/.test(q),ws=q.split(/\s+/),out;
 out=digits?DATA.filter(function(r){return r[0].indexOf(q)===0}):DATA.filter(function(r){var k=r[1].toLowerCase();return ws.every(function(w){return k.indexOf(w)>-1})});
 if(!digits)out.sort(function(a,b){function sc(r){var k=r[1].toLowerCase();return (k.indexOf(q)===0?0:1)*1000+k.length}return sc(a)-sc(b)});
 res.hidden=false;if(!out.length){res.innerHTML='<p class="hint">Nothing matches "'+S.esc(q)+'". Try a simpler word, such as "rice", "software" or "restaurant", or the first digits of a code.</p>';return}
 res.innerHTML='<ul class="n-res">'+out.slice(0,40).map(function(r){return '<li><a href="'+S.esc(r[2])+'"><b class="n-code">'+S.esc(r[0])+'</b> '+S.esc(r[1])+'</a></li>'}).join('')+'</ul>'+(out.length>40?'<p class="hint">'+out.length+' matches; showing 40.</p>':'')}
var t;box.addEventListener('input',function(){clearTimeout(t);t=setTimeout(function(){load().then(run)},150)});box.addEventListener('focus',function(){load()},{once:true});
var fm=$('#n-form');if(fm)fm.addEventListener('submit',function(e){e.preventDefault();load().then(run)})})();