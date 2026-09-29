const Q = window.QUIZ_QUESTIONS;
const K = 'touroku720_v1';
const CHAPTER_ORDER = [1, 2, 4, 3, 5];

const KANPO_CATEGORIES = [
  {name:'かぜ',items:[
    ['麻黄湯（まおうとう）','インフルエンザに効くので、体力充実、寒気、体のふしぶしが痛む'],
    ['葛根湯（かっこんとう）','かぜの初期、肩こり、筋肉痛（体力中等度以上）'],
    ['小柴胡湯（しょうさいことう）','食欲不振、口の苦み、舌に白苔（はくたい）（体力中等度）'],
    ['半夏厚朴湯（はんげこうぼくとう）','のどのつかえ（体力中等度をめやす）'],
    ['麦門冬湯（ばくもんどうとう）','喉を潤すイメージ。たんが切れにくいとか咽頭の乾燥感とか。（冬とついているので水で潤すイメージ）（体力中等度以下）'],
    ['柴胡桂枝湯（さいこけいしとう）','かぜの中期以降。体力中等度又はやや虚弱（ケイシときたら体が弱い人）'],
    ['小青竜湯（しょうせいりゅうとう）','うすい水様の痰、アレルギー性鼻炎（体力中等度またはやや虚弱）'],
    ['桂枝湯（けいしとう）','体力虚弱、汗が出る人のかぜの初期（葛根湯と麻黄湯は汗がでていたら使えない）'],
    ['香蘇散（こうそさん）','体力虚弱、神経過敏で気分がふさぐ']
  ]},
  {name:'鎮痛',items:[
    ['芍薬甘草湯（しゃくやくかんぞうとう）','こむらがえり（体力に関わらず）'],
    ['薏苡仁湯（よくいにんとう）','関節や筋肉のはれや痛み（体力中等度）'],
    ['麻杏薏甘湯（まきょうよくかんとう）','いぼ、手足のあれ（体力中等度）'],
    ['疎経活血湯（そけいかっけつとう）','血を活性化させるからしびれに効く。（体力中等度）'],
    ['釣藤散（ちょうとうさん）','慢性高血圧（体力に関わらない）（ちょうとうさん＝とうさんは高血圧）'],
    ['当帰四逆加呉茱萸生姜湯（とうきしぎゃくかごしゅゆしょうきょうとう）','手足の冷えを感じ、下肢の冷え（体力中等度以下）'],
    ['呉茱萸湯（ごしゅゆとう）','しゃっくり（体力中等度以下）'],
    ['桂枝加朮附湯（けいしかじゅつぶとう）','体力虚弱、手足が冷える、尿量が少ない'],
    ['桂枝加苓朮附湯（けいしかりょうじゅつぶとう）','手足が冷えてこわばり（体力虚弱）']
  ]},
  {name:'胃',items:[
    ['平胃散（へいいさん）','胃がもたれて消化が悪い、下痢（体力中等度以上）'],
    ['安中散（あんちゅうさん）','腹部筋肉が弛緩する傾向、神経性胃炎（体力中等度以下）'],
    ['六君子湯（りっくんしとう）','体力中等度以下、食欲がなく、みぞおちがつかえて疲れやすい'],
    ['人参湯（にんじんとう）','体力虚弱、疲れやすくて手足が冷える。']
  ]},
  {name:'腸',items:[
    ['大黄甘草湯（だいおうかんぞうとう）','便秘（大黄牡丹皮湯とひっかけ注意）（大便歓迎とう）（体力に関わらず）'],
    ['大黄牡丹皮湯（だいおうぼたんぴとう）','便秘しがちなものの月経不順（体力中等度以上）'],
    ['桂枝加芍薬湯（けいしかしゃくやくとう）','しぶり腹（体力中等度以下）'],
    ['麻子仁丸（ましにんがん）','ときに便が硬く塊状なものの便秘（コロコロの便、マシンガンで覚える）（体力中等度以下）']
  ]},
  {name:'心臓',items:[
    ['苓桂朮甘湯（りょうけいじゅつかんとう）','めまい、ふらつきがあり（体力中等度以下）']
  ]},
  {name:'血圧',items:[
    ['三黄瀉心湯（さんおうしゃしんとう）','便秘傾向＋高血圧の随伴症状（体力中等度以上）'],
    ['七物降下湯（しちもつこうかとう）','高血圧に伴う随伴症状（体力中等度以下）']
  ]},
  {name:'痔',items:[
    ['乙字湯（おつじとう）','いぼ痔、切れ痔（体力中等度以上）'],
    ['芎帰膠艾湯（きゅうききょうがいとう）','痔出血（体力中等度以下）']
  ]},
  {name:'頻尿・排尿',items:[
    ['猪苓湯（ちょれいとう）','体力にかかわらない、排尿痛'],
    ['竜胆瀉肝湯（りゅうたんしゃかんとう）','尿の濁り（体力中等度以上）'],
    ['牛車腎気丸（ごしゃじんきがん）','四肢が冷えて、尿量減少（体力中等度以下）'],
    ['八味地黄丸（はちみじおうがん）','四肢が冷える、尿量減少や多尿（体力中等度以下）'],
    ['六味丸（ろくみがん）','手足がほてる（体力中等度以下）']
  ]},
  {name:'月経・更年期障害',items:[
    ['桂枝茯苓丸（けいしぶくりょうがん）','のぼせて足冷え。顔は暑いのに足は冷える。（比較的体力あり）'],
    ['桃核承気湯（とうかくじょうきとう）','のぼせて便秘（体力中等度以上）'],
    ['温清飲（うんせいいん）','皮膚はかさかさ（体力中等度）'],
    ['五積散（ごしゃくさん）','感冒に適す（風邪に効く）（体力中等度またはやや虚弱）'],
    ['温経湯（うんけいとう）','月経困難＋こしけ（おりもの）（体力中等度以下）'],
    ['加味逍遙散（かみしょうようさん）','精神系、精神不安やいらだち（体力中等度以下）'],
    ['柴胡桂枝乾姜湯（さいこけいしかんきょうとう）','更年期障害＋かぜの後期（体力中等度以下）'],
    ['当帰芍薬散（とうきしゃくやくさん）','冷えや水分の巡りの悪さに（体力虚弱）'],
    ['四物湯（しもつとう）','体力虚弱、冷え性、皮膚の乾燥、色艶の悪い（血の気が引いている人）']
  ]},
  {name:'皮膚',items:[
    ['茵蔯蒿湯（いんちんこうとう）','便秘するものの蕁麻疹＋口内炎（体力中等度以上）'],
    ['消風散（しょうふうさん）','皮膚疾患＋分泌物が多く＋局所の熱感（体力中等度以上）'],
    ['十味敗毒湯（じゅうみはいどくとう）','化膿性皮膚疾患（体力中等度）'],
    ['当帰飲子（とうきいんし）','分泌物の少ない（体力中等度以下）']
  ]},
  {name:'鼻',items:[
    ['葛根湯加川芎辛夷（かっこんとうかせんきゅうしんい）','鼻づまり、蓄膿症、発汗傾向の著しい人に不向き（比較的体力あり）'],
    ['荊芥連翹湯（けいがいれんぎょうとう）','皮膚の色が浅黒く（体力中等度以上）'],
    ['辛夷清肺湯（しんいせいはいとう）','濃い鼻汁（体力中等度以上）'],
    ['小青竜湯（しょうせいりゅうとう）','うすい水様の痰、アレルギー性鼻炎（体力中等度またはやや虚弱）']
  ]},
  {name:'滋養強壮',items:[
    ['十全大補湯（じゅうぜんたいほとう）','体力虚弱なものの病後・術後の体力低下（体力虚弱）'],
    ['補中益気湯（ほちゅうえっきとう）','体力虚弱で元気がなく、胃腸の働きが衰えて（体力虚弱）']
  ]},
  {name:'神経質など',items:[
    ['柴胡加竜骨牡蛎湯（さいこかりゅうこつぼれいとう）','精神不安があって、便秘（体力中等度以上）'],
    ['抑肝散（よくかんさん）','精神が高ぶり、イライラの不眠症（攻撃的な感情を抑える・カンとついてるから癇癪を抑えるイメージ）（体力中等度をめやす）'],
    ['抑肝散加陳皮半夏（よくかんさんかちんぴはんげ）','イライラ（体力中等度をめやす）'],
    ['酸棗仁湯（さんそうにんとう）','心身が疲れ、精神不安、不眠（疲れているのに寝れない）（体力中等度以下）'],
    ['加味帰脾湯（かみきひとう）','心身が疲れ、血色が悪く、熱感を伴う（体力中等度以下）'],
    ['桂枝加竜骨牡蛎湯（けいしかりゅうこつぼれいとう）','疲れやすく興奮しやすい人の不眠症（寝られない焦り、物音が気になって寝られない）（体力中等度以下）']
  ]},
  {name:'疳',items:[
    ['小建中湯（しょうけんちゅうとう）','小児虚弱体質（体力虚弱）']
  ]},
  {name:'咳と痰',items:[
    ['甘草湯（かんぞうとう）','外用では痔・脱肛の痛み（体力に関わらず）'],
    ['五虎湯（ごことう）','咳が強く出る人。（虎のようにゴホゴホと吠えるイメージ）（体力中等度以上）'],
    ['麻杏甘石湯（まきょうかんせきとう）','喉が乾く人の咳（かん「せき」だから咳）（体力中等度以上）'],
    ['神秘湯（しんぴとう）','痰が少ないものの小児喘息（体力中等度）'],
    ['半夏厚朴湯（はんげこうぼくとう）','のどのつかえ（体力中等度をめやす）'],
    ['柴朴湯（さいぼくとう）','咽喉・食道部の異物感＋のどのつかえの記載なし（体力中等度）'],
    ['麦門冬湯（ばくもんどうとう）','喉を潤すイメージ。たんが切れにくいとか咽頭の乾燥感とか。（冬とついているので水で潤すイメージ）（体力中等度以下）']
  ]},
  {name:'喉の痛み',items:[
    ['桔梗湯（ききょうとう）','ときに咳が出るものの扁桃炎（体力に関わらず）'],
    ['駆風解毒散（くふうげどくさん）・駆風解毒湯（くふうげどくとう）','喉が腫れて痛む扁桃炎（体力に関わらず）'],
    ['響声破笛丸（きょうせいはてきがん）','しわがれ声（体力に関わらず）'],
    ['白虎加人参湯（びゃっこかにんじんとう）','熱感と口渇が強いものの喉の渇き（体力中等度以上）']
  ]},
  {name:'肥満',items:[
    ['防風通聖散（ぼうふうつうしょうさん）','体力充実、腹部に皮下脂肪が多く、便秘（ダイエットの漢方）'],
    ['大柴胡湯（だいさいことう）','体力充実、腹部からみぞおちにかけて苦しい、肥満症（ストレス太り）'],
    ['防已黄耆湯（ぼういおうぎとう）','体力中等度以下、汗をかきやすい、肥満、むくみ（水太り系の人向け）']
  ]},
  {name:'その他',items:[
    ['黄連解毒湯（おうれんげどくとう）','二日酔い、鼻出血（体力中等度以上）'],
    ['清上防風湯（せいじょうぼうふうとう）','赤鼻（酒さ）、にきび（体力中等度以上）']
  ]}
];


