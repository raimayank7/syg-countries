(function(){'use strict';var d=document,S=window.SYG,$=function(s){return d.querySelector(s)};
var ff=$('[data-filter]');if(ff){var rows=[].slice.call(d.querySelectorAll(ff.getAttribute('data-filter')));ff.addEventListener('input',function(){var q=ff.value.trim().toLowerCase();rows.forEach(function(r){r.hidden=!!q&&r.textContent.toLowerCase().indexOf(q)<0})})}
var cv=$('[data-mw]');if(cv){var mw=parseFloat(cv.getAttribute('data-mw')),g=$('#c-g'),m=$('#c-m'),out=$('#c-out');
 function fmt(x){return x>=100?x.toFixed(1):x>=1?x.toFixed(3):x.toPrecision(3)}
 g.addEventListener('input',function(){var v=parseFloat(g.value);if(isNaN(v)){out.textContent='';return}m.value=fmt(v/mw);out.textContent=v+' g is '+fmt(v/mw)+' mol, about '+(v/mw*6.02214076e23).toExponential(3)+' molecules.'});
 m.addEventListener('input',function(){var v=parseFloat(m.value);if(isNaN(v)){out.textContent='';return}g.value=fmt(v*mw);out.textContent=v+' mol weighs '+fmt(v*mw)+' g.'})}
var box=$('#c-in'),res=$('#c-res'),DATA=null;if(!box)return;
function load(){if(DATA)return Promise.resolve();return S.json('/chem/data/chem.json').then(function(j){DATA=j})}
function run(){var q=box.value.trim().toLowerCase();if(!q){res.hidden=true;return}var ws=q.split(/\s+/);
 var out=DATA.filter(function(r){var k=(r[1]+' '+r[2]+' '+r[3]).toLowerCase();return ws.every(function(w){return k.indexOf(w)>-1})});
 res.hidden=false;if(!out.length){res.innerHTML='<p class="hint">No substance matches "'+S.esc(q)+'". Search a name (acetone), a formula (NaCl) or a part of it.</p>';return}
 res.innerHTML='<ul class="c-res">'+out.slice(0,40).map(function(r){return '<li><a href="/chem/compound/'+S.esc(r[0])+'/"><span><b>'+S.esc(r[1])+'</b><br><small>'+S.esc(r[3])+'</small></span><small>'+S.esc(r[2])+' g/mol</small></a></li>'}).join('')+'</ul>'}
var t;box.addEventListener('input',function(){clearTimeout(t);t=setTimeout(function(){load().then(run)},120)});box.addEventListener('focus',function(){load()},{once:true});
var fm=$('#c-form');if(fm)fm.addEventListener('submit',function(e){e.preventDefault();load().then(run)})})();