/* ORIGO · book.js — renders a real BOOK page (faithful to MathO) with HAND-DRAWN, VECTOR (SVG) diagrams.
   Hand-drawn look (wobbly strokes + Caveat font) is deliberate: it invites readers to draw their own.
   SVG (not canvas) so the page prints/exports to PDF crisply at any resolution. */
(function(){
const R='#e8402e', B='#2f74d0', G='#2faa4e', INK='#5a564c', AX='#6f6a5e', DEP='#7c3fd4';   // R=horizontal, B=vertical, DEP(violet)=depth; G stays reserved for the product/total/area
const COL={1:R,2:B,3:G};
const rnd=()=>Math.random();
/* hand-drawn primitives → SVG fragment strings (jitter baked once) */
function sLine(x1,y1,x2,y2,col,w){ const L=Math.hypot(x2-x1,y2-y1), n=Math.max(2,Math.round(L/20)); let p=[];
  for(let i=0;i<=n;i++){ const t=i/n; let x=x1+(x2-x1)*t,y=y1+(y2-y1)*t; if(i&&i<n){x+=(rnd()-.5)*1.9;y+=(rnd()-.5)*1.9;} p.push(x.toFixed(1)+','+y.toFixed(1)); }
  return '<polyline points="'+p.join(' ')+'" fill="none" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"/>'; }
function sDot(cx,cy,r,col){ return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+col+'"/>'; }
function sBox(cx,cy,s,col){ const h=s/2, d=((rnd()-.5)*4).toFixed(1);
  return '<g transform="translate('+cx+' '+cy+') rotate('+d+')"><rect x="'+(-h)+'" y="'+(-h)+'" width="'+s+'" height="'+s+'" rx="4" fill="'+col+'"/><circle r="2.3" fill="#ffffff" opacity=".9"/></g>'; }
function sText(t,x,y,col,sz){ return '<text x="'+x+'" y="'+y+'" font-family="Caveat,Patrick Hand,cursive" font-size="'+(sz||22)+'" fill="'+(col||INK)+'" text-anchor="middle" dominant-baseline="middle">'+t+'</text>'; }
function sSeg(xa,xb,y,col){ return sLine(xa,y,xb,y,col,5)+sDot(xa,y,3,col)+sDot(xb,y,3,col); }
function sAxis(x0,u,vmax,y){ let s=sLine(x0-7,y,x0+vmax*u+9,y,AX,1.8); for(let i=0;i<=vmax;i++){ const x=x0+i*u; s+=sLine(x,y-3.5,x,y+3.5,AX,1.5)+sText(i,x,y+12,AX,16);} return s; }
function sBrace(x0,u,a,b,y,col,label){ const xa=x0+a*u,xb=x0+b*u;
  return sLine(xa,y+5,xa,y,col,1.8)+sLine(xa,y,xb,y,col,1.8)+sLine(xb,y,xb,y+5,col,1.8)+sText(label,(xa+xb)/2,y-9,col,17); }

const GOLD='#e0a83a';
function sCell(x,y,c,col){ const d=((rnd()-.5)*3).toFixed(1); return '<g transform="translate('+(x+c/2)+' '+(y+c/2)+') rotate('+d+')"><rect x="'+(-c/2+1.5)+'" y="'+(-c/2+1.5)+'" width="'+(c-3)+'" height="'+(c-3)+'" rx="2.5" fill="'+col+'"/></g>'; }
function sGrid(x,y,c,cols,rows,col){ let s=''; for(let r=0;r<rows;r++)for(let k=0;k<cols;k++) s+=sCell(x+k*c,y+r*c,c,col); return s; }
function cEq(cx,cy,parts,sz){ sz=sz||18; let w=parts.reduce((a,p)=>a+p[0].length*sz*0.52,0), x=cx-w/2, s=''; parts.forEach(p=>{ const pw=p[0].length*sz*0.52; s+='<text x="'+(x+pw/2).toFixed(1)+'" y="'+cy+'" font-family="Caveat,cursive" font-size="'+sz+'" fill="'+p[1]+'" text-anchor="middle" dominant-baseline="middle">'+p[0]+'</text>'; x+=pw; }); return s; }
function pbrace(x1,x2,y,label,col){ col=col||INK; return sLine(x1,y+5,x1,y,col,1.6)+sLine(x1,y,x2,y,col,1.6)+sLine(x2,y,x2,y+5,col,1.6)+sText(label,(x1+x2)/2,y-8,col,13); }
const FIGH={dots:48,bars:44,numline:52,commute:78,assoc:106, mjumps:88,marr:68,mintro:146,mrect:58,mrot:76,mdist:68,mgroups:98, gnname:64,gjux:80,gfill:50,glaw:76,garea:76, acmp:76,aunit:86,aflip:92, ucirc:86,uhex:114,utau:104, pwedge:94,prect:84,parea:92, drings:88,dstrip:66,dtri:88};   // each ≥ its lowest label so labels aren't clipped
// measured content centre (getBBox) per figure; figSVG pans the 480-wide viewBox so EVERY figure is centred in its frame (re-measure if a figure's layout changes)
const FIGCX={dots:183,bars:163,numline:240,commute:240,assoc:245, mjumps:243,marr:238,mintro:201,mrect:249,mrot:225,mdist:156,mgroups:246, gnname:249,gjux:229,gfill:264,glaw:266,garea:264, acmp:232,aunit:234,aflip:236, ucirc:240,uhex:240,utau:240, pwedge:240,prect:240,parea:240, drings:240,dstrip:240,dtri:240};
const FIGS={
  dots(){ const s=24,y=30; return sBox(74,y,s,B)+sText('+',106,y,INK,30)
    +sBox(134,y,s,B)+sBox(166,y,s,B)+sText('=',198,y,INK,30)
    +sBox(228,y,s,B)+sBox(260,y,s,B)+sBox(292,y,s,B); },
  bars(){ const y=30; return sSeg(56,82,y,R)+sText('+',95,y,INK,30)+sSeg(110,162,y,B)+sText('=',176,y,INK,30)+sSeg(192,270,y,G); },
  numline(){ const x0=74,u=110,y=30; return sAxis(x0,u,3,y)+sSeg(x0,x0+u,y,R)+sSeg(x0+u,x0+3*u,y,B)
    +sText('1',x0+u*0.5,y-12,R,20)+sText('2',x0+2*u,y-12,B,20); },
  commute(){ const x0=74,u=110; return sAxis(x0,u,3,22)+sSeg(x0,x0+u,22,R)+sSeg(x0+u,x0+3*u,22,B)
    +sAxis(x0,u,3,58)+sSeg(x0,x0+2*u,58,B)+sSeg(x0+2*u,x0+3*u,58,R); },
  assoc(){ const x0=58,u=62; return sAxis(x0,u,6,34)+sSeg(x0,x0+u,34,R)+sSeg(x0+u,x0+3*u,34,B)+sSeg(x0+3*u,x0+6*u,34,G)+sBrace(x0,u,0,3,18,INK,'(1+2)')
    +sAxis(x0,u,6,84)+sSeg(x0,x0+u,84,R)+sSeg(x0+u,x0+3*u,84,B)+sSeg(x0+3*u,x0+6*u,84,G)+sBrace(x0,u,1,6,68,INK,'(2+3)'); },
  // ---- multiplication = area (p7 / Quest 2) ----
  marr(){ const c=20,ox=192,oy=4; return sGrid(ox,oy,c,3,2,'#2f74d0')+cEq(240,oy+2*c+16,[['2',R],[' × ',INK],['3',B],[' = ',INK],['6',G]],18); },
  mrect(){ const c=22,ox=200,oy=4; return sGrid(ox,oy,c,3,2,G)+sText('2',ox-12,oy+c,R,16)+sText('3',ox+1.5*c,oy-9,B,16)+cEq(ox+3*c+34,oy+c,[['= 6',G]],18); },
  // 2×2 flow at ONE scale:  ① 3+3 on a line  →  ② two lines of 3  →  ③ add a vertical (y) line so it reads 2×3  →  ④ fill it into blocks.
  // Colour convention: RED = horizontal (columns / across), BLUE = vertical (rows / up). Columns sit on the bottom throughout.
  mintro(){ const u=20, xL=30, xR=280;
    const jump=(xa,xb,y)=>{ const m=(xa+xb)/2;   // a +3 hop is a horizontal move → red (kept low so stacked rows don't collide)
      return '<path d="M'+xa+' '+(y-3)+' Q '+m+' '+(y-17)+' '+(xb-1)+' '+(y-4)+'" fill="none" stroke="'+R+'" stroke-width="2"/>'
           +'<path d="M'+(xb-6)+' '+(y-8)+' L'+(xb-1)+' '+(y-4)+' L'+(xb-8)+' '+(y-2)+'" fill="none" stroke="'+R+'" stroke-width="1.6"/>'
           +sText('+3',m,y-13,R,12); };
    const line3=(x0,y)=>{ let s=sLine(x0-6,y,x0+3*u+8,y,AX,1.5); for(let i=0;i<=3;i++) s+=sLine(x0+i*u,y-3,x0+i*u,y+3,AX,1.3);   // a horizontal number line of 3, with its red hop
      return s+jump(x0,x0+3*u,y)+sText('3',x0+3*u+12,y,R,14); };
    // ① TOP-LEFT — 3 + 3 walked out on one line
    let s=sAxis(xL,u,6,40)+jump(xL,xL+3*u,40)+jump(xL+3*u,xL+6*u,40)
      +cEq(xL+6*u+46,40,[['3 + 3',R],[' = ',INK],['6',G]],16);
    // ② TOP-RIGHT — the very same, drawn as TWO lines of 3, one above the other
    s+=line3(xR,28)+line3(xR,52); for(let i=0;i<=3;i++) s+=sText(i,xR+i*u,52+13,R,12);   // 0..3 columns (red) under the lower line
    // ③ BOTTOM-LEFT — the same two lines, plus a vertical (blue) line that counts the rows → it reads 2 × 3
    const yb=120;
    s+=sLine(xL,yb,xL,yb-2*u,B,1.6); for(let j=0;j<=2;j++) s+=sLine(xL-3,yb-j*u,xL+3,yb-j*u,B,1.4)+sText(j,xL-12,yb-j*u,B,13);   // y line = rows (blue)
    s+=line3(xL,yb)+line3(xL,yb-u);                                            // the two red lines of 3, with their hops on rows 0 and 1
    for(let i=0;i<=3;i++) s+=sText(i,xL+i*u,yb+13,R,13);                        // columns (red) along the bottom (the row-0 line)
    s+=cEq(xL+3*u+84,yb-u,[['2',B],[' × ',INK],['3',R],[' = ',INK],['6',G]],16);   // bigger gap before the equation
    // ④ BOTTOM-RIGHT — fill it: the 2 × 3 blocks; columns (red) on the bottom, rows (blue) on the left
    const y4=yb-2*u; s+=sGrid(xR,y4,u,3,2,G)
      +sLine(xR,y4,xR,yb,B,3.2)+sText('2',xR-12,y4+u,B,15)                       // rows = 2 (blue, left = vertical)
      +sLine(xR,yb,xR+3*u,yb,R,3.2)+sText('3',xR+1.5*u,yb+14,R,15)               // columns = 3 (red, bottom = horizontal)
      +cEq(xR+3*u+34,y4+u,[['= 6',G]],17);
    return s; },
  mrot(){ const c=17, y=8;   // turn the rectangle a quarter: 3×2 → 2×3. RED = columns (bottom), BLUE = rows (left).
    let s=sGrid(150,y,c,3,2,G)
      +sLine(150,y+2*c,150+3*c,y+2*c,R,3)+sText('3',150+1.5*c,y+2*c+12,R,15)
      +sLine(150,y,150,y+2*c,B,3)+sText('2',150-11,y+c,B,15);
    s+=sText('=',244,y+1.5*c,INK,24);
    s+=sGrid(280,y,c,2,3,G)
      +sLine(280,y+3*c,280+2*c,y+3*c,R,3)+sText('2',280+c,y+3*c+12,R,15)
      +sLine(280,y,280,y+3*c,B,3)+sText('3',280-11,y+1.5*c,B,15);
    return s; },
  // repeated addition on the number line → multiplication (leads in from p1's addition)
  mjumps(){ const x0=74,u=56,y=46; let s=sAxis(x0,u,6,y);
    for(let k=0;k<3;k++){ const xa=x0+k*2*u, xb=x0+(k+1)*2*u, mid=(xa+xb)/2;
      s+='<path d="M'+xa+' '+(y-3)+' Q '+mid+' '+(y-30)+' '+(xb-1)+' '+(y-4)+'" fill="none" stroke="'+B+'" stroke-width="2.4"/>';
      s+='<path d="M'+(xb-7)+' '+(y-9)+' L'+(xb-1)+' '+(y-4)+' L'+(xb-9)+' '+(y-2)+'" fill="none" stroke="'+B+'" stroke-width="2"/>';   // arrowhead
      s+=sText('+2',mid,y-24,B,15); }
    return s+cEq(x0+3*u,y+30,[['2 + 2 + 2',B],[' = ',INK],['3',R],['×',INK],['2',B],[' = ',INK],['6',G]],17); },
  // distributive — APART = TOGETHER (same order as the game): two rectangles slide together into one wider field
  mdist(){ const c=18,oy=8, gb=2, gc=3, gw=gb*c, cw=gc*c, by=oy+2*c+6;   // widths (horizontal) bracketed in RED; heights (vertical) drawn top→bottom in BLUE
    const bb=(x1,x2,lab)=>sLine(x1,by-5,x1,by,R,1.6)+sLine(x1,by,x2,by,R,1.6)+sLine(x2,by,x2,by-5,R,1.6)+sText(lab,(x1+x2)/2,by+11,R,13);   // bottom width bracket (legs up, label below)
    const ht=(x)=>sLine(x,oy,x,oy+2*c,B,2.6)+sText('2',x-11,oy+c,B,13);   // left height line + 2
    const gX=34, plusX=gX+gw+10, wX=gX+gw+32;                                        // LEFT: 2×2 grass  +  2×3 wheat
    let s=sGrid(gX,oy,c,gb,2,G)+ht(gX)+bb(gX,gX+gw,'2')
         +sText('+',plusX,oy+c,INK,22)
         +sGrid(wX,oy,c,gc,2,GOLD)+ht(wX)+bb(wX,wX+cw,'3');   // gold box gets its vertical 2 too
    const eqX=wX+cw+16; s+=sText('=',eqX,oy+c,INK,22);
    const rx=eqX+30;                                                                // RIGHT: one field, 2 tall × (2+3) wide — gap after the equals sign
    return s+sGrid(rx,oy,c,gb,2,G)+sGrid(rx+gw,oy,c,gc,2,GOLD)+ht(rx)+bb(rx,rx+gw+cw,'2+3'); },
  // associative: the SAME 24-block box, grouped two ways — (2×3)×4 and 2×(3×4). Each edge is coloured like its number (2=red, 3=blue, 4=green).
  mgroups(){ const ux=18,dy=12,zx=10,zy=-6;
    const mkbox=(ox,oy,W,H,D,cW,cH,cD,lw,lh,ld)=>{
      const X=(i,k)=>ox+i*ux+k*zx, Y=(j,k)=>oy+j*dy+k*zy, pt=(i,j,k)=>X(i,k).toFixed(1)+' '+Y(j,k).toFixed(1);
      const poly=(p,f)=>'<polygon points="'+p.map(q=>pt(q[0],q[1],q[2])).join(' ')+'" fill="'+f+'" stroke="#46423c" stroke-width="1.3" stroke-linejoin="round"/>';
      const gl=(a,b)=>'<line x1="'+X(a[0],a[2]).toFixed(1)+'" y1="'+Y(a[1],a[2]).toFixed(1)+'" x2="'+X(b[0],b[2]).toFixed(1)+'" y2="'+Y(b[1],b[2]).toFixed(1)+'" stroke="#46423c" stroke-width=".9" opacity=".4"/>';
      const edge=(a,b,c)=>sLine(X(a[0],a[2]),Y(a[1],a[2]),X(b[0],b[2]),Y(b[1],b[2]),c,3.4);
      let s=poly([[0,0,0],[W,0,0],[W,0,D],[0,0,D]],'rgba(120,225,165,.5)')        // top
           +poly([[W,0,0],[W,H,0],[W,H,D],[W,0,D]],'rgba(50,150,80,.55)')          // right
           +poly([[0,0,0],[W,0,0],[W,H,0],[0,H,0]],'rgba(95,205,140,.85)');        // front
      for(let i=1;i<W;i++) s+=gl([i,0,0],[i,H,0]); for(let j=1;j<H;j++) s+=gl([0,j,0],[W,j,0]);
      for(let k=1;k<D;k++) s+=gl([W,0,k],[W,H,k]); for(let j=1;j<H;j++) s+=gl([W,j,0],[W,j,D]);
      for(let i=1;i<W;i++) s+=gl([i,0,0],[i,0,D]); for(let k=1;k<D;k++) s+=gl([0,0,k],[W,0,k]);
      s+=edge([0,H,0],[W,H,0],cW)+edge([0,0,0],[0,H,0],cH)+edge([W,0,0],[W,0,D],cD);   // coloured edges: width / height / depth
      s+=sText(lw,(X(0,0)+X(W,0))/2,Y(H,0)+13,cW,17)                  // width — front bottom
        +sText(lh,X(0,0)-12,(Y(0,0)+Y(H,0))/2,cH,17)                  // height — front left
        +sText(ld,X(W,D)+11,Y(0,D)-2,cD,17);    // depth — at the far (back) top-right corner, out on the margin
      return s; };
    // LEFT: group the 3×2 front face first → (2 × 3) × 4
    let s=mkbox(72,52, 3,2,4, R,B,DEP, '3','2','4')+cEq(72+3*ux+4*zx+26,52+2*dy-4,[['= 24',G]],17);   // (2×3): 3 cols=red(bottom), 2 rows=blue(left), 4 depth=violet
    // RIGHT: group the 3×4 front face first → 2 × (3 × 4). (3×4): 3 ROWS=blue(left, vertical), 4 COLS=red(bottom, horizontal), 2 depth=violet
    s+=mkbox(300,40, 4,3,2, R,B,DEP, '4','3','2')+cEq(300+4*ux+2*zx+26,40+3*dy-4,[['= 24',G]],17);
    return s; },
  // ---- p3 "Give Numbers Names" (letters as names; juxtaposition 5x). Letters (names) = blue. ----
  gnname(){ const by=22, bw=52, bh=40, x1=146, x2=300, ay=22+20;   // name it x now (unknown ?) → fill the amount in later
    const tag=(x,inner,col,fill)=> sText('x',x+bw/2,by-10,B,18)
      + '<rect x="'+x+'" y="'+by+'" width="'+bw+'" height="'+bh+'" rx="9" fill="'+fill+'" stroke="'+B+'" stroke-width="1.7"/>'
      + sText(inner,x+bw/2,by+bh/2+1,col,22);
    let s=tag(x1,'?',AX,'rgba(47,116,208,.06)');
    s+='<path d="M'+(x1+bw+8)+' '+ay+' L'+(x2-8)+' '+ay+'" stroke="'+INK+'" stroke-width="1.6" fill="none"/>'
      +'<path d="M'+(x2-15)+' '+(ay-5)+' L'+(x2-8)+' '+ay+' L'+(x2-15)+' '+(ay+5)+'" fill="none" stroke="'+INK+'" stroke-width="1.6"/>';
    return s+tag(x2,'4',INK,'rgba(47,170,78,.10)'); },   // language-neutral: the boxes + arrow read in any language; prose carries "fill in later"
  gjux(){ const y1=20, y2=60;   // 5 ×̶ x  →  5x ,  and  5x = x+x+x+x+x
    let s=sText('5',150,y1,INK,24)+sText('×',173,y1,AX,22)+sLine(165,y1+8,181,y1-8,R,1.8)+sText('x',195,y1,B,24);
    s+='<path d="M214 '+y1+' L248 '+y1+'" stroke="'+INK+'" stroke-width="1.7" fill="none"/><path d="M242 '+(y1-5)+' L248 '+y1+' L242 '+(y1+5)+'" fill="none" stroke="'+INK+'" stroke-width="1.7"/>';
    s+=sText('5',270,y1,INK,26)+sText('x',286,y1,B,26);
    return s+cEq(240,y2,[['5',INK],['x',B],['  =  ',INK],['x',B],['+',INK],['x',B],['+',INK],['x',B],['+',INK],['x',B],['+',INK],['x',B]],18); },
  gfill(){ const y=30;   // x = 4  →  5x = 5×4 = 20
    let s=sText('x',124,y,B,22)+sText('=',142,y,INK,18)+sText('4',160,y,INK,22)+sText('→',192,y,AX,20);
    return s+cEq(322,y,[['5',INK],['x',B],['  =  ',INK],['5',INK],['×',AX],['4',INK],['  =  ',INK],['20',G]],20); },
  glaw(){ const ox=162, oy=4, rw=108, rh=54;   // a×b SOLID rectangle (no grid → a,b are lengths, not integers): a=height(blue), b=width(red), area=green; ab = ba
    let s='<rect x="'+ox+'" y="'+oy+'" width="'+rw+'" height="'+rh+'" fill="rgba(47,170,78,.12)" stroke="'+G+'" stroke-width="1.8"/>';
    s+=sText('a',ox-14,oy+rh/2,B,20)+sText('b',ox+rw/2,oy+rh+16,R,20)+sText('ab',ox+rw/2,oy+rh/2,G,22);
    return s+cEq(ox+rw+70,oy+rh/2,[['ab',G],['  =  ',INK],['ba',G]],19); },
  garea(){ const ox=152, oy=4, rw=116, rh=50, rows=3;   // 3 rows tall × x wide → area 3x : blue height, red width, green area
    let s='<rect x="'+ox+'" y="'+oy+'" width="'+rw+'" height="'+rh+'" fill="rgba(47,170,78,.12)" stroke="'+G+'" stroke-width="1.8"/>';
    for(let i=1;i<rows;i++){ const yy=(oy+rh*i/rows).toFixed(1); s+='<line x1="'+ox+'" y1="'+yy+'" x2="'+(ox+rw)+'" y2="'+yy+'" stroke="'+B+'" stroke-width="1" stroke-dasharray="5 4" opacity=".55"/>'; }
    s+=sText('3',ox-14,oy+rh/2,B,20)+sText('x',ox+rw/2,oy+rh+16,R,20)+sText('3x',ox+rw/2,oy+rh/2,G,22);
    return s+cEq(ox+rw+74,oy+rh/2,[['3',B],['×',AX],['x',R],['  =  ',INK],['3x',G]],19); },
  // ---- p4 "Comparing Area and Length" : area x = green, length y = blue, unit "1" = red. y is a VERTICAL line so it reads against the square's side. ----
  acmp(){ const sy=12, sq=60, ox=150, A='#2faa4e', L='#2f74d0';   // area x (square) vs length y (vertical line) — which is bigger?
    let s='<rect x="'+ox+'" y="'+sy+'" width="'+sq+'" height="'+sq+'" rx="3" fill="rgba(47,170,78,.18)" stroke="'+A+'" stroke-width="1.8"/>'+sText('x',ox+sq/2,sy+sq/2,A,22);
    s+=sText('?',ox+sq+34,sy+sq/2,AX,30);
    const lx=ox+sq+88; return s+sLine(lx,sy,lx,sy+sq,L,4)+sDot(lx,sy,4,L)+sDot(lx,sy+sq,4,L)+sText('y',lx+16,sy+sq/2,L,20); },
  aunit(){ const sy=14, sq=52, ox=172, A='#2faa4e', L='#2f74d0';   // unit square (1×1) + a unit-long VERTICAL line y (same height as the side) → x = y
    let s='<rect x="'+ox+'" y="'+sy+'" width="'+sq+'" height="'+sq+'" rx="3" fill="rgba(47,170,78,.16)" stroke="'+A+'" stroke-width="1.8"/>'+sText('x',ox+sq/2,sy+sq/2,A,20);
    const by=sy+sq+6; s+=sLine(ox,by,ox+sq,by,R,1.6)+sLine(ox,by,ox,by-5,R,1.6)+sLine(ox+sq,by,ox+sq,by-5,R,1.6)+sText('1',ox+sq/2,by+12,R,13);   // bottom side = 1
    const vx=ox-6; s+=sLine(vx,sy,vx,sy+sq,R,1.6)+sLine(vx,sy,vx+5,sy,R,1.6)+sLine(vx,sy+sq,vx+5,sy+sq,R,1.6)+sText('1',vx-10,sy+sq/2,R,13);   // left side = 1
    const lx=ox+sq+72; s+=sLine(lx,sy,lx,sy+sq,L,4)+sDot(lx,sy,4,L)+sDot(lx,sy+sq,4,L)+sText('y',lx,sy-9,L,18);   // y vertical = 1
    const yx=lx+7; return s+sLine(yx,sy,yx,sy+sq,R,1.6)+sLine(yx,sy,yx-5,sy,R,1.6)+sLine(yx,sy+sq,yx-5,sy+sq,R,1.6)+sText('1',yx+10,sy+sq/2,R,13); },
  aflip(){ const A='#2faa4e', L='#2f74d0', Q=34, base=66, mid=236;   // BOTH panels are x = y. Left: y SMALL; right: y BIG. Unit "1" sized so x = y either way → looks do not decide. The "1" sits on the OUTER side of each group; a divider splits the two.
    const unit=(ux,U,dx)=>'<line x1="'+ux+'" y1="'+(base-U)+'" x2="'+ux+'" y2="'+base+'" stroke="'+R+'" stroke-width="4" stroke-linecap="round"/>'+sText('1',ux+dx,base-U/2,R,12);
    const sq=(x)=>'<rect x="'+x+'" y="'+(base-Q)+'" width="'+Q+'" height="'+Q+'" rx="3" fill="rgba(47,170,78,.16)" stroke="'+A+'" stroke-width="1.6"/>'+sText('x',x+Q/2,base-Q/2,A,14);
    const yln=(x,Ly,dx)=>sLine(x,base-Ly,x,base,L,3.5)+sDot(x,base-Ly,2.6,L)+sDot(x,base,2.6,L)+sText('y',x+dx,base-Ly+3,L,13);
    const verd=[['x',A],[' = ',INK],['y',L]];
    let s=unit(124,56,-10)+sq(142)+yln(190,21,10);                                   // LEFT: 1 (outer) | x | y , y small
    s+='<line x1="'+mid+'" y1="6" x2="'+mid+'" y2="'+(base+8)+'" stroke="'+AX+'" stroke-width="1" stroke-dasharray="3 4" opacity=".55"/>';   // divider
    s+=sq(278)+yln(326,53,-10)+unit(354,22,10);                                       // RIGHT: x | y | 1 (outer) , y big
    return s+cEq(157,base+20,verd,15)+cEq(316,base+20,verd,15); },
  // ---- the unit circle & τ (p9 / Quest 5) ---- circle BLUE, radius/unit "1" RED, chords/arcs GREEN, τ GOLD
  ucirc(){ const cx=240, cy=44, r=34;   // the unit circle: a radius of 1 to the rim
    return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+GOLD+'" stroke-width="2.6"/>'
      + sLine(cx,cy,cx+r,cy,R,2.4) + sDot(cx,cy,3,INK) + sDot(cx+r,cy,3,R)
      + sText('1',cx+r*0.5,cy-9,R,14) + sText('O',cx-10,cy+12,'#7a6a4a',12); },
  uhex(){ const cx=240, cy=58, r=42, PI=Math.PI; let s='';   // six unit radii → hexagon: chords green = 1, the ring (arcs) blue
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+GOLD+'" stroke-width="2.2"/>';
    const tp=k=>({x:+(cx+r*Math.cos(-PI/2+k*PI/3)).toFixed(1), y:+(cy+r*Math.sin(-PI/2+k*PI/3)).toFixed(1)});
    for(let k=0;k<6;k++){ const p=tp(k); s+=sLine(cx,cy,p.x,p.y,R,1.7)+sDot(p.x,p.y,2.6,R); }
    for(let k=0;k<6;k++){ const a=tp(k),b=tp((k+1)%6); s+=sLine(a.x,a.y,b.x,b.y,G,2); }
    s+=sDot(cx,cy,3,INK);
    s+=sText('1',cx+11,(cy+tp(0).y)/2,R,12);                            // a radius = 1
    const a0=tp(0),b0=tp(1); s+=sText('1',(a0.x+b0.x)/2+11,(a0.y+b0.y)/2-2,G,12);   // a chord = 1
    return s; },
  utau(){ const cx=240, cy=42, r=34;   // the whole way around = τ — clean circle, value (with τ) labelled below
    return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+GOLD+'" stroke-width="3"/>'
      + '<text x="'+cx+'" y="'+(cy+r+17)+'" font-family="Caveat,cursive" font-size="18" fill="#a8780f" text-anchor="middle" dominant-baseline="middle">τ ≈ 6.28</text>'; },
  pwedge(){ const PI=Math.PI; const cx=196, cy=50, r=30, n=18; let s='';   // cut the disk into many wedges → each is a thin triangle
    for(let i=0;i<n;i++){ const a0=-PI/2+i*2*PI/n, a1=a0+2*PI/n;
      const x0=+(cx+r*Math.cos(a0)).toFixed(1), y0=+(cy+r*Math.sin(a0)).toFixed(1), x1=+(cx+r*Math.cos(a1)).toFixed(1), y1=+(cy+r*Math.sin(a1)).toFixed(1);
      s+='<path d="M'+cx+' '+cy+' L'+x0+' '+y0+' A'+r+' '+r+' 0 0 1 '+x1+' '+y1+' Z" fill="'+G+'" opacity="'+((i%2)?0.16:0.26)+'"/>';
      s+=sLine(cx,cy,x0,y0,R,1.1); }
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+GOLD+'" stroke-width="2.4"/>'+sDot(cx,cy,2.6,INK);
    s+=sLine(cx+r+8,cy,cx+r+34,cy,INK,2)+'<path d="M'+(cx+r+34)+' '+(cy-5)+' L'+(cx+r+42)+' '+cy+' L'+(cx+r+34)+' '+(cy+5)+' Z" fill="'+INK+'"/>';   // arrow →
    const tx=cx+r+68, th=42, tw=13;   // one wedge opened up = a thin triangle
    s+='<path d="M'+tx+' '+(cy-th/2)+' L'+(tx-tw)+' '+(cy+th/2)+' L'+(tx+tw)+' '+(cy+th/2)+' Z" fill="'+G+'" opacity="0.24"/>';
    s+=sLine(tx,cy-th/2,tx-tw,cy+th/2,R,1.8)+sLine(tx,cy-th/2,tx+tw,cy+th/2,R,1.8)+sLine(tx-tw,cy+th/2,tx+tw,cy+th/2,GOLD,2);
    s+=sText('triangle',tx,cy+th/2+13,G,12); return s; },
  prect(){ const x0=168, Wb=144, yT=28, yB=72, M=14; let s='';   // many wedges packed into a bar: height h = 1, two bases 2b = τ
    s+='<rect x="'+x0+'" y="'+yT+'" width="'+Wb+'" height="'+(yB-yT)+'" fill="'+G+'" opacity="0.18"/>';
    for(let i=0;i<M;i++){ const x=x0+i*Wb/M, y=(i%2===0)?yB:yT, x2=x0+(i+1)*Wb/M, y2=(i%2===0)?yT:yB; s+=sLine(x,y,x2,y2,R,1.5); }   // zig-zag = the packed wedge sides (radii)
    s+=sLine(x0,yT,x0+Wb,yT,GOLD,2.4)+sLine(x0,yB,x0+Wb,yB,GOLD,2.4);   // gold long edges = the two bases b (together = the rim τ)
    s+=sLine(x0,yT,x0,yB,R,2)+sLine(x0+Wb,yT,x0+Wb,yB,R,2);
    s+=sText('b',x0+Wb/2,yT-9,'#a8780f',14)+sText('b',x0+Wb/2,yB+11,'#a8780f',14)+sText('h',x0-12,(yT+yB)/2,R,13)+sText('2b = τ',x0+Wb+4,(yT+yB)/2,'#a8780f',12); return s; },
  parea(){ const ccx=150, ccy=42, rc=27, x0=234, Wb=116, yT=ccy-22, yB=ccy+22; let s='';   // the circle and the bar, side by side — same area ½τ = π
    s+='<circle cx="'+ccx+'" cy="'+ccy+'" r="'+rc+'" fill="'+G+'" opacity="0.26"/><circle cx="'+ccx+'" cy="'+ccy+'" r="'+rc+'" fill="none" stroke="'+GOLD+'" stroke-width="2.4"/>'+sDot(ccx,ccy,2.3,INK);
    s+=sLine(ccx,ccy,ccx+rc,ccy,R,1.6)+sText('1',ccx+rc*0.5,ccy-7,R,11);   // a radius 1 in the circle
    s+='<text x="200" y="'+(ccy+1)+'" font-family="Caveat,cursive" font-size="22" fill="'+INK+'" text-anchor="middle" dominant-baseline="middle">=</text>';
    s+='<rect x="'+x0+'" y="'+yT+'" width="'+Wb+'" height="'+(yB-yT)+'" fill="'+G+'" opacity="0.26"/>'+sLine(x0,yT,x0+Wb,yT,GOLD,2.2)+sLine(x0,yB,x0+Wb,yB,GOLD,2.2)+sLine(x0,yT,x0,yB,R,2)+sLine(x0+Wb,yT,x0+Wb,yB,R,2);
    s+=sText('½τ',x0+Wb/2,yT-7,'#a8780f',12)+sText('1',x0-9,ccy,R,11);
    s+='<text x="237" y="'+(yB+18)+'" font-family="Caveat,cursive" font-size="14" fill="#a8780f" text-anchor="middle">same area = ½τ = <tspan fill="'+DEP+'">π</tspan></text>'; return s; },
  drings(){ const cx=240, cy=48, r=34, n=6; let s='';   // slice the radius into thin rings, each dx wide
    for(let i=1;i<=n;i++){ const ri=+(r*i/n).toFixed(1); s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+ri+'" fill="none" stroke="'+(i===n?GOLD:'#caa84a')+'" stroke-width="'+(i===n?2.4:1.3)+'" opacity="'+(i===n?1:(0.4+0.4*i/n).toFixed(2))+'"/>'; }
    const dx=r/n; s+=sLine(cx+r-dx,cy,cx+r,cy,R,3)+sLine(cx+r-dx,cy-5,cx+r-dx,cy+5,R,1.5)+sLine(cx+r,cy-5,cx+r,cy+5,R,1.5);
    s+=sDot(cx,cy,2.6,INK)+sText('dx',cx+r-dx/2,cy-11,R,12); return s; },
  dstrip(){ const x0=152, len=176, y=40, w=18; let s='';   // one ring unrolled → a strip: dx wide, r·τ long
    s+='<rect x="'+x0+'" y="'+(y-w/2)+'" width="'+len+'" height="'+w+'" fill="'+G+'" opacity="0.22"/>';
    s+=sLine(x0,y-w/2,x0+len,y-w/2,GOLD,2.2)+sLine(x0,y+w/2,x0+len,y+w/2,GOLD,2.2)+sLine(x0,y-w/2,x0,y+w/2,R,2.2);
    s+=sText('dx',x0-12,y,R,12)+sText('r·τ',x0+len/2,y-w/2-10,'#a8780f',13); return s; },
  dtri(){ const x0=176, W=128, yT=26, yB=72; let s='';   // strips stacked → triangle: base 1, height τ, area ½τ = π
    s+='<path d="M'+x0+' '+yB+' L'+x0+' '+yT+' L'+(x0+W)+' '+yT+' Z" fill="'+G+'" opacity="0.22"/>';
    s+=sLine(x0,yT,x0,yB,R,2.4)+sLine(x0,yT,x0+W,yT,GOLD,2.6)+sLine(x0,yB,x0+W,yT,INK,1.6);
    s+=sText('1',x0-11,(yT+yB)/2,R,13)+sText('τ',x0+W/2,yT-10,'#a8780f',16);
    s+='<text x="'+(x0+W*0.36)+'" y="'+((yT+yB)/2)+'" font-family="Caveat,cursive" font-size="16" fill="#a8780f" text-anchor="middle" dominant-baseline="middle">½τ</text>';
    s+=sText('= π',x0+W*0.36,(yT+yB)/2+15,DEP,11); return s; },
};
function figSVG(name){ const W=480,H=FIGH[name]||70, cx=FIGCX[name]||240; return '<svg class="bkfig" width="544" height="'+(544*H/W).toFixed(1)+'" viewBox="'+(cx-240).toFixed(0)+' 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg">'+FIGS[name]()+'</svg>'; }   // pan viewBox to centre content; explicit width/height so it sizes even if page CSS is missing (PNG/PDF export)
function colorEq(s){ return s.replace(/\d/g,d=>'<span style="color:'+(COL[+d]||INK)+'">'+d+'</span>'); }

const BOOK={};
/* ---- PNG export: rasterize the page (SVG figures + text) via an <svg><foreignObject> snapshot ---- */
function ab2b64(buf){ let s='',a=new Uint8Array(buf); for(let i=0;i<a.length;i++) s+=String.fromCharCode(a[i]); return btoa(s); }
/* Page CSS embedded for export. We do NOT scrape document.styleSheets: reading cssRules of the external
   engine.css throws a SecurityError in the file:// / webview context, so the scrape returned '' and the
   PNG/PDF came out completely unstyled (giant brand mark, plain text). This mirrors engine.css's .page block
   (rem → px so it doesn't depend on a root font-size that the foreignObject doesn't have). */
const PAGE_CSS=`
.page{position:relative;width:100%;max-width:580px;margin:auto;min-height:calc(580px * 297 / 210);background:#fdfcf6;color:#23201a;border-radius:4px;padding:10px 12px 12px;font-family:'Patrick Hand','Segoe Print','Bradley Hand','Ma Shan Zheng','KaiTi','STKaiti','Segoe UI',sans-serif;font-size:16px;line-height:1.28;}
.page .corner{position:absolute;top:0;left:0;border-width:0 0 26px 26px;border-style:solid;border-color:transparent transparent transparent #d4b24a;opacity:.8;}
.page .pno{position:absolute;bottom:12px;right:20px;font-family:'Caveat','Segoe Print','Bradley Hand','Ma Shan Zheng','KaiTi','STKaiti',cursive;font-size:19px;color:#9a958a;}
.page .mathtau{position:absolute;top:13px;right:18px;display:flex;align-items:center;gap:6px;}
.page .mathtau svg{width:24px;height:24px;}
.page .mathtau span{font-family:'Playfair Display',Georgia,serif;font-weight:600;font-size:16px;color:#a8780f;}
.bkh{margin:1px 0 5px;}
.bkh .kick{font-family:'Caveat','Segoe Print','Bradley Hand','Ma Shan Zheng','KaiTi','STKaiti',cursive;font-size:24px;color:#3a3630;line-height:1;}
.bkh .ttl{font-family:'Caveat','Segoe Print','Bradley Hand','Ma Shan Zheng','KaiTi','STKaiti',cursive;font-weight:700;font-size:35px;color:#1a1712;line-height:1;margin-top:-2px;}
.bkrow{border-top:1px solid #e7e3d6;padding-top:2px;margin-top:2px;}
.bkrow:first-of-type{border-top:none;}
.bkrow p{margin:0 0 2px;}
.bkfig{display:block;width:100%;max-width:544px;height:auto;margin:1px auto 3px;}
.bklaw{font-family:'Caveat','Segoe Print','Bradley Hand','Ma Shan Zheng','KaiTi','STKaiti',cursive;font-weight:700;font-size:22px;}
.bkeq{font-family:'Caveat','Segoe Print','Bradley Hand','Ma Shan Zheng','KaiTi','STKaiti',cursive;font-size:24px;letter-spacing:.02em;}
.q{color:#2f74d0;font-weight:bold;}.len{color:#e8402e;font-weight:bold;}
.r{color:#e8402e}.b{color:#2f74d0}.gr{color:#2faa4e}.g{color:#2faa4e}.y{color:#b5860b}.p{color:#7c3fd4}
.bknote{margin-top:5px;background:#fbf7e4;border:1px solid #e9dab0;border-left:4px solid #f0c419;border-radius:6px;padding:6px 10px;font-size:14px;color:#4a4436;}
.bknote b{color:#b5860b;}`;
function pageCSS(){ return PAGE_CSS; }
async function embedFont(url){ try{ const css=await fetch(url).then(r=>r.text());
    if(!/@font-face/.test(css)) return '';                                   // not real CSS (error page) → skip, don't corrupt the SVG
    const urls=[...css.matchAll(/url\((https:[^)]+\.woff2)\)/g)].map(m=>m[1]); const map={};
    await Promise.all(urls.map(async u=>{ try{ map[u]=ab2b64(await fetch(u).then(r=>r.arrayBuffer())); }catch(_){ } }));
    return css.replace(/url\((https:[^)]+\.woff2)\)/g,(m,u)=> map[u]?'url(data:font/woff2;base64,'+map[u]+')':'url()')+'\n';   // never leave an external url
  }catch(_){ return ''; } }