const SHOYAKU_CATEGORIES = [
  {name:'強心薬', importance:'最重要', stars:'★★★★★', items:[
    ['センソ（蟾酥）','ヒキガエル科のシナヒキガエル等の毒腺の分泌物','微量で強い強心作用があり、1日容量5mgを超えると劇薬'],
    ['ジャコウ（麝香）','シカ科のジャコウジカの雄の麝香腺分泌物','強心作用、呼吸中枢を刺激して呼吸機能を高めたり意識をはっきりさせる。小児の疳にも'],
    ['ゴオウ（牛黄）','ウシ科のウシの胆嚢中に生じた結石','強心作用、末梢血管拡張による血圧低下、興奮を鎮める。小児の疳にも'],
    ['ロクジョウ（鹿茸）','シカ科のマンシュウアカジカ又はマンシュウジカの雄のまだ角化していない、又はわずかに角化した幼角','強心作用、強壮、血行促進'],
    ['シンジュ','ウグイスガイ科のアコヤガイ、シンジュガイ又はクロチョウガイ等の外套膜組成中に病的に形成された顆粒状物質','鎮静作用'],
    ['リュウノウ','フタバガキ科リュウノウジュの樹幹に析出する精油の結晶','中枢神経系の刺激作用による気つけの効果']
  ]},
  {name:'漢方処方製剤の構成生薬', importance:'重要', stars:'★★★★', items:[
    ['カンゾウ','マメ科のGlycyrrhiza uralensis Fischer又はGlycyrrhiza glabra Linnéの根及びストロンで、ときには周皮を除いたもの（皮去りカンゾウ）','グリチルリチン酸による抗炎症作用、気道粘膜の分泌促進作用、健胃作用。\n1日最大服用量がカンゾウとして1g以上となる製品は長期連用を避ける'],
    ['マオウ','マオウ科のEphedra sinica Stapf、Ephedra intermedia Schrenk et C. A. Meyer又はEphedra equisetina Bungeの地上茎','気管支拡張、発汗促進、尿量増加（利尿）。\nエフェドリンの依存性あり、交感神経系への刺激作用'],
    ['ダイオウ','タデ科のRheum palmatum Linné、Rheum tanguticum Maximowicz、Rheum officinale Baillon、Rheum coreanum Nakai又はそれらの種間雑種の、通例、根茎','センノシドを含む大腸刺激性瀉下作用。\n授乳×（乳児に下痢）']
  ]},
  {name:'代表的な生薬8つ', importance:'重要', stars:'★★★★', items:[
    ['ブシ','キンポウゲ科のハナトリカブト又はオクトリカブトの塊根','血液循環改善'],
    ['カッコン','マメ科のクズの周皮を除いた根','解熱、鎮痙'],
    ['サイコ','セリ科のミシマサイコの根','抗炎症、鎮痛、解熱'],
    ['ボウフウ','セリ科のSaposhnikovia divaricata Schischkinの根及び根茎','発汗、解熱、鎮痛、鎮痙'],
    ['ショウマ','キンポウゲ科のCimicifuga dahurica Maximowicz、Cimicifuga heracleifolia Komarov、Cimicifuga foetida Linné又はサラシナショウマの根茎','発汗、解熱、解毒、消炎'],
    ['ブクリョウ','サルノコシカケ科のマツホドの菌核で外層をほとんど除いたもの','利尿、健胃、鎮静'],
    ['レンギョウ','モクセイ科のレンギョウの果実','鎮痛、抗菌'],
    ['サンザシ','バラ科のサンザシ又はオオミサンザシの偽果をそのまま、又は縦切若しくは横切したもの','健胃、消化促進']
  ]},
  {name:'小児鎮静薬', importance:'重要', stars:'★★★★', items:[
    ['レイヨウカク','ウシ科のサイカレイヨウ等の角','緊張興奮を鎮める'],
    ['ジンコウ','ジンチョウゲ科のジンコウ、その他の同属植物の材、特にその辺材の材質中に黒色の樹脂が沈着した部分を採取したもの','鎮静、健胃、強壮']
  ]},
  {name:'婦人薬', importance:'重要', stars:'★★★★', items:[
    ['ボタンピ','ボタン科のボタンの根皮','鎮痛・鎮静・鎮痙作用、内臓の痛みを取る'],
    ['サフラン','あやめ科のサフラン','鎮痛、鎮静作用、月経を促す作用'],
    ['コウブシ','カヤツリグサ科のハマスゲの根茎','鎮静、鎮痛作用、月経を促す作用'],
    ['センキュウ','セリ科のセンキュウの根茎を、通例、湯通ししたもの','血行を改善し、血色不良や冷えの症状を緩和、強壮、鎮静、鎮痛等の作用'],
    ['トウキ','セリ科のトウキ又はホッカイトウキの根を、通例、湯通ししたもの','血行を改善し、血色不良や冷えの症状を緩和、強壮、鎮静、鎮痛などの作用'],
    ['ジオウ','ゴマノハグサ科のアカヤジオウなどの根またはそれを蒸したもの','血行を改善し、血色不良や冷えの症状を緩和、強壮、鎮静、鎮痛等の作用']
  ]},
  {name:'泌尿器の薬', importance:'中', stars:'★★★', items:[
    ['ウワウルシ','ツツジ科のクマコケモモの葉','利尿作用、尿路消毒成分']
  ]},
  {name:'胃腸薬', importance:'中', stars:'★★★', items:[
    ['オウバク','ミカン科のキハダ又はPhellodendron chinense Schneiderの周皮を除いた樹皮','苦みによる健胃'],
    ['オウレン','キンポウゲ科のオウレン、Coptis chinensis Franchet、Coptis deltoidea C. Y. Cheng et Hsiao又はCoptis teeta Wallichの根をほとんど除いた根茎','苦みによる健胃'],
    ['センブリ','リンドウ科のセンブリの開花期の全草','苦みによる健胃'],
    ['ケイヒ','クスノキ科のCinnamomum cassia J. Preslの樹皮又は周皮の一部を除いた樹皮','香りによる健胃'],
    ['センナ、センノシド','マメ科のCassia angustifolia Vahl又はCassia acutifolia Delileの小葉','大腸刺激瀉下作用。センノシドはセンナから抽出'],
    ['シャクヤク','ボタン科のシャクヤクの根','鎮痛・鎮痙作用'],
    ['ケツメイシ','マメ科のエビスグサ又はCassia tora Linnéの種子','整腸'],
    ['ゲンノショウコ','フウロソウ科のゲンノショウコの地上部','整腸']
  ]},
  {name:'鎮咳去痰薬', importance:'中', stars:'★★★', items:[
    ['キョウニン','バラ科のホンアンズ、アンズ等の種子','呼吸中枢、咳嗽中枢を鎮静'],
    ['ナンテンジツ','メギ科のシロミナンテン（シロナンテン）またはナンテンの果実','知覚神経・末梢運動神経に作用（咳止め）'],
    ['ゴミシ','マツブサ科のチョウセンゴミシの果実','鎮咳'],
    ['シャゼンソウ','オオバコ科のオオバコの花期の全草','去痰'],
    ['セキサン','ヒガンバナ科のヒガンバナ鱗茎','去痰'],
    ['バクモンドウ','ユリ科のジャノヒゲの根の膨大部','鎮咳、去痰、滋養強壮']
  ]},
  {name:'解熱鎮痛薬', importance:'中', stars:'★★★', items:[
    ['ジリュウ','フトミミズ科のPheretima aspergillum Perrier又はその近縁動物','熱さまし、解熱']
  ]},
  {name:'歯や口の中に使う生薬', importance:'低', stars:'★★', items:[
    ['カミツレ','キク科のカミツレの頭花','抗炎症、抗菌、発汗'],
    ['ラタニア','クラメリア科のクラメリア・トリアンドラ及びその同属植物の根','収斂作用'],
    ['ミルラ','カンラン科のミルラノキなどの植物の外部の傷口から流出して凝固した樹脂','収斂作用、抗菌作用']
  ]}
];
let shoyakuDraft=null;
let shoyakuSavedIndex=null;
let shoyakuDirty=false;
let shoyakuOnlyNg=false;
let shoyakuRandom=false;
let shoyakuRandomItems=[];
let shoyakuRevealed=new Set();
function shoyakuKey(label){return label.trim();}

