function addNote(key,msg){const n=DB.get('notes',[]);if(n.some(x=>x.key===key))return;n.unshift({key,msg,date:new Date().toLocaleString(),read:false});DB.set('notes',n.slice(0,50));
 if(DB.get('settings',{}).notify&&window.Notification&&Notification.permission==='granted')new Notification('EduBoard AI',{body:msg})}
function syncNotes(){const st=stats(),d=daysLeft(),t=today(),ss=streakNow();
 if(d)addNote('exam'+t,'📅 Your exam is in '+d+' days!');
 addNote('left'+t,'📚 You have '+st.left+' chapters remaining.');
 if(ss)addNote('str'+t,"🔥 Don't break your "+ss+'-day streak!');
 if(d&&st.p<timeUsed()-15)addNote('late'+t,'⚠️ You are behind your study schedule.');
 addNote('upd','📢 A new board update is available (demo).')}
function bell(){const n=DB.get('notes',[]).filter(x=>!x.read).length;document.querySelectorAll('.nb').forEach(e=>{e.textContent=n;e.hidden=!n})}
function toggleND(){const d=$('nd');d.hidden=!d.hidden;d.innerHTML=DB.get('notes',[]).slice(0,4).map(n=>'<p>'+esc(n.msg)+'<br><small class="mut">'+esc(n.date)+'</small></p>').join('')+'<a href="notifications.html"><b>View All →</b></a>'}
