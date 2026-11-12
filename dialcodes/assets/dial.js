(function(){'use strict';
var d=document,S=window.SYG,$=function(s,r){return (r||d).querySelector(s)};
/* local time in a zone, for "is it a good time to call" */
function clock(){[].forEach.call(d.querySelectorAll('[data-tz]'),function(el){try{el.textContent=new Intl.DateTimeFormat('en-IN',{timeZone:el.getAttribute('data-tz'),weekday:'short',hour:'numeric',minute:'2-digit',hour12:true}).format(new Date())}catch(e){el.textContent='not available on this device'}})}
if($('[data-tz]')){clock();setInterval(clock,30000)}

/* filter a table or list as you type */
var f=$('[data-filter]');
if(f){var rows=[].slice.call(d.querySelectorAll(f.getAttribute('data-filter'))),none=$('[data-none]');
 f.addEventListener('input',function(){var q=f.value.trim().toLowerCase().replace(/^\+|^0+/,''),n=0;rows.forEach(function(r){var k=(r.getAttribute('data-k')||r.textContent).toLowerCase(),hit=!q||(/^[0-9]+$/.test(q)?k.split(' ').some(function(t){return t.replace(/^\+|^0+/,'').indexOf(q)===0}):k.indexOf(q)>-1);r.hidden=!hit;if(hit)n++});if(none)none.hidden=n>0})}

/* home search: countries, codes, Indian places */
var box=$('#dc-q');
if(box){var out=$('#dc-out'),C=null,P=null,want=false;
 var load=function(){if(want)return;want=true;S.json('/dialcodes/data/countries.json').then(function(j){C=j;run()});S.json('/dialcodes/data/std.json').then(function(j){P=j;run()})};
 var run=function(){var raw=box.value.trim(),q=raw.toLowerCase();if(!q){out.innerHTML='';return}if(!C){out.innerHTML='<div class="shim"></div>';return}
  var num=q.replace(/[^0-9]/g,''),isNum=/^[+0-9\s-]+$/.test(q),h='',n=0;
  if(isNum&&num){var code=num.replace(/^00/,'');
   var hit=C.filter(function(c){return (c[1]+(c[3]||''))===code||c[1]===code});
   if(!hit.length){for(var L=Math.min(7,code.length);L>0&&!hit.length;L--){var pre=code.slice(0,L);hit=C.filter(function(c){return (c[1]+(c[3]||''))===pre});if(!hit.length)hit=C.filter(function(c){return c[1]===pre&&!c[3]})}}
   hit.slice(0,30).forEach(function(c){n++;h+='<li><a href="/dialcodes/country/'+c[2]+'/">'+S.esc(c[0])+' <span>+'+c[1]+(c[3]?' '+c[3]:'')+'</span></a></li>'});
   if(P){var std=num.replace(/^0+/,'');P.filter(function(p){return p[1]===std}).slice(0,20).forEach(function(p){n++;h+='<li><a href="/dialcodes/india/'+p[2]+'/">'+S.esc(p[0])+', India <span>0'+p[1]+'</span></a></li>'})}
  }else{
   C.filter(function(c){return c[0].toLowerCase().indexOf(q)>-1}).sort(function(a,b){return a[0].toLowerCase().indexOf(q)-b[0].toLowerCase().indexOf(q)}).slice(0,12).forEach(function(c){n++;h+='<li><a href="/dialcodes/country/'+c[2]+'/">'+S.esc(c[0])+' <span>+'+c[1]+(c[3]?' '+c[3]:'')+'</span></a></li>'});
   if(P&&q.length>1)P.filter(function(p){return p[0].toLowerCase().indexOf(q)>-1}).sort(function(a,b){return a[0].toLowerCase().indexOf(q)-b[0].toLowerCase().indexOf(q)}).slice(0,18).forEach(function(p){n++;h+='<li><a href="/dialcodes/india/'+p[2]+'/">'+S.esc(p[0])+', India <span>0'+p[1]+'</span></a></li>'});
  }
  out.innerHTML=n?'<ul class="dc-list">'+h+'</ul>':'<p class="dc-empty">Nothing found for "'+S.esc(raw)+'". Try a country name, a code like 44, or an Indian town.</p>'};
 box.addEventListener('focus',load);box.addEventListener('input',function(){load();run()});if(box.value)load()}

/* WhatsApp link maker */
var wf=$('#wa-form');
if(wf){var sel=$('#wa-c'),numEl=$('#wa-n'),msg=$('#wa-m'),res=$('#wa-res');
 try{var last=localStorage.getItem('dc-wa-c');if(last)sel.value=last}catch(e){}
 var make=function(){var o=sel.options[sel.selectedIndex],cc=o.getAttribute('data-cc'),np=o.getAttribute('data-np'),n=numEl.value.replace(/[^0-9+]/g,'');
  if(!numEl.value.trim()){res.hidden=true;return}
  var full;
  if(n.charAt(0)==='+')full=n.slice(1).replace(/\+/g,'');
  else{n=n.replace(/\+/g,'');if(n.indexOf('00')===0&&n.length>11)full=n.slice(2);else{if(np&&cc!=='1'&&n.indexOf(np)===0)n=n.slice(np.length);if(cc==='1'&&n.length===11&&n.charAt(0)==='1')n=n.slice(1);full=cc+n}}
  if(full.length<7||full.length>15){res.hidden=false;res.innerHTML='<h2>Check the number</h2><p>A full international number has 7 to 15 digits with the country code. This one has '+full.length+'.</p>';return}
  var url='https://wa.me/'+full+(msg.value.trim()?'?text='+encodeURIComponent(msg.value.trim()):'');
  try{localStorage.setItem('dc-wa-c',sel.value)}catch(e){}
  res.hidden=false;res.innerHTML='<h2>Your WhatsApp link</h2><p class="big" style="font-size:1.1rem">'+S.esc(url)+'</p><dl class="facts"><dt>Number in international format</dt><dd>+'+full+'</dd></dl><div class="acts"><button class="btn" type="button" data-copy="'+S.esc(url)+'" data-done="Link copied">Copy link</button><a class="btn ghost" href="'+S.esc(url)+'" target="_blank" rel="noopener">Open chat</a><button class="btn ghost" type="button" data-copy="+'+full+'" data-done="Number copied">Copy number</button></div><p class="hint">The link opens a chat only if this number uses WhatsApp.</p>'};
 wf.addEventListener('submit',function(e){e.preventDefault();make()});}
})();