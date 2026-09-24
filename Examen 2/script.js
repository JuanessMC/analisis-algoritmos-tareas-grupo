const $=s=>document.querySelector(s),NS='http://www.w3.org/2000/svg',W=700,H=690;
const el=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p&&p.appendChild(e);return e};
const P=(lo,la)=>[(lo+118)*7.4,(35-la)*7.4];
const KM=15; // km por pixel aprox.
const fmt=n=>n.toLocaleString('es');
const nodes=[['A','MEX','Ciudad de México',-99.1,19.4],['B','HAV','La Habana',-82.4,23.1],['C','BOG','Bogotá',-74.1,4.7],['D','LIM','Lima',-77,-12],['E','SCL','Santiago',-70.8,-33.4],['F','EZE','Buenos Aires',-58.5,-34.8],['G','GRU','São Paulo',-46.5,-23.4]]
.map(([id,code,name,lo,la])=>{const[x,y]=P(lo,la);return{id,code,name,x,y,x0:x,y0:y}});
const byId=Object.fromEntries(nodes.map(n=>[n.id,n]));
const edges=['AB','AC','AD','BC','CD','CF','CG','DE','DG','EF','FG','DF'].map(s=>({a:byId[s[0]],b:byId[s[1]]}));
const km=(a,b)=>Math.round(Math.hypot(a.x-b.x,a.y-b.y)*KM);

const svg=$('#map');
const land=[
[[-118,35],[-100,35],[-96,28],[-97,22],[-94,18],[-90,21],[-87,21],[-88,16],[-84,15],[-83,10],[-79,9],[-77,8],[-80,7.5],[-83,8],[-86,11],[-92,14],[-96,16],[-105,20],[-110,24],[-112,29],[-118,32]],
[[-77,8],[-72,12],[-64,10.5],[-60,8],[-52,5],[-50,0],[-44,-2],[-35,-6],[-35,-9],[-39,-15],[-41,-22],[-48,-26],[-53,-34],[-58,-35],[-57,-38],[-62,-39],[-65,-42],[-68,-50],[-69,-54],[-72,-52],[-74,-45],[-73,-38],[-71,-30],[-70,-18],[-76,-14],[-81,-5],[-80,0],[-78,3]],
[[-85,22],[-80,23.2],[-74,20],[-78,19.8],[-82,21.8]],
[[-100,35],[-96,28],[-90,29],[-82,30],[-80,26],[-79,35]]
];
land.forEach(poly=>el('path',{d:'M'+poly.map(([lo,la])=>P(lo,la).join(',')).join('L')+'Z',fill:'var(--land)',stroke:'var(--coast)','stroke-width':1.5,'stroke-linejoin':'round'},svg));
for(let lo=-110;lo<=-30;lo+=20)el('line',{x1:P(lo,0)[0],y1:0,x2:P(lo,0)[0],y2:H,stroke:'var(--coast)','stroke-width':.4,opacity:.5},svg);
for(let la=30;la>=-50;la-=20)el('line',{x1:0,y1:P(0,la)[1],x2:W,y2:P(0,la)[1],stroke:'var(--coast)','stroke-width':.4,opacity:.5},svg);

const gE=el('g',{},svg),gR=el('polyline',{fill:'none',stroke:'var(--acc)','stroke-width':5,'stroke-linecap':'round','stroke-linejoin':'round',opacity:.9},svg),gN=el('g',{},svg);
edges.forEach(e=>{e.l=el('line',{stroke:'var(--edge)','stroke-width':1.6,'stroke-dasharray':'5 4'},gE);e.t=el('text',{class:'wl','text-anchor':'middle'},gE)});
nodes.forEach(n=>{
 n.g=el('g',{class:'nd',tabindex:0,role:'button','aria-label':n.name},gN);
 n.c=el('circle',{r:15,fill:'var(--node)',stroke:'#fff','stroke-width':2.5},n.g);
 const t=el('text',{'text-anchor':'middle',y:4.5,fill:'#fff','font-size':13,'font-weight':700,'pointer-events':'none'},n.g);t.textContent=n.id;
 n.lb=el('text',{class:'nl','text-anchor':'middle',y:32},n.g);n.lb.textContent=n.code+' · '+n.name;
 n.g.addEventListener('pointerdown',ev=>{drag=n;stopFly();svg.setPointerCapture(ev.pointerId);ev.preventDefault()});
});
const plane=el('path',{d:'M14 0L4-2-2-12-5-12-2-2-9-2-11-6-13-6-12 0-13 6-11 6-9 2-2 2-5 12-2 12 4 2Z',fill:'var(--acc)',stroke:'#fff','stroke-width':1.2,visibility:'hidden'},svg);
plane.style.pointerEvents='none';
const tag=el('text',{class:'nl','text-anchor':'middle',visibility:'hidden'},svg);

