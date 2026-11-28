const R={KRW:1400,VND:25400,USD:1,USDT:1,EUR:.92,JPY:150,RUB:90,UZS:12700},CUR=Object.keys(R),API=window.MONIFY_API||"";
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const f=(n,c)=>(Math.abs(n)<100&&n%1?n.toFixed(2):Math.round(n).toLocaleString("en-US"))+(c?" "+c:""),cv=(a,x,y)=>a/R[x]*R[y],cl=x=>Math.max(0,Math.min(1,x));
const ld=k=>JSON.parse(localStorage.getItem(k)||"null"),sv=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const opt=d=>CUR.map(c=>`<option ${c==d?"selected":""}>${c}</option>`).join(""),today=()=>new Date().toISOString().slice(0,10);
const JN=["Thiết yếu","Học phí/Giáo dục","Tiết kiệm dài hạn","Hưởng thụ","Đầu tư","Gửi về nhà"],JP=[40,15,15,10,10,10];
let S,U,tab=0,per=30;
async function api(a,p){
  if(API){const r=await fetch(API,{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify({action:a,...p})});return r.json()}
  const us=ld("mf_users")||[{id:1,username:"monify",fullName:"Monify Demo",dob:"2000-01-01",password:"828282",email:"demo@monify.app"}];
  if(a=="login"){const u=us.find(x=>x.username==p.username&&x.password==p.password);return u?{ok:1,user:u,data:ld("mf_d"+u.id)}:{ok:0,msg:"Sai tên đăng nhập hoặc mật khẩu"}}
  if(a=="register"){if(us.some(x=>x.username==p.username))return{ok:0,msg:"Tên đăng nhập đã tồn tại"};const u={...p,id:Math.max(...us.map(x=>x.id))+1};us.push(u);sv("mf_users",us);return{ok:1,user:u}}
  if(a=="save"){sv("mf_d"+p.userId,p.data);return{ok:1}}
}
const save=()=>api("save",{userId:U.id,data:S});
function blank(){return{base:"KRW",wallets:[],savings:[],tx:[],jars:JN.map((n,i)=>({n,p:JP[i]})),goals:[],subs:[],visa:1e7,sent:0,inc:3e6,travel:false,alerts:[]}}
function seed(){const s=blank(),w=(id,name,type,country,cur,bal)=>({id,name,type,country,cur,bal});
  s.wallets=[w(1,"Ngân hàng Toss","Bank","Hàn Quốc","KRW",1e6),w(2,"Ngân hàng Việt Nam","Bank","Việt Nam","VND",3e6),w(3,"Tiền mặt USD","Cash","Quốc tế","USD",1000),w(4,"Tiền mặt Việt Nam","Cash","Việt Nam","VND",7e6),w(5,"Tiền mặt Hàn Quốc","Cash","Hàn Quốc","KRW",3e5)];
  s.savings=[{id:1,bank:"Sổ tiết kiệm Hàn Quốc",country:"Hàn Quốc",cur:"KRW",principal:1e7,start:"2025-06-03",mat:"2026-06-03",rate:3},{id:2,bank:"Sổ tiết kiệm Việt Nam",country:"Việt Nam",cur:"VND",principal:2e8,start:"2026-06-03",mat:"2027-06-03",rate:5}];
  s.subs=[{n:"Coupang Wow",amt:7890,cur:"KRW",day:5},{n:"Netflix",amt:13.99,cur:"USD",day:12},{n:"ChatGPT",amt:20,cur:"USD",day:20}];
  s.sent=12000;s.goals=[{n:"Học phí kỳ sau",t:8e6,cur:"KRW",dl:"2027-02-28",saved:2e6}];
  for(let m=0;m<12;m++)[[10,"Income","",3e6],[3,"Expense",0,7e5+m%3*8e4],[12,"Expense",3,25e4+m%4*9e4],[24,"Expense",1,3e5]].forEach(([d,t,j,a],i)=>{const x=new Date();x.setDate(1);x.setMonth(x.getMonth()-m);x.setDate(d);if(x>new Date())return;s.tx.push({id:"s"+m+i,date:x.toISOString().slice(0,10),type:t,cur:"KRW",amt:a,jar:j,wallet:1,travel:false,note:""})});
  return s}
