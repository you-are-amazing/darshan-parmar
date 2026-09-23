// ---------- Visitor name ----------
function getDisplayName() {
  try {
    const stored = localStorage.getItem('portfolio_visitor_name');
    return stored ? stored : 'You';
  } catch (error) {
    return 'You';
  }
}

// ---------- Content library ----------
const RESPONSES = window.RESPONSES || {};
const PROMPT_LABELS = window.PROMPT_LABELS || {};

// ---------- DOM ----------
const messagesEl = document.getElementById('messages');
const welcomeEl = document.getElementById('welcome');
const promptInput = document.getElementById('promptInput');
const sendBtn = document.getElementById('sendBtn');
const attachBtn = document.getElementById('attachBtn');
const socialMenu = document.getElementById('socialMenu');
const suggestionsPanel = document.getElementById('suggestionsPanel');
const composerInner = document.querySelector('.composer-inner');
const chatEl = document.querySelector('.chat');
const appRoot = document.getElementById('appRoot');
const sidebar = document.getElementById('sidebar');
const sidebarList = document.getElementById('sidebarList');
const sidebarEmpty = document.getElementById('sidebarEmpty');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarOpenBtn = document.getElementById('sidebarOpenBtn');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');

const suggestionOrder = [
  'about',
  'skills',
  'projects',
  'experience',
  'research',
  'contact'
];

const answeredPrompts = {};
let chatEpoch = 0; // bumped by clearChat() so in-flight replies are dropped

// ---------- Viewport height ----------
// Modern browsers: CSS (100dvh) sizes the app, so nothing to measure.
// Older browsers without dvh: measure the visible area in JS and re-measure
// after the keyboard / URL bar settles so the layout never stays stuck at
// a stale (too short) height.
const supportsDvh = !!(window.CSS && CSS.supports && CSS.supports('height', '100dvh'));

function setViewportHeight() {
  const root = document.documentElement;
  if (supportsDvh) {
    root.style.removeProperty('--app-vh');
    return;
  }
  const vv = window.visualViewport;
  const h = Math.max(vv ? vv.height : 0, window.innerHeight || 0);
  root.style.setProperty('--app-vh', `${h}px`);
}

function settleViewportHeight() {
  setViewportHeight();
  [120, 350, 700].forEach(ms => setTimeout(setViewportHeight, ms));
}

setViewportHeight();
window.addEventListener('load', settleViewportHeight);
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', settleViewportHeight);
window.addEventListener('pageshow', settleViewportHeight);
document.addEventListener('visibilitychange', settleViewportHeight);
document.addEventListener('focusout', settleViewportHeight);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => {
    setViewportHeight();
    // keep the latest message visible while the keyboard animates in/out
    scrollToEnd();
  });
}

