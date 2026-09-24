const Q=window.QUIZ_QUESTIONS,K='touroku720_v1';let S=load(),cur=null,page='home';const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];function blank(){return{progress:{},modeSessions:{},savedSessions:[],active:null}}function load(){try{return Object.assign(blank(),JSON.parse(localStorage.getItem(K)||'{}'))}catch{return blank()}}function save(){localStorage.setItem(K,JSON.stringify(S))}function rec(id){return S.progress[id]||(S.progress[id]={attempts:[],manualWeak:false,manualStatus:null})}function effMaster(q){let r=S.progress[q.id];if(!r)return false;if(r.manualStatus==='mastered')return true;if(r.manualStatus==='unmastered')return false;if(!r.attempts.length)return false;let everBad=r.attempts.some(a=>a.type!=='correct'),streak=0;for(let i=r.attempts.length-1;i>=0&&r.attempts[i].type==='correct';i--)streak++;return everBad?streak>=2:r.attempts[0].type==='correct'}function effWeak(q){let r=S.progress[q.id];return !!(r&&(r.manualWeak||r.attempts.some(a=>a.type!=='correct')))}function renderStats(){let seen=0,cor=0,w=0,m=0;Q.forEach(q=>{let r=S.progress[q.id];if(r?.attempts?.length){seen++;if(r.attempts.at(-1).type==='correct')cor++}if(effWeak(q))w++;if(effMaster(q))m++});$('#seen').textContent=seen;$('#correct').textContent=cor;$('#weak').textContent=w;$('#mastered').textContent=m;$('#pbar').style.width=(seen/720*100)+'%'}function chapterName(ch){return ['','第1章','第2章','第3章','第4章','第5章'][ch]}function setPage(p){page=p;['home','quiz','listPage'].forEach(x=>$('#'+x).classList.add('hidden'));$('#'+p).classList.remove('hidden');$('#tabHome').classList.toggle('active',p==='home');$('#tabWeak').classList.toggle('active',p==='listPage')}function courseKey(type,year,chapter){return`${type}|${year}|${chapter}`}function pool(year='all',chapter='all'){return Q.filter(q=>(year==='all'||q.year==year)&&(chapter==='all'||q.chapter==chapter))}function currentIndexKey(type,year,chapter){return courseKey(type,year,chapter)}
function renderHome(){setPage('home');renderStats();const h=$('#home');h.innerHTML=`<div class="card"><h2 style="margin-top:0">学習モード</h2><div class="homegrid"><button class="modecard" id="normal"><h3>通常学習</h3><p>年度・章を選んで順番に学習。各組み合わせごとに続きから再開できます。</p></button><button class="modecard" id="parallel"><h3>平行モード</h3><p>同じ章内の同じ問題番号を、令和元〜6年で6問連続して比較します。</p></button><button class="modecard" id="test"><h3>テストモード</h3><p>1年度120問を本番順に解答し、最後に章別正答率と合格基準を表示します。</p></button></div></div><div class="card"><h3 style="margin-top:0">保存した学習</h3><div id="saved"></div></div>`;$('#normal').onclick=()=>chooseNormal();$('#parallel').onclick=()=>chooseParallel();$('#test').onclick=()=>chooseTest();renderSaved()}
function renderSaved(){let el=$('#saved');if(!S.savedSessions.length){el.innerHTML='<p class="small">保存した学習はありません。</p>';return}el.innerHTML=S.savedSessions.map((s,i)=>`<button class="listItem" data-i="${i}"><b>${s.type==='parallel'?'平行':'テスト'}｜${s.label}</b><div class="small">${s.positionLabel||''}</div></button>`).join('');el.querySelectorAll('.listItem').forEach(b=>b.onclick=()=>resumeSaved(+b.dataset.i))}
function selectorCard(title,body){$('#home').innerHTML=`<div class="card"><h2>${title}</h2>${body}<div class="savebar"><button class="btn" id="backHome">← 戻る</button><button class="btn primary" id="startMode">開始</button></div></div>`;$('#backHome').onclick=renderHome}
function chooseNormal(){selectorCard('通常学習',`<div class="row"><select id="ySel" class="select"><option value="all">全年度</option>${[1,2,3,4,5,6].map(y=>`<option value="${y}">令和${y===1?'元':y}年度</option>`).join('')}</select><select id="cSel" class="select"><option value="all">全章</option>${[1,2,3,4,5].map(c=>`<option value="${c}">第${c}章</option>`).join('')}</select></div><p class="small">同じ年度・章の組み合わせは、前回の続きから再開します。</p>`);$('#startMode').onclick=()=>startNormal($('#ySel').value,$('#cSel').value)}
function startNormal(y,c){let k=currentIndexKey('normal',y,c),idx=S.modeSessions[k]||0,arr=pool(y,c);if(idx>=arr.length)idx=0;S.active={type:'normal',year:y,chapter:c,ids:arr.map(q=>q.id),index:idx,key:k};save();showActive()}
function chooseParallel(){selectorCard('平行モード',`<div class="row"><select id="cSel" class="select"><option value="all">全章</option>${[1,2,3,4,5].map(c=>`<option value="${c}">第${c}章</option>`).join('')}</select></div><p class="small">例：第1章なら「R1の章内問1→R2の章内問1→…→R6の章内問1→R1の章内問2…」。</p>`);$('#startMode').onclick=()=>startParallel($('#cSel').value)}
function parallelIds(c){let ps=c==='all'?Q:Q.filter(q=>q.chapter==c),chs=c==='all'?[1,2,3,4,5]:[+c],ids=[];chs.forEach(ch=>{let max=ch===3?40:20;for(let cq=1;cq<=max;cq++)for(let y=1;y<=6;y++){let q=Q.find(x=>x.year===y&&x.chapter===ch&&x.chapterQuestion===cq);if(q)ids.push(q.id)}});return ids}
function startParallel(c){let ids=parallelIds(c);S.active={type:'parallel',chapter:c,ids,index:0,key:null,dirty:false};save();showActive()}
function chooseTest(){selectorCard('テストモード',`<div class="row"><select id="ySel" class="select">${[1,2,3,4,5,6].map(y=>`<option value="${y}">令和${y===1?'元':y}年度</option>`).join('')}</select></div><p class="small">その年度の120問を本番順に出題します。途中保存は終了時に選べます。</p>`);$('#startMode').onclick=()=>startTest($('#ySel').value)}
function startTest(y){let ids=Q.filter(q=>q.year==y).sort((a,b)=>a.globalNumber-b.globalNumber).map(q=>q.id);S.active={type:'test',year:y,ids,index:0,answers:{},dirty:false};save();showActive()}
function findq(id){return Q.find(q=>q.id===id)}function showActive(){setPage('quiz');let a=S.active;if(!a)return renderHome();if(a.index>=a.ids.length){if(a.type==='test')return renderTestSummary();return finishSession()}cur=findq(a.ids[a.index]);renderQuestion()}

