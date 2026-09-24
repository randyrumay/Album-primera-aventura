const pages=[...document.querySelectorAll('.page')];
const nextBtn=document.getElementById('next');
const prevBtn=document.getElementById('prev');
const progress=document.getElementById('progress');
const music=document.getElementById('music');
const audio=document.getElementById('audio');
let current=0;

pages.forEach(p=>p.style.backgroundImage=`url("${p.dataset.bg}")`);

document.querySelectorAll('.photo img').forEach(img=>{
  const slot=img.parentElement;
  img.addEventListener('load',()=>slot.classList.add('has-photo'));
  img.addEventListener('error',()=>{img.remove();slot.classList.add('empty')});
});

function show(i,dir=1){
  current=Math.max(0,Math.min(pages.length-1,i));
  pages.forEach((p,n)=>p.classList.toggle('active',n===current));
  progress.textContent=`${current+1} / ${pages.length}`;
  prevBtn.style.opacity=current===0?'0':'1';
  prevBtn.style.pointerEvents=current===0?'none':'auto';
  nextBtn.style.opacity=current===pages.length-1?'0':'1';
  nextBtn.style.pointerEvents=current===pages.length-1?'none':'auto';
}
function goNext(){
  if(current<pages.length-1) show(current+1,1);
}
function goPrev(){
  if(current>0) show(current-1,-1);
}
nextBtn.addEventListener('click',goNext);prevBtn.addEventListener('click',goPrev);
document.querySelectorAll('[data-action="next"]').forEach(b=>b.addEventListener('click',goNext));

document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();goNext()}if(e.key==='ArrowLeft'){e.preventDefault();goPrev()}});
let sx=0;
document.getElementById('book').addEventListener('touchstart',e=>sx=e.changedTouches[0].screenX,{passive:true});
document.getElementById('book').addEventListener('touchend',e=>{const dx=e.changedTouches[0].screenX-sx;if(Math.abs(dx)>45) dx<0?goNext():goPrev()},{passive:true});

async function toggleMusic(){
  try{
    if(audio.paused){await audio.play();music.textContent='♫';music.title='Pausar música'}
    else{audio.pause();music.textContent='♪';music.title='Reproducir música'}
  }catch(e){music.textContent='♪'}
}
music.addEventListener('click',toggleMusic);
// El primer clic del visitante también intenta iniciar el audio, respetando las reglas del navegador.
document.addEventListener('pointerdown',()=>{if(audio.paused) audio.play().catch(()=>{});},{once:true});
show(0);