function scrollToEnd() {
  requestAnimationFrame(() => {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  });
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

function hideWelcome() {
  if (!welcomeEl || !welcomeEl.parentNode) return;
  // Deferred a frame so this lands in the same paint cycle as the FLIP
  // transition set up in markChatStarted() — otherwise the opacity class
  // can apply before that transition is enabled and the fade never animates.
  requestAnimationFrame(() => {
    welcomeEl.classList.add('welcome-hide');
  });
  // Matches the FLIP slide duration in markChatStarted() so the hero
  // finishes gliding + fading before it's removed from the DOM.
  setTimeout(() => {
    if (welcomeEl.parentNode) welcomeEl.remove();
  }, 440);
}

// Once the first message is sent, the composer moves from its centered
// "empty state" spot (right under the hero) to its normal pinned-bottom
// position. Animated with a FLIP transform so it glides into place
// instead of teleporting there in the same frame — that instant jump is
// what made the old version feel like it "got stuck then vanished."
function markChatStarted() {
  if (!chatEl || !chatEl.classList.contains('is-empty')) return;

  const composerEl = document.querySelector('.composer');
  const tracked = [welcomeEl, composerEl].filter(Boolean);
  const firstRects = tracked.map((el) => el.getBoundingClientRect());

  chatEl.classList.remove('is-empty');

  tracked.forEach((el, i) => {
    const firstRect = firstRects[i];
    const lastRect = el.getBoundingClientRect();
    const deltaY = firstRect.top - lastRect.top;
    if (Math.abs(deltaY) < 1) return;
    el.style.transition = 'none';
    el.style.transform = `translateY(${deltaY}px)`;
  });

  // Force layout once so the starting transform above is actually
  // painted before we animate it away.
  void (composerEl || document.body).offsetHeight;

  requestAnimationFrame(() => {
    tracked.forEach((el) => {
      el.style.transition = 'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease';
      el.style.transform = '';
    });
  });

  tracked.forEach((el) => {
    el.addEventListener('transitionend', function cleanup(event) {
      if (event.propertyName && event.propertyName !== 'transform') return;
      el.style.transition = '';
      el.style.transform = '';
      el.removeEventListener('transitionend', cleanup);
    });
  });
}

// ---------- Sidebar: prompt history ----------
function addHistoryItem(key, label) {
  if (!sidebarList) return;
  if (sidebarEmpty && sidebarEmpty.parentNode) sidebarEmpty.remove();
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'sidebar-item';
  btn.dataset.key = key;
  btn.textContent = label;
  btn.addEventListener('click', () => {
    scrollToExisting(key);
    setActiveHistoryItem(key);
    if (isMobileLayout()) setSidebarCollapsed(true);
  });
  sidebarList.appendChild(btn);
}

function setActiveHistoryItem(key) {
  if (!sidebarList) return;
  sidebarList.querySelectorAll('.sidebar-item').forEach((b) => {
    b.classList.toggle('active', b.dataset.key === key);
  });
}

function isMobileLayout() {
  return window.matchMedia('(max-width: 780px)').matches;
}

function setSidebarCollapsed(collapsed) {
  if (!appRoot) return;
  appRoot.classList.toggle('sidebar-collapsed', collapsed);
  try {
    localStorage.setItem('portfolio_sidebar_collapsed', collapsed ? '1' : '0');
  } catch (error) {
    /* ignore storage errors */
  }
}

function toggleSidebar() {
  if (!appRoot) return;
  setSidebarCollapsed(!appRoot.classList.contains('sidebar-collapsed'));
}

if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
if (sidebarOpenBtn) sidebarOpenBtn.addEventListener('click', toggleSidebar);
if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', () => setSidebarCollapsed(true));

(function initSidebarState() {
  let stored = null;
  try {
    stored = localStorage.getItem('portfolio_sidebar_collapsed');
  } catch (error) {
    stored = null;
  }
  if (stored === '1') {
    setSidebarCollapsed(true);
  } else if (stored === '0') {
    setSidebarCollapsed(false);
  } else {
    setSidebarCollapsed(isMobileLayout());
  }
})();

function addUserMessage(text, id) {
  // Snap the layout to its normal (non-centered, scrollable) state first,
  // so the hero's fade-out below never overlaps a mid-reflow frame.
  markChatStarted();
  hideWelcome();
  const displayName = getDisplayName();
  const msg = document.createElement('div');
  msg.className = 'msg user';
  if (id) msg.id = id;
  msg.innerHTML = `
    <div class="bubble">
      <div class="who"><b>${escapeHtml(displayName)}</b></div>
      <div class="bubble-card"><p>${escapeHtml(text)}</p></div>
    </div>
  `;
  messagesEl.appendChild(msg);
  scrollToEnd();
}

function showTyping() {
  const msg = document.createElement('div');
  msg.className = 'msg bot';
  msg.id = 'typing-msg';
  msg.innerHTML = `
    <div class="avatar bot"><img class="assistant-logo" src="logo.png" alt="" /></div>
    <div class="bubble">
      <div class="who"><b>Darshan's assistant</b></div>
      <div class="typing"><span></span><span></span><span></span></div>
    </div>
  `;
  messagesEl.appendChild(msg);
  scrollToEnd();
}

function removeTyping() {
  const t = document.getElementById('typing-msg');
  if (t) t.remove();
}

function addBotMessage(html, id) {
  const msg = document.createElement('div');
  msg.className = 'msg bot';
  if (id) msg.id = id;
  msg.innerHTML = `
    <div class="avatar bot"><img class="assistant-logo" src="logo.png" alt="" /></div>
    <div class="bubble">
      <div class="who"><b>Darshan Here</b></div>
      <div class="bubble-card">${html}</div>
    </div>
  `;
  messagesEl.appendChild(msg);
  scrollToEnd();
}

function scrollToExisting(key) {
  const el = document.getElementById(answeredPrompts[key]);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  el.classList.add('highlight');
  setTimeout(() => el.classList.remove('highlight'), 1200);
}

function markChipVisited(key) {
  if (!suggestionsPanel) return;
  const item = suggestionsPanel.querySelector(`[data-prompt="${key}"]`);
  if (item) item.classList.add('visited');
}

// ---------- Content viewer panel (blog posts / repo previews) ----------
// Opens blog posts and open-source repo previews in an in-app slide-over
// panel instead of navigating away, so the visitor's tab never changes.
const viewerOverlay = document.getElementById('viewerOverlay');
const viewerIcon = document.getElementById('viewerIcon');
const viewerTitle = document.getElementById('viewerTitle');
const viewerSubtitle = document.getElementById('viewerSubtitle');
const viewerBody = document.getElementById('viewerBody');
const viewerExternalLink = document.getElementById('viewerExternalLink');
const viewerClose = document.getElementById('viewerClose');

function openViewer({ icon, title, subtitle, html, externalUrl }) {
  if (!viewerOverlay) return;
  if (viewerIcon) viewerIcon.textContent = icon || '📄';
  if (viewerTitle) viewerTitle.textContent = title || '';
  if (viewerSubtitle) viewerSubtitle.textContent = subtitle || '';
  if (viewerBody) {
    viewerBody.innerHTML = html || '';
    viewerBody.scrollTop = 0;
  }
  if (viewerExternalLink) {
    if (externalUrl) {
      viewerExternalLink.href = externalUrl;
      viewerExternalLink.style.display = '';
    } else {
      viewerExternalLink.style.display = 'none';
    }
  }
  viewerOverlay.classList.add('open');
  viewerOverlay.setAttribute('aria-hidden', 'false');
}

function closeViewer() {
  if (!viewerOverlay) return;
  viewerOverlay.classList.remove('open');
  viewerOverlay.setAttribute('aria-hidden', 'true');
}

if (viewerClose) viewerClose.addEventListener('click', closeViewer);
if (viewerOverlay) {
  viewerOverlay.addEventListener('click', (event) => {
    if (event.target === viewerOverlay) closeViewer();
  });
}
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeViewer();
});