function splitDisplayQuestion(text){
  const s=String(text??'').replace(/\r/g,'');
  const labels=['１','２','３','４','５'];
  const isNextOk=(ch)=>ch==='（'||ch==='('||ch===' '||ch==='　'||ch==='\t';
  const candidates=[];
  for(let i=0;i<s.length;i++){
    if(s[i]==='１' && isNextOk(s[i+1]||'')) candidates.push(i);
  }
  // 後ろ側にある「1→2→3→4→5」の並びを選択肢ブロックとして採用。
  // 「15歳」「昭和35年」等の本文中の数字は、直後が空白/括弧ではないため候補外。
  for(let ci=candidates.length-1;ci>=0;ci--){
    const pos=[candidates[ci]];
    let cursor=pos[0]+1, ok=true;
    for(let n=1;n<labels.length;n++){
      let found=-1;
      for(let j=cursor;j<s.length;j++){
        if(s[j]===labels[n] && isNextOk(s[j+1]||'')){
          const prev=s[j-1]||'';
          // 選択肢番号は通常、空白・改行・閉じ括弧などの後に現れる。
          if(j===0 || /[\s）)。」]/.test(prev)){ found=j; break; }
        }
      }
      if(found<0){ok=false;break}
      pos.push(found);cursor=found+1;
    }
    if(!ok) continue;
    // 選択肢ブロックが本文末尾に近いケースだけを採用して誤分割を避ける。
    if(pos[0] < s.length*0.18) continue;
    let stem=s.slice(0,pos[0]).trim();
    const choices=[];
    for(let n=0;n<5;n++){
      const start=pos[n]+1;
      const end=n<4?pos[n+1]:s.length;
      choices.push(s.slice(start,end).trim());
    }
    if(choices.every(Boolean)){
      // 組合せ表（a b c / a b c d など）は、見出しを本文から外して
      // 各選択肢内で「a 値 / b 値 / c 値」の形に再構成する。
      let headers=null;
      const hm=stem.match(/(?:^|\n)\s*([ａｂｃｄｅ](?:[ \t　]+[ａｂｃｄｅ]){1,4})\s*$/);
      if(hm){
        headers=hm[1].trim().split(/[ \t　]+/);
        stem=stem.slice(0,hm.index).trim();
      }
      return {stem,choices,headers};
    }
  }
  return {stem:s.trim(),choices:null,headers:null};
}

