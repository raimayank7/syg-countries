(function(){'use strict';var d=document,S=window.SYG,$=function(s){return d.querySelector(s)};
var fi=$('[data-filter]');if(fi){var rows=[].slice.call(d.querySelectorAll(fi.getAttribute('data-filter')));fi.addEventListener('input',function(){var q=fi.value.trim().toLowerCase();rows.forEach(function(r){r.hidden=!!q&&r.textContent.toLowerCase().indexOf(q)<0})})}
var box=$('#i-in'),out=$('#i-out');if(!box)return;var V4=null,V6=null,P=null;
function get(u){return S.json(u)}
function need(six){var a=[];if(!P)a.push(get('/ipranges/data/meta.json').then(function(j){P=j}));
 if(six&&!V6)a.push(get('/ipranges/data/v6.json').then(function(j){V6=j}));if(!six&&!V4)a.push(get('/ipranges/data/v4.json').then(function(j){var s=[],e=0;for(var i=0;i<j.g.length;i++){e+=j.g[i];s.push(e);e+=j.n[i]}j.s=s;V4=j}));return Promise.all(a)}
function dt(n){n=String(n);return n.length===8?n.slice(0,4)+'-'+n.slice(4,6)+'-'+n.slice(6):'date not given'}
function ip4(t){var m=t.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);if(!m)return null;var x=0;for(var i=1;i<5;i++){var o=+m[i];if(o>255)return null;x=x*256+o}return x}
function ip6(t){if(!/^[0-9a-fA-F:.]+$/.test(t)||t.indexOf(':')<0)return null;var v4=t.match(/(\d+\.\d+\.\d+\.\d+)$/);if(v4){var q=ip4(v4[1]);if(q===null)return null;t=t.slice(0,t.length-v4[1].length)+(Math.floor(q/65536)).toString(16)+':'+(q%65536).toString(16)}
 var h=t.split('::');if(h.length>2)return null;var a=h[0]?h[0].split(':'):[],b=h.length===2&&h[1]?h[1].split(':'):[];if(h.length===1&&a.length!==8)return null;if(h.length===2&&a.length+b.length>7)return null;
 var mid=[];if(h.length===2)for(var i=0;i<8-a.length-b.length;i++)mid.push('0');var all=a.concat(mid,b);if(all.length!==8)return null;
 for(var j=0;j<8;j++){if(!/^[0-9a-fA-F]{1,4}$/.test(all[j]))return null}return BigInt('0x'+all.map(function(p){return('0000'+p).slice(-4)}).join(''))}
function find4(x){var s=V4.s,lo=0,hi=s.length-1,k=-1;while(lo<=hi){var m=(lo+hi)>>1;if(s[m]<=x){k=m;lo=m+1}else hi=m-1}
 if(k<0||x>=s[k]+V4.n[k])return null;return k}
function find6(x){var s=V6.s,lo=0,hi=s.length-1,k=-1;while(lo<=hi){var m=(lo+hi)>>1;if(BigInt('0x'+s[m])<=x){k=m;lo=m+1}else hi=m-1}
 if(k<0)return null;var p=V6.p[k],st=BigInt('0x'+s[k]);if((x>>BigInt(128-p))!==(st>>BigInt(128-p)))return null;return k}
function card(cc,reg,date,range,extra){var c=P.cc[cc];var link=c[2]?'<a href="/ipranges/country/'+c[2]+'/">'+S.esc(c[1])+'</a>':S.esc(c[1]);
 return '<div class="i-res"><p><b>First allocated to: '+link+'</b></p><p>Block: <span class="i-cidr">'+S.esc(range)+'</span><br>Registry that listed it: '+S.esc(P.rir[reg])+'<br>Allocation date: '+S.esc(dt(date))+(extra||'')+'</p>'+
 '<p class="hint">This says where the block was <i>first allocated</i>. It does not say where the address is used now, and one block can serve users in many countries.</p></div>'}
function run(){var t=box.value.trim();if(!t){out.hidden=true;return}out.hidden=false;
 var a=ip4(t);if(a!==null){need(false).then(function(){var k=find4(a);if(k===null){out.innerHTML='<p class="hint">'+S.esc(t)+' is not in any block that the registries list as allocated or assigned to a country. It may be unassigned, reserved, or a private or special-use address (see the guides).</p>';return}
  var n=V4.n[k],s=V4.s[k];var e=s+n-1;function q(v){return[v>>>24,(v>>>16)&255,(v>>>8)&255,v&255].join('.')}
  out.innerHTML=card(V4.c[k],V4.r[k],V4.d[k],q(s)+' to '+q(e)+' ('+n.toLocaleString('en')+' addresses)')});return}
 var b=ip6(t);if(b!==null){need(true).then(function(){var k=find6(b);if(k===null){out.innerHTML='<p class="hint">'+S.esc(t)+' is not in any IPv6 block that the registries list as allocated or assigned to a country.</p>';return}
  var pre=BigInt('0x'+V6.s[k]);var h=pre.toString(16);while(h.length<32)h='0'+h;var g=[];for(var i=0;i<8;i++)g.push(h.slice(i*4,i*4+4).replace(/^0+(?=.)/,''));
  out.innerHTML=card(V6.c[k],V6.r[k],V6.d[k],g.join(':').replace(/(^|:)(0(:0)+)(:|$)/,'::')+'/'+V6.p[k])});return}
 out.innerHTML='<p class="hint">That does not look like an IP address. Examples: 8.8.8.8 or 2001:4860:4860::8888.</p>'}
box.addEventListener('focus',function(){need(false)},{once:true});$('#i-form').addEventListener('submit',function(e){e.preventDefault();run()});
var qs=(location.search.match(/[?&]ip=([^&]+)/)||[])[1];if(qs){box.value=decodeURIComponent(qs);run()}})();