function openBlogPost(slug) {
  const post = (window.BLOG_POSTS || {})[slug];
  if (!post) return;
  const html = `
    <h1>${escapeHtml(post.title)}</h1>
    <div class="viewer-meta">${escapeHtml(post.date)}${post.readTime ? ' · ' + escapeHtml(post.readTime) : ''}</div>
    ${post.body}
  `;
  openViewer({
    icon: '📝',
    title: post.title,
    subtitle: "Darshan's blog",
    html,
    externalUrl: post.sourceUrl || null
  });
}

function openRepoPreview(slug) {
  const repo = (window.REPO_PREVIEWS || {})[slug];
  if (!repo) return;
  const stars = repo.stars != null ? `⭐ ${repo.stars.toLocaleString()}` : '';
  const forks = repo.forks != null ? `⑂ ${repo.forks.toLocaleString()}` : '';
  const html = `
    <div class="repo-preview">
      <div class="repo-preview-top">
        <div class="repo-preview-name">${escapeHtml(repo.owner)}<span style="color:var(--ink-faint)"> / </span>${escapeHtml(repo.name)}</div>
        <div class="repo-preview-desc">${escapeHtml(repo.description)}</div>
      </div>
      <div class="repo-preview-stats">
        ${repo.language ? `<span><span class="repo-lang-dot" style="background:${repo.languageColor || 'var(--maroon-600)'}"></span>${escapeHtml(repo.language)}</span>` : ''}
        ${stars ? `<span>${stars}</span>` : ''}
        ${forks ? `<span>${forks}</span>` : ''}
        ${repo.updated ? `<span>Updated ${escapeHtml(repo.updated)}</span>` : ''}
      </div>
      ${repo.readme ? `<div class="repo-readme">${repo.readme}</div>` : ''}
    </div>
    <p style="color:var(--ink-faint); font-size:0.85rem;">GitHub doesn't allow other sites to embed its pages, so this is a preview built from the repo's info — use "Open externally" above for the live page.</p>
  `;
  openViewer({
    icon: '💾',
    title: `${repo.owner}/${repo.name}`,
    subtitle: 'GitHub repository',
    html,
    externalUrl: repo.url
  });
}

// Delegated click handling — blog-cards and the repo project-card are
// injected into #messages dynamically, so listen on the container.
messagesEl.addEventListener('click', (event) => {
  const blogTrigger = event.target.closest('[data-blog]');
  if (blogTrigger) {
    event.preventDefault();
    openBlogPost(blogTrigger.dataset.blog);
    return;
  }
  const repoTrigger = event.target.closest('[data-repo]');
  if (repoTrigger) {
    event.preventDefault();
    openRepoPreview(repoTrigger.dataset.repo);
  }
});

