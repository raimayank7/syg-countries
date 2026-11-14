(function(){'use strict';var d=document,S=window.SYG,$=function(s){return d.querySelector(s)};
var fi=$('[data-filter]');if(fi){var rows=[].slice.call(d.querySelectorAll(fi.getAttribute('data-filter')));fi.addEventListener('input',function(){var q=fi.value.trim().toLowerCase();rows.forEach(function(r){r.hidden=!!q&&r.textContent.toLowerCase().indexOf(q)<0})})}
var box=$('#u-in'),res=$('#u-res'),DATA=null;if(!box)return;
function load(){if(DATA)return Promise.resolve();return S.json('/universities/data/u.json').then(function(j){DATA=j})}
function run(){var q=box.value.trim().toLowerCase();if(!q){res.hidden=true;return}var ws=q.split(/\s+/);
 var out=DATA.u.filter(function(r){var k=(r[0]+' '+r[2]+' '+DATA.c[r[1]][0]).toLowerCase();return ws.every(function(w){return k.indexOf(w)>-1})});
 res.hidden=false;if(!out.length){res.innerHTML='<p class="hint">Nothing matches "'+S.esc(q)+'". Try a part of the name, the town or the country.</p>';return}
 out.sort(function(a,b){return (b[3]?1:0)-(a[3]?1:0)});
 res.innerHTML='<ul class="u-res">'+out.slice(0,40).map(function(r){var inner='<span><b>'+S.esc(r[0])+'</b><br><small>'+S.esc([r[2],DATA.c[r[1]][0]].filter(Boolean).join(', '))+'</small></span>';
  return '<li>'+(r[3]?'<a href="/universities/u/'+r[3]+'/">'+inner+'</a>':'<a href="/universities/country/'+DATA.c[r[1]][1]+'/">'+inner+'<small>list</small></a>')+'</li>'}).join('')+'</ul>'+(out.length>40?'<p class="hint">'+out.length+' matches; showing 40.</p>':'')}
var t;box.addEventListener('input',function(){clearTimeout(t);t=setTimeout(function(){load().then(run)},120)});box.addEventListener('focus',function(){load()},{once:true});
$('#u-form').addEventListener('submit',function(e){e.preventDefault();load().then(run)})})();