async function fontCSS(text){   // embed Caveat + Patrick Hand + Ma Shan Zheng, ALL subset (&text) to the page's chars so the data-URI stays small
  const uniq=[...new Set(text||'')].join('');
  let out=await embedFont('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Patrick+Hand&display=swap'+(uniq?'&text='+encodeURIComponent(uniq):''));
  const cn=[...new Set((text||'').replace(/[^一-鿿]/g,''))].join('');
  if(cn) out+=await embedFont('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&text='+encodeURIComponent(cn));
  return out; }
/* Register the bundled @font-face fonts in the document and AWAIT them before rasterizing.
   Without this, an SVG-as-<img> often paints before its embedded font is decoded → fallback font in the export. */
async function ensureFonts(css){
  if(!css || typeof document==='undefined' || !document.fonts || !window.FontFace) return;
  const re=/@font-face\{font-family:'([^']+)';font-style:normal;font-weight:(\d+);src:(url\(data:[^)]+\)\s*format\('woff2'\))/g;
  let m, ps=[];
  while((m=re.exec(css))){ try{ const ff=new FontFace(m[1], m[3], {weight:m[2], style:'normal'}); document.fonts.add(ff); ps.push(ff.load()); }catch(_){ } }
  try{ await Promise.all(ps); await document.fonts.ready; }catch(_){ }
}
BOOK._renderCanvas=async function(pageEl, scale){ scale=scale||2;
  const W=pageEl.offsetWidth, H=pageEl.offsetHeight;          // border-box incl. padding (scrollWidth clipped the padded edge)
  const clone=pageEl.cloneNode(true); clone.style.boxShadow='none'; clone.style.margin='0'; clone.style.width=W+'px';
  const xml=new XMLSerializer().serializeToString(clone);
  const fc=BOOK._noFonts?'':((typeof window!=='undefined'&&window.BOOK_FONTS)||await fontCSS(pageEl.textContent).catch(()=>''));   // prefer the bundled base64 fonts (exact match, no blocked fetch); fall back to runtime embed
  await ensureFonts(fc);   // decode the fonts into the document first, so the SVG paints with them (not a fallback)
  const mk=fonts=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'"><foreignObject x="0" y="0" width="'+W+'" height="'+H+'"><div xmlns="http://www.w3.org/1999/xhtml"><style>*{box-sizing:border-box;margin:0;padding:0;}'+fonts+pageCSS()+'</style>'+xml+'</div></foreignObject></svg>');
  const load=src=>new Promise((res,rej)=>{ const im=new Image(); im.onload=()=>res(im); im.onerror=rej; im.src=src; });
  let img; try{ img=await load(mk(fc)); }catch(_){ img=await load(mk('')); }   // if embedded fonts make the data-URI too big/broken, fall back to system fonts
  const c=document.createElement('canvas'); c.width=Math.round(W*scale); c.height=Math.round(H*scale); const x=c.getContext('2d');
  x.fillStyle='#fdfcf6'; x.fillRect(0,0,c.width,c.height); x.setTransform(scale,0,0,scale,0,0); x.drawImage(img,0,0);
  c._W=W; c._H=H; return c; };
