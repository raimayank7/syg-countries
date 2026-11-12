(function(){'use strict';
var d=document,S=window.SYG,$=function(s){return d.querySelector(s)};
var f=$('[data-filter]');
if(f){var rows=[].slice.call(d.querySelectorAll(f.getAttribute('data-filter'))),none=$('[data-none]');
 f.addEventListener('input',function(){var q=f.value.trim().toLowerCase(),n=0;rows.forEach(function(r){var hit=!q||(r.getAttribute('data-k')||r.textContent).toLowerCase().indexOf(q)>-1;r.hidden=!hit;if(hit)n++});if(none)none.hidden=n>0})}
var form=$('#ib-form');if(!form)return;
var box=$('#ib-in'),res=$('#ib-res'),DATA=null;
var KIND={n:['a digit','digits'],a:['a capital letter','capital letters'],c:['a letter or digit','letters or digits']};
function g4(s){return s.replace(/(.{4})/g,'$1 ').trim()}
function mod97(s){var r=0;for(var i=0;i<s.length;i++){var c=s.charCodeAt(i),v=c>=65?String(c-55):s.charAt(i);for(var j=0;j<v.length;j++)r=(r*10+ +v.charAt(j))%97}return r}
function show(ok,title,html){res.hidden=false;res.className='result rise '+(ok?'ok':'bad');res.innerHTML='<h2>'+title+'</h2>'+html;}
function run(){var raw=box.value,s=raw.toUpperCase().replace(/[\s\-.]/g,'');
 if(!s){res.hidden=true;return}
 if(/[^A-Z0-9]/.test(s))return show(false,'Not a valid IBAN','<p>An IBAN has only letters A to Z and digits 0 to 9. Remove any other character and try again.</p>');
 if(s.length<5||!/^[A-Z]{2}/.test(s))return show(false,'Not a valid IBAN','<p>An IBAN starts with two letters for the country, such as DE or GB, then two check digits.</p>');
 var cc=s.slice(0,2),c=DATA[cc];
 if(!c)return show(false,'Country code '+S.esc(cc)+' is not in the IBAN registry','<p>Either the first two letters are mistyped, or this country does not use IBAN. India, the United States, Canada, Australia, China and Japan, for example, do not issue IBANs. <a href="/iban/countries/">See the countries that use IBAN</a>.</p>');
 if(!/^[0-9]{2}$/.test(s.slice(2,4)))return show(false,'Not a valid IBAN','<p>Characters 3 and 4 must be the two check digits. Here they are "'+S.esc(s.slice(2,4))+'".</p>');
 if(s.length!==c.l)return show(false,'Wrong length for '+S.esc(c.n),'<p>An IBAN of '+S.esc(c.n)+' has <b>'+c.l+'</b> characters. This one has <b>'+s.length+'</b>, so '+(function(n,w){return n+(n===1?' is ':' are ')+w})(Math.abs(c.l-s.length),s.length<c.l?'missing':'extra')+'.</p><p><a href="/iban/country/'+c.u+'/">See the layout for '+S.esc(c.n)+'</a></p>');
 var b=s.slice(4);
 for(var i=0;i<b.length;i++){var k=c.k.charAt(i),ch=b.charAt(i),good=k==='n'?/[0-9]/.test(ch):k==='a'?/[A-Z]/.test(ch):true;
  if(!good)return show(false,'Wrong kind of character','<p>Character '+(i+5)+' of an IBAN of '+S.esc(c.n)+' must be '+KIND[k][0]+', but it is "'+S.esc(ch)+'".</p><p><a href="/iban/country/'+c.u+'/">See the layout for '+S.esc(c.n)+'</a></p>')}
 if(mod97(s.slice(4)+s.slice(0,4))!==1)return show(false,'The check digits do not match','<p>The length and layout are right for '+S.esc(c.n)+', but the check digits say that at least one character is wrong. This is usually a typing mistake: a wrong digit, or two characters swapped. Compare it with the original once more.</p>');
 var parts='<li><b>'+cc+'</b><small>Country</small></li><li><b>'+s.slice(2,4)+'</b><small>Check digits</small></li>';
 c.p.forEach(function(p){parts+='<li><b>'+S.esc(b.slice(p[1],p[2]))+'</b><small>'+S.esc(p[0])+'</small></li>'});
 show(true,'Valid IBAN format','<p class="big" style="font-size:1.15rem">'+g4(s)+'</p><ul class="ib-seg">'+parts+'</ul><dl class="facts"><dt>Country</dt><dd><a href="/iban/country/'+c.u+'/">'+S.esc(c.n)+'</a></dd><dt>Length</dt><dd>'+c.l+' characters</dd><dt>SEPA</dt><dd>'+(c.e?'Yes, in the Single Euro Payments Area':'Not in the Single Euro Payments Area')+'</dd></dl>'+
  '<div class="acts"><button class="btn sm" type="button" data-copy="'+g4(s)+'" data-done="Copied with spaces">Copy with spaces</button><button class="btn sm ghost" type="button" data-copy="'+s+'" data-done="Copied without spaces">Copy without spaces</button></div>'+
  '<p class="hint">This means the IBAN is written correctly. It does not show that the account exists, who owns it, or that it can receive your payment. Confirm the details with the account holder or the bank before sending money.</p>')}
function go(){if(DATA)return run();res.hidden=false;res.className='result';res.innerHTML='<div class="shim"></div>';S.json('/iban/data/iban.json').then(function(j){DATA=j;run()},function(){show(false,'Could not load the checker','<p>Please check your connection and try again.</p>')})}
form.addEventListener('submit',function(e){e.preventDefault();go()});
$('#ib-clear').addEventListener('click',function(){box.value='';res.hidden=true;box.focus()});
[].forEach.call(d.querySelectorAll('[data-try]'),function(b){b.addEventListener('click',function(){box.value=b.getAttribute('data-try');go();box.scrollIntoView({block:'center'})})});
})();