const tot=(c=S.base)=>S.wallets.reduce((a,w)=>a+cv(w.bal,w.cur,c),0)+S.savings.reduce((a,s)=>a+cv(s.principal,s.cur,c),0);
const days=d=>Math.ceil((new Date(d)-new Date())/864e5);

/* ---------- Auth ---------- */
$("#app").innerHTML=`<div class=center><img src="./logo1.png" width=180 alt="Monify" onerror="this.outerHTML='<h1>Monify</h1>'"></div>`;setTimeout(login,2000);
const eye=i=>{const x=$("#"+i);x.type=x.type=="password"?"text":"password"};
function login(){$("#app").innerHTML=`<div class=pad><h1>Monify</h1><p class=sm>My Finance Manager</p><br><input id=u placeholder="Tên đăng nhập" autocomplete=username><div class=pw><input id=p type=password placeholder="Mật khẩu"><a onclick="eye('p')">Hiện/Ẩn</a></div><p id=m class=sm></p><br><button class=btn style="width:100%" onclick=doLogin()>Đăng nhập</button><p class=sm style="margin-top:14px">Chưa có tài khoản? <a onclick=reg()>Đăng ký ngay</a></p></div>`}
async function doLogin(){const r=await api("login",{username:$("#u").value.trim(),password:$("#p").value});if(!r.ok)return $("#m").textContent=r.msg||"Lỗi đăng nhập";U=r.user;S={...blank(),...(r.data||(U.id==1?seed():{}))};if(!r.data)save();tab=0;draw()}
function reg(){$("#app").innerHTML=`<div class=pad><h2>Đăng ký</h2><input id=ru placeholder="Tên đăng nhập"><input id=rn placeholder="Họ và tên"><input id=rd type=date><div class=pw><input id=rp type=password placeholder="Mật khẩu"><a onclick="eye('rp')">Hiện/Ẩn</a></div><input id=re type=email placeholder="Email"><p id=m class=sm></p><button class=btn style="width:100%" onclick=doReg()>Đăng ký</button><p class=sm style="margin-top:14px"><a onclick=login()>← Quay lại đăng nhập</a></p></div>`}
async function doReg(){const p={username:$("#ru").value.trim(),fullName:$("#rn").value.trim(),dob:$("#rd").value,password:$("#rp").value,email:$("#re").value.trim()};if(Object.values(p).some(v=>!v))return $("#m").textContent="Vui lòng điền đủ 5 trường";const r=await api("register",p);if(!r.ok)return $("#m").textContent=r.msg;U=r.user;S=blank();save();tab=0;draw()}

/* ---------- Shell ---------- */
function draw(){$("#app").innerHTML=`<main>${[home,xfer,spend,goals,ai][tab]()}</main><nav>${["Trang chủ","Chuyển tiền","Chi tiêu","Mục tiêu","Trợ lý AI"].map((n,i)=>`<button class="${i==tab?"on":""}" onclick="tab=${i};draw()">${n}</button>`).join("")}</nav>`;if(tab==1){cmp();spl()}if(tab==2)chart()}

