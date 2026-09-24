const QS=window.QUIZ_QUESTIONS||[];
const KEY='touroku_hanbai_200_progress_v2';
let state=load(); let current=null; let locked=false;
const $=s=>document.querySelector(s);
function blank(){return {version:2,startedAt:Date.now(),mode:'course',year:'all',progress:{},orderIndex:0};}
function load(){try{return {...blank(),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){return blank()}}
function save(){localStorage.setItem(KEY,JSON.stringify(state)); renderStats();}
function rec(id){return state.progress[id]||(state.progress[id]={attempts:0,correct:0,wrong:0,unknown:0,streak:0,everWeak:false,mastered:false,lastSeen:0});}
function isUnanswered(q){return !state.progress[q.id]||!state.progress[q.id].attempts}
function weak(q){const r=state.progress[q.id]; return r&&r.everWeak&&!r.mastered}
function mastered(q){return !!state.progress[q.id]?.mastered}
function visiblePool(){let pool=QS; if(state.year!=='all') pool=pool.filter(q=>String(q.year)===String(state.year)); return pool}
function pick(){const pool=visiblePool(); if(!pool.length)return null;
  if(state.mode==='weak'){
    const w=pool.filter(weak).sort((a,b)=>(state.progress[a.id].lastSeen||0)-(state.progress[b.id].lastSeen||0)); return w[0]||null;
  }
  if(state.mode==='random'){
    const nm=pool.filter(q=>!mastered(q)); const p=nm.length?nm:pool; return p[Math.floor(Math.random()*p.length)];
  }
  // Course: first pass sequentially. After all are seen, repeat weak until mastered.
  const u=pool.find(isUnanswered); if(u)return u;
  const w=pool.filter(weak).sort((a,b)=>(state.progress[a.id].lastSeen||0)-(state.progress[b.id].lastSeen||0)); if(w.length)return w[0];
  return null;
}
function renderStats(){const pool=visiblePool(), seen=pool.filter(q=>!isUnanswered(q)).length, w=pool.filter(weak).length, m=pool.filter(mastered).length;
 $('#seen').textContent=seen; $('#weak').textContent=w; $('#mastered').textContent=m; $('#remain').textContent=pool.length-m;
 $('#pbar').style.width=(pool.length?m/pool.length*100:0)+'%'; $('#scope').textContent=(state.year==='all'?'全200問':`令和${state.year==1?'元':state.year}年度 40問`);
}
function statusTag(q){if(mastered(q))return '<span class="tag master">定着</span>'; if(weak(q))return '<span class="tag weak">弱点</span>'; return '<span class="tag">未定着</span>'}
function renderQuestion(){locked=false; current=pick(); const box=$('#quiz');
 if(!current){box.innerHTML=`<div class="card empty"><h2>${state.mode==='weak'?'弱点問題はありません':'🎉 この範囲は完了です'}</h2><p>${state.mode==='weak'?'間違い・「わからない」の問題が出ると、ここに追加されます。':'全問回答済みで、弱点も定着済みです。'}</p></div>`; renderStats(); return;}
 const q=current, r=state.progress[q.id];
 box.innerHTML=`<div class="card"><div class="meta"><span class="tag">${q.yearLabel}</span><span class="tag">午後 問${q.number}</span>${statusTag(q)}${r?`<span class="tag">挑戦 ${r.attempts}回</span>`:''}</div><div class="qtext"></div><div class="answers ${q.choiceCount===4?'four':''}"></div><button class="unknown">わからない</button><div class="result" id="result"></div><button class="next" id="next">次の問題へ</button></div>`;
 $('.qtext').textContent=q.text;
 const a=$('.answers'); for(let i=1;i<=q.choiceCount;i++){const b=document.createElement('button');b.className='ans';b.textContent=i;b.dataset.n=i;b.onclick=()=>answer(i,b);a.appendChild(b)}
 $('.unknown').onclick=unknown; $('#next').onclick=renderQuestion; renderStats(); window.scrollTo({top:0,behavior:'instant'});
}
function reveal(chosen,type){const q=current,res=$('#result'), buttons=[...document.querySelectorAll('.ans')]; buttons.forEach(b=>{const n=+b.dataset.n;if(n===q.answer)b.classList.add('correct');else if(type==='wrong'&&n===chosen)b.classList.add('wrong');else b.classList.add('dim')}); $('.unknown').disabled=true;
 if(type==='correct'){res.className='result show ok';res.innerHTML=`⭕ 正解：${q.answer}<div class="subresult">${rec(q.id).everWeak?'弱点問題は2回連続正解で定着です。':'初見正解なので定着扱いです。'}</div>`}
 if(type==='wrong'){res.className='result show ng';res.innerHTML=`❌ 不正解　正解：${q.answer}<div class="subresult">弱点として記録しました。あとで自動的に反復します。</div>`}
 if(type==='unknown'){res.className='result show unk';res.innerHTML=`正解：${q.answer}<div class="subresult">「わからない」として弱点に記録しました。あとで自動的に反復します。</div>`}
 $('#next').classList.add('show');
}
function answer(n){if(locked)return;locked=true;const r=rec(current.id);r.attempts++;r.lastSeen=Date.now(); if(n===current.answer){r.correct++;r.streak++; if(!r.everWeak || r.streak>=2)r.mastered=true; reveal(n,'correct')}else{r.wrong++;r.streak=0;r.everWeak=true;r.mastered=false;reveal(n,'wrong')} save();}
function unknown(){if(locked)return;locked=true;const r=rec(current.id);r.attempts++;r.unknown++;r.streak=0;r.everWeak=true;r.mastered=false;r.lastSeen=Date.now();reveal(null,'unknown');save();}
function setMode(v){state.mode=v;save();renderQuestion()}
function setYear(v){state.year=v;save();renderQuestion()}
function openSettings(){document.querySelector('#modal').classList.add('show')}
function closeSettings(){document.querySelector('#modal').classList.remove('show')}
function resetAll(){if(confirm('200問すべての学習記録をリセットしますか？')){state=blank();save();syncControls();renderQuestion();closeSettings()}}
function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='登録販売者_午後200問_進捗.json';a.click();URL.revokeObjectURL(a.href)}
function importData(file){const fr=new FileReader();fr.onload=()=>{try{const x=JSON.parse(fr.result);if(!x.progress)throw 0;state={...blank(),...x};save();syncControls();renderQuestion();closeSettings();alert('進捗を読み込みました。')}catch(e){alert('進捗ファイルを読み込めませんでした。')}};fr.readAsText(file)}
function syncControls(){$('#mode').value=state.mode;$('#year').value=state.year}
window.addEventListener('DOMContentLoaded',()=>{syncControls();$('#mode').onchange=e=>setMode(e.target.value);$('#year').onchange=e=>setYear(e.target.value);$('#settings').onclick=openSettings;$('#close').onclick=closeSettings;$('#reset').onclick=resetAll;$('#export').onclick=exportData;$('#import').onchange=e=>e.target.files[0]&&importData(e.target.files[0]);renderQuestion(); if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});});