BOOK.renderPNG=async function(pageEl, scale){ return (await BOOK._renderCanvas(pageEl,scale)).toDataURL('image/png'); };
BOOK.savePNG=async function(pageEl){ try{ const url=await BOOK.renderPNG(pageEl||document.getElementById('bookpage'));
  const a=document.createElement('a'); a.href=url; a.download='origo-addition-p'+(BOOK._page||1)+'.png'; document.body.appendChild(a); a.click(); a.remove(); }catch(e){ alert('PNG export failed: '+e.message); } };
/* build a one-page PDF (page sized to the content) with the rendered page embedded as a JPEG — no print dialog, no header/footer, no margins */
function buildJpegPDF(jpeg, imgW, imgH, wpt, hpt){
  const segs=[]; let pos=0; const xref=[0,0,0,0,0,0];
  const A=s=>{ const u=new Uint8Array(s.length); for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i)&0xff; segs.push(u); pos+=u.length; };
  const content='q '+wpt+' 0 0 '+hpt+' 0 0 cm /Im0 Do Q';
  A('%PDF-1.4\n%âãÏÓ\n');
  xref[1]=pos; A('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  xref[2]=pos; A('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  xref[3]=pos; A('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+wpt+' '+hpt+'] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n');
  xref[4]=pos; A('4 0 obj\n<< /Type /XObject /Subtype /Image /Width '+imgW+' /Height '+imgH+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+jpeg.length+' >>\nstream\n'); segs.push(jpeg); pos+=jpeg.length; A('\nendstream\nendobj\n');
  xref[5]=pos; A('5 0 obj\n<< /Length '+content.length+' >>\nstream\n'+content+'\nendstream\nendobj\n');
  const xp=pos; let xr='xref\n0 6\n0000000000 65535 f \n'; for(let i=1;i<=5;i++) xr+=String(xref[i]).padStart(10,'0')+' 00000 n \n';
  A(xr); A('trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n'+xp+'\n%%EOF');
  let total=0; segs.forEach(u=>total+=u.length); const out=new Uint8Array(total); let o=0; segs.forEach(u=>{ out.set(u,o); o+=u.length; }); return out; }
