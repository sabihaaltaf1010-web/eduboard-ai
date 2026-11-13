function save(S){DB.set('subjects',S);resetToday();syl()}
function tg(i,j){const S=subs();S[i].chapters[j].done=!S[i].chapters[j].done;save(S)}
function df(i,j,v){const S=subs();S[i].chapters[j].diff=v;save(S)}
function ec(i,j){const S=subs(),n=prompt('Edit chapter name:',S[i].chapters[j].name);if(n&&n.trim()){S[i].chapters[j].name=n.trim();save(S)}}
function dc(i,j){if(!confirm('Delete this chapter?'))return;const S=subs();S[i].chapters.splice(j,1);save(S)}
function ac(i){const n=prompt('Chapter name:');if(!n||!n.trim())return;let d=prompt('Difficulty (Easy / Medium / Hard):','Medium');d=['Easy','Medium','Hard'].find(x=>x.toLowerCase()===(d||'').trim().toLowerCase())||'Medium';const S=subs();S[i].chapters.push({id:uid(),name:n.trim(),diff:d,done:false});save(S)}
function wk(i){const S=subs();S[i].weak=!S[i].weak;save(S)}
function ds(i){if(!confirm('Delete this subject and its chapters?'))return;const S=subs();S.splice(i,1);save(S)}
function addSub(){const n=prompt('Subject name:');if(!n||!n.trim())return;const S=subs();S.push({name:n.trim(),weak:false,chapters:[]});save(S)}
function syl(){const S=subs();
 Shell('<div class="between"><h2>📚 My Syllabus</h2><button class="btn" onclick="addSub()">+ Add Subject</button></div><div class="grid g2">'+S.map((s,i)=>'<div class="card"><div class="between"><h3>'+esc(s.name)+' '+(s.weak?'<span class="tag d">Weak</span>':'')+'</h3><span>'+s.chapters.filter(c=>c.done).length+' / '+s.chapters.length+' Chapters</span></div>'+bar(subP(s))+
 '<div class="mt">'+(s.chapters.map((c,j)=>'<div class="ch"><input type="checkbox" '+(c.done?'checked':'')+' onchange="tg('+i+','+j+')"><span class="'+(c.done?'dn':'')+'">'+(j+1)+'. '+esc(c.name)+'</span><select class="in sm" onchange="df('+i+','+j+',this.value)">'+['Easy','Medium','Hard'].map(x=>'<option '+(c.diff===x?'selected':'')+'>'+x+'</option>').join('')+'</select><button class="ib" onclick="ec('+i+','+j+')">✏️</button><button class="ib" onclick="dc('+i+','+j+')">🗑️</button></div>').join('')||'<p class="mut">No chapters yet.</p>')+'</div>'+
 '<div class="row"><button class="btn o sm" onclick="ac('+i+')">+ Chapter</button><button class="btn o sm" onclick="wk('+i+')">'+(s.weak?'Unmark weak':'Mark weak')+'</button><button class="btn o sm" onclick="ds('+i+')">Delete subject</button></div></div>').join('')+'</div>')}
syl();