let kanpoDraft=null;
let kanpoSavedIndex=null;
let kanpoDirty=false;
let kanpoOnlyNg=false;
let kanpoRandom=false;
let kanpoRandomItems=[];
let kanpoRevealed=new Set();
function kanpoKey(label){ return label.replace(/（.*$/,'').trim(); }
let S = load();
let cur = null;
let page = 'home';
let pendingExit = null;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function blank(){
  return {progress:{}, modeSessions:{}, savedSessions:[], active:null, kanpoProgress:{}, shoyakuProgress:{}};
}
function load(){
  try{return Object.assign(blank(), JSON.parse(localStorage.getItem(K)||'{}'));}
  catch{return blank();}
}
function save(){ localStorage.setItem(K, JSON.stringify(S)); }
function rec(id){
  const r=S.progress[id] || (S.progress[id]={attempts:[], weakState:null});
  if(!Array.isArray(r.attempts)) r.attempts=[];
  if(!('weakState' in r)) r.weakState=null;
  return r;
}
function effWeak(q){
  const r=S.progress[q.id];
  if(!r) return false;
  if(typeof r.weakState==='boolean') return r.weakState;
  // 旧版データからの移行用。新しく解答した時点で weakState に置き換わる。
  return !!(r.manualWeak || r.manualStatus==='unmastered' || r.attempts.some(a=>a.type!=='correct'));
}
function lastCorrect(q){
  const r=S.progress[q.id];
  return !!(r?.attempts?.length && r.attempts.at(-1).type==='correct');
}
function renderStats(){
  let seen=0,cor=0,w=0;
  Q.forEach(q=>{
    const r=S.progress[q.id];
    if(r?.attempts?.length){seen++; if(r.attempts.at(-1).type==='correct') cor++;}
    if(effWeak(q)) w++;
  });
  $('#seen').textContent=seen;
  $('#correct').textContent=cor;
  $('#weak').textContent=w;
  $('#pbar').style.width=(seen/720*100)+'%';
}
function chapterName(ch){ return ['','第1章','第2章','第3章','第4章','第5章'][ch]; }
function setPage(p){
  page=p;
  ['home','quiz','listPage','kanpo','shoyaku'].forEach(x=>$('#'+x).classList.add('hidden'));
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
        <button class="modecard" id="normal"><h3>通常学習</h3><p>年度・章を選んで順番に学習。ここから開始した場合は毎回1問目から始まります。</p></button>
        <button class="modecard" id="parallel"><h3>平行モード</h3><p>同じ章内の同じ問題番号を、令和元〜6年で6問連続して比較します。</p></button>
        <button class="modecard" id="test"><h3>テストモード</h3><p>1年度120問を本番順に解答し、章別正答率と合格基準を表示します。</p></button>
        <button class="modecard kanpoModeCard" id="kanpoMode"><h3>🌿 漢方暗記モード</h3><p>漢方を一覧で確認。解説をタップで表示し、○・×を自分で付けて反復できます。</p></button>
        <button class="modecard shoyakuModeCard" id="shoyakuMode"><h3>🌱 生薬暗記モード</h3><p>生薬を一覧で確認。起源と作用を別々に開き、○・×で反復できます。</p></button>
      </div>
    </div>
    <div class="card"><h3 style="margin-top:0">保存した学習</h3><div id="saved"></div></div>`;
  $('#normal').onclick=chooseNormal;
  $('#parallel').onclick=chooseParallel;
  $('#test').onclick=chooseTest;
  $('#kanpoMode').onclick=startKanpo;
  $('#shoyakuMode').onclick=startShoyaku;
  renderSaved();
}

function modeName(type){
  return ({normal:'通常',parallel:'平行',test:'テスト',review:'復習',kanpoMemory:'漢方暗記',shoyakuMemory:'生薬暗記'})[type]||type;
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
  if(a.type==='kanpoMemory') return '漢方暗記・保存記録';
  if(a.type==='shoyakuMemory') return '生薬暗記・保存記録';
  return '';
}
function renderSaved(){
  const el=$('#saved');
  if(!S.savedSessions.length){el.innerHTML='<p class="small">保存した学習はありません。</p>';return;}
  el.innerHTML=S.savedSessions.map((s,i)=>`
    <div class="savedRow">
      <button class="listItem savedOpen" data-i="${i}"><b>${modeName(s.type)}｜${esc(s.label||savedLabel(s))}</b><div class="small">${esc(s.positionLabel||(s.type==='kanpoMemory'||s.type==='shoyakuMemory'?'○×の保存記録':''))}</div></button>
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
  selectorCard('通常学習',`<div class="row"><select id="ySel" class="select"><option value="all">全年度</option>${[1,2,3,4,5,6].map(y=>`<option value="${y}">令和${y===1?'元':y}年度</option>`).join('')}</select><select id="cSel" class="select"><option value="all">全章</option>${CHAPTER_ORDER.map(c=>`<option value="${c}">第${c}章</option>`).join('')}</select></div><p class="small">ここから開始すると、過去の回答履歴に関係なく必ず1問目から始まります。途中から再開したい場合は、問題画面の「保存」を押し、ホームの「保存した学習」から開いてください。</p>`);
  $('#startMode').onclick=()=>startNormal($('#ySel').value,$('#cSel').value);
}
function startNormal(y,c){
  const arr=pool(y,c);
  // 学習モードから新しく入った場合は、過去の位置に関係なく必ず先頭から。
  // 過去の○×履歴は S.progress に残るため、問題右上では確認できる。
  S.active={type:'normal',year:y,chapter:c,ids:arr.map(q=>q.id),index:0,key:null,dirty:false,visited:[]};
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
  S.active={type:'parallel',chapter:c,ids:parallelIds(c),index:0,key:null,dirty:false,visited:[]};
  save();showActive();
}
function chooseTest(){
  selectorCard('テストモード',`<div class="row"><select id="ySel" class="select">${[1,2,3,4,5,6].map(y=>`<option value="${y}">令和${y===1?'元':y}年度</option>`).join('')}</select></div><p class="small">その年度の120問を本番順に出題します。</p>`);
  $('#startMode').onclick=()=>startTest($('#ySel').value);
}
function startTest(y){
  const ids=Q.filter(q=>q.year==y).sort((a,b)=>a.globalNumber-b.globalNumber).map(q=>q.id);
  S.active={type:'test',year:y,ids,index:0,answers:{},dirty:false,visited:[]};
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
  a.visited=Array.isArray(a.visited)?a.visited:[];
  if(cur && !a.visited.includes(cur.id)) a.visited.push(cur.id);
  renderQuestion();
  requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'}));
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
    let headers=null,colHeaders=null;
    const hm=stem.match(/(?:^|\n)\s*([ａｂｃｄｅa-e](?:[ \t　]+[ａｂｃｄｅa-e]){1,4})\s*$/i);
    if(hm){headers=hm[1].trim().split(/[ \t　]+/);stem=stem.slice(0,hm.index).trim();}
    const chm=stem.match(/((?:【[^】]+】\s*){2,4})\s*$/);
    if(chm){colHeaders=[...chm[1].matchAll(/【([^】]+)】/g)].map(m=>m[1]);stem=stem.slice(0,chm.index).trim();}
    return {stem,choices,headers,colHeaders};
  }
  return {stem:s,choices:null,headers:null,colHeaders:null};
}
function prettyStem(stem){
  let s=String(stem||'').replace(/\r/g,'').trim();
  // 穴埋め記号の（ａ）〜（ｅ）は、PDF抽出で括弧内に改行や空白が入っても1つに戻す。
  // 例: 「（\nａ ）」→「（ａ）」。「a/b/c の記述行」と誤認して改行祭りになるのを防ぐ。
  s=s.replace(/[（(]\s*([ａｂｃｄｅa-e])\s*[）)]/gi,(m,x)=>`（${x}）`);
  // a/b/c/d/e の各“記述ラベル”だけを独立行へ。
  // 開き括弧直後の ａ などは穴埋め記号なので対象外。
  s=s.replace(/(^|[^（(])([ \t　]*)([ａｂｃｄｅ])\s+/gm,(m,pre,sp,label)=>`${pre}\n${label} `);
  // 穴埋め問題の導入文と本文を分離。
  // 例: 「…いずれも同じ字句が入る。消化管の運動は…」→ 導入文の後に空行を入れる。
  // 「それぞれ同じ字句が入る。」にも対応する。
  s=s.replace(/((?:いずれも|それぞれ)同じ字句が入る。)\s*(?=\S)/g,'$1\n\n');
  // 穴埋め問題で「正しい組み合わせはどれか。」の直後から本文が始まる場合も分離。
  // 「なお、…同じ字句が入る。」が続く問題は上の専用ルールでまとめて扱う。
  s=s.replace(/(正しい組み合わせはどれか。)\s*(?!(?:なお|但し|ただし))(?=\S)/g,'$1\n\n');
  // 「どれか。」等の直後に配合量が続くPDF抽出崩れを強制的に改行。
  s=s.replace(/。\s*(?=[０-９0-9]+\s*(?:錠|カプセル|包|粒|枚|mL|ｍL|ｍＬ|ML|g|ｇ)\s*中)/g,'。\n');
  // 「9錠中アセトアミノフェン」「60mL 中ジヒドロ...」を見出しと成分で分離。
  s=s.replace(/([０-９0-9]+\s*(?:錠|カプセル|包|粒|枚|mL|ｍL|ｍＬ|ML|g|ｇ)\s*中)\s*/g,'$1\n');
  s=s.replace(/\n{3,}/g,'\n\n').trim();
  // 配合量の羅列は、単位の直後で次の成分名が続く場合のみ改行。
  s=s.replace(/([０-９0-9]+(?:[.．][０-９0-9]+)?\s*(?:mg|ｍｇ|g|ｇ|mL|ｍL|ｍＬ|μg|µg))\s*(?=[ァ-ヶ一-龠々A-Za-zｄｌＤＬ])/g,'$1\n');
  return s;
}
function parseChoiceParts(t,headers){
  if(!headers?.length) return null;
  let parts=String(t).trim().split(/[ \t　]+/).filter(Boolean);
  if(parts.length>headers.length) parts=[...parts.slice(0,headers.length-1),parts.slice(headers.length-1).join(' ')];
  return parts.length===headers.length?parts:null;
}
const CIRCLED=['','①','②','③','④','⑤'];
function splitTableCells(text,count=2){
  let t=String(text||'').trim();
  // 明示的なダッシュがあれば最優先で左右に分ける。
  const dm=t.match(/^(.*?)\s*[－―—–-]\s*(.+)$/);
  if(dm && count===2) return [dm[1].trim(),dm[2].trim()];
  // PDF抽出で列間が空白1個だけになるケース。2列なら最初の空白境界で分ける。
  if(count===2){
    const m=t.match(/^(\S+(?:、\S+)*)[ \t　]+(.+)$/);
    if(m) return [m[1].trim(),m[2].trim()];
  }
  // 3列以上は2個以上の空白を優先して分割。
  let parts=t.split(/[ \t　]{2,}/).filter(Boolean);
  if(parts.length===count) return parts;
  return null;
}
function stemHtml(stem){
  const s=prettyStem(stem);
  const headers=[...s.matchAll(/【([^】]+)】/g)].map(m=>m[1]);
  if(headers.length<2) return esc(s);
  const first=s.indexOf('【');
  const lineEnd=s.indexOf('\n',first);
  const headerBlock=(lineEnd>=0?s.slice(first,lineEnd):s.slice(first));
  const hs=[...headerBlock.matchAll(/【([^】]+)】/g)].map(m=>m[1]);
  if(hs.length<2) return esc(s);
  const intro=s.slice(0,first).trim();
  const rest=(lineEnd>=0?s.slice(lineEnd+1):'').trim();
  const lines=rest.split('\n').map(x=>x.trim()).filter(Boolean);
  const rows=[]; const leftovers=[];
  for(const line of lines){
    const m=line.match(/^([ａｂｃｄｅa-e])\s+(.+)$/i);
    if(!m){leftovers.push(line);continue;}
    const cells=splitTableCells(m[2],hs.length);
    if(cells) rows.push({label:m[1],cells}); else leftovers.push(line);
  }
  if(!rows.length) return esc(s);
  const table=`<div class="stemTable"><div class="stemTableHead"><span></span>${hs.map(h=>`<b>${esc(h)}</b>`).join('')}</div>${rows.map(r=>`<div class="stemTableRow"><b class="stemRowLabel">${esc(r.label)}</b>${r.cells.map(c=>`<span>${esc(c)}</span>`).join('')}</div>`).join('')}</div>`;
  return `${intro?`<div class="stemIntro">${esc(intro)}</div>`:''}${table}${leftovers.length?`<div class="stemLeftover">${esc(leftovers.join('\n'))}</div>`:''}`;
}
function attemptHistoryText(q){
  const a=S.progress[q.id]?.attempts||[];
  return a.map(x=>x.type==='correct'?'○':'×').join('');
}
function updateAttemptHistory(){
  const el=$('#attemptHistory'); if(!el||!cur)return;
  const t=attemptHistoryText(cur);
  el.textContent=t||'未回答';
  el.classList.toggle('empty',!t);
}
function choiceReferenceHtml(choices,headers,colHeaders){
  if(!choices?.length) return '';
  if(colHeaders?.length>=2){
    const rows=choices.map((t,i)=>({i,cells:splitTableCells(t,colHeaders.length),raw:t}));
    if(rows.every(r=>r.cells)){
      return `<div class="choiceReference choiceRefTable" aria-label="選択肢一覧"><div class="choiceRefTableHead"><span></span>${colHeaders.map(h=>`<b>${esc(h)}</b>`).join('')}</div>${rows.map(r=>`<div class="choiceRefTableRow"><b class="refNo">${CIRCLED[r.i+1]}</b>${r.cells.map(c=>`<span>${esc(c)}</span>`).join('')}</div>`).join('')}</div>`;
    }
  }
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
  if(a.type==='kanpoMemory') return '漢方暗記・保存記録';
  if(a.type==='shoyakuMemory') return '生薬暗記・保存記録';
  return '';
}
function renderQuestion(){
  const a=S.active,q=cur,r=rec(q.id),disp=splitDisplayQuestion(q.text);
  $('#scope').textContent=scopeName(a);
  const result=a.type==='test'?a.answers?.[q.id]:null;
  $('#quiz').innerHTML=`<div class="card">
    <div class="meta questionMeta"><span class="tag">${q.yearLabel}</span><span class="tag">${q.partLabel} 問${q.partNumber}</span><span class="tag">${chapterName(q.chapter)}・章内問${q.chapterQuestion}</span><span class="badge">${a.index+1}/${a.ids.length}</span><span class="attemptHistoryWrap">過去 <b id="attemptHistory" class="attemptHistory">${attemptHistoryText(q)||'未回答'}</b></span></div>
    <div class="qtext">${stemHtml(disp.stem)}</div>
    ${choiceReferenceHtml(disp.choices,disp.headers,disp.colHeaders)}
    <div class="answers fixedAnswers" style="--n:${disp.choices?.length||5}">${answerButtons(disp.choices?.length||5)}</div>
    <button class="unknown">わからない</button>
    <div id="result" class="result"></div>
    <div id="weakChoice" class="statusChoice hidden"><div class="small">次へ進む前に、この問題をどう扱うか選べます。</div><div class="statusChoiceBtns"><button id="statusCorrect" class="statusCorrect">✓ 正解</button><button id="statusWeak" class="statusWeak">★ 弱点</button></div></div>
    <div class="controls four"><button id="prev" ${a.index===0?'disabled':''}>← 前へ</button><button id="questionList">一覧</button><button id="saveOnly">💾 保存</button><button id="next" class="primary">次へ →</button></div>
    <div id="sessionSaveMsg" class="small sessionSaveMsg" aria-live="polite"></div>
    <button id="exit" class="btn" style="width:100%;margin-top:8px">終了・一覧へ戻る</button>
  </div>`;
  $$('.ans').forEach(b=>b.onclick=()=>answer(+b.dataset.n));
  $('.unknown').onclick=()=>answer(null);
  $('#prev').onclick=()=>{a.index--;updateAutoPosition();save();showActive();};
  $('#questionList').onclick=showQuestionGrid;
  $('#saveOnly').onclick=saveActiveAndContinue;
  $('#next').onclick=goNext;
  $('#exit').onclick=()=>requestExit({kind:a.type==='review'?'list':'home',filter:a.reviewFilter||'all'});
  $('#statusCorrect').onclick=()=>setWeakState(false);
  $('#statusWeak').onclick=()=>setWeakState(true);
  if(result) reveal(result.selected,result.correct,result.unknown);
}

function updateAutoPosition(){
  // 以前は通常学習の位置を自動保存していたが、現在は明示的な「保存」だけで再開位置を保持する。
  // 学習モードからの新規開始は常に1問目から。
}
function answer(n){
  const a=S.active,q=cur,ok=n===q.answer,unk=n===null,r=rec(q.id);
  r.attempts.push({type:unk?'unknown':ok?'correct':'wrong',selected:n,ts:Date.now()});
  // 不正解・わからないは自動で弱点。正解は既定で弱点解除。
  r.weakState=!(ok&&!unk);
  if(a.type==='test'){
    a.answers=a.answers||{};
    a.answers[q.id]={selected:n,correct:ok,unknown:unk};
  }
  a.dirty=true;save();renderStats();updateAttemptHistory();reveal(n,ok,unk);
}
function setWeakState(isWeak){
  const r=rec(cur.id);
  r.weakState=!!isWeak;
  delete r.manualWeak;
  save();renderStats();renderWeakChoice();
}
function renderWeakChoice(){
  const box=$('#weakChoice');
  if(!box) return;
  const r=rec(cur.id);
  box.classList.remove('hidden');
  $('#statusWeak')?.classList.toggle('on',effWeak(cur));
  $('#statusCorrect')?.classList.toggle('on',!effWeak(cur));
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
  renderWeakChoice();
}

function activeAnswer(a,id){
  if(a.type==='test') return a.answers?.[id]||null;
  const r=S.progress[id];
  if(!r?.attempts?.length) return null;
  const x=r.attempts.at(-1);
  return {correct:x.type==='correct',unknown:x.type==='unknown',selected:x.selected};
}
function isAnsweredActive(a,id){ return !!activeAnswer(a,id); }
function nextUnvisitedIndex(a){
  const seen=new Set(Array.isArray(a.visited)?a.visited:[]);
  return a.ids.findIndex(id=>!seen.has(id));
}
function goNext(){
  const a=S.active;if(!a)return;
  if(a.type==='review'){
    if(a.index<a.ids.length-1){a.index++;save();showActive();}
    else finishSession();
    return;
  }
  // 過去の回答履歴とは無関係に、今の出題順を必ず1問ずつ進む。
  // 以前に解答済みの問題も飛ばさない。
  if(a.index<a.ids.length-1){
    a.index++;
    updateAutoPosition();save();showActive();return;
  }
  // 一覧から途中へジャンプした場合だけ、今回のセッションでまだ表示していない問題へ戻る。
  const ni=nextUnvisitedIndex(a);
  if(ni>=0){a.index=ni;updateAutoPosition();save();showActive();return;}
  renderCompletionSummary();
}
function answerMark(a,id){
  const x=activeAnswer(a,id);
  if(!x) return '';
  return x.correct?'○':'×';
}
function ensureQuestionGridModal(){
  if($('#qGridModal')) return;
  const d=document.createElement('div');d.id='qGridModal';d.className='modal';
  d.innerHTML=`<div class="modalbox gridModalBox"><div class="gridHead"><h2>問題一覧</h2><button id="qGridClose" class="btn">閉じる</button></div><p class="small">○＝正解、×＝不正解・わからない、白＝未回答。番号を押すとその問題へ移動します。</p><div id="qGrid" class="questionGrid"></div></div>`;
  document.body.appendChild(d);
  $('#qGridClose').onclick=()=>d.classList.remove('show');
}
function showQuestionGrid(){
  const a=S.active;if(!a)return;
  ensureQuestionGridModal();
  const g=$('#qGrid');
  g.innerHTML=a.ids.map((id,i)=>{
    const m=answerMark(a,id),cls=m==='○'?'qDoneOk':m==='×'?'qDoneNg':'';
    return `<button class="qJump ${cls} ${i===a.index?'current':''}" data-i="${i}"><span>${i+1}</span>${m?`<b>${m}</b>`:''}</button>`;
  }).join('');
  g.querySelectorAll('.qJump').forEach(b=>b.onclick=()=>{
    a.index=+b.dataset.i;updateAutoPosition();save();$('#qGridModal').classList.remove('show');showActive();
  });
  $('#qGridModal').classList.add('show');
}
function renderCompletionSummary(){
  const a=S.active;if(!a)return;
  const items=a.ids.map(findq).filter(Boolean);
  const answers=items.map(q=>({q,x:activeAnswer(a,q.id)}));
  const total=items.length,correct=answers.filter(z=>z.x?.correct).length,rate=total?correct/total*100:0;
  const oneYear=[...new Set(items.map(q=>q.year))].length===1;
  const fullYear=oneYear&&total===120&&new Set(items.map(q=>q.globalNumber)).size===120;
  let extra='';
  if(fullYear){
    const by={};CHAPTER_ORDER.forEach(ch=>by[ch]={n:0,c:0});
    answers.forEach(({q,x})=>{by[q.chapter].n++;if(x?.correct)by[q.chapter].c++;});
    const rows=CHAPTER_ORDER.map(ch=>{const x=by[ch],p=x.n?x.c/x.n*100:0,need=Math.max(0,Math.ceil(x.n*.4)-x.c);return `<tr><td>${chapterName(ch)}</td><td>${x.c}/${x.n}</td><td>${p.toFixed(1)}%</td><td>${need?`40%まであと${need}問`:'40%以上'}</td></tr>`;}).join('');
    const need70=Math.max(0,84-correct),pass=correct>=84&&Object.values(by).every(x=>x.n&&x.c/x.n>=.4);
    extra=`<p>${need70?`70%（84問）まであと${need70}問`:'総合70%以上'}</p><table><tr><th>章</th><th>正解</th><th>率</th><th>基準</th></tr>${rows}</table><h3>${pass?'合格基準クリア':'基準未達'}</h3><p class="small">判定基準：総合70%以上かつ各章40%以上。</p>`;
  }
  $('#quiz').innerHTML=`<div class="card testSummary"><h2>終了</h2><p><b>${correct}/${total} 正解（${rate.toFixed(1)}%）</b></p>${extra}<div class="savebar"><button class="btn" id="summaryList">一覧を見る</button><button class="btn primary" id="done">ホームへ</button></div></div>`;
  $('#summaryList').onclick=showQuestionGrid;
  $('#done').onclick=()=>{S.active=null;save();renderHome();};
  requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'}));
}

function ensureExitModal(){
  if($('#exitModal')) return;
  const d=document.createElement('div');d.id='exitModal';d.className='modal';
  d.innerHTML=`<div class="modalbox"><h2>この学習を終了しますか？</h2><p class="small">回答履歴・弱点指定は常に保存されます。「保存して戻る」は、この位置を保存して戻ります。保存データから再開中の場合は同じ保存枠を上書きします。</p><div class="exitChoices"><button id="exitSave" class="btn primary">保存して戻る</button><button id="exitNoSave" class="btn">保存せず戻る</button><button id="exitCancel" class="btn">問題に戻る</button></div></div>`;
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

  // 「保存した学習」から再開した学習は、同じ保存枠へ上書きする。
  // 新規学習も一度保存した後は、そのまま続けて再保存すると同じ枠を更新する。
  const i=Number.isInteger(a.fromSaved) ? a.fromSaved : -1;
  if(i>=0 && S.savedSessions[i]){
    S.savedSessions[i]=snap;
    a.fromSaved=i;
    return {index:i,updated:true};
  }
  S.savedSessions.push(snap);
  a.fromSaved=S.savedSessions.length-1;
  return {index:a.fromSaved,updated:false};
}
function saveActiveAndContinue(){
  const a=S.active;if(!a)return;
  updateAutoPosition();
  const result=saveSession(a);
  save();
  const msg=$('#sessionSaveMsg');
  if(msg){
    msg.textContent=result.updated?'上書き保存しました。':'保存しました。';
    clearTimeout(saveActiveAndContinue._t);
    saveActiveAndContinue._t=setTimeout(()=>{const m=$('#sessionSaveMsg');if(m)m.textContent='';},1800);
  }
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
  if(src.type==='kanpoMemory'){
    kanpoSavedIndex=i;kanpoDraft=JSON.parse(JSON.stringify(src.progress||{}));kanpoDirty=false;kanpoOnlyNg=false;kanpoRandom=false;kanpoRandomItems=[];resetKanpoReveal();renderKanpoModeSelect();return;
  }
  if(src.type==='shoyakuMemory'){
    shoyakuSavedIndex=i;shoyakuDraft=JSON.parse(JSON.stringify(src.progress||{}));shoyakuDirty=false;shoyakuOnlyNg=false;shoyakuRandom=false;shoyakuRandomItems=[];resetShoyakuReveal();renderShoyakuModeSelect();return;
  }
  S.active=JSON.parse(JSON.stringify(src));
  S.active.dirty=false;S.active.fromSaved=i;
  S.active.visited=Array.isArray(S.active.visited)?S.active.visited:[];
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
  if(f==='all') return true;
  if(f==='answered') return !!r?.attempts?.length;
  if(f==='correct') return lastCorrect(q);
  if(f==='weak') return effWeak(q);
  return false;
}
function filterLabel(f){return ({all:'全問題',answered:'回答済み',correct:'正解',weak:'弱点'})[f]||'一覧';}
function renderList(initialFilter='all',initialChapter='all'){
  setPage('listPage');renderStats();$('#scope').textContent=filterLabel(initialFilter);
  $('#listPage').innerHTML=`<div class="card"><h2>問題一覧</h2><div class="row"><select id="lf" class="select"><option value="all">全問題</option><option value="answered">回答済み</option><option value="correct">正解</option><option value="weak">弱点</option></select><select id="lc" class="select"><option value="all">全章</option>${CHAPTER_ORDER.map(c=>`<option value="${c}">第${c}章</option>`).join('')}</select></div><div id="li"></div></div>`;
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

function allKanpoEntries(){
  return KANPO_CATEGORIES.flatMap((cat,ci)=>cat.items.map((item,ii)=>({
    label:item[0],desc:item[1],key:kanpoKey(item[0]),rid:`k${ci}_${ii}`,cat:cat.name,ci,ii
  })));
}
function shuffledKanpo(entries){
  const a=[...entries];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
function resetKanpoReveal(){ kanpoRevealed=new Set(); }
function startKanpo(){
  kanpoSavedIndex=null;
  if(!S.kanpoProgress || typeof S.kanpoProgress!=='object') S.kanpoProgress={};
  kanpoDraft=JSON.parse(JSON.stringify(S.kanpoProgress));
  kanpoDirty=false;kanpoOnlyNg=false;kanpoRandom=false;kanpoRandomItems=[];resetKanpoReveal();
  renderKanpoModeSelect();
}
function renderKanpoModeSelect(){
  setPage('kanpo');renderStats();$('#scope').textContent='漢方暗記';
  const st=kanpoStats();
  $('#kanpo').innerHTML=`<div class="card"><h2>🌿 漢方暗記モード</h2><p class="small">○ ${st.ok}　× ${st.ng}　未選択 ${st.blank}　/ ${st.total}種類</p><p>表示方法を選んでください。</p><div class="kanpoModeChoices"><button id="kanpoCategoryStart" class="modecard"><h3>カテゴリ順</h3><p>かぜ・胃・鼻など、カテゴリ別に一覧表示します。</p></button><button id="kanpoRandomStart" class="modecard kanpoRandomCard"><h3>🔀 完全ランダム</h3><p>カテゴリ名を表示せず、漢方を完全にランダムな順番で並べます。</p></button></div><div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button id="kanpoResetProgress" class="btn">記録をリセット</button><button id="kanpoSelectExit" class="btn">ホームへ</button></div></div>`;
  $('#kanpoResetProgress').onclick=requestKanpoReset;
  $('#kanpoCategoryStart').onclick=()=>{kanpoRandom=false;kanpoOnlyNg=false;resetKanpoReveal();renderKanpo();};
  $('#kanpoRandomStart').onclick=()=>{kanpoRandom=true;kanpoOnlyNg=false;resetKanpoReveal();kanpoRandomItems=shuffledKanpo(allKanpoEntries());renderKanpo();};
  $('#kanpoSelectExit').onclick=requestKanpoExit;
}
function kanpoStats(){
  const keys=[...new Set(KANPO_CATEGORIES.flatMap(c=>c.items.map(x=>kanpoKey(x[0]))))];
  let ok=0,ng=0;
  keys.forEach(k=>{if(kanpoDraft?.[k]==='ok')ok++;else if(kanpoDraft?.[k]==='ng')ng++;});
  return {total:keys.length,ok,ng,blank:keys.length-ok-ng};
}
function kanpoItemHtml(x){
  const state=kanpoDraft?.[x.key]||'';
  const open=kanpoRevealed.has(x.rid);
  return `<article class="kanpoItem" data-key="${esc(x.key)}" data-rid="${x.rid}">
    <div class="kanpoHead"><div class="kanpoName">${esc(x.label)}</div><div class="kanpoJudge"><button class="kanpoOk ${state==='ok'?'on':''}" data-state="ok">○</button><button class="kanpoNg ${state==='ng'?'on':''}" data-state="ng">×</button></div></div>
    <button class="kanpoAnswer ${open?'open':''}" data-reveal="${x.rid}" aria-expanded="${open?'true':'false'}"><span class="kanpoPlaceholder">${open?esc(x.desc):'ここを押すと解説を表示'}</span></button>
  </article>`;
}
function renderKanpo(){
  setPage('kanpo');renderStats();
  const modeLabel=kanpoRandom?'ランダム':'カテゴリ順';
  $('#scope').textContent=`漢方 ${kanpoOnlyNg?'×のみ / ':''}${modeLabel}`;
  const st=kanpoStats();
  let body='';
  if(kanpoRandom){
    let items=kanpoRandomItems.length?kanpoRandomItems:shuffledKanpo(allKanpoEntries());
    if(kanpoOnlyNg) items=items.filter(x=>kanpoDraft?.[x.key]==='ng');
    body=items.length?`<section class="kanpoCategory kanpoRandomList">${items.map(kanpoItemHtml).join('')}</section>`:'<div class="card"><p>×の漢方はありません。</p></div>';
  }else{
    body=KANPO_CATEGORIES.map((cat,ci)=>{
      const items=cat.items.map((item,ii)=>({label:item[0],desc:item[1],key:kanpoKey(item[0]),rid:`k${ci}_${ii}`,cat:cat.name,ci,ii}))
        .filter(x=>!kanpoOnlyNg||kanpoDraft?.[x.key]==='ng');
      if(!items.length) return '';
      return `<section class="kanpoCategory"><h2>${esc(cat.name)}</h2>${items.map(kanpoItemHtml).join('')}</section>`;
    }).join('') || '<div class="card"><p>×の漢方はありません。</p></div>';
  }
  $('#kanpo').innerHTML=`<div class="kanpoTop card"><div><h2 style="margin:0">🌿 漢方暗記モード</h2><p class="small" style="margin-bottom:0">○ ${st.ok}　× ${st.ng}　未選択 ${st.blank}　/ ${st.total}種類</p><p class="small" style="margin:4px 0 0">表示：${kanpoOnlyNg?'×のみ・':''}${modeLabel}</p></div><div class="kanpoTopBtns"><button id="kanpoCategoryMode" class="btn ${!kanpoRandom?'primary':''}">カテゴリ順</button><button id="kanpoRandomMode" class="btn ${kanpoRandom?'primary':''}">🔀 ランダム</button><button id="kanpoSaveTop" class="btn">保存</button><button id="kanpoResetTop" class="btn">記録リセット</button><button id="kanpoExitTop" class="btn">ホームへ</button></div></div>${body}<div class="card kanpoBottom"><button id="kanpoNgMode" class="btn primary">${kanpoOnlyNg?'×のみを再整列':'×のみモード'}</button>${kanpoOnlyNg?'<button id="kanpoAllMode" class="btn">全件表示</button>':''}${kanpoRandom?'<button id="kanpoReshuffle" class="btn">🔀 再シャッフル</button>':''}<button id="kanpoSaveBottom" class="btn">保存</button><button id="kanpoExitBottom" class="btn">ホームへ</button><div id="kanpoSaveMsg" class="small"></div></div>`;
  $$('#kanpo .kanpoJudge button').forEach(b=>b.onclick=e=>{
    const item=e.currentTarget.closest('.kanpoItem'),key=item.dataset.key,state=e.currentTarget.dataset.state;
    kanpoDraft[key]=state;kanpoDirty=true;
    item.querySelector('.kanpoOk').classList.toggle('on',state==='ok');
    item.querySelector('.kanpoNg').classList.toggle('on',state==='ng');
    const st2=kanpoStats();const p=$('#kanpo .kanpoTop .small');if(p)p.textContent=`○ ${st2.ok}　× ${st2.ng}　未選択 ${st2.blank}　/ ${st2.total}種類`;
  });
  $$('#kanpo .kanpoAnswer').forEach(b=>b.onclick=e=>{
    const btn=e.currentTarget,rid=btn.dataset.reveal;
    const m=rid.match(/^k(\d+)_(\d+)$/); if(!m)return;
    const desc=KANPO_CATEGORIES[+m[1]].items[+m[2]][1];
    if(kanpoRevealed.has(rid)){kanpoRevealed.delete(rid);btn.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.querySelector('.kanpoPlaceholder').textContent='ここを押すと解説を表示';}
    else{kanpoRevealed.add(rid);btn.classList.add('open');btn.setAttribute('aria-expanded','true');btn.querySelector('.kanpoPlaceholder').textContent=desc;}
  });
  const doSave=()=>saveKanpo();
  $('#kanpoSaveTop').onclick=doSave;$('#kanpoSaveBottom').onclick=doSave;$('#kanpoResetTop').onclick=requestKanpoReset;
  $('#kanpoExitTop').onclick=requestKanpoExit;$('#kanpoExitBottom').onclick=requestKanpoExit;
  $('#kanpoCategoryMode').onclick=()=>{kanpoRandom=false;kanpoOnlyNg=false;resetKanpoReveal();renderKanpo();window.scrollTo({top:0,behavior:'auto'});};
  $('#kanpoRandomMode').onclick=()=>{kanpoRandom=true;kanpoOnlyNg=false;resetKanpoReveal();kanpoRandomItems=shuffledKanpo(allKanpoEntries());renderKanpo();window.scrollTo({top:0,behavior:'auto'});};
  $('#kanpoNgMode').onclick=()=>{kanpoOnlyNg=true;resetKanpoReveal();if(kanpoRandom)kanpoRandomItems=shuffledKanpo(allKanpoEntries().filter(x=>kanpoDraft?.[x.key]==='ng'));renderKanpo();window.scrollTo({top:0,behavior:'auto'});};
  if($('#kanpoAllMode')) $('#kanpoAllMode').onclick=()=>{kanpoOnlyNg=false;resetKanpoReveal();if(kanpoRandom)kanpoRandomItems=shuffledKanpo(allKanpoEntries());renderKanpo();window.scrollTo({top:0,behavior:'auto'});};
  if($('#kanpoReshuffle')) $('#kanpoReshuffle').onclick=()=>{resetKanpoReveal();kanpoRandomItems=shuffledKanpo(allKanpoEntries().filter(x=>!kanpoOnlyNg||kanpoDraft?.[x.key]==='ng'));renderKanpo();window.scrollTo({top:0,behavior:'auto'});};
}
function saveKanpo(){
  const data=JSON.parse(JSON.stringify(kanpoDraft||{}));
  if(Number.isInteger(kanpoSavedIndex)&&S.savedSessions[kanpoSavedIndex]?.type==='kanpoMemory'){
    S.savedSessions[kanpoSavedIndex].progress=data;S.savedSessions[kanpoSavedIndex].savedAt=Date.now();
  }else{
    S.kanpoProgress=data;
  }
  save();kanpoDirty=false;
  const msg=$('#kanpoSaveMsg');if(msg){msg.textContent=Number.isInteger(kanpoSavedIndex)?'保存記録を上書きしました。':'保存しました。';setTimeout(()=>{if($('#kanpoSaveMsg'))$('#kanpoSaveMsg').textContent='';},1800);}
}
function archiveKanpoProgress(){
  const data=JSON.parse(JSON.stringify(kanpoDraft||S.kanpoProgress||{}));
  if(Number.isInteger(kanpoSavedIndex)&&S.savedSessions[kanpoSavedIndex]?.type==='kanpoMemory'){
    S.savedSessions[kanpoSavedIndex].progress=data;S.savedSessions[kanpoSavedIndex].savedAt=Date.now();
  }else{
    S.savedSessions.push({type:'kanpoMemory',label:'漢方暗記・保存記録',progress:data,savedAt:Date.now(),positionLabel:'○×の保存記録'});
  }
}
function ensureKanpoResetModal(){
  if($('#kanpoResetModal'))return;
  const d=document.createElement('div');d.id='kanpoResetModal';d.className='modal';
  d.innerHTML=`<div class="modalbox"><h2>漢方暗記の記録をリセットしますか？</h2><p class="small">現在の○×を「保存した学習」に残してからリセットすることもできます。リセット後、漢方暗記モードを開くと未選択の状態から始まります。</p><div class="exitChoices"><button id="kanpoResetSave" class="btn primary">今の状態を保存してリセット</button><button id="kanpoResetNoSave" class="btn">保存せずリセット</button><button id="kanpoResetCancel" class="btn">やめる</button></div></div>`;
  document.body.appendChild(d);
  $('#kanpoResetSave').onclick=()=>performKanpoReset(true);
  $('#kanpoResetNoSave').onclick=()=>performKanpoReset(false);
  $('#kanpoResetCancel').onclick=()=>$('#kanpoResetModal').classList.remove('show');
}
function requestKanpoReset(){ensureKanpoResetModal();$('#kanpoResetModal').classList.add('show');}
function performKanpoReset(archive){
  if(archive)archiveKanpoProgress();
  S.kanpoProgress={};kanpoDraft={};kanpoSavedIndex=null;kanpoDirty=false;kanpoOnlyNg=false;kanpoRandom=false;kanpoRandomItems=[];resetKanpoReveal();
  save();$('#kanpoResetModal')?.classList.remove('show');renderHome();
}
function ensureKanpoExitModal(){
  if($('#kanpoExitModal')) return;
  const d=document.createElement('div');d.id='kanpoExitModal';d.className='modal';
  d.innerHTML=`<div class="modalbox"><h2>漢方暗記を終了しますか？</h2><p class="small">保存しない場合、今回の○×変更は捨てて最後に保存した状態へ戻ります。</p><div class="exitChoices"><button id="kanpoExitSave" class="btn primary">保存して戻る</button><button id="kanpoExitDiscard" class="btn">保存せず戻る</button><button id="kanpoExitCancel" class="btn">漢方暗記に戻る</button></div></div>`;
  document.body.appendChild(d);
  $('#kanpoExitSave').onclick=()=>{saveKanpo();$('#kanpoExitModal').classList.remove('show');kanpoDraft=null;kanpoSavedIndex=null;kanpoDirty=false;renderHome();};
  $('#kanpoExitDiscard').onclick=()=>{$('#kanpoExitModal').classList.remove('show');kanpoDraft=null;kanpoSavedIndex=null;kanpoDirty=false;renderHome();};
  $('#kanpoExitCancel').onclick=()=>$('#kanpoExitModal').classList.remove('show');
}
function requestKanpoExit(){
  if(!kanpoDirty){kanpoDraft=null;kanpoSavedIndex=null;renderHome();return;}
  ensureKanpoExitModal();$('#kanpoExitModal').classList.add('show');
}


function allShoyakuEntries(){
  return SHOYAKU_CATEGORIES.flatMap((cat,ci)=>cat.items.map((item,ii)=>({
    label:item[0],origin:item[1],action:item[2],key:shoyakuKey(item[0]),rid:`s${ci}_${ii}`,cat:cat.name,importance:cat.importance,stars:cat.stars,ci,ii
  })));
}
function shuffledShoyaku(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;}
function resetShoyakuReveal(){shoyakuRevealed=new Set();}
function startShoyaku(){
  shoyakuSavedIndex=null;
  if(!S.shoyakuProgress||typeof S.shoyakuProgress!=='object')S.shoyakuProgress={};
  shoyakuDraft=JSON.parse(JSON.stringify(S.shoyakuProgress));
  shoyakuDirty=false;shoyakuOnlyNg=false;shoyakuRandom=false;shoyakuRandomItems=[];resetShoyakuReveal();
  renderShoyakuModeSelect();
}
function renderShoyakuModeSelect(){
  setPage('shoyaku');renderStats();$('#scope').textContent='生薬暗記';
  const st=shoyakuStats();
  $('#shoyaku').innerHTML=`<div class="card"><h2>🌱 生薬暗記モード</h2><p class="small">○ ${st.ok}　× ${st.ng}　未選択 ${st.blank}　/ ${st.total}種類</p><p>表示方法を選んでください。</p><div class="kanpoModeChoices"><button id="shoyakuCategoryStart" class="modecard"><h3>カテゴリ順</h3><p>カテゴリと重要度ごとに一覧表示します。</p></button><button id="shoyakuRandomStart" class="modecard kanpoRandomCard"><h3>🔀 完全ランダム</h3><p>カテゴリ名を隠して完全ランダム。名前の後ろに重要度の★だけ表示します。</p></button></div><div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button id="shoyakuResetProgress" class="btn">記録をリセット</button><button id="shoyakuSelectExit" class="btn">ホームへ</button></div></div>`;
  $('#shoyakuResetProgress').onclick=requestShoyakuReset;
  $('#shoyakuCategoryStart').onclick=()=>{shoyakuRandom=false;shoyakuOnlyNg=false;resetShoyakuReveal();renderShoyaku();};
  $('#shoyakuRandomStart').onclick=()=>{shoyakuRandom=true;shoyakuOnlyNg=false;resetShoyakuReveal();shoyakuRandomItems=shuffledShoyaku(allShoyakuEntries());renderShoyaku();};
  $('#shoyakuSelectExit').onclick=requestShoyakuExit;
}
function shoyakuStats(){
  const keys=[...new Set(SHOYAKU_CATEGORIES.flatMap(c=>c.items.map(x=>shoyakuKey(x[0]))))];let ok=0,ng=0;
  keys.forEach(k=>{if(shoyakuDraft?.[k]==='ok')ok++;else if(shoyakuDraft?.[k]==='ng')ng++;});
  return {total:keys.length,ok,ng,blank:keys.length-ok-ng};
}
function shoyakuItemHtml(x){
  const state=shoyakuDraft?.[x.key]||'';
  const originOpen=shoyakuRevealed.has(x.rid+':origin'), actionOpen=shoyakuRevealed.has(x.rid+':action');
  const displayName=shoyakuRandom?`${x.label}　${x.stars}`:x.label;
  return `<article class="kanpoItem shoyakuItem" data-key="${esc(x.key)}" data-rid="${x.rid}">
    <div class="kanpoHead"><div class="kanpoName">${esc(displayName)}</div><div class="kanpoJudge"><button class="kanpoOk ${state==='ok'?'on':''}" data-state="ok">○</button><button class="kanpoNg ${state==='ng'?'on':''}" data-state="ng">×</button></div></div>
    <div class="shoyakuAnswers">
      <button class="kanpoAnswer shoyakuAnswer ${originOpen?'open':''}" data-kind="origin" data-reveal="${x.rid}" aria-expanded="${originOpen?'true':'false'}"><b class="shoyakuLabel">起源</b><span class="kanpoPlaceholder">${originOpen?esc(x.origin):'ここを押すと起源を表示'}</span></button>
      <button class="kanpoAnswer shoyakuAnswer ${actionOpen?'open':''}" data-kind="action" data-reveal="${x.rid}" aria-expanded="${actionOpen?'true':'false'}"><b class="shoyakuLabel">作用</b><span class="kanpoPlaceholder">${actionOpen?esc(x.action):'ここを押すと作用を表示'}</span></button>
    </div>
  </article>`;
}
function renderShoyaku(){
  setPage('shoyaku');renderStats();const modeLabel=shoyakuRandom?'ランダム':'カテゴリ順';$('#scope').textContent=`生薬 ${shoyakuOnlyNg?'×のみ / ':''}${modeLabel}`;
  const st=shoyakuStats();let body='';
  if(shoyakuRandom){
    let items=shoyakuRandomItems.length?shoyakuRandomItems:shuffledShoyaku(allShoyakuEntries());
    if(shoyakuOnlyNg)items=items.filter(x=>shoyakuDraft?.[x.key]==='ng');
    body=items.length?`<section class="kanpoCategory kanpoRandomList">${items.map(shoyakuItemHtml).join('')}</section>`:'<div class="card"><p>×の生薬はありません。</p></div>';
  }else{
    body=SHOYAKU_CATEGORIES.map((cat,ci)=>{
      const items=cat.items.map((item,ii)=>({label:item[0],origin:item[1],action:item[2],key:shoyakuKey(item[0]),rid:`s${ci}_${ii}`,cat:cat.name,importance:cat.importance,stars:cat.stars,ci,ii})).filter(x=>!shoyakuOnlyNg||shoyakuDraft?.[x.key]==='ng');
      if(!items.length)return '';
      return `<section class="kanpoCategory shoyakuCategory"><h2>${esc(cat.name)} <span class="importanceText">${esc(cat.importance)}　${esc(cat.stars)}</span></h2>${items.map(shoyakuItemHtml).join('')}</section>`;
    }).join('')||'<div class="card"><p>×の生薬はありません。</p></div>';
  }
  $('#shoyaku').innerHTML=`<div class="kanpoTop card"><div><h2 style="margin:0">🌱 生薬暗記モード</h2><p class="small" style="margin-bottom:0">○ ${st.ok}　× ${st.ng}　未選択 ${st.blank}　/ ${st.total}種類</p><p class="small" style="margin:4px 0 0">表示：${shoyakuOnlyNg?'×のみ・':''}${modeLabel}</p></div><div class="kanpoTopBtns"><button id="shoyakuCategoryMode" class="btn ${!shoyakuRandom?'primary':''}">カテゴリ順</button><button id="shoyakuRandomMode" class="btn ${shoyakuRandom?'primary':''}">🔀 ランダム</button><button id="shoyakuSaveTop" class="btn">保存</button><button id="shoyakuResetTop" class="btn">記録リセット</button><button id="shoyakuExitTop" class="btn">ホームへ</button></div></div>${body}<div class="card kanpoBottom"><button id="shoyakuNgMode" class="btn primary">${shoyakuOnlyNg?'×のみを再整列':'×のみモード'}</button>${shoyakuOnlyNg?'<button id="shoyakuAllMode" class="btn">全件表示</button>':''}${shoyakuRandom?'<button id="shoyakuReshuffle" class="btn">🔀 再シャッフル</button>':''}<button id="shoyakuSaveBottom" class="btn">保存</button><button id="shoyakuExitBottom" class="btn">ホームへ</button><div id="shoyakuSaveMsg" class="small"></div></div>`;
  $$('#shoyaku .kanpoJudge button').forEach(b=>b.onclick=e=>{const item=e.currentTarget.closest('.shoyakuItem'),key=item.dataset.key,state=e.currentTarget.dataset.state;shoyakuDraft[key]=state;shoyakuDirty=true;item.querySelector('.kanpoOk').classList.toggle('on',state==='ok');item.querySelector('.kanpoNg').classList.toggle('on',state==='ng');const st2=shoyakuStats();const p=$('#shoyaku .kanpoTop .small');if(p)p.textContent=`○ ${st2.ok}　× ${st2.ng}　未選択 ${st2.blank}　/ ${st2.total}種類`;});
  $$('#shoyaku .shoyakuAnswer').forEach(b=>b.onclick=e=>{const btn=e.currentTarget,rid=btn.dataset.reveal,kind=btn.dataset.kind,key=rid+':'+kind;const m=rid.match(/^s(\d+)_(\d+)$/);if(!m)return;const item=SHOYAKU_CATEGORIES[+m[1]].items[+m[2]],txt=kind==='origin'?item[1]:item[2];if(shoyakuRevealed.has(key)){shoyakuRevealed.delete(key);btn.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.querySelector('.kanpoPlaceholder').textContent=kind==='origin'?'ここを押すと起源を表示':'ここを押すと作用を表示';}else{shoyakuRevealed.add(key);btn.classList.add('open');btn.setAttribute('aria-expanded','true');btn.querySelector('.kanpoPlaceholder').textContent=txt;}});
  $('#shoyakuSaveTop').onclick=saveShoyaku;$('#shoyakuSaveBottom').onclick=saveShoyaku;$('#shoyakuResetTop').onclick=requestShoyakuReset;$('#shoyakuExitTop').onclick=requestShoyakuExit;$('#shoyakuExitBottom').onclick=requestShoyakuExit;
  $('#shoyakuCategoryMode').onclick=()=>{shoyakuRandom=false;shoyakuOnlyNg=false;resetShoyakuReveal();renderShoyaku();window.scrollTo({top:0,behavior:'auto'});};
  $('#shoyakuRandomMode').onclick=()=>{shoyakuRandom=true;shoyakuOnlyNg=false;resetShoyakuReveal();shoyakuRandomItems=shuffledShoyaku(allShoyakuEntries());renderShoyaku();window.scrollTo({top:0,behavior:'auto'});};
  $('#shoyakuNgMode').onclick=()=>{shoyakuOnlyNg=true;resetShoyakuReveal();if(shoyakuRandom)shoyakuRandomItems=shuffledShoyaku(allShoyakuEntries().filter(x=>shoyakuDraft?.[x.key]==='ng'));renderShoyaku();window.scrollTo({top:0,behavior:'auto'});};
  if($('#shoyakuAllMode'))$('#shoyakuAllMode').onclick=()=>{shoyakuOnlyNg=false;resetShoyakuReveal();if(shoyakuRandom)shoyakuRandomItems=shuffledShoyaku(allShoyakuEntries());renderShoyaku();window.scrollTo({top:0,behavior:'auto'});};
  if($('#shoyakuReshuffle'))$('#shoyakuReshuffle').onclick=()=>{resetShoyakuReveal();shoyakuRandomItems=shuffledShoyaku(allShoyakuEntries().filter(x=>!shoyakuOnlyNg||shoyakuDraft?.[x.key]==='ng'));renderShoyaku();window.scrollTo({top:0,behavior:'auto'});};
}
function saveShoyaku(){
  const data=JSON.parse(JSON.stringify(shoyakuDraft||{}));
  if(Number.isInteger(shoyakuSavedIndex)&&S.savedSessions[shoyakuSavedIndex]?.type==='shoyakuMemory'){S.savedSessions[shoyakuSavedIndex].progress=data;S.savedSessions[shoyakuSavedIndex].savedAt=Date.now();}
  else S.shoyakuProgress=data;
  save();shoyakuDirty=false;const msg=$('#shoyakuSaveMsg');if(msg){msg.textContent=Number.isInteger(shoyakuSavedIndex)?'保存記録を上書きしました。':'保存しました。';setTimeout(()=>{if($('#shoyakuSaveMsg'))$('#shoyakuSaveMsg').textContent='';},1800);}
}
function archiveShoyakuProgress(){
  const data=JSON.parse(JSON.stringify(shoyakuDraft||S.shoyakuProgress||{}));
  if(Number.isInteger(shoyakuSavedIndex)&&S.savedSessions[shoyakuSavedIndex]?.type==='shoyakuMemory'){S.savedSessions[shoyakuSavedIndex].progress=data;S.savedSessions[shoyakuSavedIndex].savedAt=Date.now();}
  else S.savedSessions.push({type:'shoyakuMemory',label:'生薬暗記・保存記録',progress:data,savedAt:Date.now(),positionLabel:'○×の保存記録'});
}
function ensureShoyakuResetModal(){
  if($('#shoyakuResetModal'))return;const d=document.createElement('div');d.id='shoyakuResetModal';d.className='modal';
  d.innerHTML=`<div class="modalbox"><h2>生薬暗記の記録をリセットしますか？</h2><p class="small">現在の○×を「保存した学習」に残してからリセットすることもできます。リセット後、生薬暗記モードを開くと未選択の状態から始まります。</p><div class="exitChoices"><button id="shoyakuResetSave" class="btn primary">今の状態を保存してリセット</button><button id="shoyakuResetNoSave" class="btn">保存せずリセット</button><button id="shoyakuResetCancel" class="btn">やめる</button></div></div>`;document.body.appendChild(d);
  $('#shoyakuResetSave').onclick=()=>performShoyakuReset(true);$('#shoyakuResetNoSave').onclick=()=>performShoyakuReset(false);$('#shoyakuResetCancel').onclick=()=>$('#shoyakuResetModal').classList.remove('show');
}
function requestShoyakuReset(){ensureShoyakuResetModal();$('#shoyakuResetModal').classList.add('show');}
function performShoyakuReset(archive){
  if(archive)archiveShoyakuProgress();
  S.shoyakuProgress={};shoyakuDraft={};shoyakuSavedIndex=null;shoyakuDirty=false;shoyakuOnlyNg=false;shoyakuRandom=false;shoyakuRandomItems=[];resetShoyakuReveal();
  save();$('#shoyakuResetModal')?.classList.remove('show');renderHome();
}
function ensureShoyakuExitModal(){
  if($('#shoyakuExitModal'))return;const d=document.createElement('div');d.id='shoyakuExitModal';d.className='modal';
  d.innerHTML=`<div class="modalbox"><h2>生薬暗記を終了しますか？</h2><p class="small">保存しない場合、今回の○×変更は捨てて最後に保存した状態へ戻ります。</p><div class="exitChoices"><button id="shoyakuExitSave" class="btn primary">保存して戻る</button><button id="shoyakuExitDiscard" class="btn">保存せず戻る</button><button id="shoyakuExitCancel" class="btn">生薬暗記に戻る</button></div></div>`;document.body.appendChild(d);
  $('#shoyakuExitSave').onclick=()=>{saveShoyaku();$('#shoyakuExitModal').classList.remove('show');shoyakuDraft=null;shoyakuSavedIndex=null;shoyakuDirty=false;renderHome();};
  $('#shoyakuExitDiscard').onclick=()=>{$('#shoyakuExitModal').classList.remove('show');shoyakuDraft=null;shoyakuSavedIndex=null;shoyakuDirty=false;renderHome();};
  $('#shoyakuExitCancel').onclick=()=>$('#shoyakuExitModal').classList.remove('show');
}
function requestShoyakuExit(){if(!shoyakuDirty){shoyakuDraft=null;shoyakuSavedIndex=null;renderHome();return;}ensureShoyakuExitModal();$('#shoyakuExitModal').classList.add('show');}

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
  if(page==='kanpo'){ if(kanpoDirty){requestKanpoExit();} else goDestination(dest); return; }
  if(page==='shoyaku'){ if(shoyakuDirty){requestShoyakuExit();} else goDestination(dest); return; }
  if(S.active) requestExit(dest); else goDestination(dest);
}

window.addEventListener('DOMContentLoaded',()=>{
  const e=integrity();
  if(e.length){document.body.innerHTML='<pre>正答データ検証エラー\n'+e.slice(0,20).join('\n')+'</pre>';return;}
  $('#verifyStatus').textContent='✓ 公式解答PDFから作成：720 / 720問。起動時に正答キーを自動照合。';
  $('#tabHome').onclick=()=>page==='kanpo'?requestKanpoExit():page==='shoyaku'?requestShoyakuExit():(S.active?requestExit({kind:'home'}):renderHome());
  $('#tabWeak').onclick=()=>{if(page==='kanpo'){if(kanpoDirty){requestKanpoExit();}else renderList('weak');}else if(page==='shoyaku'){if(shoyakuDirty){requestShoyakuExit();}else renderList('weak');}else S.active?requestExit({kind:'list',filter:'weak'}):renderList('weak');};
  $('#settings').onclick=()=>$('#modal').classList.add('show');
  $('#close').onclick=()=>$('#modal').classList.remove('show');
  $('#reset').onclick=()=>{if(confirm('全記録を消しますか？')){S=blank();save();renderHome();$('#modal').classList.remove('show');}};
  $('#export').onclick=exportData;
  $('#import').onchange=e=>e.target.files[0]&&importData(e.target.files[0]);
  $('#seen').closest('.stat').onclick=()=>statDestination('answered');
  $('#correct').closest('.stat').onclick=()=>statDestination('correct');
  $('#weak').closest('.stat').onclick=()=>statDestination('weak');
  $$('.stat').forEach(x=>{x.classList.add('statLink');x.setAttribute('role','button');x.tabIndex=0;});
  renderHome();
  if('serviceWorker'in navigator&&location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
});
