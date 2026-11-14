(function(){'use strict';var d=document,S=window.SYG,$=function(s){return d.querySelector(s)};
var f=$('[data-filter]');if(f){var rows=[].slice.call(d.querySelectorAll(f.getAttribute('data-filter')));f.addEventListener('input',function(){var q=f.value.trim().toLowerCase();rows.forEach(function(r){r.hidden=!!q&&r.textContent.toLowerCase().indexOf(q)<0})})}
var form=$('#p-form');if(!form)return;var cs=$('#p-cc'),q=$('#p-q'),res=$('#p-res'),IDX=null,cache={};
function norm(s){return s.toUpperCase().replace(/[^A-Z0-9]/g,'')}
function say(h){res.hidden=false;res.innerHTML=h}
function idx(){return IDX?Promise.resolve(IDX):S.json('/postcodes/data/pc/index.json').then(function(j){IDX=j;return j})}
function shard(cc,code){var m=IDX[cc];if(!m)return null;if(!m.s)return cc;var k=norm(code).slice(0,m.s);return k.length<m.s?null:cc+'-'+k}
function getf(name){return cache[name]?Promise.resolve(cache[name]):S.json('/postcodes/data/pc/'+name+'.json').then(function(j){cache[name]=j;return j})}
function row(r,regs,cc){return '<li><span><b>'+S.esc(r[0])+'</b><small>'+S.esc(r[1])+(r[2]!==''?', '+S.esc(regs[r[2]]):'')+'</small></span><button class="btn sm ghost" type="button" data-copy="'+S.esc(r[0])+'" data-done="Copied">Copy</button></li>'}
function run(){var cc=cs.value,v=q.value.trim();if(!cc||!v)return say('<p class="hint">Choose a country and type a postal code or a place name.</p>');
 idx().then(function(){var isCode=/\d/.test(v)||(IDX[cc]&&IDX[cc].s&&v.length<=6&&!/\s/.test(v)&&/^[A-Za-z]{1,2}\d/.test(v)),name=isCode?shard(cc,v):(IDX[cc]&&!IDX[cc].s?cc:null);
  if(!IDX[cc])return say('<p class="hint">No data for this country.</p>');
  if(!name)return say('<p class="hint">'+(isCode?'Type at least '+IDX[cc].s+' characters of the code.':'This country has too many places to search by name. Search by postal code instead, or open a region page.')+'</p>');
  getf(name).then(function(j){var k=norm(v),out=[];
   if(isCode){j.c.forEach(function(r){if(norm(r[0]).indexOf(k)===0)out.push(r)})}else{var w=v.toLowerCase();j.c.forEach(function(r){if((r[1]||'').toLowerCase().indexOf(w)>-1)out.push(r)})}
   if(!out.length)return say('<p class="hint">Nothing found for "'+S.esc(v)+'". Check the spelling, or see the <a href="/postcodes/country/'+S.esc(IDX[cc].u)+'/">format and regions for this country</a>.</p>');
   say('<h2>'+out.length+' result'+(out.length===1?'':'s')+'</h2><ul class="p-res">'+out.slice(0,60).map(function(r){return row(r,j.r,cc)}).join('')+'</ul>'+(out.length>60?'<p class="hint">Showing the first 60. Type more of the code or name.</p>':'')+'<p class="hint">Data: GeoNames (CC BY 4.0). Codes can cover several places; check with the postal service for an exact address.</p>')},function(){say('<p class="hint">Could not load the data. Check your connection.</p>')})})}
form.addEventListener('submit',function(e){e.preventDefault();run()});
})();