let drag=null,route=[],legs=[],direct=null,pos=0,total=0,flying=false,last=0,raf=0,cum=[];
svg.addEventListener('pointermove',ev=>{
 if(!drag)return;
 const pt=svg.createSVGPoint();pt.x=ev.clientX;pt.y=ev.clientY;
 const q=pt.matrixTransform(svg.getScreenCTM().inverse());
 drag.x=Math.max(20,Math.min(W-20,q.x));drag.y=Math.max(20,Math.min(H-40,q.y));
 update();solve();
});
const end=()=>{drag=null};svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);

function update(){
 nodes.forEach(n=>n.g.setAttribute('transform',`translate(${n.x},${n.y})`));
 edges.forEach(e=>{const{a,b}=e;e.l.setAttribute('x1',a.x);e.l.setAttribute('y1',a.y);e.l.setAttribute('x2',b.x);e.l.setAttribute('y2',b.y);
  e.t.setAttribute('x',(a.x+b.x)/2);e.t.setAttribute('y',(a.y+b.y)/2-4);e.t.textContent=km(a,b).toLocaleString('es')+' km'});
}
function dij(s,t){
 const dist={},prev={},seen={};nodes.forEach(n=>dist[n.id]=Infinity);dist[s]=0;
 for(;;){
  let u=null;nodes.forEach(n=>{if(!seen[n.id]&&(u===null||dist[n.id]<dist[u]))u=n.id});
  if(u===null||dist[u]===Infinity||u===t)break;seen[u]=1;
  edges.forEach(e=>{const v=e.a.id===u?e.b.id:e.b.id===u?e.a.id:null;if(v&&!seen[v]){const nd=dist[u]+km(e.a,e.b);if(nd<dist[v]){dist[v]=nd;prev[v]=u}}});
 }
 const p=[t];while(p[0]!==s&&prev[p[0]])p.unshift(prev[p[0]]);
 return{p,d:dist[t]};
}
const nm=id=>`${id} (${byId[id].code})`;
function solve(){
 const o=$('#o').value,w=$('#w').value,d=$('#d').value,stops=[o,w,d].filter(Boolean);
 route=[];legs=[];let tot=0;
 for(let i=0;i<stops.length-1;i++){const r=dij(stops[i],stops[i+1]);legs.push(r);tot+=r.d;route.push(...(i?r.p.slice(1):r.p))}
 if(!legs.length)route=[o];
 direct=dij(o,d);
 gR.setAttribute('points',route.map(id=>byId[id].x+','+byId[id].y).join(' '));
 let h=`<div>Distancia total</div><div class="tot">${fmt(tot)} km</div>`;
 h+=`<div>Ruta: <b>${route.map(nm).join(' → ')}</b></div><ul>`+legs.map(l=>`<li>${l.p.join(' → ')}: ${fmt(l.d)} km</li>`).join('')+'</ul>';
 if(w&&direct.d<tot)h+=`<div>La ruta más corta sin escala es <b>${direct.p.join(' → ')}</b> (${fmt(direct.d)} km). Pasar por ${w} añade ${fmt(tot-direct.d)} km.</div>`;
 else if(w)h+=`<div>Pasar por ${w} ya es parte de la mejor ruta directa.</div>`;
 $('#res').innerHTML=h;
 const pts=route.map(id=>byId[id]);cum=[0];
 for(let i=1;i<pts.length;i++)cum.push(cum[i-1]+Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y));
 total=cum[cum.length-1]||0;pos=0;setPlane(0);
}
