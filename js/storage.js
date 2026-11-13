/* Storage helpers. Per-user keys: eb_<key>_<email>. Replace with a real backend later. */
const GL=['users','settings'],SES=()=>localStorage.getItem('eb_session')||'';
const DB={get(k,d){try{const v=localStorage.getItem('eb_'+k+(GL.includes(k)?'':'_'+SES()));return v===null?d:JSON.parse(v)}catch(e){return d}},
set(k,v){localStorage.setItem('eb_'+k+(GL.includes(k)?'':'_'+SES()),JSON.stringify(v))}};
const $=id=>document.getElementById(id),uid=()=>Math.random().toString(36).slice(2,9);
const ymd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const today=()=>ymd(new Date()),ago=n=>{const d=new Date();d.setDate(d.getDate()-n);return ymd(d)};
const diffDays=(a,b)=>Math.round((new Date(b+'T00:00:00')-new Date(a+'T00:00:00'))/864e5);
const daysLeft=()=>{const e=DB.get('exam',{});return e.date?Math.max(0,diffDays(today(),e.date)):0};
const fmt=d=>new Date(d+'T00:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const session=()=>DB.get('users',[]).find(u=>u.email===SES());
const subs=()=>DB.get('subjects',[]);
const stats=()=>{let t=0,d=0;subs().forEach(s=>s.chapters.forEach(c=>{t++;if(c.done)d++}));return{t,d,left:t-d,p:t?Math.round(d/t*100):0}};
const subP=s=>s.chapters.length?Math.round(s.chapters.filter(c=>c.done).length/s.chapters.length*100):0;
const timeUsed=()=>{const e=DB.get('exam',{});if(!e.date)return 0;const sp=Math.max(diffDays(e.start||today(),e.date),1);return Math.min(100,Math.max(0,Math.round((sp-daysLeft())/sp*100)))};
document.documentElement.dataset.theme=DB.get('settings',{}).theme||'light';
function toggleTheme(){const s=DB.get('settings',{});s.theme=s.theme==='dark'?'light':'dark';DB.set('settings',s);document.documentElement.dataset.theme=s.theme}
const GROUPS={'Pre-Medical':['Physics','Chemistry','Biology','English','Urdu'],'Pre-Engineering':['Physics','Chemistry','Mathematics','English','Urdu'],'Computer Science':['Physics','Mathematics','Computer Science','English','Urdu'],'Commerce':['Accounting','Business Studies','Economics','English','Urdu'],'General Science':['Mathematics','Computer Science','Economics','English','Urdu']};
const SUBJ=['Physics','Chemistry','Biology','Mathematics','Computer Science','English','Urdu','Accounting'];
/* Add more boards here (Sindh, Punjab, KPK...) - the whole UI reads from this list */
const BOARDS=[
{id:'BIEK',name:'BIEK Karachi',full:'Board of Intermediate Education Karachi',icon:'🏛️',url:'https://www.biek.edu.pk',classes:[11,12],desc:'Official board for Karachi intermediate students.'},
{id:'FBISE',name:'Federal Board',full:'Federal Board of Intermediate and Secondary Education',icon:'🏫',url:'https://www.fbise.edu.pk',classes:[9,10,11,12],desc:'SSC and HSSC syllabus, model papers, date sheets and results.'},
{id:'SINDH',name:'Sindh Boards',full:'Other Sindh Boards',icon:'🎓',soon:true,classes:[9,10,11,12],desc:'More Sindh boards will be added soon.'}];
/* DEMO updates only - replace with verified source / API / RSS */
const UPD=[
{t:'Examination schedule notice',b:'BIEK',c:'Announcements',d:'2026-11-12',x:'Sample entry showing how an official announcement appears.'},
{t:'Date sheet published',b:'FBISE',c:'Date Sheets',d:'2026-11-10',x:'Sample entry for an exam date sheet.'},
{t:'Syllabus revision notice',b:'FBISE',c:'Syllabus Updates',d:'2026-11-08',x:'Sample entry for syllabus changes.'},
{t:'Admission & enrolment update',b:'BIEK',c:'Official Notices',d:'2026-11-06',x:'Sample entry for an official notice.'},
{t:'Practical examination guidelines',b:'BIEK',c:'Examination Updates',d:'2026-11-03',x:'Sample entry for examination updates.'},
{t:'Result announcement',b:'FBISE',c:'Results',d:'2026-10-30',x:'Sample entry for results.'}];
const RES=(()=>{const r=[];BOARDS.filter(b=>!b.soon).forEach(b=>b.classes.forEach(c=>SUBJ.forEach(s=>[2025,2024,2023].forEach(y=>['Past Paper','Model Paper'].forEach(t=>r.push({id:(b.id+'-'+c+'-'+s+'-'+y+'-'+t).replace(/ /g,'_'),board:b.id,cls:c,sub:s,year:y,type:t,title:s+' '+t,url:b.url}))))));return r})();
