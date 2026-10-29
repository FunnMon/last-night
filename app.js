'use strict';
(() => {
  const KEY = 'last-night-assessment-v1';
  const $ = selector => document.querySelector(selector);
  const fresh = () => ({ version: 1, answers: [], step: 0, completed: false });
  let state = fresh();
  let storageAvailable = true;
  let noticeTimer;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (raw?.version === 1 && Array.isArray(raw.answers) && raw.answers.length <= SCENARIOS.length && raw.answers.every(n => Number.isInteger(n) && n >= 0 && n < 4)) {
      state = { version: 1, answers: raw.answers, step: Number.isInteger(raw.step) ? Math.max(0, Math.min(raw.step, raw.answers.length, SCENARIOS.length - 1)) : 0, completed: raw.completed === true && raw.answers.length === SCENARIOS.length };
    }
  } catch { storageAvailable = false; }
  function notice(message) {
    clearTimeout(noticeTimer); $('#status').textContent = message;
    noticeTimer = setTimeout(() => { $('#status').textContent = ''; }, 5000);
  }
  function updateEntry() { $('#start-label').textContent = state.completed ? '查看我的生存档案' : state.answers.length ? '继续这一夜' : '进入爆发现场'; }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { storageAvailable = false; }
    updateEntry();
  }
  function focusHeading(selector) { const heading = $(selector); heading.tabIndex = -1; heading.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }
  function show(view, focus) {
    ['home','quiz','result'].forEach(name => { $(`#${name}-view`).hidden = name !== view; });
    document.title = view === 'result' ? `${calculateSurvival(state.answers).days} 天｜我的丧尸生存档案` : '最后一夜｜丧尸生存测评';
    if (focus) focusHeading(view === 'home' ? '#home-title' : view === 'quiz' ? '#question-title' : '#result-title');
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function route(initial = false) {
    if (location.hash === '#test' && !state.completed) { renderQuiz(); show('quiz', !initial); }
    else if (location.hash === '#result' && state.completed) { renderResult(); show('result', !initial); }
    else show('home', !initial);
    updateEntry();
  }
  function navigate(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  function renderQuiz() {
    const index = state.step, scene = SCENARIOS[index], chapter = CHAPTERS[Math.floor(index / 3)], selected = state.answers[index];
    $('#quiz-view').innerHTML = `
      <div class="quiz-top"><button class="text-button" type="button" data-action="home">返回首页</button><span>第 ${index+1} / ${SCENARIOS.length} 次选择</span></div>
      <div class="progress-track" role="progressbar" aria-label="答题进度" aria-valuemin="0" aria-valuemax="${SCENARIOS.length}" aria-valuenow="${index+1}">${SCENARIOS.map((_, i) => `<span class="${i <= index ? 'passed' : ''}"></span>`).join('')}</div>
      <div class="quiz-layout"><aside class="chapter-panel" aria-label="当前剧情"><img src="assets/city.webp" alt="" width="1122" height="1402"><span class="chapter-time">${chapter.time}</span><span class="chapter-name">${chapter.name}</span><p class="chapter-line">${chapter.line}</p></aside>
      <div class="question"><h1 id="question-title">${scene.title}</h1><p class="scene">${scene.scene}</p><p class="prompt" id="choice-prompt">${scene.prompt}</p><div class="choices" role="group" aria-labelledby="choice-prompt">${scene.options.map((option, i) => `<button class="choice" type="button" data-choice="${i}" aria-pressed="${selected === i}"><span class="choice-key">${'ABCD'[i]}</span><span>${option.text}</span><span class="choice-check" aria-hidden="true">${selected === i ? '✓' : ''}</span></button>`).join('')}</div><div class="quiz-bottom"><button class="text-button" type="button" data-action="previous" ${index === 0 ? 'disabled' : ''}>上一次选择</button><button class="button primary" type="button" data-action="next" ${selected === undefined ? 'disabled' : ''}>${index === SCENARIOS.length-1 ? '揭晓我的结局' : '继续这一夜'}</button></div></div></div>`;
  }
  function select(value) {
    state.answers[state.step] = value; save();
    document.querySelectorAll('[data-choice]').forEach(button => { const checked = Number(button.dataset.choice) === value; button.setAttribute('aria-pressed', String(checked)); button.querySelector('.choice-check').textContent = checked ? '✓' : ''; });
    $('[data-action="next"]').disabled = false;
  }
  function next() {
    if (state.answers[state.step] === undefined) return;
    if (state.step < SCENARIOS.length-1) { state.step++; save(); renderQuiz(); focusHeading('#question-title'); }
    else { state.completed = true; save(); navigate('#result'); }
  }
  function renderResult() {
    const r = calculateSurvival(state.answers);
    const key = SCENARIOS[r.keyIndex], keyOption = key.options[state.answers[r.keyIndex]], anchor = SCENARIOS[r.anchorIndex].options[state.answers[r.anchorIndex]];
    $('#result-view').innerHTML = `
      <div class="result-top"><span>最后一夜 / 你的生存档案</span><span>${r.open ? '记录状态：仍有回应' : '记录状态：停止更新'}</span></div>
      <div class="result-hero"><div><h1 id="result-title">${r.open ? '第六十天，你仍然在场。' : '你撑过了'}</h1><div class="survival-duration"><strong>${r.days}</strong><span>${r.open ? '天以上' : '天'}</span></div><p class="duration-note">${r.open ? '开放结局，档案暂时停止计时。' : '基于这 12 次选择的虚构剧情推演。'}</p><h2 class="survivor-name">${r.survivor.name}</h2><p class="survivor-line">${r.survivor.line}</p></div><img class="result-photo" src="assets/city.webp" alt="夜色里等待回音的城市" width="1122" height="1402"></div>
      <section class="result-section" aria-labelledby="ending-title"><h2 id="ending-title">${r.open ? '故事，未完待续。' : '你的结局，停在这里。'}</h2><div class="ending-layout"><h3>${r.ending.name}</h3><p>${r.ending.text}</p></div></section>
      <section class="result-section" aria-labelledby="reading-title"><h2 id="reading-title">真正影响你的，是这些选择。</h2><div class="readings"><article class="reading-row"><div><h3>你最依赖的生存方式</h3><p class="chosen-text">你选择过：“${anchor.text}”</p></div><p>${r.survivor.strength}</p></article><article class="reading-row"><div><h3>${r.open ? '仍需留意的一步' : '埋下隐患的一步'}</h3><p class="chosen-text">第 ${r.keyIndex+1} 题：“${keyOption.text}”</p></div><p>${keyOption.reflect} 这类选择积累的风险是：${RISK_NAMES[r.riskAxis]}。</p></article><article class="reading-row"><h3>你容易忽略的代价</h3><p>${r.survivor.blind}</p></article></div></section>
      <section class="result-section" aria-labelledby="record-title"><h2 id="record-title">倒带，看看最初的那一夜。</h2><ol class="record">${r.record.map(item => `<li><time>${item.time}</time><strong>${item.name}</strong><p>${item.event}</p></li>`).join('')}</ol></section>
      <section class="result-section rewrite" aria-labelledby="rewrite-title"><h2 id="rewrite-title">${r.open ? '天亮之后，故事继续。' : '如果只改写一次选择……'}</h2>${r.rewrite ? `<p>回到第 ${r.rewrite.index+1} 题「${SCENARIOS[r.rewrite.index].title}」，换成：</p><p class="rewrite-choice">“${SCENARIOS[r.rewrite.index].options[r.rewrite.alternative].text}”</p><p>同一套剧情规则下，你的记录会从 ${r.days} 天延长到 ${r.rewrite.days}${r.rewrite.open ? ' 天以上，进入开放结局。' : ' 天。'} 这条支线，还来得及重写。</p>` : `<p>${r.open ? '你没有把生存只押在某一次聪明的决定上。准备、判断和彼此回应，让危机逐渐变成了可以共同面对的日常。下一次广播响起时，希望你仍有人可以叫醒。' : '这一版结局来自多次选择的累积，单独换一步还不够。下一次，试着重新想一想：什么值得相信，什么值得等待，什么不必由你独自承担。'}</p>`}</section>
      <div class="result-actions"><button class="button primary" type="button" data-action="download">保存生存档案</button><button class="text-button" type="button" data-action="restart">重写这场危机</button></div><p class="export-hint">这是虚构故事里的你。生存时长不是现实预测。</p>`;
  }
  async function exportCard(button) {
    if (button.disabled) return;
    button.disabled = true; button.setAttribute('aria-busy','true'); button.textContent = '正在封存档案…';
    try {
      await document.fonts.ready;
      const r = calculateSurvival(state.answers), root = getComputedStyle(document.documentElement);
      const color = name => root.getPropertyValue(`--color-export-${name}`).trim(), family = root.getPropertyValue('--font-body').trim();
      const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1530;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = color('paper'); ctx.fillRect(0,0,1080,1530);
      function text(value,x,y,size=30,weight=400,ink='ink') { ctx.font = `${weight} ${size}px ${family}`; ctx.fillStyle=color(ink); ctx.fillText(value,x,y); }
      function wrap(value,x,y,width,size,lineHeight,ink='muted') { ctx.font=`400 ${size}px ${family}`; ctx.fillStyle=color(ink); let line=''; for(const char of value) { if(ctx.measureText(line+char).width>width && line) { ctx.fillText(line,x,y); y+=lineHeight; line=char; } else line+=char; } if(line) ctx.fillText(line,x,y); return y; }
      text('最后一夜 / 丧尸生存档案',70,95,28);
      ctx.strokeStyle=color('rule'); ctx.beginPath(); ctx.moveTo(70,130); ctx.lineTo(1010,130); ctx.stroke();
      text(r.open ? '第六十天，仍然在场。' : '我的生存记录停在',70,195,30);
      text(String(r.days),60,395,210,300);
      text(r.open ? '天以上' : '天',340,385,42);
      text(r.survivor.name,70,490,53,400);
      wrap(r.survivor.line,70,550,940,27,42);
      const image = new Image(); image.src='assets/city.webp'; await image.decode();
      const cropHeight=image.naturalWidth*300/940;
      ctx.drawImage(image,0,image.naturalHeight*.35,image.naturalWidth,cropHeight,70,600,940,300);
      text(r.ending.name,70,970,37);
      wrap(r.ending.text,70,1030,940,27,44);
      const chosen=SCENARIOS[r.keyIndex].options[state.answers[r.keyIndex]];
      text(r.open ? '仍需留意的选择' : '埋下隐患的选择',70,1265,26,500,'accent');
      wrap(`“${chosen.text}”`,70,1320,940,27,42,'ink');
      ctx.strokeStyle=color('rule'); ctx.beginPath(); ctx.moveTo(70,1430); ctx.lineTo(1010,1430); ctx.stroke();
      text('12 次选择 / 一场虚构危机 / 时长不代表现实生存能力',70,1480,23,400,'muted');
      const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('export failed')),'image/png'));
      const url=URL.createObjectURL(blob), link=document.createElement('a'); link.href=url; link.download=`最后一夜-${r.days}天-${r.survivor.name}.png`; document.body.append(link); link.click(); link.remove(); setTimeout(()=>URL.revokeObjectURL(url),30000);
    } catch { notice('档案图片暂时没有保存成功，请再试一次。'); }
    finally { button.disabled=false; button.removeAttribute('aria-busy'); button.textContent='保存生存档案'; }
  }
  document.addEventListener('click', event => {
    const choice=event.target.closest('[data-choice]'); if(choice) { select(Number(choice.dataset.choice)); return; }
    const button=event.target.closest('[data-action]'); if(!button) return;
    switch(button.dataset.action) {
      case 'start': if(!storageAvailable) notice('当前浏览器无法保存进度，请在本次打开中完成测评。'); navigate(state.completed?'#result':'#test'); break;
      case 'home': navigate(''); break;
      case 'previous': if(state.step>0) { state.step--; save(); renderQuiz(); focusHeading('#question-title'); } break;
      case 'next': next(); break;
      case 'restart': state=fresh(); save(); navigate('#test'); break;
      case 'download': exportCard(button); break;
    }
  });
  window.addEventListener('hashchange',()=>route());
  updateEntry(); route(true);
})();
