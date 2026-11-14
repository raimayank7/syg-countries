(function(){'use strict';var d=document,S=window.SYG,$=function(s){return d.querySelector(s)};
var fi=$('[data-filter]');if(fi){var rows=[].slice.call(d.querySelectorAll(fi.getAttribute('data-filter')));fi.addEventListener('input',function(){var q=fi.value.trim().toLowerCase();rows.forEach(function(r){r.hidden=!!q&&r.textContent.toLowerCase().indexOf(q)<0})})}
var sel=$('#p-reg');if(!sel)return;var R=null;
function money(v,sym){return sym+v.toLocaleString('en',{minimumFractionDigits:2,maximumFractionDigits:2})}
function load(){if(R)return Promise.resolve();return S.json('/powerrates/data/rates.json').then(function(j){R=j;var g={};j.forEach(function(r,i){(g[r[3]]=g[r[3]]||[]).push('<option value="'+i+'">'+S.esc(r[0])+'</option>')});
 sel.innerHTML=Object.keys(g).map(function(k){return '<optgroup label="'+S.esc(k)+'">'+g[k].join('')+'</optgroup>'}).join('');var q=(location.search.match(/[?&]r=([^&]+)/)||[])[1];if(q){for(var i=0;i<j.length;i++)if(j[i][4]===q)sel.value=i}})}
function run(){if(!R)return;var r=R[+sel.value],p=r[1],sym=r[2],k=parseFloat($('#p-kwh').value),w=parseFloat($('#p-w').value),h=parseFloat($('#p-h').value),o='';
 o+='<p>Price used: <b>'+sym+p.toFixed(4)+' per kWh</b> ('+S.esc(r[5])+').</p>';
 if(k>=0)o+='<p>'+k.toLocaleString('en')+' kWh a month at this price: <b>'+money(k*p,sym)+'</b> a month, '+money(k*p*12,sym)+' a year (energy only; real bills add fixed charges).</p>';
 if(w>=0&&h>=0){var e=w/1000*h*30;o+='<p>A '+w+' W appliance used '+h+' hours a day uses about '+e.toFixed(1)+' kWh a month and costs about <b>'+money(e*p,sym)+'</b> a month, '+money(e*p*12,sym)+' a year.</p>'}
 $('#p-out').innerHTML=o}
['#p-reg','#p-kwh','#p-w','#p-h'].forEach(function(s){$(s).addEventListener('input',run);$(s).addEventListener('change',run)});load().then(run)})();