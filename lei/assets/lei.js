(function(){'use strict';var d=document,S=window.SYG,$=function(s){return d.querySelector(s)};
var API='https://api.gleif.org/api/v1/lei-records',H={Accept:'application/vnd.api+json'};
function valid(l){if(l.length!==20||!/^[A-Z0-9]{20}$/.test(l))return false;var r=0,s='';for(var i=0;i<20;i++){var c=l.charCodeAt(i);s+=(c>=65?String(c-55):l.charAt(i))}for(var j=0;j<s.length;j++)r=(r*10+ +s.charAt(j))%97;return r===1}
window.leiValid=valid;
var form=$('#l-form');if(!form)return;var q=$('#l-q'),res=$('#l-res');
function say(h){res.hidden=false;res.innerHTML=h}
function row(a){var e=a.entity,addr=e.legalAddress||{};return '<li><b>'+S.esc(e.legalName.name)+'</b><small><span class="l-code">'+S.esc(a.lei)+'</span> &middot; '+S.esc([addr.city,addr.country].filter(Boolean).join(', '))+' &middot; status: '+S.esc(a.registration.status)+(a.registration.nextRenewalDate?' &middot; renewal due '+S.esc(a.registration.nextRenewalDate.slice(0,10)):'')+'</small>'+
 '<small>Entity status: '+S.esc(e.status||'-')+(e.jurisdiction?' &middot; jurisdiction '+S.esc(e.jurisdiction):'')+(a.registration.initialRegistrationDate?' &middot; first registered '+S.esc(a.registration.initialRegistrationDate.slice(0,10)):'')+(a.registration.managingLou?' &middot; issued by LOU '+S.esc(a.registration.managingLou):'')+'</small>'+
 '<button class="btn sm ghost" type="button" data-copy="'+S.esc(a.lei)+'" data-done="Copied">Copy LEI</button></li>'}
function run(){var v=q.value.trim();if(!v){res.hidden=true;return}var u=v.replace(/\s+/g,'').toUpperCase();
 if(/^[A-Z0-9]{20}$/.test(u)){var ok=valid(u);var head='<p class="'+(ok?'l-ok':'l-bad')+'"><b>'+(ok?'The check digits are correct.':'The check digits do not match: at least one character is wrong.')+'</b> '+(ok?'This only shows that the code is written correctly.':'Check the code against the original.')+'</p>';
  if(!ok)return say(head);say(head+'<p class="hint">Looking it up in GLEIF...</p>');
  fetch(API+'/'+u,{headers:H}).then(function(r){if(r.status===404)return null;if(!r.ok)throw 0;return r.json()}).then(function(j){if(!j)return say(head+'<p>GLEIF has no record of this LEI. It may be mistyped or not issued.</p>');say(head+'<ul class="l-res">'+row(j.data.attributes)+'</ul>')},function(){say(head+'<p class="hint"><b>The GLEIF service could not be reached.</b> Either your connection or GLEIF may be down. Nothing is stored and nothing was lost: try again in a few minutes, or look the entity up on gleif.org.</p>')});return}
 say('<p class="hint">Searching GLEIF...</p>');
 function search(param){return fetch(API+'?filter%5B'+param+'%5D='+encodeURIComponent(v)+'&page%5Bsize%5D=15',{headers:H}).then(function(r){if(!r.ok)throw 0;return r.json()})}
 search('entity.legalName').then(function(j){return j.data.length?j:search('fulltext')}).then(function(j){if(!j.data.length)return say('<p class="hint">GLEIF finds no legal entity for "'+S.esc(v)+'". Try fewer words or the full registered name.</p>');
  say('<p class="hint">'+(j.meta.pagination.total>15?'Showing 15 of '+j.meta.pagination.total+'. Add words to narrow.':j.meta.pagination.total+' result'+(j.meta.pagination.total===1?'':'s'))+'</p><ul class="l-res">'+j.data.map(function(x){return row(x.attributes)}).join('')+'</ul>')},function(){say('<p class="hint"><b>The GLEIF service could not be reached.</b> Either your connection or GLEIF may be down. Nothing is stored and nothing was lost: try again in a few minutes, or look the entity up on gleif.org.</p>')})}
form.addEventListener('submit',function(e){e.preventDefault();run()});
})();