function renderSuggestions(filterText = '') {
  if (!suggestionsPanel) return;

  const value = (filterText || '').trim().toLowerCase();
  const items = suggestionOrder
    .map((key) => ({ key, label: PROMPT_LABELS[key] || key }))
    .filter(({ label }) => !value || label.toLowerCase().includes(value));

  suggestionsPanel.innerHTML = items.length
    ? items
      .map(({ key, label }) => `<button type="button" class="suggestion-item" data-prompt="${key}">${escapeHtml(label)}</button>`)
      .join('')
    : '<button type="button" class="suggestion-item" aria-disabled="true">No matching prompts</button>';

  suggestionsPanel.classList.remove('hidden');
  suggestionsPanel.classList.add('open');
  promptInput.setAttribute('aria-expanded', 'true');

  suggestionsPanel.querySelectorAll('.suggestion-item').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.getAttribute('aria-disabled') === 'true') return;
      const key = button.dataset.prompt;
      const selectedLabel = PROMPT_LABELS[key] || button.textContent.trim();
      promptInput.value = selectedLabel;
      updateSendState();
      closeSuggestionPanel();
      handleSubmit(selectedLabel);
      promptInput.focus();
    });
  });
}

function closeSuggestionPanel() {
  if (!suggestionsPanel) return;
  suggestionsPanel.classList.remove('open');
  suggestionsPanel.classList.add('hidden');
  promptInput.setAttribute('aria-expanded', 'false');
}

function showSuggestionPanel(filterText = '') {
  renderSuggestions(filterText);
}

function closeSocialMenu() {
  if (!socialMenu) return;
  socialMenu.classList.add('hidden');
  socialMenu.classList.remove('open');
  if (attachBtn) attachBtn.classList.remove('active');
}

function openSocialMenu() {
  if (!socialMenu) return;
  socialMenu.classList.remove('hidden');
  socialMenu.classList.add('open');
  if (attachBtn) attachBtn.classList.add('active');
  closeSuggestionPanel();
}

function toggleSocialMenu() {
  if (!socialMenu) return;
  if (socialMenu.classList.contains('hidden')) {
    openSocialMenu();
  } else {
    closeSocialMenu();
  }
}

function closeAllMenus() {
  closeSuggestionPanel();
  closeSocialMenu();
}

function classifyPrompt(text) {
  const t = text.toLowerCase().trim();
  if (!t) return null;

  // A click on a suggested prompt sends its exact label — map it straight
  // to its section so generic phrases like "tell me about" can't hijack it.
  for (const [key, label] of Object.entries(PROMPT_LABELS)) {
    if (label.toLowerCase().trim() === t) return key;
  }

  const rules = [
    { keys: ['skill', 'tool', 'tech stack', 'technology', 'languages', 'framework'], key: 'skills' },
    { keys: ['experience', 'work', 'job', 'career', 'role', 'position', 'employment', 'worked'], key: 'experience' },
    { keys: ['project', 'build', 'made', 'created', 'portfolio', 'work you\'ve done', 'what have you built'], key: 'projects' },
    { keys: ['research', 'paper', 'publication', 'study', 'thesis', 'academic'], key: 'research' },
    { keys: ['contact', 'email', 'reach', 'hello', 'get in touch', 'connect', 'linkedin', 'github', 'twitter'], key: 'contact' },
    { keys: ['about', 'who is darshan', 'who are you', 'tell me about', 'introduce'], key: 'about' }
  ];

  for (const rule of rules) {
    for (const kw of rule.keys) {
      if (t.includes(kw)) return rule.key;
    }
  }
  return null;
}

