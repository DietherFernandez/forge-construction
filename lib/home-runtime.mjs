/** Initialize the GitHub landing page on each React mount; return complete cleanup. */
export function initializeHome(root) {
 const controller = new AbortController();
 const cleanups = [];
 const animations = [];
 function on(target, type, listener, options = {}) {
  target.addEventListener(type, listener, { ...options, signal: controller.signal });
 }
 function trackAnimation(animation) { animations.push(animation); }
 try {

// Reusable hero background: poster stays in place; only the media layer changes.
class HeroBackground{constructor(container,{videoSource=null,poster,posterSmall}){this.container=container;this.videoSource=videoSource;this.poster=poster;this.posterSmall=posterSmall}mount(){if(!this.container||!this.videoSource||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const video=document.createElement('video');video.className='hero-video';video.setAttribute('aria-hidden','true');video.setAttribute('autoplay','');video.setAttribute('muted','');video.setAttribute('loop','');video.setAttribute('playsinline','');video.autoplay=true;video.muted=true;video.defaultMuted=true;video.loop=true;video.playsInline=true;video.preload='metadata';video.poster=this.poster;on(video,'playing',()=>video.classList.add('is-live'),{once:true});on(video,'error',()=>video.remove(),{once:true});video.src=this.videoSource;this.container.appendChild(video);const attempt=video.play();if(attempt?.catch)attempt.catch(()=>{})}}
const HERO_VIDEO_SOURCE='/assets/videos/forge-hero.mp4'; // Generated hero video; poster remains the fallback.
new HeroBackground(root.querySelector('#hero-background'),{videoSource:HERO_VIDEO_SOURCE,poster:'/assets/images/forge_hero.webp',posterSmall:'/assets/images/forge_hero-small.webp'}).mount();
const header=root.querySelector('#site-header');const syncHeader=()=>header.classList.toggle('scrolled',scrollY>24);syncHeader();on(window,'scroll',syncHeader,{passive:true});
const drawer=root.querySelector('#mobile-drawer'),menuButton=root.querySelector('.menu-toggle'),closeButton=root.querySelector('.drawer-close'),panel=root.querySelector('.drawer-panel');let previousFocus=null;
function closeMenu(){if(drawer.hidden)return;drawer.hidden=true;document.body.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation menu');previousFocus?.focus()}
function openMenu(){previousFocus=document.activeElement;drawer.hidden=false;document.body.classList.add('menu-open');menuButton.setAttribute('aria-expanded','true');menuButton.setAttribute('aria-label','Close navigation menu');closeButton.focus()}
on(menuButton,'click',()=>drawer.hidden?openMenu():closeMenu());on(closeButton,'click',closeMenu);on(drawer.querySelector('.backdrop'),'click',closeMenu);drawer.querySelectorAll('a').forEach(a=>on(a,'click',closeMenu));
on(document,'keydown',event=>{if(drawer.hidden)return;if(event.key==='Escape'){event.preventDefault();closeMenu();return}if(event.key==='Tab'){const items=[...panel.querySelectorAll('a[href],button:not([disabled])')],first=items[0],last=items[items.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}});
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const reduced=motionPreference.matches;
let stopArchitecturalMotion=()=>{};
if(!reduced&&'IntersectionObserver' in window){
 try{
  const targets=[...root.querySelectorAll('.reveal,.section-label')];
  root.querySelectorAll('[data-reveal-group]').forEach(group=>group.querySelectorAll(':scope > .reveal').forEach((el,i)=>el.style.setProperty('--delay',`${Math.min(i*90,270)}ms`)));
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
  }),{threshold:0,rootMargin:'0px 0px -32px 0px'});
  cleanups.push(()=>observer.disconnect());targets.forEach(el=>observer.observe(el));
  document.documentElement.classList.add('js-motion');
  const hero=root.querySelector('.hero'),process=root.querySelector('.process-grid'),contact=root.querySelector('.contact');
  const steps=[...root.querySelectorAll('.step')];
  let frame=0;
  const clamp=n=>Math.min(1,Math.max(0,n));
  function draw(){
   frame=0;
   const vh=innerHeight,heroRect=hero.getBoundingClientRect();
   const distance=Math.max(0,-heroRect.top);
   hero.style.setProperty('--hero-drift',`${Math.min(distance*.16,110)}px`);
   hero.style.setProperty('--hero-opacity',String(1-clamp(distance/heroRect.height)*.7));
   const rect=process.getBoundingClientRect();
   const progress=clamp((vh*.8-rect.top)/(vh*.55+rect.height));
   process.style.setProperty('--build-progress',String(progress));
   steps.forEach(step=>step.classList.toggle('is-current',step.getBoundingClientRect().top<vh*.8));
   if(contact.getBoundingClientRect().top<vh*.88)contact.classList.add('is-assembled');
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(draw)}
  on(window,'scroll',schedule,{passive:true});on(window,'resize',schedule,{passive:true});
  stopArchitecturalMotion=()=>{observer.disconnect();removeEventListener('scroll',schedule);removeEventListener('resize',schedule);cancelAnimationFrame(frame);document.documentElement.classList.remove('js-motion');hero.style.removeProperty('--hero-drift');hero.style.removeProperty('--hero-opacity');process.style.removeProperty('--build-progress');contact.classList.add('is-assembled')};
  draw();
 }catch(error){stopArchitecturalMotion();document.documentElement.classList.remove('js-motion')}
}
on(motionPreference,'change',()=>{if(motionPreference.matches){stopArchitecturalMotion();root.querySelectorAll('video').forEach(video=>video.pause())}});

if(!reduced&&Element.prototype.animate)root.querySelectorAll('.hero h1 span').forEach((line,i)=>trackAnimation(line.animate([{clipPath:'inset(0 0 100% 0)',transform:'translateY(18px)',opacity:.35},{clipPath:'inset(0 0 0 0)',transform:'translateY(0)',opacity:1}],{duration:780,delay:160+i*130,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'})));

 return () => {
  controller.abort();stopArchitecturalMotion();cleanups.forEach(cleanup=>cleanup());
  animations.forEach(animation=>animation.cancel());
  root.querySelectorAll('video').forEach(video=>{video.pause();video.removeAttribute('src');video.load();video.remove()});
  document.body.classList.remove('menu-open');document.documentElement.classList.remove('js-motion');
 };
 } catch (error) {
  controller.abort();cleanups.forEach(cleanup=>cleanup());
  document.documentElement.classList.remove('js-motion');document.body.classList.remove('menu-open');
  console.error('FORGE homepage initialization failed', error);
  return () => {};
 }
}
