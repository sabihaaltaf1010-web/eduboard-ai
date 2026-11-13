const enc=s=>btoa(unescape(encodeURIComponent(s))); /* demo only: use a real backend + hashing in production */
function msg(t,ok){const m=$('msg');if(m){m.textContent=t;m.style.color=ok?'#16a34a':'#ef4444'}return false}
function signup(e){e.preventDefault();const d=Object.fromEntries(new FormData(e.target));d.email=d.email.trim().toLowerCase();
 if(d.pw.length<6)return msg('Password must be at least 6 characters');if(d.pw!==d.confirm)return msg('Passwords do not match');
 const us=DB.get('users',[]);if(us.some(u=>u.email===d.email))return msg('This email is already registered');
 us.push({name:d.name.trim(),email:d.email,pw:enc(d.pw),board:d.board,cls:d.cls,group:''});DB.set('users',us);localStorage.setItem('eb_session',d.email);location.href='onboarding.html'}
function login(e){e.preventDefault();const d=Object.fromEntries(new FormData(e.target)),u=DB.get('users',[]).find(x=>x.email===d.email.trim().toLowerCase()&&x.pw===enc(d.pw));
 if(!u)return msg('Invalid email or password');localStorage.setItem('eb_session',u.email);location.href=DB.get('exam',{}).date?'dashboard.html':'onboarding.html'}
function forgot(e){e.preventDefault();const d=Object.fromEntries(new FormData(e.target)),us=DB.get('users',[]),u=us.find(x=>x.email===d.email.trim().toLowerCase());
 if(!u)return msg('No account found with this email');if(d.pw.length<6)return msg('Password must be at least 6 characters');u.pw=enc(d.pw);DB.set('users',us);msg('Password updated. You can log in now.',1)}
let OS=1;
const boxS=s=>'<label class="chk"><input type="checkbox" name="sub" value="'+esc(s)+'" checked> '+esc(s)+'</label>';
const picked=()=>[...document.querySelectorAll('[name=sub]:checked')].map(x=>x.value);
function obInit(){if(!session()){location.replace('login.html');return}$('grp').innerHTML=Object.keys(GROUPS).map(g=>'<option>'+g+'</option>').join('');gSubs()}
function gSubs(){$('sb').innerHTML=GROUPS[$('grp').value].map(boxS).join('')}
function addCustom(){const v=$('cs').value.trim();if(!v)return;$('sb').insertAdjacentHTML('beforeend',boxS(v));$('cs').value=''}
function obNav(d){
 if(d>0){if(OS===1&&!picked().length)return msg('Select at least one subject');
  if(OS===2){if(!$('ed').value||diffDays(today(),$('ed').value)<1)return msg('Choose a future exam date');if(!(+$('dh').value>0&&+$('dh').value<=16))return msg('Daily hours must be 1-16')}
  if(OS===3)for(let i=0;i<picked().length;i++){const t=+$('t'+i).value,k=+$('d'+i).value;if(!(t>=1&&k>=0&&k<=t))return msg('Check chapter numbers: completed cannot exceed total')}
  if(OS===4)return obDone()}
 msg('');OS=Math.min(4,Math.max(1,OS+d));
 if(d>0&&OS===3)$('chs').innerHTML=picked().map((s,i)=>'<div class="between"><b>'+esc(s)+'</b><span>Total <input type="number" class="in sm" min="1" max="40" value="8" id="t'+i+'" style="width:70px"> Done <input type="number" class="in sm" min="0" value="0" id="d'+i+'" style="width:70px"></span></div>').join('');
 if(d>0&&OS===4)$('wk').innerHTML=picked().map(s=>'<label class="chk"><input type="checkbox" name="weak" value="'+esc(s)+'"> '+esc(s)+'</label>').join('');
 for(let i=1;i<=4;i++)$('s'+i).hidden=i!==OS;$('pg').style.width=OS*25+'%';$('nx').textContent=OS===4?'Finish ✓':'Next';$('bk').style.visibility=OS===1?'hidden':'visible'}
function obDone(){const names=picked(),weak=[...document.querySelectorAll('[name=weak]:checked')].map(x=>x.value);
 const S=names.map((n,i)=>{const t=Math.floor(+$('t'+i).value),k=Math.floor(+$('d'+i).value);return{name:n,weak:weak.includes(n),chapters:Array.from({length:t},(_,j)=>({id:uid(),name:'Chapter '+(j+1),diff:'Medium',done:j<k}))}});
 DB.set('subjects',S);DB.set('exam',{date:$('ed').value,hours:+$('dh').value,time:$('pt').value,start:today()});DB.set('tasks',{});
 const us=DB.get('users',[]),u=us.find(x=>x.email===SES());u.group=$('grp').value;DB.set('users',us);location.href='dashboard.html'}