function formatChoice(t,headers){
  if(!headers?.length) return `<span class="choiceLabel">${esc(t)}</span>`;
  let parts=String(t).trim().split(/[ \t　]+/).filter(Boolean);
  // 通常は列数と一致。列内に空白がある場合は、余った語を最後の列へまとめる。
  if(parts.length>headers.length){
    parts=[...parts.slice(0,headers.length-1),parts.slice(headers.length-1).join(' ')];
  }
  if(parts.length!==headers.length) return `<span class="choiceLabel">${esc(t)}</span>`;
  return `<span class="choiceMatrix">${headers.map((h,i)=>`<span class="choiceCell"><b>${esc(h)}</b><span>${esc(parts[i])}</span></span>`).join('')}</span>`;
}

function renderQuestion(){let a=S.active,q=cur,r=rec(q.id),disp=splitDisplayQuestion(q.text);$('#scope').textContent=a.type==='normal'?'通常学習':a.type==='parallel'?'平行モード':'テスト';let result=a.type==='test'&&a.answers[q.id];let answerHtml=disp.choices?disp.choices.map((t,i)=>`<button class="ans choiceAns" data-n="${i+1}"><span class="choiceNo">${i+1}</span>${formatChoice(t,disp.headers)}</button>`).join(''):[1,2,3,4,5].map(n=>`<button class="ans" data-n="${n}">${n}</button>`).join('');$('#quiz').innerHTML=`<div class="card"><div class="meta"><span class="tag">${q.yearLabel}</span><span class="tag">${q.partLabel} 問${q.partNumber}</span><span class="tag">${chapterName(q.chapter)}・章内問${q.chapterQuestion}</span><span class="badge">${a.index+1}/${a.ids.length}</span></div><div class="qtext">${esc(disp.stem)}</div><div class="answers ${disp.choices?'choiceList':''}">${answerHtml}</div><button class="unknown">わからない</button><div id="result" class="result"></div><div class="manual"><div class="small">手動指定（もう一度押すと解除）</div><div class="manualBtns"><button id="mw" class="weakbtn ${r.manualWeak?'on':''}">★ 弱点</button><button id="mm" class="masterbtn ${r.manualStatus==='mastered'?'on':''}">✓ 定着</button><button id="mu" class="unmasterbtn ${r.manualStatus==='unmastered'?'on':''}">↺ 未定着</button></div></div><div class="controls"><button id="prev" ${a.index===0?'disabled':''}>← 前へ</button><button id="next" class="primary">次へ →</button></div><button id="exit" class="btn" style="width:100%;margin-top:8px">終了してホームへ</button></div>`;$$('.ans').forEach(b=>b.onclick=()=>answer(+b.dataset.n));$('.unknown').onclick=()=>answer(null);$('#prev').onclick=()=>{a.index--;save();showActive()};$('#next').onclick=()=>{a.index++;if(a.type==='normal')S.modeSessions[a.key]=a.index;save();showActive()};$('#exit').onclick=exitActive;$('#mw').onclick=()=>{r.manualWeak=!r.manualWeak;save();renderStats();renderQuestion()};$('#mm').onclick=()=>{r.manualStatus=r.manualStatus==='mastered'?null:'mastered';save();renderStats();renderQuestion()};$('#mu').onclick=()=>{r.manualStatus=r.manualStatus==='unmastered'?null:'unmastered';save();renderStats();renderQuestion()};if(result)reveal(result.selected,result.correct,result.unknown)}
function answer(n){let a=S.active,q=cur,ok=n===q.answer,unk=n===null;r=rec(q.id);r.attempts.push({type:unk?'unknown':ok?'correct':'wrong',selected:n,ts:Date.now()});if(a.type==='test')a.answers[q.id]={selected:n,correct:ok,unknown:unk};a.dirty=true;save();renderStats();reveal(n,ok,unk)}
function reveal(n,ok,unk){$$('.ans').forEach(b=>{let x=+b.dataset.n;b.disabled=true;if(x===cur.answer)b.classList.add('correct');else if(!unk&&x===n)b.classList.add('wrong');else b.classList.add('dim')});$('.unknown').disabled=true;let res=$('#result');res.className='result show '+(unk?'unk':ok?'ok':'ng');res.innerHTML=`${unk?'正解：':ok?'⭕ 正解：':'❌ 不正解　正解：'}${cur.answer}<div class="explain"><b>解説</b>\n${esc(cur.explanation||'正答番号は公式解答PDFと照合済みです。')}${cur.explanationSource?`<div class="sourceLink"><a href="${cur.explanationSource}" target="_blank" rel="noopener">詳しい解説元（35189.jp）を開く ↗</a></div>`:''}</div>`}
function exitActive(){let a=S.active;if(!a)return renderHome();if((a.type==='parallel'||a.type==='test')&&a.dirty){if(confirm('この途中経過を「保存した学習」に記憶しますか？'))saveSession(a)}if(a.type==='normal'&&a.key)S.modeSessions[a.key]=a.index;S.active=null;save();renderHome()}
function saveSession(a){let label=a.type==='parallel'?(a.chapter==='all'?'全章':chapterName(+a.chapter)):`令和${a.year==1?'元':a.year}年度`;S.savedSessions.push(JSON.parse(JSON.stringify({...a,label,positionLabel:`${a.index+1}/${a.ids.length}問目から再開`})))}function resumeSaved(i){S.active=S.savedSessions.splice(i,1)[0];save();showActive()}
function finishSession(){S.active=null;save();$('#quiz').innerHTML='<div class="card"><h2>完了しました</h2><button class="btn primary" id="done">ホームへ</button></div>';$('#done').onclick=renderHome}
function renderTestSummary(){let a=S.active,items=Q.filter(q=>q.year==a.year),by={};[1,2,3,4,5].forEach(ch=>by[ch]={n:0,c:0});let total=0;items.forEach(q=>{by[q.chapter].n++;if(a.answers[q.id]?.correct){by[q.chapter].c++;total++}});let rows=[1,2,3,4,5].map(ch=>{let x=by[ch],p=x.c/x.n*100,need=Math.max(0,Math.ceil(x.n*.4)-x.c);return`<tr><td>${chapterName(ch)}</td><td>${x.c}/${x.n}</td><td>${p.toFixed(1)}%</td><td>${need?`40%まであと${need}問`:'40%以上'}</td></tr>`}).join('');let need70=Math.max(0,84-total),pass=total>=84&&Object.values(by).every(x=>x.c/x.n>=.4);$('#quiz').innerHTML=`<div class="card testSummary"><h2>令和${a.year==1?'元':a.year}年度 結果</h2><p><b>総合 ${total}/120（${(total/120*100).toFixed(1)}%）</b><br>${need70?`70%（84問）まであと${need70}問`:'総合70%以上'}</p><table><tr><th>章</th><th>正解</th><th>率</th><th>基準</th></tr>${rows}</table><h3>${pass?'合格基準クリア':'基準未達'}</h3><p class="small">判定基準：総合70%以上かつ各章40%以上。</p><button class="btn primary" id="done">ホームへ</button></div>`;$('#done').onclick=()=>{S.active=null;save();renderHome()}}
function renderList(){setPage('listPage');let items=Q.filter(q=>effWeak(q)||rec(q.id).manualStatus);$('#listPage').innerHTML=`<div class="card"><h2>弱点・手動指定一覧</h2><div class="row"><select id="lf" class="select"><option value="all">すべて</option><option value="weak">弱点</option><option value="unmastered">未定着</option><option value="mastered">定着</option></select><select id="lc" class="select"><option value="all">全章</option>${[1,2,3,4,5].map(c=>`<option value="${c}">第${c}章</option>`).join('')}</select></div><div id="li"></div></div>`;function draw(){let f=$('#lf').value,c=$('#lc').value,arr=Q.filter(q=>(c==='all'||q.chapter==c)&&(f==='all'?(effWeak(q)||rec(q.id).manualStatus):f==='weak'?effWeak(q):f==='mastered'?rec(q.id).manualStatus==='mastered':rec(q.id).manualStatus==='unmastered'));$('#li').innerHTML=arr.length?arr.map(q=>`<button class="listItem" data-id="${q.id}"><b>${q.yearLabel}｜${chapterName(q.chapter)}｜章内問${q.chapterQuestion}</b><div class="small">${esc(q.title)}</div></button>`).join(''):'<p class="small">該当なし</p>';$('#li').querySelectorAll('.listItem').forEach(b=>b.onclick=()=>{let q=findq(b.dataset.id);S.active={type:'normal',year:String(q.year),chapter:String(q.chapter),ids:[q.id],index:0,key:null};save();showActive()})}$('#lf').onchange=draw;$('#lc').onchange=draw;draw()}
function integrity(){let errs=[];if(Q.length!==720)errs.push('問題数');let ids=new Set(Q.map(q=>q.id));if(ids.size!==720)errs.push('ID重複');Q.forEach(q=>{if(window.OFFICIAL_ANSWER_KEY[q.id]!==q.answer)errs.push(q.id)});return errs}function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}function exportData(){let b=new Blob([JSON.stringify(S,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='登録販売者720問_進捗.json';a.click()}function importData(f){let r=new FileReader();r.onload=()=>{try{S=Object.assign(blank(),JSON.parse(r.result));save();renderHome();$('#modal').classList.remove('show')}catch{alert('読み込めません')}};r.readAsText(f)}
window.addEventListener('DOMContentLoaded',()=>{let e=integrity();if(e.length){document.body.innerHTML='<pre>正答データ検証エラー\n'+e.slice(0,20).join('\n')+'</pre>';return}$('#verifyStatus').textContent='✓ 公式解答PDFから作成：720 / 720問。起動時に正答キーを自動照合。';$('#tabHome').onclick=renderHome;$('#tabWeak').onclick=renderList;$('#settings').onclick=()=>$('#modal').classList.add('show');$('#close').onclick=()=>$('#modal').classList.remove('show');$('#reset').onclick=()=>{if(confirm('全記録を消しますか？')){S=blank();save();renderHome();$('#modal').classList.remove('show')}};$('#export').onclick=exportData;$('#import').onchange=e=>e.target.files[0]&&importData(e.target.files[0]);renderHome();if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{})});