function handleSubmit(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const key = classifyPrompt(trimmed);
  if (!key) {
    addUserMessage(trimmed);
    showTyping();
    const epoch = chatEpoch;
    setTimeout(() => {
      if (epoch !== chatEpoch) return;
      removeTyping();
      addBotMessage(`<p>I didn't quite catch that. Here are some things I can help with:</p><div class="link-row"><a class="link-pill" href="#" data-quick="about">About Darshan</a><a class="link-pill" href="#" data-quick="skills">Skills</a><a class="link-pill" href="#" data-quick="projects">Projects</a><a class="link-pill" href="#" data-quick="contact">Contact</a></div>`);
      document.querySelectorAll('[data-quick]').forEach(a => {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          handleSubmit(PROMPT_LABELS[a.dataset.quick]);
        });
      });
    }, 600);
    return;
  }

  const label = PROMPT_LABELS[key] || trimmed;
  if (answeredPrompts[key]) {
    scrollToExisting(key);
    setActiveHistoryItem(key);
    return;
  }

  const pairId = `qa-${key}-${Date.now()}`;
  addUserMessage(label, pairId);
  showTyping();
  const epoch = chatEpoch;
  const delay = 650 + Math.min(900, (RESPONSES[key] || '').length / 8);
  setTimeout(() => {
    if (epoch !== chatEpoch) return;
    removeTyping();
    const responseId = `answer-${key}-${Date.now()}`;
    addBotMessage(RESPONSES[key] || `<p>I don't have information on that yet. Try one of the prompts below.</p>`, responseId);
    answeredPrompts[key] = responseId;
    markChipVisited(key);
    addHistoryItem(key, label);
    setActiveHistoryItem(key);
  }, delay);
}

function updateSendState() {
  const hasText = promptInput.value.trim().length > 0;
  sendBtn.disabled = !hasText;
}

// The prompt input is readonly — visitors pick from the suggestion
// list instead of typing. "Enter" and "Space" open the list (same as
// a tap), which also gives keyboard users a path.
promptInput.addEventListener('focus', () => showSuggestionPanel(''));
promptInput.addEventListener('click', () => showSuggestionPanel(''));
promptInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    showSuggestionPanel('');
  }
});

sendBtn.addEventListener('click', () => {
  showSuggestionPanel('');
  promptInput.focus();
});

if (attachBtn) {
  attachBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleSocialMenu();
  });
}

document.addEventListener('click', (event) => {
  const target = event.target;
  const inSocial = socialMenu && socialMenu.contains(target);
  const inAttach = attachBtn && attachBtn.contains(target);
  const inPrompt = promptInput && promptInput.contains(target);
  const inSuggestions = suggestionsPanel && suggestionsPanel.contains(target);
  const inComposer = composerInner && composerInner.contains(target);

  if (!inSocial && !inAttach) closeSocialMenu();
  if (!inComposer) {
    closeSuggestionPanel();
  } else if (!inSuggestions && !inPrompt) {
    closeSuggestionPanel();
  }
});

if (suggestionsPanel) {
  showSuggestionPanel('');
  closeSuggestionPanel();
}

if (socialMenu) {
  closeSocialMenu();
}

if (promptInput) {
  promptInput.value = '';
  updateSendState();
}

scrollToEnd();

// ---------- Clear chat ----------
// Resets the conversation in place — messages, history list and "visited"
// prompt state — and returns to the hero screen so every topic can be asked
// again. The visitor's saved name is kept, so the name prompt does not
// reappear.
function clearChat() {
  chatEpoch += 1;
  removeTyping();
  Object.keys(answeredPrompts).forEach((k) => delete answeredPrompts[k]);

  // Messages: wipe them and bring the hero back.
  messagesEl.innerHTML = '';
  if (welcomeEl) {
    welcomeEl.classList.remove('welcome-hide');
    welcomeEl.style.transition = '';
    welcomeEl.style.transform = '';
    messagesEl.appendChild(welcomeEl);
    const heroVideo = welcomeEl.querySelector('video');
    if (heroVideo && heroVideo.play) heroVideo.play().catch(() => {});
  }

  // Composer goes back to its centered "empty state" spot.
  const composerEl = document.querySelector('.composer');
  if (composerEl) {
    composerEl.style.transition = '';
    composerEl.style.transform = '';
  }
  if (chatEl) chatEl.classList.add('is-empty');

  // Sidebar history.
  if (sidebarList) {
    sidebarList.innerHTML = '';
    if (sidebarEmpty) sidebarList.appendChild(sidebarEmpty);
  }

  // Prompt bar, menus, viewer.
  if (suggestionsPanel) {
    suggestionsPanel.querySelectorAll('.visited').forEach((el) => el.classList.remove('visited'));
  }
  if (promptInput) {
    promptInput.value = '';
    updateSendState();
  }
  closeAllMenus();
  if (typeof closeViewer === 'function') closeViewer();
  if (isMobileLayout()) setSidebarCollapsed(true);
  scrollToEnd();
}

const clearChatBtn = document.getElementById('clearChatBtn');
if (clearChatBtn) clearChatBtn.addEventListener('click', clearChat);