(function(){'use strict';
var d=document,S=window.SYG,$=function(s){return d.querySelector(s)};
var box=$('#u-in'),res=$('#u-res'),DATA=null,B=null;
function glyph(cp,gc){return (gc==='Cc'||gc==='Cf'||gc==='Zs'||gc==='Zl'||gc==='Zp')?'<span class="u-none">&middot;&middot;&middot;</span>':(gc==='Mn'||gc==='Mc'||gc==='Me'?'\u25cc':'')+S.esc(String.fromCodePoint(cp))}
function hex(cp){var h=cp.toString(16).toUpperCase();while(h.length<4)h='0'+h;return 'U+'+h}
function cap(s){return s.replace(/(^|[ -])([a-z])/g,function(m,a,b){return a+b.toUpperCase()})}
function row(r){var cp=r[0],name=cap(r[1]||'control'),u=r[3]?'<a href="/unicode/char/'+cp.toString(16).padStart(4,'0')+'/">'+S.esc(name)+'</a>':S.esc(name);
 return '<li><span class="u-g">'+glyph(cp,r[2])+'</span><span class="grow"><b>'+u+'</b><small>'+hex(cp)+' &middot; '+S.esc(DATA.g[r[2]]||r[2])+'</small></span>'+(r[2]!=='Cc'&&r[2]!=='Zl'&&r[2]!=='Zp'?'<button class="u-cp" type="button" data-copy="'+S.esc(String.fromCodePoint(cp))+'" data-done="Copied">Copy</button>':'')+'</li>'}
function words(q){return q.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)}
function find(q){q=q.trim();if(!q)return null;
 var out=[],m;
 if((m=q.match(/^(?:u\+|0x|\\u|&#x|#x)?([0-9a-f]{2,6});?$/i))&&/^(u\+|0x|\\u|&#x|#x)/i.test(q)||/^u\+[0-9a-f]+$/i.test(q)){var cp=parseInt(m[1],16),h=DATA.byCp[cp];if(h)out.push(h)}
 if(!out.length&&/^&#\d+;?$/.test(q)){var cp2=parseInt(q.replace(/\D/g,''),10),h2=DATA.byCp[cp2];if(h2)out.push(h2)}
 if(!out.length){var chars=Array.from(q);if(chars.length<=3&&!/^[A-Za-z0-9 ]+$/.test(q)){chars.forEach(function(c){var h=DATA.byCp[c.codePointAt(0)];if(h&&out.indexOf(h)<0)out.push(h)});if(out.length)return out}}
 if(out.length)return out;
 var w=words(q);if(!w.length)return [];
 var scored=[];DATA.c.forEach(function(r){var n=r[1],s=0,i;for(i=0;i<w.length;i++){var k=n.indexOf(w[i]);if(k<0)return;s+=(k===0||n.charAt(k-1)===' ')?0:1}
  scored.push([s*1000+n.length,r])});
 scored.sort(function(a,b){return a[0]-b[0]});return scored.slice(0,60).map(function(x){return x[1]})}
function run(){var q=box.value;if(!q.trim()){res.hidden=true;return}
 var r=find(q);res.hidden=false;
 if(!r.length){res.innerHTML='<p class="hint">Nothing found for "'+S.esc(q)+'". Try a part of the name in English (for example "heart" or "arrow"), a code such as U+2665, or paste the character itself.</p>';return}
 res.innerHTML='<ul class="u-res">'+r.map(row).join('')+'</ul>'+(r.length>=60?'<p class="hint">Showing the first 60. Add a word to narrow the list.</p>':'')}
function load(){if(DATA)return Promise.resolve();return S.json('/unicode/data/u.json').then(function(j){j.byCp={};j.c.forEach(function(r){j.byCp[r[0]]=r});DATA=j})}
if(box){var t;box.addEventListener('input',function(){clearTimeout(t);t=setTimeout(function(){load().then(run,function(){res.hidden=false;res.innerHTML='<p class="hint">Could not load the character list. Please check your connection.</p>'})},150)});
 box.addEventListener('focus',function(){load()},{once:true});
 var form=$('#u-form');if(form)form.addEventListener('submit',function(e){e.preventDefault();load().then(run)});
 [].forEach.call(d.querySelectorAll('[data-try]'),function(b){b.addEventListener('click',function(){box.value=b.getAttribute('data-try');load().then(run)})})}
})();