/* ---------- Tab 1 ---------- */
function home(){const K=tot("KRW"),ok=K>=S.visa*1.2,n=S.wallets.length;
return`<div class="card g1"><div class=sm>Tổng tài sản (gồm sổ tiết kiệm)</div><div class="big num">${f(tot(),S.base)}</div><select style="width:auto" onchange="S.base=this.value;save();draw()">${["KRW","USD","VND","USDT"].map(c=>`<option ${c==S.base?"selected":""}>${c}</option>`).join("")}</select></div>
<h2>Ví tiền · ${n}/6 ví</h2>${S.wallets.map(w=>`<div class="card row"><div><b>${esc(w.name)}</b><div class=sm>${w.type} · ${esc(w.country)}</div></div><div class=num style="text-align:right"><b>${f(w.bal,w.cur)}</b><div class=sm><a onclick="wal(${w.id})">Sửa</a> · <a onclick="delw(${w.id})">Xóa</a></div></div></div>`).join("")}<button class=btn ${n>=6?"disabled":""} onclick="wal()">+ Thêm ví</button>
<h2>Sổ tiết kiệm</h2>${S.savings.map(s=>{const d=days(s.mat),it=s.principal*s.rate/100*Math.max(0,(new Date(s.mat)-new Date(s.start))/864e5)/365;return`<div class="card vel"><div class=row><b>${esc(s.bank)}</b><span class=num>${d>=0?"D-"+d:"Đã đáo hạn D+"+-d}</span></div><div class="num big" style="font-size:20px">${f(s.principal,s.cur)}</div><div class=sm>${s.start} → ${s.mat} · ${s.rate}%/năm · lãi dự kiến ${f(it,s.cur)}</div><button class=btn style="margin-top:8px" onclick="esav(${s.id})">Chỉnh sửa</button></div>`}).join("")}
<h2>Lá chắn số dư Visa</h2><div class="card ${ok?"":"deep"}"><div class=sm>Số dư tối thiểu cần giữ (KRW)</div><input type=number value=${S.visa} onchange="S.visa=+this.value;save();draw()"><div class="bar ${ok?"":"w"}"><i style="width:${cl(S.visa/K)*100}%"></i></div><div>${ok?"An toàn":"Cảnh báo: số dư khả dụng sát ngưỡng!"} · khả dụng ${f(Math.max(0,K-S.visa),"KRW")}</div></div>
<h2>Radar hạn mức $50,000/năm</h2><div class=card><div class=row><b class=num>$${f(S.sent)} / $50,000</b><a onclick=addSent()>+ Ghi nhận</a></div><div class="bar ${S.sent>4e4?"w":""}"><i style="width:${cl(S.sent/5e4)*100}%"></i></div><div class=sm>Nhắc: quyết toán/hoàn thuế vào tháng 5. Chỉ mang tính tham khảo.</div></div>`}
function wal(id){const w=S.wallets.find(x=>x.id==id)||{id:Date.now(),name:"",type:"Bank",country:"",cur:"KRW",bal:0},nw=!S.wallets.includes(w);if(nw&&S.wallets.length>=6)return;const name=prompt("Tên ví",w.name);if(!name)return;const cur=(prompt("Tiền tệ: "+CUR.join("/"),w.cur)||w.cur).toUpperCase();if(!R[cur])return alert("Tiền tệ không hỗ trợ");const type=/cash/i.test(prompt("Loại: Bank hoặc Cash",w.type)||"")?"Cash":"Bank",country=prompt("Quốc gia",w.country)||"",b=parseFloat(prompt("Số dư ("+cur+")",w.bal));Object.assign(w,{name,cur,type,country,bal:isNaN(b)?0:b});if(nw)S.wallets.push(w);save();draw()}
function delw(id){if(confirm("Xóa ví này?")){S.wallets=S.wallets.filter(w=>w.id!=id);save();draw()}}
function esav(id){const s=S.savings.find(x=>x.id==id);s.principal=parseFloat(prompt("Số tiền gốc",s.principal))||s.principal;s.start=prompt("Ngày mở (YYYY-MM-DD)",s.start)||s.start;s.mat=prompt("Ngày đáo hạn (YYYY-MM-DD)",s.mat)||s.mat;s.rate=parseFloat(prompt("Lãi suất %/năm",s.rate))||s.rate;save();draw()}
function addSent(){const a=parseFloat(prompt("Số tiền đã chuyển (USD)"));if(a>0){S.sent+=a;save();draw()}}

