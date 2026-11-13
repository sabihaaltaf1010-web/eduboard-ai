const LOGO='<svg width="56" height="56" viewBox="0 0 64 64"><path d="M32 6 6 18l26 12 26-12z" fill="#7c5cff"/><path d="M16 26v10c0 5 8 9 16 9s16-4 16-9V26l-16 8z" fill="#3b82f6"/><path d="M10 54h44" stroke="#22d3ee" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="50" r="3" fill="#22d3ee"/></svg>';
const NAV=[['dashboard','🏠','Dashboard'],['syllabus','📚','My Syllabus'],['ai-planner','🤖','AI Study Planner'],['papers','📝','Papers & Resources'],['boards','🏛️','Boards'],['updates','📢','Board Updates'],['progress','📊','Progress'],['notifications','🔔','Notifications'],['settings','⚙️','Settings']];
const bar=p=>'<div class="bar"><i style="width:'+p+'%"></i></div>';
const ring=(p,inner)=>'<div class="ring" style="--p:'+p+'"><div>'+inner+'</div></div>';
function logout(){localStorage.removeItem('eb_session');location.href='login.html'}
function build(){const u=session();if(!u){location.replace('login.html');return false}
 if(!DB.get('exam',{}).date){location.replace('onboarding.html');return false}
 syncNotes();const pg=document.body.dataset.page;
 document.body.innerHTML='<aside class="side" id="side"><div class="logo">'+LOGO+'<b>EduBoard AI</b><small>Smart Board Exam Assistant</small></div>'+
 NAV.map(n=>'<a href="'+n[0]+'.html" class="'+(pg===n[0]?'on':'')+'">'+n[1]+' '+n[2]+(n[0]==='notifications'?'<span class="badge nb"></span>':'')+'</a>').join('')+
 '<a href="#" onclick="logout();return false">🚪 Logout</a><div class="cheer">🏆<br><b>You Can Do It!</b><br><small>Keep Studying! ✨</small></div></aside>'+
 '<div class="main"><div class="top"><button class="ham" onclick="$(\'side\').classList.toggle(\'open\')">☰</button><div class="sw"><input class="in" placeholder="🔍 Search anything..." oninput="search(this.value)"><div class="dd" id="sr" hidden></div></div>'+
 '<button class="ic" onclick="toggleTheme()" title="Light/Dark">🌗</button><div class="sw"><button class="ic" onclick="toggleND()">🔔<span class="badge nb"></span></button><div class="dd nd" id="nd" hidden></div></div>'+
 '<a href="settings.html" class="me">👩‍🎓 <b>Hello, '+esc(u.name.split(' ')[0])+'! 👋</b></a></div><div id="view"></div></div>'+chatHTML();return true}
function Shell(html){let v=$('view');if(!v){if(!build())return;v=$('view')}v.innerHTML=html;bell()}
function search(v){const r=$('sr'),q=v.trim().toLowerCase();if(!q){r.hidden=true;return}const o=[];
 subs().forEach(s=>{if(s.name.toLowerCase().includes(q))o.push(['📚',s.name,'Subject','syllabus.html']);s.chapters.forEach(c=>{if(c.name.toLowerCase().includes(q))o.push(['📖',s.name+' – '+c.name,'Chapter','syllabus.html'])})});
 RES.filter(x=>(x.title+' '+x.year+' '+x.board).toLowerCase().includes(q)).slice(0,5).forEach(x=>o.push(['📝',x.title+' '+x.year+' ('+x.board+' Class '+x.cls+')',x.type,'papers.html?q='+encodeURIComponent(q)]));
 UPD.filter(x=>(x.t+' '+x.c+' '+x.b).toLowerCase().includes(q)).forEach(x=>o.push(['📢',x.t,'Update','updates.html']));
 r.innerHTML=o.slice(0,10).map(x=>'<a href="'+x[3]+'">'+x[0]+' '+esc(x[1])+' <small class="mut">'+x[2]+'</small></a>').join('')||'<p class="mut">No results</p>';r.hidden=false}