BOOK._pdfBytes=async function(pageEl){ const c=await BOOK._renderCanvas(pageEl, 3);
  const durl=c.toDataURL('image/jpeg',0.95), bin=atob(durl.split(',')[1]); const jpeg=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) jpeg[i]=bin.charCodeAt(i);
  const wpt=595.28, hpt=Math.round(wpt*c.height/c.width*100)/100;   // A4 width; height follows the card's real ratio → never distorts even if content runs long
  return buildJpegPDF(jpeg, c.width, c.height, ''+wpt, ''+hpt); };
BOOK.savePDF=async function(pageEl){ try{ const bytes=await BOOK._pdfBytes(pageEl||document.getElementById('bookpage'));
  const blob=new Blob([bytes],{type:'application/pdf'}), url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='origo-addition-p'+(BOOK._page||1)+'.pdf'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),3000); }catch(e){ alert('PDF export failed: '+e.message); } };
BOOK.render=function(host, spec, lang){ BOOK._page=spec.page;
  const t=s=> (s&&typeof s==='object')?(s[lang]||s.en||''):(s||'');
  const mark='<div class="mathtau"><svg width="24" height="24" viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#15153a"/><circle cx="20" cy="20" r="14.5" fill="none" stroke="#f0c040" stroke-width=".8" opacity=".45"/><circle cx="20" cy="20" r="9.5" fill="none" stroke="#f0c040" stroke-width="1.3"/><text x="20" y="27" font-family="Georgia,serif" font-style="italic" font-size="18" fill="#f0c040" text-anchor="middle">τ</text></svg><span>MathTau</span></div>';
  let h='<div class="corner"></div>'+mark+'<div class="pno">'+(lang==='zh'?spec.page:'p.'+spec.page)+'</div>';
  h+='<div class="bkh"><div class="kick">'+t(spec.kicker)+'</div><div class="ttl">'+t(spec.title)+'</div></div>';
  spec.blocks.forEach(b=>{ h+='<div class="bkrow">';
    if(b.top && b.fig) h+=figSVG(b.fig);
    if(b.law) h+='<div class="bklaw">'+t(b.law)+(b.eq?' &nbsp;<span class="bkeq">'+(b.eq.indexOf('<')>=0?b.eq:colorEq(b.eq))+'</span>':'')+'</div>';   // pre-coloured eq (with spans) passes through; plain eq gets value-based colorEq
    if(b.prose) h+='<p>'+t(b.prose)+'</p>';
    if(!b.top && b.fig) h+=figSVG(b.fig);
    if(b.note) h+='<div class="bknote">'+t(b.note)+'</div>';
    h+='</div>'; });
  host.innerHTML=h;
};
window.BOOK=BOOK;
})();
