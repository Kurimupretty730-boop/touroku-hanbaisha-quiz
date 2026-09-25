const Q = window.QUIZ_QUESTIONS;
const K = 'touroku720_v1';
const CHAPTER_ORDER = [1, 2, 4, 3, 5];
let S = load();
let cur = null;
let page = 'home';
let pendingExit = null;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function blank(){
  return {progress:{}, modeSessions:{}, savedSessions:[], active:null};
}
function load(){
  try{return Object.assign(blank(), JSON.parse(localStorage.getItem(K)||'{}'));}
  catch{return blank();}
}
function save(){ localStorage.setItem(K, JSON.stringify(S)); }
function rec(id){
  return S.progress[id] || (S.progress[id]={attempts:[], manualWeak:false, manualStatus:null});
}
function effMaster(q){
  const r=S.progress[q.id];
  if(!r) return false;
  if(r.manualStatus==='mastered') return true;
  if(r.manualStatus==='unmastered') return false;
  if(!r.attempts.length) return false;
  const everBad=r.attempts.some(a=>a.type!=='correct');
  let streak=0;
  for(let i=r.attempts.length-1;i>=0&&r.attempts[i].type==='correct';i--) streak++;
  return everBad ? streak>=2 : r.attempts[0].type==='correct';
}
function effWeak(q){
  const r=S.progress[q.id];
  return !!(r && (r.manualWeak || r.attempts.some(a=>a.type!=='correct')));
}
function lastCorrect(q){
  const r=S.progress[q.id];
  return !!(r?.attempts?.length && r.attempts.at(-1).type==='correct');
}
function renderStats(){
  let seen=0,cor=0,w=0,m=0;
  Q.forEach(q=>{
    const r=S.progress[q.id];
    if(r?.attempts?.length){seen++; if(r.attempts.at(-1).type==='correct') cor++;}
    if(effWeak(q)) w++;
    if(effMaster(q)) m++;
  });
  $('#seen').textContent=seen;
  $('#correct').textContent=cor;
  $('#weak').textContent=w;
  $('#mastered').textContent=m;
  $('#pbar').style.width=(seen/720*100)+'%';
}
function chapterName(ch){ return ['','第1章','第2章','第3章','第4章','第5章'][ch]; }
function setPage(p){
  page=p;
  ['home','quiz','listPage'].forEach(x=>$('#'+x).classList.add('hidden'));
  $('#'+p).classList.remove('hidden');
  $('#tabHome').classList.toggle('active',p==='home');
  $('#tabWeak').classList.toggle('active',p==='listPage');
}
function courseKey(type,year,chapter){ return `${type}|${year}|${chapter}`; }
function pool(year='all',chapter='all'){
  return Q.filter(q=>(year==='all'||q.year==year)&&(chapter==='all'||q.chapter==chapter));
}

function renderHome(){
  setPage('home'); renderStats(); $('#scope').textContent='全720問';
  $('#home').innerHTML=`
    <div class="card">
      <h2 style="margin-top:0">学習モード</h2>
      <div class="homegrid">
        <button class="modecard" id="normal"><h3>通常学習</h3><p>年度・章を選んで順番に学習。組み合わせごとの続き位置も保持します。</p></button>
        <button class="modecard" id="parallel"><h3>平行モード</h3><p>同じ章内の同じ問題番号を、令和元〜6年で6問連続して比較します。</p></button>
        <button class="modecard" id="test"><h3>テストモード</h3><p>1年度120問を本番順に解答し、章別正答率と合格基準を表示します。</p></button>
      </div>
    </div>
    <div class="card"><h3 style="margin-top:0">保存した学習</h3><div id="saved"></div></div>`;
  $('#normal').onclick=chooseNormal;
  $('#parallel').onclick=chooseParallel;
  $('#test').onclick=chooseTest;
  renderSaved();
}

