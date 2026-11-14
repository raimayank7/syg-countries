(function(){'use strict';var d=document,S=window.SYG,$=function(s){return d.querySelector(s)};
var ff=$('[data-filter]');if(ff){var rows=[].slice.call(d.querySelectorAll(ff.getAttribute('data-filter')));ff.addEventListener('input',function(){var q=ff.value.trim().toLowerCase();rows.forEach(function(r){r.hidden=!!q&&r.textContent.toLowerCase().indexOf(q)<0})})}
var box=$('#t-in'),res=$('#t-res'),DATA=null;if(!box)return;
function load(){if(DATA)return Promise.resolve();return S.json('/tcpports/data/ports.json').then(function(j){DATA=j})}
function run(){var q=box.value.trim().toLowerCase();if(!q){res.hidden=true;return}var out;
 if(/^\d+$/.test(q)){var n=+q;out=DATA.filter(function(r){return r[0]===n});if(!out.length){res.hidden=false;res.innerHTML='<p class="hint">Port '+S.esc(q)+' has no entry in the IANA registry: it is unassigned or reserved. Programs can still use it by agreement.</p>';return}}
 else{var ws=q.split(/\s+/);out=DATA.filter(function(r){var k=(r[1]+' '+r[2]).toLowerCase();return ws.every(function(w){return k.indexOf(w)>-1})})}
 res.hidden=false;if(!out.length){res.innerHTML='<p class="hint">Nothing matches "'+S.esc(q)+'". Search by number (443) or by name or part of the description (mail, ssh).</p>';return}
 res.innerHTML='<ul class="t-res">'+out.slice(0,40).map(function(r){var h=r[4]?'/tcpports/port/'+r[0]+'/':'/tcpports/range/'+r[5]+'/';return '<li><a href="'+h+'"><span><b>'+r[0]+'</b> '+S.esc(r[1])+'<br><small>'+S.esc(r[2])+'</small></span><small>'+S.esc(r[3])+'</small></a></li>'}).join('')+'</ul>'+(out.length>40?'<p class="hint">'+out.length+' matches; showing 40.</p>':'')}
var t;box.addEventListener('input',function(){clearTimeout(t);t=setTimeout(function(){load().then(run)},120)});box.addEventListener('focus',function(){load()},{once:true});
var fm=$('#t-form');if(fm)fm.addEventListener('submit',function(e){e.preventDefault();load().then(run)})})();