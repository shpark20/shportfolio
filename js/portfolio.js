(() => {
  'use strict';
  // Old fullPage URLs keep working after switching to native document scrolling.
  const oldAnchors = {page1:'opening',page2:'project',page3:'ai-video',page4:'project',field:'project','on-site':'project',page5:'profile',page6:'memory'};
  const resolveOldAnchor = () => { const target = oldAnchors[location.hash.slice(1)]; if (target) {history.replaceState(null,'','#'+target);document.getElementById(target)?.scrollIntoView();} };
  resolveOldAnchor(); window.addEventListener('hashchange', resolveOldAnchor);
  document.getElementById('copyright-year').textContent = new Date().getFullYear();

  const hero = document.getElementById('opening-video');
  const loopToggle = document.getElementById('loop-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = reducedMotion.matches;
  let heroVisible = true;
  const syncLoopButton = () => {
    const paused = hero.paused;
    loopToggle.setAttribute('aria-pressed', String(userPaused));
    loopToggle.setAttribute('aria-label', paused ? '오프닝 영상 재생' : '오프닝 영상 일시정지');
    loopToggle.querySelector('.loop-symbol').textContent = paused ? '▷' : 'Ⅱ';
    loopToggle.querySelector('.loop-label').textContent = paused ? 'PLAY LOOP' : 'PAUSE LOOP';
  };
  const resumeHero = () => {if (!userPaused && heroVisible && !document.hidden) hero.play().catch(syncLoopButton);};
  if(userPaused) {hero.autoplay=false;hero.pause();}
  hero.addEventListener('play', syncLoopButton);hero.addEventListener('pause', syncLoopButton);
  loopToggle.addEventListener('click', () => {userPaused = !hero.paused; if(userPaused) hero.pause();else hero.play().catch(syncLoopButton);syncLoopButton();});
  reducedMotion.addEventListener('change', e => {userPaused=e.matches;if(userPaused)hero.pause();else resumeHero();syncLoopButton();});
  const heroObserver = new IntersectionObserver(entries => {heroVisible=entries[0].isIntersecting;if(heroVisible)resumeHero();else hero.pause();},{threshold:.1});
  heroObserver.observe(hero);syncLoopButton();

  const pauseOtherMedia = current => {
    document.querySelectorAll('video').forEach(video => {if(video!==current)video.pause();});
    document.querySelectorAll('.youtube-player iframe').forEach(iframe => iframe.contentWindow?.postMessage(JSON.stringify({event:'command',func:'pauseVideo',args:[]}), 'https://www.youtube-nocookie.com'));
  };
  document.querySelectorAll('video:not(#opening-video)').forEach(video => video.addEventListener('play',()=>pauseOtherMedia(video)));
  const mediaObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting) {
      if(entry.target.tagName==='VIDEO')entry.target.pause();
      else entry.target.querySelector('iframe')?.contentWindow?.postMessage(JSON.stringify({event:'command',func:'pauseVideo',args:[]}), 'https://www.youtube-nocookie.com');
    }
  }),{threshold:.03});
  document.querySelectorAll('video:not(#opening-video),.youtube-player').forEach(media=>mediaObserver.observe(media));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseOtherMedia(null);else resumeHero();});
  document.querySelectorAll('[data-play]').forEach(button=>{
    const video=document.getElementById(button.dataset.play);
    const update=()=>{button.innerHTML=(video.paused?'PLAY FILM':'PAUSE FILM')+' <span aria-hidden="true">'+(video.paused?'↗':'Ⅱ')+'</span>';button.setAttribute('aria-label',video.getAttribute('aria-label')+(video.paused?' 재생':' 일시정지'));};
    video.addEventListener('play',update);video.addEventListener('pause',update);video.addEventListener('ended',update);
    button.addEventListener('click',()=>{if(video.paused){video.muted=false;video.play().catch(()=>video.focus());video.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'center'});}else video.pause();});
  });
  document.querySelectorAll('.youtube-trigger > img').forEach(img => {
    const showFallback = () => img.closest('.youtube-trigger').classList.add('thumbnail-unavailable');
    img.addEventListener('error', showFallback);
    if (img.complete && img.naturalWidth === 0) showFallback();
  });
  document.querySelectorAll('button.youtube-trigger').forEach(button=>button.addEventListener('click',()=>{
    pauseOtherMedia(null);
    const player=button.closest('.youtube-player');
    const iframe=document.createElement('iframe');
    iframe.src='https://www.youtube-nocookie.com/embed/'+player.dataset.youtube+'?autoplay=1&rel=0&enablejsapi=1';
    iframe.title=player.dataset.title;
    iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy='strict-origin-when-cross-origin';
    iframe.allowFullscreen=true;
    player.replaceChildren(iframe);
    iframe.focus();
  }));
  document.querySelectorAll('details').forEach(details => details.addEventListener('toggle', () => {
    if (!details.open) details.querySelectorAll('.youtube-player iframe').forEach(iframe => iframe.contentWindow?.postMessage(JSON.stringify({event:'command',func:'pauseVideo',args:[]}), 'https://www.youtube-nocookie.com'));
  }));

  const navLinks=[...document.querySelectorAll('.main-nav a')];
  const sections=[...document.querySelectorAll('main > section')];
  let frameRequested=false;
  const updateNav=()=>{let current='opening';for(const section of sections){if(section.getBoundingClientRect().top<=window.innerHeight*.35)current=section.id;}navLinks.forEach(link=>{if(link.hash==='#'+current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});frameRequested=false;};
  window.addEventListener('scroll',()=>{if(!frameRequested){frameRequested=true;requestAnimationFrame(updateNav);}},{passive:true});
  updateNav();

  const dialog=document.getElementById('memory-dialog');
  const dialogImage=document.getElementById('memory-dialog-image');
  const dialogCaption=document.getElementById('memory-dialog-caption');
  let memoryTrigger=null;
  document.querySelectorAll('[data-memory]').forEach(button=>button.addEventListener('click',()=>{
    memoryTrigger=button;dialogImage.src=button.dataset.memory;dialogImage.alt=button.dataset.caption;dialogCaption.textContent=button.dataset.caption;dialog.showModal();
  }));
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>memoryTrigger?.focus({preventScroll:true}));
})();