function modeName(type){
  return ({normal:'通常',parallel:'平行',test:'テスト',review:'復習'})[type]||type;
}
function savedLabel(a){
  if(a.type==='normal'){
    const y=a.year==='all'?'全年度':`令和${a.year==1?'元':a.year}年度`;
    const c=a.chapter==='all'?'全章':chapterName(+a.chapter);
    return `${y}・${c}`;
  }
  if(a.type==='parallel') return a.chapter==='all'?'全章':chapterName(+a.chapter);
  if(a.type==='test') return `令和${a.year==1?'元':a.year}年度`;
  if(a.type==='review') return a.reviewLabel||'復習';
  return '';
}
function renderSaved(){
  const el=$('#saved');
  if(!S.savedSessions.length){el.innerHTML='<p class="small">保存した学習はありません。</p>';return;}
  el.innerHTML=S.savedSessions.map((s,i)=>`
    <div class="savedRow">
      <button class="listItem savedOpen" data-i="${i}"><b>${modeName(s.type)}｜${esc(s.label||savedLabel(s))}</b><div class="small">${esc(s.positionLabel||'')}</div></button>
      <button class="savedDelete" data-i="${i}" aria-label="削除">削除</button>
    </div>`).join('');
  el.querySelectorAll('.savedOpen').forEach(b=>b.onclick=()=>resumeSaved(+b.dataset.i));
  el.querySelectorAll('.savedDelete').forEach(b=>b.onclick=()=>{
    const i=+b.dataset.i;
    if(confirm('この保存データを削除しますか？')){S.savedSessions.splice(i,1);save();renderSaved();}
  });
}
function selectorCard(title,body){
  $('#home').innerHTML=`<div class="card"><h2>${title}</h2>${body}<div class="savebar"><button class="btn" id="backHome">← 戻る</button><button class="btn primary" id="startMode">開始</button></div></div>`;
  $('#backHome').onclick=renderHome;
}
function chooseNormal(){
  selectorCard('通常学習',`<div class="row"><select id="ySel" class="select"><option value="all">全年度</option>${[1,2,3,4,5,6].map(y=>`<option value="${y}">令和${y===1?'元':y}年度</option>`).join('')}</select><select id="cSel" class="select"><option value="all">全章</option>${CHAPTER_ORDER.map(c=>`<option value="${c}">第${c}章</option>`).join('')}</select></div><p class="small">同じ年度・章の組み合わせは前回位置も保持します。途中状態は別途「保存した学習」に複数保存できます。</p>`);
  $('#startMode').onclick=()=>startNormal($('#ySel').value,$('#cSel').value);
}
function startNormal(y,c){
  const k=courseKey('normal',y,c), arr=pool(y,c);
  let idx=S.modeSessions[k]||0; if(idx>=arr.length) idx=0;
  S.active={type:'normal',year:y,chapter:c,ids:arr.map(q=>q.id),index:idx,key:k,dirty:false};
  save(); showActive();
}
function chooseParallel(){
  selectorCard('平行モード',`<div class="row"><select id="cSel" class="select"><option value="all">全章</option>${CHAPTER_ORDER.map(c=>`<option value="${c}">第${c}章</option>`).join('')}</select></div><p class="small">例：第1章なら「R1章内問1→R2章内問1→…→R6章内問1→R1章内問2…」。</p>`);
  $('#startMode').onclick=()=>startParallel($('#cSel').value);
}
function parallelIds(c){
  const chs=c==='all'?CHAPTER_ORDER:[+c], ids=[];
  chs.forEach(ch=>{
    const max=ch===3?40:20;
    for(let cq=1;cq<=max;cq++) for(let y=1;y<=6;y++){
      const q=Q.find(x=>x.year===y&&x.chapter===ch&&x.chapterQuestion===cq);
      if(q) ids.push(q.id);
    }
  });
  return ids;
}
function startParallel(c){
  S.active={type:'parallel',chapter:c,ids:parallelIds(c),index:0,key:null,dirty:false};
  save();showActive();
}
function chooseTest(){
  selectorCard('テストモード',`<div class="row"><select id="ySel" class="select">${[1,2,3,4,5,6].map(y=>`<option value="${y}">令和${y===1?'元':y}年度</option>`).join('')}</select></div><p class="small">その年度の120問を本番順に出題します。</p>`);
  $('#startMode').onclick=()=>startTest($('#ySel').value);
}
function startTest(y){
  const ids=Q.filter(q=>q.year==y).sort((a,b)=>a.globalNumber-b.globalNumber).map(q=>q.id);
  S.active={type:'test',year:y,ids,index:0,answers:{},dirty:false};
  save();showActive();
}
function findq(id){return Q.find(q=>q.id===id);}
function showActive(){
  setPage('quiz');
  const a=S.active;
  if(!a) return renderHome();
  if(a.index>=a.ids.length){
    if(a.type==='test') return renderTestSummary();
    return finishSession();
  }
  cur=findq(a.ids[a.index]);
  renderQuestion();
}

