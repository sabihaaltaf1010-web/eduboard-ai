const WT={Easy:1,Medium:1.5,Hard:2};
function buildPlan(){
 const S=subs(),dl=daysLeft(),dm=(DB.get('exam',{}).hours||2)*60;if(!dl)return[];
 const rev=dl>4?Math.max(3,Math.ceil(dl*.15)):0,sd=Math.max(dl-rev,1);
 const lists=S.map(s=>s.chapters.filter(c=>!c.done).map(c=>({sub:s.name,cid:c.id,text:c.name,w:(WT[c.diff]||1.5)*(s.weak?1.3:1)})));
 const items=[];for(let i=0;lists.some(l=>i<l.length);i++)lists.forEach(l=>{if(l[i])items.push(l[i])});
 const tw=items.reduce((a,x)=>a+x.w,0),cap=sd*dm;
 items.forEach(x=>{x.left=Math.min(180,Math.max(10,Math.round(x.w/tw*cap/5)*5))});
 const days=[],q=items.slice();
 for(let i=0;i<sd;i++){let c=dm;const t=[];
  while(c>0&&q.length){const x=q[0],u=Math.min(c,x.left);x.left-=u;c-=u;t.push({sub:x.sub,cid:x.cid,text:x.text,min:u,last:x.left<=0});if(x.left<=0)q.shift()}
  if(!t.length)t.push({text:'Extra practice: solve a past paper',min:dm});days.push({tasks:t})}
 if(q.length){const t=days[days.length-1].tasks;q.forEach(x=>t.push({sub:x.sub,cid:x.cid,text:x.text,min:x.left,last:true}))}
 const wk=S.filter(s=>s.weak).map(s=>s.name),focus=wk.length?wk:S.map(s=>s.name);
 for(let i=0;i<rev;i++)days.push({rev:true,tasks:[{text:'Revision: '+(focus[i%focus.length]||'all subjects'),min:Math.round(dm*.4)},{text:'Past paper practice',min:Math.round(dm*.35)},{text:'Model paper / weak topics',min:Math.round(dm*.25)}]});
 days.forEach((d,i)=>{const x=new Date();x.setDate(x.getDate()+i);d.date=ymd(x)});return days}
const mkTask=x=>({id:uid(),sub:x.sub||'',cid:x.cid||null,last:x.last!==false,text:x.text,min:x.min,done:false});
function ensureToday(){let t=DB.get('tasks',{});if(t.date!==today()){const p=buildPlan()[0];t={date:today(),items:(p?p.tasks:[]).map(mkTask)};DB.set('tasks',t)}return t}
function resetToday(){const t=ensureToday(),keep=t.items.filter(i=>i.done),p=buildPlan()[0];t.items=keep.concat((p?p.tasks:[]).map(mkTask).filter(n=>!keep.some(k=>k.cid&&k.cid===n.cid)));DB.set('tasks',t)}
function toggleTask(i){const t=ensureToday(),it=t.items[i];if(!it)return;it.done=!it.done;
 if(it.cid&&it.last){const S=subs(),s=S.find(x=>x.name===it.sub),c=s&&s.chapters.find(c=>c.id===it.cid);if(c){c.done=it.done;DB.set('subjects',S)}}
 DB.set('tasks',t);const h=DB.get('hist',{});h[today()]=t.items.filter(x=>x.done).length;DB.set('hist',h);updStreak(t)}
function updStreak(t){const s=DB.get('streak',{cur:0,best:0,last:''});
 if(t.items.length&&t.items.every(x=>x.done)){if(s.last!==today()){s.cur=s.last===ago(1)?s.cur+1:1;s.last=today();s.best=Math.max(s.best,s.cur)}}
 else if(s.last===today()){s.cur=Math.max(s.cur-1,0);s.last=s.cur?ago(1):''}
 DB.set('streak',s)}
const streakNow=()=>{const s=DB.get('streak',{cur:0,best:0,last:''});return s.last===today()||s.last===ago(1)?s.cur:0};
const fmtMin=m=>m>=60?Math.floor(m/60)+'h'+(m%60?' '+m%60+'m':''):m+' min';