/* ---------- Tab 2 ---------- */
function cmp(){const a=+$("#ca").value||0,fr=$("#cf").value,to=$("#ct").value,P=[["SentBe",3000,.005,"1~2 ngày"],["Hanpass",0,.009,"1~2 ngày"],["WireBarley",2500,.004,"Vài phút~1 ngày"],["Stablecoin USDT/USDC",1500,.002,"Vài phút"]];
const r=P.map(p=>{const fee=cv(p[1],"KRW",fr);return{n:p[0],fee,get:Math.max(0,cv(a-fee,fr,to)*(1-p[2])),t:p[3]}}).sort((x,y)=>y.get-x.get);
$("#co").innerHTML=r.map((x,i)=>`<div class="card ${i?"":"best"}" style="margin:6px 0"><div class=row><b>${x.n}${i?"":" · Tốt nhất"}</b><b class=num>${f(x.get,to)}</b></div><div class=sm>Phí ${f(x.fee,fr)} · ${x.t}</div></div>`).join("")}
function qr(){let h=0;for(const c of U.username)h=(h*31+c.charCodeAt(0))>>>0;let s="";for(let y=0;y<15;y++)for(let x=0;x<15;x++){h=(h*1103515245+12345)>>>0;if((h>>>16)&1||(x<3&&y<3)||(x>11&&y<3)||(x<3&&y>11))s+=`<rect x=${x} y=${y} width=1 height=1 />`}return`<svg viewBox="-1 -1 17 17" width=140 style="background:#FAF9F8;border-radius:12px" fill="#150811">${s}</svg>`}
function scanSim(){const a=+$("#qa").value||0,p=$("#qp").value,r=$("#qr").value;$("#qo").textContent=`Người gửi trả ${f(a,p)} → người nhận nhận ${f(cv(a,p,r)*.998,r)}`}
function spl(){const L=$("#sp").value.split("\n").map(l=>l.split(",")).filter(x=>x.length==3&&R[x[2].trim().toUpperCase()]).map(x=>({n:x[0].trim(),p:cv(+x[1],x[2].trim().toUpperCase(),"KRW")}));if(!L.length){$("#so").innerHTML="";return}
const sh=L.reduce((a,x)=>a+x.p,0)/L.length,D=L.filter(x=>x.p<sh-1).map(x=>({n:x.n,a:sh-x.p})),C=L.filter(x=>x.p>sh+1).map(x=>({n:x.n,a:x.p-sh})),o=[];for(const d of D)for(const c of C){const m=Math.min(d.a,c.a);if(m>1){o.push(`${d.n} → ${c.n}: ${f(m,"KRW")}`);d.a-=m;c.a-=m}}
$("#so").innerHTML=`<p class=sm>Tổng ${f(sh*L.length,"KRW")} · mỗi người ${f(sh,"KRW")}</p>`+(o.map(x=>`<div class=row><b class=num>${x}</b></div>`).join("")||"Đã cân bằng")}
function xfer(){const map=q=>"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(q);
return`<h2>So sánh chuyển tiền quốc tế</h2><div class=card><input id=ca type=number value=1000000 oninput=cmp()><div class=row><select id=cf onchange=cmp()>${opt("KRW")}</select><select id=ct onchange=cmp()>${opt("VND")}</select></div><div id=co></div><p class=sm>Phí và biên độ tỷ giá là số mẫu; cần nối API thật.</p></div>
<h2>My QR</h2><div class="card dark" style="text-align:center">${qr()}<p class=sm>@${esc(U.username)} · mã QR mô phỏng</p><input id=qa type=number placeholder="Số tiền" style="color:#150811"><div class=row><select id=qp>${opt("KRW")}</select><select id=qr>${opt("VND")}</select></div><button class=btn onclick=scanSim()>Quét QR & gửi (mô phỏng)</button><p id=qo class=sm></p></div>
<h2>Chia tiền nhóm đa tiền tệ</h2><div class=card><p class=sm>Mỗi dòng: Tên,Số tiền đã trả,Tiền tệ</p><textarea id=sp rows=4 oninput=spl()>An,300000,KRW
Dasha,100,USD
Tan,2000000,VND</textarea><div id=so></div></div>
<h2>Global ATM & tiệm đổi tiền</h2><div class=card>${[["Global ATM 24/7 Myeongdong","Myeongdong"],["Tiệm đổi tiền tỷ giá tốt Hongdae","Hongdae"],["Tiệm đổi tiền tỷ giá tốt Itaewon","Itaewon"]].map(x=>`<div class=row><b>${x[1]}</b><a href="${map(x[0])}" target=_blank rel=noopener>Chỉ đường</a></div>`).join("")}</div>`}