function splitDisplayQuestion(text){
  const s=String(text??'').replace(/\r/g,'').trim();
  const fw=['１','２','３','４','５'], hw=['1','2','3','4','5'];
  const boundaryPrev=ch=>!ch || /[\s。．.!！?？）」】\]]/.test(ch);
  const isChoiceNext=ch=>!ch || /[\s　（(]/.test(ch);
  function positionsFor(labels){
    const all=[];
    for(let i=0;i<s.length;i++){
      if(s[i]!==labels[0]||!(boundaryPrev(s[i-1])||/[（(]/.test(s[i+1]||''))||!isChoiceNext(s[i+1])) continue;
      const pos=[i];let cursor=i+1,ok=true;
      for(let n=1;n<4;n++){
        let found=-1;
        for(let j=cursor;j<s.length;j++){
          if(s[j]===labels[n]&&(boundaryPrev(s[j-1])||/[（(]/.test(s[j+1]||''))&&isChoiceNext(s[j+1])){found=j;break;}
        }
        if(found<0){ok=false;break;}
        pos.push(found);cursor=found+1;
      }
      if(!ok) continue;
      let fifth=-1;
      for(let j=cursor;j<s.length;j++) if(s[j]===labels[4]&&(boundaryPrev(s[j-1])||/[（(]/.test(s[j+1]||''))&&isChoiceNext(s[j+1])){fifth=j;break;}
      if(fifth>=0) pos.push(fifth);
      all.push(pos);
    }
    return all;
  }
  const seqs=[...positionsFor(fw),...positionsFor(hw)].sort((a,b)=>b[0]-a[0]);
  for(const pos of seqs){
    let stem=s.slice(0,pos[0]).trim();
    const choices=[];
    for(let n=0;n<pos.length;n++){
      const start=pos[n]+1,end=n<pos.length-1?pos[n+1]:s.length;
      const value=s.slice(start,end).trim();
      if(!value){choices.length=0;break;}
      choices.push(value);
    }
    if(choices.length<4) continue;
    let headers=null;
    const hm=stem.match(/(?:^|\n)\s*([ａｂｃｄｅa-e](?:[ \t　]+[ａｂｃｄｅa-e]){1,4})\s*$/i);
    if(hm){headers=hm[1].trim().split(/[ \t　]+/);stem=stem.slice(0,hm.index).trim();}
    return {stem,choices,headers};
  }
  return {stem:s,choices:null,headers:null};
}
function prettyStem(stem){
  let s=String(stem||'').replace(/\r/g,'').trim();
  // a/b/c/d/e の各記述を必ず独立行へ。PDF抽出で直前に改行が落ちた場合にも対応。
  s=s.replace(/[ \t　]*([ａｂｃｄｅ])\s+/g,'\n$1 ');
  s=s.replace(/。(?=(?:\d+(?:\.\d+)?\s*)?mL\s*中)/g,'。\n');
  s=s.replace(/\n{3,}/g,'\n\n').trim();
  // 配合量の羅列は、単位の直後で次の成分名が続く場合のみ改行。
  s=s.replace(/(\d+(?:\.\d+)?\s*(?:mg|g|mL|μg|µg))(?=[ァ-ヶ一-龠々A-Za-z])/g,'$1\n');
  return s;
}
function parseChoiceParts(t,headers){
  if(!headers?.length) return null;
  let parts=String(t).trim().split(/[ \t　]+/).filter(Boolean);
  if(parts.length>headers.length) parts=[...parts.slice(0,headers.length-1),parts.slice(headers.length-1).join(' ')];
  return parts.length===headers.length?parts:null;
}
const CIRCLED=['','①','②','③','④','⑤'];
function choiceReferenceHtml(choices,headers){
  if(!choices?.length) return '';
  return `<div class="choiceReference" aria-label="選択肢一覧">${choices.map((t,i)=>{
    const parts=parseChoiceParts(t,headers);
    if(parts){
      const body=headers.map((h,j)=>`<span class="compactPart"><b>${esc(h)}</b> ${esc(parts[j])}</span>`).join('<span class="compactSep">　</span>');
      return `<div class="choiceRefLine"><b class="refNo">${CIRCLED[i+1]}</b><span>${body}</span></div>`;
    }
    return `<div class="choiceRefLine"><b class="refNo">${CIRCLED[i+1]}</b><span>${esc(t)}</span></div>`;
  }).join('')}</div>`;
}
function answerButtons(count=5){
  return Array.from({length:count},(_,i)=>i+1).map(n=>`<button class="ans" data-n="${n}" aria-label="選択肢${n}">${CIRCLED[n]}</button>`).join('');
}
function scopeName(a){
  if(a.type==='normal') return '通常学習';
  if(a.type==='parallel') return '平行モード';
  if(a.type==='test') return 'テスト';
  if(a.type==='review') return a.reviewLabel||'復習';
  return '';
}
function renderQuestion(){
  const a=S.active,q=cur,r=rec(q.id),disp=splitDisplayQuestion(q.text);
  $('#scope').textContent=scopeName(a);
  const result=a.type==='test'&&a.answers?.[q.id];
  $('#quiz').innerHTML=`<div class="card">
    <div class="meta"><span class="tag">${q.yearLabel}</span><span class="tag">${q.partLabel} 問${q.partNumber}</span><span class="tag">${chapterName(q.chapter)}・章内問${q.chapterQuestion}</span><span class="badge">${a.index+1}/${a.ids.length}</span></div>
    <div class="qtext">${esc(prettyStem(disp.stem))}</div>
    ${choiceReferenceHtml(disp.choices,disp.headers)}
    <div class="answers fixedAnswers" style="--n:${disp.choices?.length||5}">${answerButtons(disp.choices?.length||5)}</div>
    <button class="unknown">わからない</button>
    <div id="result" class="result"></div>
    <div class="manual"><div class="small">手動指定（もう一度押すと解除）</div><div class="manualBtns"><button id="mw" class="weakbtn ${r.manualWeak?'on':''}">★ 弱点</button><button id="mm" class="masterbtn ${r.manualStatus==='mastered'?'on':''}">✓ 定着</button><button id="mu" class="unmasterbtn ${r.manualStatus==='unmastered'?'on':''}">↺ 未定着</button></div></div>
    <div class="controls"><button id="prev" ${a.index===0?'disabled':''}>← 前へ</button><button id="next" class="primary">次へ →</button></div>
    <button id="exit" class="btn" style="width:100%;margin-top:8px">終了・一覧へ戻る</button>
  </div>`;
  $$('.ans').forEach(b=>b.onclick=()=>answer(+b.dataset.n));
  $('.unknown').onclick=()=>answer(null);
  $('#prev').onclick=()=>{a.index--;updateAutoPosition();save();showActive();};
  $('#next').onclick=()=>{a.index++;updateAutoPosition();save();showActive();};
  $('#exit').onclick=()=>requestExit({kind:a.type==='review'?'list':'home',filter:a.reviewFilter||'all'});
  $('#mw').onclick=()=>{r.manualWeak=!r.manualWeak;save();renderStats();renderQuestion();};
  $('#mm').onclick=()=>{r.manualStatus=r.manualStatus==='mastered'?null:'mastered';save();renderStats();renderQuestion();};
  $('#mu').onclick=()=>{r.manualStatus=r.manualStatus==='unmastered'?null:'unmastered';save();renderStats();renderQuestion();};
  if(result) reveal(result.selected,result.correct,result.unknown);
}
function updateAutoPosition(){
  const a=S.active;
  if(a?.type==='normal'&&a.key) S.modeSessions[a.key]=a.index;
}
function answer(n){
  const a=S.active,q=cur,ok=n===q.answer,unk=n===null,r=rec(q.id);
  r.attempts.push({type:unk?'unknown':ok?'correct':'wrong',selected:n,ts:Date.now()});
  if(a.type==='test'){
    a.answers=a.answers||{};
    a.answers[q.id]={selected:n,correct:ok,unknown:unk};
  }
  a.dirty=true;save();renderStats();reveal(n,ok,unk);
}
function reveal(n,ok,unk){
  $$('.ans').forEach(b=>{
    const x=+b.dataset.n;b.disabled=true;
    if(x===cur.answer)b.classList.add('correct');
    else if(!unk&&x===n)b.classList.add('wrong');
    else b.classList.add('dim');
  });
  $('.unknown').disabled=true;
  const res=$('#result');
  res.className='result show '+(unk?'unk':ok?'ok':'ng');
  res.innerHTML=`${unk?'正解：':ok?'⭕ 正解：':'❌ 不正解　正解：'}${CIRCLED[cur.answer]||cur.answer}<div class="explain"><b>解説</b>\n${esc(cur.explanation||'正答番号は公式解答PDFと照合済みです。')}${cur.explanationSource?`<div class="sourceLink"><a href="${cur.explanationSource}" target="_blank" rel="noopener">詳しい解説元（35189.jp）を開く ↗</a></div>`:''}</div>`;
}

function ensureExitModal(){
  if($('#exitModal')) return;
  const d=document.createElement('div');d.id='exitModal';d.className='modal';
  d.innerHTML=`<div class="modalbox"><h2>この学習を終了しますか？</h2><p class="small">回答履歴・弱点指定は常に保存されます。「保存して戻る」は、この位置を「保存した学習」に追加します。</p><div class="exitChoices"><button id="exitSave" class="btn primary">保存して戻る</button><button id="exitNoSave" class="btn">保存せず戻る</button><button id="exitCancel" class="btn">問題に戻る</button></div></div>`;
  document.body.appendChild(d);
  $('#exitSave').onclick=()=>completeExit(true);
  $('#exitNoSave').onclick=()=>completeExit(false);
  $('#exitCancel').onclick=()=>{$('#exitModal').classList.remove('show');pendingExit=null;};
}
function requestExit(destination={kind:'home'}){
  if(!S.active){return goDestination(destination);}
  pendingExit=destination;ensureExitModal();$('#exitModal').classList.add('show');
}
function saveSession(a){
  const snap=JSON.parse(JSON.stringify(a));
  snap.label=savedLabel(a);
  snap.positionLabel=`${Math.min(a.index+1,a.ids.length)}/${a.ids.length}問目から再開`;
  snap.savedAt=Date.now();
  delete snap.fromSaved;
  S.savedSessions.push(snap);
}
function completeExit(doSave){
  const dest=pendingExit||{kind:'home'};
  if(doSave&&S.active) saveSession(S.active);
  updateAutoPosition();
  S.active=null;save();
  $('#exitModal')?.classList.remove('show');pendingExit=null;
  goDestination(dest);
}
function goDestination(dest){
  if(dest?.kind==='list') renderList(dest.filter||'all',dest.chapter||'all');
  else renderHome();
}
function resumeSaved(i){
  const src=S.savedSessions[i];if(!src)return;
  S.active=JSON.parse(JSON.stringify(src));
  S.active.dirty=false;S.active.fromSaved=i;
  save();showActive();
}
function finishSession(){
  S.active=null;save();
  $('#quiz').innerHTML='<div class="card"><h2>完了しました</h2><button class="btn primary" id="done">ホームへ</button></div>';
  $('#done').onclick=renderHome;
}
function renderTestSummary(){
  const a=S.active,items=Q.filter(q=>q.year==a.year),by={};CHAPTER_ORDER.forEach(ch=>by[ch]={n:0,c:0});
  let total=0;items.forEach(q=>{by[q.chapter].n++;if(a.answers?.[q.id]?.correct){by[q.chapter].c++;total++;}});
  const rows=CHAPTER_ORDER.map(ch=>{const x=by[ch],p=x.c/x.n*100,need=Math.max(0,Math.ceil(x.n*.4)-x.c);return`<tr><td>${chapterName(ch)}</td><td>${x.c}/${x.n}</td><td>${p.toFixed(1)}%</td><td>${need?`40%まであと${need}問`:'40%以上'}</td></tr>`;}).join('');
  const need70=Math.max(0,84-total),pass=total>=84&&Object.values(by).every(x=>x.c/x.n>=.4);
  $('#quiz').innerHTML=`<div class="card testSummary"><h2>令和${a.year==1?'元':a.year}年度 結果</h2><p><b>総合 ${total}/120（${(total/120*100).toFixed(1)}%）</b><br>${need70?`70%（84問）まであと${need70}問`:'総合70%以上'}</p><table><tr><th>章</th><th>正解</th><th>率</th><th>基準</th></tr>${rows}</table><h3>${pass?'合格基準クリア':'基準未達'}</h3><p class="small">判定基準：総合70%以上かつ各章40%以上。</p><button class="btn primary" id="done">ホームへ</button></div>`;
  $('#done').onclick=()=>{S.active=null;save();renderHome();};
}

function listMatch(q,f){
  const r=S.progress[q.id];
  if(f==='answered') return !!r?.attempts?.length;
  if(f==='correct') return lastCorrect(q);
  if(f==='weak') return effWeak(q);
  if(f==='mastered') return rec(q.id).manualStatus==='mastered';
  if(f==='unmastered') return rec(q.id).manualStatus==='unmastered';
  return effWeak(q)||rec(q.id).manualStatus;
}
function filterLabel(f){return ({all:'弱点・手動指定',answered:'回答済み',correct:'正解',weak:'弱点',mastered:'定着',unmastered:'未定着'})[f]||'一覧';}
function renderList(initialFilter='all',initialChapter='all'){
  setPage('listPage');renderStats();$('#scope').textContent=filterLabel(initialFilter);
  $('#listPage').innerHTML=`<div class="card"><h2>問題一覧</h2><div class="row"><select id="lf" class="select"><option value="all">弱点・手動指定</option><option value="answered">回答済み</option><option value="correct">正解</option><option value="weak">弱点</option><option value="unmastered">未定着</option><option value="mastered">定着</option></select><select id="lc" class="select"><option value="all">全章</option>${CHAPTER_ORDER.map(c=>`<option value="${c}">第${c}章</option>`).join('')}</select></div><div id="li"></div></div>`;
  $('#lf').value=initialFilter;$('#lc').value=String(initialChapter);
  function draw(){
    const f=$('#lf').value,c=$('#lc').value;
    const arr=Q.filter(q=>(c==='all'||q.chapter==c)&&listMatch(q,f));
    $('#scope').textContent=filterLabel(f);
    $('#li').innerHTML=arr.length?arr.map((q,i)=>`<button class="listItem" data-i="${i}"><b>${q.yearLabel}｜${chapterName(q.chapter)}｜章内問${q.chapterQuestion}</b><div class="small">${esc(q.title)}</div></button>`).join(''):'<p class="small">該当なし</p>';
    $('#li').querySelectorAll('.listItem').forEach(b=>b.onclick=()=>{
      const ids=arr.map(x=>x.id),idx=+b.dataset.i;
      S.active={type:'review',reviewFilter:f,reviewChapter:c,reviewLabel:`${filterLabel(f)}復習`,ids,index:idx,dirty:false};
      save();showActive();
    });
  }
  $('#lf').onchange=draw;$('#lc').onchange=draw;draw();
}
function integrity(){
  const errs=[];if(Q.length!==720)errs.push('問題数');
  if(new Set(Q.map(q=>q.id)).size!==720)errs.push('ID重複');
  Q.forEach(q=>{if(window.OFFICIAL_ANSWER_KEY[q.id]!==q.answer)errs.push(q.id);});
  return errs;
}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function exportData(){
  const b=new Blob([JSON.stringify(S,null,2)],{type:'application/json'}),a=document.createElement('a');
  a.href=URL.createObjectURL(b);a.download='登録販売者720問_進捗.json';a.click();
}
function importData(f){
  const r=new FileReader();r.onload=()=>{try{S=Object.assign(blank(),JSON.parse(r.result));save();renderHome();$('#modal').classList.remove('show');}catch{alert('読み込めません');}};r.readAsText(f);
}
function statDestination(filter){
  const dest={kind:'list',filter};
  if(S.active) requestExit(dest); else goDestination(dest);
}

window.addEventListener('DOMContentLoaded',()=>{
  const e=integrity();
  if(e.length){document.body.innerHTML='<pre>正答データ検証エラー\n'+e.slice(0,20).join('\n')+'</pre>';return;}
  $('#verifyStatus').textContent='✓ 公式解答PDFから作成：720 / 720問。起動時に正答キーを自動照合。';
  $('#tabHome').onclick=()=>S.active?requestExit({kind:'home'}):renderHome();
  $('#tabWeak').onclick=()=>S.active?requestExit({kind:'list',filter:'weak'}):renderList('weak');
  $('#settings').onclick=()=>$('#modal').classList.add('show');
  $('#close').onclick=()=>$('#modal').classList.remove('show');
  $('#reset').onclick=()=>{if(confirm('全記録を消しますか？')){S=blank();save();renderHome();$('#modal').classList.remove('show');}};
  $('#export').onclick=exportData;
  $('#import').onchange=e=>e.target.files[0]&&importData(e.target.files[0]);
  $('#seen').closest('.stat').onclick=()=>statDestination('answered');
  $('#correct').closest('.stat').onclick=()=>statDestination('correct');
  $('#weak').closest('.stat').onclick=()=>statDestination('weak');
  $('#mastered').closest('.stat').onclick=()=>statDestination('mastered');
  $$('.stat').forEach(x=>{x.classList.add('statLink');x.setAttribute('role','button');x.tabIndex=0;});
  renderHome();
  if('serviceWorker'in navigator&&location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
});
