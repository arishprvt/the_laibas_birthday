(function(){
  // Only keep JS for elements that still exist in the updated HTML.
  const revealBtn = document.getElementById('revealBtn');
  const againBtn = document.getElementById('againBtn');
  const messageBox = document.getElementById('messageBox');
  const hintText = document.getElementById('hintText');

  const sparkles = document.getElementById('sparkles');
  const tapCounter = document.getElementById('tapCounter');
  let sparkleCount = 0;

  const wishInput = document.getElementById('wishInput');
  const saveWish = document.getElementById('saveWish');
  const clearWish = document.getElementById('clearWish');
  const wishStatus = document.getElementById('wishStatus');

  // If sparkles container doesn't exist, nothing to do.
  if (!sparkles) return;


  function prefersReducedMotion(){
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function spawnSparkles(x, y, amount){
    if (prefersReducedMotion()) return;
    const n = amount ?? 6;
    for(let i=0;i<n;i++){
      const p = document.createElement('div');
      p.className = 'particle';

      const size = 7 + Math.random() * 9;
      p.style.width = size + 'px';
      p.style.height = size + 'px';

      const dx = (Math.random() * 90 - 45).toFixed(1) + 'px';
      const dy = (Math.random() * 90 - 45).toFixed(1) + 'px';
      p.style.setProperty('--dx', dx);
      p.style.setProperty('--dy', dy);

      p.style.left = x + 'px';
      p.style.top = y + 'px';

      sparkles.appendChild(p);
      setTimeout(() => p.remove(), 760);
    }
  }

  function bumpSparkles(clientX, clientY, amount){
    sparkleCount += amount ?? 6;
    if (tapCounter) tapCounter.textContent = 'Sparkles: ' + sparkleCount;
    spawnSparkles(clientX, clientY, amount ?? 7);
  }


  function showMessage(){
    if (!messageBox || !hintText || !revealBtn) return;
    messageBox.classList.add('show');
    hintText.style.display = 'none';
    revealBtn.setAttribute('aria-pressed', 'true');
  }

  function hideMessage(){
    if (!messageBox || !hintText || !revealBtn) return;
    messageBox.classList.remove('show');
    hintText.style.display = 'block';
    revealBtn.setAttribute('aria-pressed', 'false');
  }

  if (revealBtn) {
    revealBtn.addEventListener('click', (e) => {
      bumpSparkles(e.clientX, e.clientY, 8);
      showMessage();
    });
  }

  if (againBtn) {
    againBtn.addEventListener('click', (e) => {
      bumpSparkles(e.clientX, e.clientY, 6);
      showMessage();
    });
  }


  // Fun: tap anywhere on the page to add a few sparkles.
  document.addEventListener('pointerdown', (e) => {
    // avoid double counting when tapping the input or buttons already handled
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'button' || tag === 'textarea') return;
    bumpSparkles(e.clientX, e.clientY, 4);
  }, { passive: true });

  function setWish(text){
    if (!wishStatus) return;
    const trimmed = text.trim();
    if (!trimmed){
      wishStatus.classList.remove('show');
      wishStatus.textContent = '';
      return;
    }
    wishStatus.innerHTML = 'Your wish for <strong>Belly</strong>: ' + escapeHtml(trimmed) + ' 💗';
    wishStatus.classList.add('show');
  }


  function escapeHtml(str){
    return str
      .replaceAll('&','&amp;')
      .replaceAll('<','<')
      .replaceAll('>','>')
      .replaceAll('"','"')
      .replaceAll("'",'&#039;');
  }

  if (saveWish && clearWish && wishInput) {
    saveWish.addEventListener('click', (e) => {
      bumpSparkles(e.clientX, e.clientY, 6);
      setWish(wishInput.value);
    });

    clearWish.addEventListener('click', (e) => {
      bumpSparkles(e.clientX, e.clientY, 4);
      wishInput.value = '';
      if (wishStatus) {
        wishStatus.classList.remove('show');
        wishStatus.textContent = '';
      }
    });

    wishInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter'){
        e.preventDefault();
        saveWish.click();
      }
    });
  }


  // Start with message hidden; if user already clicked, keep as is.
  hideMessage();
})();