/* ---------- Tab 3 ---------- */
function spend(){const m=today().slice(0,7),sp=j=>S.tx.filter(t=>t.type=="Expense"&&!t.travel&&t.jar===j&&t.date.startsWith(m)).reduce((a,t)=>a+cv(t.amt,t.cur,"KRW"),0),tp=S.jars.reduce((a,j)=>a+j.p,0),ms=S.subs.reduce((a,s)=>a+cv(s.amt,s.cur,"KRW"),0),tm=new Date(Date.now()+864e5).getDate();
return`<h2>6 chiếc lọ</h2><div class=card><div class=sm>Thu nhập tháng (KRW)</div><input type=number value=${S.inc} onchange="S.inc=+this.value;save();draw()"></div>
${S.jars.map((j,i)=>{const al=S.inc*j.p/100,u=sp(i);return`<div class=card><div class=row><input value="${esc(j.n)}" onchange="S.jars[${i}].n=this.value;save()" style="width:65%"><b class=num>${j.p}%</b></div><input type=range min=0 max=100 value=${j.p} oninput="S.jars[${i}].p=+this.value;this.previousElementSibling.lastElementChild.textContent=this.value+'%'" onchange="save();draw()"><div class="bar ${u>al?"w":""}"><i style="width:${al?cl(u/al)*100:0}%"></i></div><div class=sm>Đã chi ${f(u,"KRW")} / ${f(al,"KRW")}</div></div>`}).join("")}
<div class="card ${tp==100?"":"deep"}">Tổng: ${tp}% ${tp==100?"✓":"— cần đúng 100%"}</div>
<h2>Thêm khoản chi</h2><div class=card><input id=xa type=number placeholder="Số tiền"><div class=row><select id=xc>${opt("KRW")}</select><select id=xj>${S.jars.map((j,i)=>`<option value=${i}>${esc(j.n)}</option>`).join("")}</select></div><input id=xd type=date value=${today()}><label class=sm><input id=xt type=checkbox ${S.travel?"checked":""} style="width:auto"> Chi tiêu du lịch/về nước</label><div class=row><button class=btn onclick=addX()>Lưu</button><label class="btn s">Quét hóa đơn (demo)<input type=file accept="image/*" hidden onchange=scan()></label></div></div>
<h2>Phân tích dòng tiền</h2><div class=card><div class=tabs>${[[7,"1 Tuần"],[30,"1 Tháng"],[90,"3 Tháng"],[180,"6 Tháng"],[365,"1 Năm"]].map(x=>`<button class="btn ${per==x[0]?"":"s"}" onclick="per=${x[0]};draw()">${x[1]}</button>`).join("")}</div><div id=ch></div></div>
<h2>Gói đăng ký định kỳ · ${f(ms,"KRW")}/tháng</h2><div class=card>${S.subs.map((s,i)=>`<div class=row><div><b>${esc(s.n)}</b><div class=sm>Ngày ${s.day} hằng tháng${s.day==tm?" · thanh toán trong 24h tới!":""}</div></div><div class=num>${f(s.amt,s.cur)} <a onclick="S.subs.splice(${i},1);save();draw()">Xóa</a></div></div>`).join("")}<button class=btn onclick=addSub()>+ Thêm gói</button></div>`}
function addX(){const a=+$("#xa").value;if(!a)return;const c=$("#xc").value;S.tx.push({id:"t"+Date.now(),date:$("#xd").value||today(),type:"Expense",cur:c,amt:a,jar:+$("#xj").value,wallet:0,travel:$("#xt").checked,note:""});const w=S.wallets.find(x=>x.cur==c);if(w)w.bal-=a;save();draw()}
function scan(){$("#xa").value=15800;$("#xc").value="KRW";$("#xj").value=0;$("#xd").value=today();alert("Demo: đã điền mẫu 15,800 KRW → hũ Thiết yếu. Để OCR thật cần nối API (Claude/Google Vision).")}
function addSub(){const n=prompt("Tên gói");if(!n)return;const c=(prompt("Tiền tệ: KRW hoặc USD","KRW")||"KRW").toUpperCase(),a=parseFloat(prompt("Số tiền/tháng")),d=parseInt(prompt("Ngày thanh toán (1-28)","1"));if(R[c]&&a>0){S.subs.push({n,amt:a,cur:c,day:d||1});save();draw()}}
function chart(){const[n,l]={7:[7,1],30:[4,7],90:[3,30],180:[6,30],365:[12,30]}[per],b=Array.from({length:n},()=>({i:0,x:0})),now=Date.now();
S.tx.filter(t=>!t.travel).forEach(t=>{const k=Math.floor((now-new Date(t.date))/864e5/l);if(k>=0&&k<n)b[n-1-k][t.type=="Income"?"i":"x"]+=cv(t.amt,t.cur,"KRW")});
const mx=Math.max(1,...b.map(o=>Math.max(o.i,o.x))),av=b.reduce((a,o)=>a+o.x,0)/n,w=300/n;
$("#ch").innerHTML=`<svg viewBox="0 0 300 120">${b.map((o,k)=>`<rect x="${k*w+2}" y="${110-o.i/mx*100}" width="${w/2-3}" height="${o.i/mx*100}" fill="#BEB8CD"/><rect x="${k*w+w/2}" y="${110-o.x/mx*100}" width="${w/2-3}" height="${o.x/mx*100}" fill="${o.x>av*1.2?"#531245":"#AAAAFF"}"/>`).join("")}</svg><p class=sm>Thu nhập (xám) · Chi tiêu (xanh) · Chi vượt mức trung bình (tím đậm)</p>`}

/* ---------- Tab 4 ---------- */
function goals(){const tr=S.tx.filter(t=>t.travel).reduce((a,t)=>a+cv(t.amt,t.cur,"KRW"),0);
return`<div class="card vel row"><div><b>Chế độ Về nước / Du lịch</b><div class=sm>Chi tiêu chuyến đi tách khỏi thống kê sinh hoạt</div></div><button class=btn onclick="S.travel=!S.travel;save();draw()">${S.travel?"BẬT":"TẮT"}</button></div><div class=card>Chi tiêu du lịch: <b class=num>${f(tr,"KRW")}</b></div>
<h2>Mục tiêu tài chính</h2>${S.goals.map((g,i)=>{const ml=Math.max(1,Math.ceil((new Date(g.dl)-new Date())/2592e6)),mo=Math.max(0,g.t-g.saved)/ml;return`<div class=card><div class=row><b>${esc(g.n)}</b><a onclick="S.goals.splice(${i},1);save();draw()">Xóa</a></div><div class=bar><i style="width:${cl(g.saved/g.t)*100}%"></i></div><div class=sm>${f(g.saved,g.cur)} / ${f(g.t,g.cur)} · hạn ${g.dl}</div><div>Cần để dành mỗi tháng: <b class=num>${f(mo,g.cur)}</b></div><div class=sm>Gợi ý: chia ~${f(cv(mo,g.cur,"USDT")/4,"USDT")}/lần, đổi 4 lần/tháng khi tỷ giá thuận lợi.</div></div>`}).join("")}<button class=btn onclick=addG()>+ Thêm mục tiêu</button>`}
function addG(){const n=prompt("Tên mục tiêu (học phí, tiền cọc nhà...)");if(!n)return;const c=(prompt("Tiền tệ: "+CUR.join("/"),"KRW")||"KRW").toUpperCase(),t=parseFloat(prompt("Số tiền mục tiêu")),dl=prompt("Hạn chót (YYYY-MM-DD)"),sv2=parseFloat(prompt("Đã tích lũy","0"))||0;if(R[c]&&t>0&&dl){S.goals.push({n,t,cur:c,dl,saved:sv2});save();draw()}}

/* ---------- Tab 5 ---------- */
function hs(){const K=tot("KRW"),m=today().slice(0,7),ex=S.tx.filter(t=>t.type=="Expense"&&!t.travel&&Date.now()-new Date(t.date)<2592e6).reduce((a,t)=>a+cv(t.amt,t.cur,"KRW"),0),r=S.inc?(S.inc-ex)/S.inc:0,a=Math.round(cl(r/.2)*40),b=K>=S.visa*1.2?30:K>=S.visa?15:0,tp=S.jars.reduce((x,j)=>x+j.p,0),
over=S.jars.filter((j,i)=>S.tx.filter(t=>t.type=="Expense"&&!t.travel&&t.jar===i&&t.date.startsWith(m)).reduce((x,t)=>x+cv(t.amt,t.cur,"KRW"),0)>S.inc*j.p/100).length,c=tp==100?Math.round(30*(6-over)/6):0,tips=[];
if(a<40)tips.push("Tỷ lệ tiết kiệm dưới 20%: tuần này thử giảm chi ở hũ Hưởng thụ.");if(b<30)tips.push("Số dư sát ngưỡng Visa: tạm dừng chi lớn và bổ sung số dư.");if(c<30)tips.push(tp==100?"Có hũ chi vượt hạn mức: xem lại tab Chi tiêu.":"Tổng % các hũ chưa bằng 100%.");
return{s:a+b+c,tips:tips.slice(0,2)}}
function addAl(){const p=$("#ap").value,th=parseFloat($("#at").value);if(th>0){S.alerts.push({p,th});save();draw()}}
function ai(){const h=hs();
return`<div class="card deep"><div class=sm>Điểm sức khỏe tài chính</div><div class="big num">${h.s} / 100</div><div class="bar"><i style="width:${h.s}%"></i></div>${h.tips.map(t=>`<div>• ${t}</div>`).join("")||"<div>Tuyệt vời, hãy duy trì!</div>"}</div>
<h2>Canh tỷ giá mục tiêu</h2><div class=card><div class=row><select id=ap>${["KRW/VND","USD/KRW","USD/VND","KRW/USD"].map(x=>`<option>${x}</option>`).join("")}</select><input id=at type=number step=any placeholder="Ngưỡng"></div><button class=btn onclick=addAl()>Đặt cảnh báo</button>
${S.alerts.map((a,i)=>{const[x,y]=a.p.split("/"),r=cv(1,x,y);return`<div class=row><div><b>${a.p} ≥ ${a.th}</b><div class=sm>Hiện tại (mẫu): ${r.toFixed(r<1?5:2)} · ${r>=a.th?"ĐÃ ĐẠT ngưỡng":"chưa đạt"}</div></div><a onclick="S.alerts.splice(${i},1);save();draw()">Xóa</a></div>`}).join("")}</div>
<p class=sm><i>Phân tích chỉ mang tính tham khảo dựa trên dữ liệu lịch sử, không cam kết dự đoán chính xác tỷ giá tương lai.</i></p>`}
