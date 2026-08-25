/**
 * ProjectMatch AI - Main Application Controller & UI Logic
 * Interactivity for Discovery Deck, Live Board, AI Interview, Team Chat, Profile, and Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  const state = window.appState;

  // DOM Elements
  const viewportContainer = document.getElementById('viewport-container');
  const modeToggleBtn = document.getElementById('mode-toggle-btn');
  const cardStack = document.getElementById('card-stack');
  const deckEmptyState = document.getElementById('deck-empty-state');
  const resetDeckBtn = document.getElementById('reset-deck-btn');
  const btnPass = document.getElementById('btn-pass');
  const btnLike = document.getElementById('btn-like');
  const btnInterview = document.getElementById('btn-interview');
  const tickerTrack = document.getElementById('ticker-track');
  const countdownHours = document.getElementById('countdown-hours');
  const countdownMinutes = document.getElementById('countdown-minutes');
  const countdownSeconds = document.getElementById('countdown-seconds');
  const teamsGrid = document.getElementById('teams-grid');
  const teamsFilterTabs = document.querySelectorAll('.filter-tab');
  const postIdeaFab = document.getElementById('post-idea-fab');

  // Modals
  const interviewModal = document.getElementById('interview-modal');
  const interviewCloseBtn = document.getElementById('interview-close-btn');
  const interviewNextBtn = document.getElementById('interview-next-btn');
  const interviewContent = document.getElementById('interview-content');
  const interviewStepText = document.getElementById('interview-step-text');
  const interviewStepper = document.getElementById('interview-stepper');

  const pitchModal = document.getElementById('pitch-modal');
  const pitchCloseBtn = document.getElementById('pitch-close-btn');
  const pitchForm = document.getElementById('pitch-form');

  const wizardModal = document.getElementById('wizard-modal');
  const wizardCloseBtn = document.getElementById('wizard-close-btn');
  const wizardForm = document.getElementById('wizard-form');

  const specsModal = document.getElementById('specs-modal');
  const specsCloseBtn = document.getElementById('specs-close-btn');

  // Chat Elements
  const chatMessagesArea = document.getElementById('chat-messages-area');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatTeamTitle = document.getElementById('chat-team-title');
  const chatTeamStatus = document.getElementById('chat-team-status');
  const chatTeamAvatar = document.getElementById('chat-team-avatar');

  // Toast Container
  const toastContainer = document.getElementById('toast-container');

  // Helper: Show Toast Notification
  function showToast(message, icon = 'check_circle', isHighlight = false) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    if (isHighlight) {
      toast.style.borderColor = 'var(--color-secondary-fixed)';
      toast.style.boxShadow = 'var(--glow-secondary)';
    }
    toast.innerHTML = `
      <span class="material-symbols-outlined text-primary-fixed-dim" style="${isHighlight ? 'color: var(--color-secondary-fixed);' : ''}">${icon}</span>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // =========================================================================
  // 1. Device Viewport Mode (Mobile Frame vs Desktop Command Center)
  // =========================================================================
  function updateModeUI(isDesktop) {
    if (isDesktop) {
      viewportContainer.classList.add('desktop-mode');
      modeToggleBtn.innerHTML = `
        <span class="material-symbols-outlined text-[16px]">stay_current_portrait</span>
        <span>Mobile View</span>
      `;
    } else {
      viewportContainer.classList.remove('desktop-mode');
      modeToggleBtn.innerHTML = `
        <span class="material-symbols-outlined text-[16px]">laptop_chromebook</span>
        <span>Desktop View</span>
      `;
    }
  }

  if (modeToggleBtn) {
    modeToggleBtn.addEventListener('click', () => {
      state.toggleDesktopMode();
    });
  }

  state.on('mode:changed', (isDesktop) => {
    updateModeUI(isDesktop);
    showToast(isDesktop ? 'Switched to Desktop View' : 'Switched to Mobile View', 'devices');
  });

  updateModeUI(state.state.isDesktopMode);

  // =========================================================================
  // 2. Tab Navigation
  // =========================================================================
  const navTabs = document.querySelectorAll('[data-view]');
  const viewScreens = document.querySelectorAll('.view-screen');

  function switchView(viewName) {
    viewScreens.forEach(screen => {
      screen.classList.toggle('active', screen.id === `view-${viewName}`);
    });

    navTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.view === viewName);
    });

    state.state.currentView = viewName;

    // View specific triggers
    if (viewName === 'chat') {
      renderChatMessages(state.state.activeChatTeamId);
    } else if (viewName === 'profile') {
      renderProfile();
    } else if (viewName === 'teams') {
      renderTeams();
    }
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = tab.dataset.view;
      switchView(targetView);
    });
  });

  state.on('view:changed', (viewName) => {
    switchView(viewName);
  });

  // Top Nav Brand Click -> Feed
  document.getElementById('brand-btn')?.addEventListener('click', () => switchView('feed'));

  // =========================================================================
  // 3. Discovery Card Deck & Swipe Physics Engine
  // =========================================================================
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let topCardElement = null;

  function renderDeck() {
    if (!cardStack) return;
    cardStack.innerHTML = '';

    const currentProj = state.getCurrentProject();
    if (!currentProj) {
      cardStack.style.display = 'none';
      if (deckEmptyState) deckEmptyState.classList.add('active');
      return;
    }

    cardStack.style.display = 'flex';
    if (deckEmptyState) deckEmptyState.classList.remove('active');

    // Create top card
    const card = document.createElement('div');
    card.className = 'discovery-card';
    card.id = `card-${currentProj.id}`;

    const chipsHtml = currentProj.needs.map(need => {
      let chipClass = 'chip-match';
      if (need.type === 'gap') chipClass = 'chip-gap';
      if (need.type === 'ghost') chipClass = 'chip-ghost';
      return `<span class="chip ${chipClass}">${need.name}</span>`;
    }).join('');

    card.innerHTML = `
      <div class="stamp stamp-like" id="stamp-like">CONNECT</div>
      <div class="stamp stamp-pass" id="stamp-pass">PASS</div>

      <div class="card-header-media" style="background-image: url('${currentProj.image}')">
        <div class="match-score-badge">
          <div class="conic-ring" style="--score: ${currentProj.matchScore}%;">
            <div class="conic-ring-inner">${currentProj.matchScore}%</div>
          </div>
        </div>
      </div>

      <div class="card-body">
        <div class="card-title-group">
          <h2 class="card-title">${currentProj.title}</h2>
          <p class="card-subtitle">
            <span class="material-symbols-outlined text-[16px]">person</span>
            ${currentProj.founder} (${currentProj.founderRole})
          </p>
        </div>

        <div>
          <div class="card-section-label">Needed Skills & Gaps</div>
          <div class="skill-chips-row">
            ${chipsHtml}
          </div>
        </div>

        <div class="ai-insight-box">
          <span class="material-symbols-outlined ai-insight-icon" style="font-variation-settings: 'FILL' 1;">psychology</span>
          <p class="ai-insight-text">${currentProj.aiInsight}</p>
        </div>
      </div>
    `;

    cardStack.appendChild(card);
    topCardElement = card;
    attachSwipeListeners(card);
  }

  function attachSwipeListeners(card) {
    const stampLike = card.querySelector('#stamp-like');
    const stampPass = card.querySelector('#stamp-pass');

    function onPointerDown(e) {
      if (e.target.closest('button')) return;
      isDragging = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX);
      startY = e.clientY || (e.touches && e.touches[0].clientY);
      card.style.transition = 'none';
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      currentX = (e.clientX || (e.touches && e.touches[0].clientX)) - startX;
      currentY = (e.clientY || (e.touches && e.touches[0].clientY)) - startY;

      const rotate = currentX * 0.06;
      card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotate}deg)`;

      // Dynamic Stamp Opacity
      const opacity = Math.min(1, Math.abs(currentX) / 90);
      if (currentX > 0) {
        if (stampLike) stampLike.style.opacity = opacity;
        if (stampPass) stampPass.style.opacity = 0;
      } else {
        if (stampPass) stampPass.style.opacity = opacity;
        if (stampLike) stampLike.style.opacity = 0;
      }
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;

      const threshold = 110;
      if (currentX > threshold) {
        triggerSwipeAnimation('right');
      } else if (currentX < -threshold) {
        triggerSwipeAnimation('left');
      } else {
        // Return to center
        card.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        card.style.transform = 'translate(0, 0) rotate(0deg)';
        if (stampLike) stampLike.style.opacity = 0;
        if (stampPass) stampPass.style.opacity = 0;
      }
    }

    // Touch & Mouse Event Listeners
    card.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    card.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
  }

  function triggerSwipeAnimation(direction) {
    if (!topCardElement) return;
    const card = topCardElement;
    const throwDistance = direction === 'right' ? window.innerWidth + 200 : -(window.innerWidth + 200);

    card.style.transition = 'transform 0.35s ease-out, opacity 0.25s ease-out';
    card.style.transform = `translate(${throwDistance}px, ${currentY || 0}px) rotate(${direction === 'right' ? 30 : -30}deg)`;
    card.style.opacity = '0';

    setTimeout(() => {
      state.swipeCard(direction === 'right' ? 'like' : 'pass');
      currentX = 0;
      currentY = 0;
      renderDeck();
    }, 280);
  }

  // Button triggers for Swipe
  if (btnPass) {
    btnPass.addEventListener('click', () => {
      const stampPass = topCardElement?.querySelector('#stamp-pass');
      if (stampPass) stampPass.style.opacity = 1;
      triggerSwipeAnimation('left');
    });
  }

  if (btnLike) {
    btnLike.addEventListener('click', () => {
      const stampLike = topCardElement?.querySelector('#stamp-like');
      if (stampLike) stampLike.style.opacity = 1;
      triggerSwipeAnimation('right');
      showToast('Connected! Request sent to team founder.', 'favorite', true);
    });
  }

  if (btnInterview) {
    btnInterview.addEventListener('click', () => {
      const proj = state.getCurrentProject();
      if (proj) {
        state.startInterview(proj);
      }
    });
  }

  if (resetDeckBtn) {
    resetDeckBtn.addEventListener('click', () => {
      state.resetDeck();
      renderDeck();
      showToast('Deck reloaded with fresh talent & projects!', 'refresh');
    });
  }

  // Initial Deck Render
  renderDeck();

  // =========================================================================
  // 4. Live Activity Ticker & Countdown Timer
  // =========================================================================
  function renderTicker() {
    if (!tickerTrack) return;
    const events = state.state.tickerEvents;
    tickerTrack.innerHTML = events.map(ev => `<span>${ev}</span>`).join('');
  }

  renderTicker();
  state.on('ticker:updated', renderTicker);

  // Dynamic Ticker Simulation: adds realistic hackathon events
  const SIMULATED_STREAM = [
    'Aria S. posted project: Generative Spatial UI',
    'Team AppX verified 94% match on AI Engineer',
    'Quantum Logistics opened 2 backend slots',
    'New Hackathon Alpha sponsor prize announced ($15k)',
    'Liam P. completed AI Fit Interview with 95% score',
    'Sarah J. scheduled team sync for 2:30 PM PST'
  ];

  let simIndex = 0;
  setInterval(() => {
    state.addTickerEvent(SIMULATED_STREAM[simIndex % SIMULATED_STREAM.length]);
    simIndex++;
  }, 7000);

  // Event Countdown Clock
  let targetTime = Date.now() + (14 * 3600 + 22 * 60 + 45) * 1000;

  function updateCountdown() {
    const diff = Math.max(0, targetTime - Date.now());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (countdownHours) countdownHours.textContent = String(hours).padStart(2, '0');
    if (countdownMinutes) countdownMinutes.textContent = String(mins).padStart(2, '0');
    if (countdownSeconds) countdownSeconds.textContent = String(secs).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // =========================================================================
  // 5. Live Teams Board & Filtering
  // =========================================================================
  let currentTeamFilter = 'all';

  function renderTeams() {
    if (!teamsGrid) return;
    teamsGrid.innerHTML = '';

    let teams = state.state.teams;

    if (currentTeamFilter === 'hackathons') {
      teams = teams.filter(t => t.hackathon === 'Hackathon Alpha');
    } else if (currentTeamFilter === 'high-match') {
      teams = teams.filter(t => t.matchScore >= 90);
    } else if (currentTeamFilter === 'needs-dev') {
      teams = teams.filter(t => t.skills.includes('React') || t.skills.includes('Python') || t.needsRole.includes('Engineer'));
    }

    teams.forEach(team => {
      const card = document.createElement('div');
      card.className = 'team-card';

      const avatarsHtml = team.members.map(m => `
        <div class="avatar-stack-item" style="background-image: url('${m.avatar}')" title="${m.name} (${m.role})"></div>
      `).join('');

      const remainingSlots = team.slotsTotal - team.slotsFilled;
      const extraSlotBadge = remainingSlots > 0 ? `<div class="avatar-stack-item">+${remainingSlots}</div>` : '';

      const conflictHtml = team.conflict ? `
        <div class="badge-conflict" title="${team.conflict.description}">
          <span class="material-symbols-outlined text-[13px]">warning</span>
          <span>${team.conflict.title}</span>
        </div>
      ` : '';

      const skillsHtml = team.skills.map(s => `
        <span class="chip chip-match">${s}</span>
      `).join('') + `
        <span class="chip chip-ghost"><span class="material-symbols-outlined text-[12px]">add</span> Needs ${team.needsRole}</span>
      `;

      card.innerHTML = `
        <div class="team-card-header">
          <div class="team-info">
            <h4>${team.name}</h4>
            <p>${team.description}</p>
          </div>
          <div class="team-badges-col">
            <div class="badge-match">
              <span class="material-symbols-outlined text-[13px]">auto_awesome</span>
              <span>${team.matchScore}% Match</span>
            </div>
            <div class="badge-slots">
              <span class="material-symbols-outlined text-[13px]">group</span>
              <span>${team.slotsFilled}/${team.slotsTotal} slots</span>
            </div>
            ${conflictHtml}
          </div>
        </div>

        <div class="skill-chips-row" style="margin-bottom: 0;">
          ${skillsHtml}
        </div>

        <div class="team-card-footer">
          <div class="avatar-stack">
            ${avatarsHtml}
            ${extraSlotBadge}
          </div>
          <div class="team-cta-btns">
            <button class="btn-outline-sm btn-team-interview" data-team-id="${team.id}">AI Fit Check</button>
            <button class="btn-primary-sm btn-team-join" data-team-id="${team.id}">Join Team</button>
          </div>
        </div>
      `;

      // Connect Button Action
      card.querySelector('.btn-team-join')?.addEventListener('click', () => {
        state.joinTeam(team.id);
        state.state.activeChatTeamId = team.id;
        showToast(`Joined ${team.name}! Opened team chat.`, 'groups', true);
        switchView('chat');
      });

      // AI Fit Check Button
      card.querySelector('.btn-team-interview')?.addEventListener('click', () => {
        state.startInterview(team);
      });

      teamsGrid.appendChild(card);
    });
  }

  teamsFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      teamsFilterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTeamFilter = tab.dataset.filter;
      renderTeams();
    });
  });

  state.on('teams:updated', renderTeams);

  // Floating Action Button -> Post Idea Modal
  if (postIdeaFab) {
    postIdeaFab.addEventListener('click', () => {
      pitchModal.classList.add('active');
    });
  }

  // =========================================================================
  // 6. AI Fit Candidate Interview Machine
  // =========================================================================
  function renderInterviewStep() {
    const interview = state.state.interview;
    if (!interview.active) return;

    const stepData = AI_INTERVIEW_FLOW[interview.currentStep];
    if (!stepData) return;

    if (interviewStepText) {
      interviewStepText.textContent = `Step ${interview.currentStep + 1} of ${AI_INTERVIEW_FLOW.length}`;
    }

    if (interviewStepper) {
      interviewStepper.innerHTML = AI_INTERVIEW_FLOW.map((s, idx) => `
        <div class="step-segment ${idx === interview.currentStep ? 'active' : (idx < interview.currentStep ? 'completed' : '')}"></div>
      `).join('');
    }

    const selectedOption = interview.selectedAnswers[interview.currentStep];

    const optionsHtml = stepData.options.map((opt, idx) => {
      const isSelected = selectedOption && selectedOption.badge === opt.badge;
      return `
        <button class="bento-option-btn ${isSelected ? 'selected' : ''}" data-opt-idx="${idx}">
          <span class="bento-opt-badge">${opt.badge}</span>
          <span class="bento-opt-desc">${opt.desc}</span>
        </button>
      `;
    }).join('');

    interviewContent.innerHTML = `
      <div class="flex gap-md items-start">
        <div class="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center shrink-0 border border-primary-fixed-dim/30 shadow-md">
          <span class="material-symbols-outlined text-primary-fixed-dim text-[20px]" style="font-variation-settings: 'FILL' 1;">smart_toy</span>
        </div>
        <div class="bg-surface-container-low rounded-xl p-md border border-white/10 flex-1 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-1 h-full bg-primary-fixed-dim"></div>
          <p class="font-bold text-on-surface mb-xs leading-snug">${stepData.question}</p>
          <p class="text-xs text-on-surface-variant font-mono">${stepData.subtext}</p>
        </div>
      </div>

      <div class="bento-grid mt-sm">
        ${optionsHtml}
      </div>

      <div class="form-group mt-xs">
        <label class="form-label" for="interview-custom-input">Or detail your customized approach</label>
        <div class="relative flex items-center">
          <textarea id="interview-custom-input" class="form-textarea w-full" rows="2" placeholder="I architected high-throughput pipelines with custom rate limiters..."></textarea>
        </div>
      </div>
    `;

    // Bento Click Handlers
    interviewContent.querySelectorAll('.bento-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const optIdx = parseInt(btn.dataset.optIdx, 10);
        state.selectInterviewOption(interview.currentStep, optIdx);
        renderInterviewStep();
      });
    });

    // Update Next Button Text
    if (interviewNextBtn) {
      const isLast = interview.currentStep === AI_INTERVIEW_FLOW.length - 1;
      interviewNextBtn.innerHTML = `
        <span>${isLast ? 'Complete & Match' : 'Continue'}</span>
        <span class="material-symbols-outlined text-[16px]">${isLast ? 'verified' : 'arrow_forward'}</span>
      `;
    }
  }

  state.on('interview:started', () => {
    interviewModal.classList.add('active');
    renderInterviewStep();
  });

  if (interviewNextBtn) {
    interviewNextBtn.addEventListener('click', () => {
      const interview = state.state.interview;
      // Auto select first option if none selected
      if (!interview.selectedAnswers[interview.currentStep]) {
        state.selectInterviewOption(interview.currentStep, 0);
      }
      state.nextInterviewStep();
      if (interview.active) {
        renderInterviewStep();
      }
    });
  }

  if (interviewCloseBtn) {
    interviewCloseBtn.addEventListener('click', () => {
      interviewModal.classList.remove('active');
      state.state.interview.active = false;
    });
  }

  state.on('interview:completed', ({ target, finalScore }) => {
    interviewModal.classList.remove('active');
    showToast(`AI Interview Verified! Compatibility updated to ${finalScore}%.`, 'verified', true);
    renderDeck();
    renderTeams();
  });

  // =========================================================================
  // 7. Team Chat & Collaboration Hub
  // =========================================================================
  function renderChatMessages(teamId) {
    if (!chatMessagesArea) return;
    const chat = state.getChat(teamId);
    if (!chat) return;

    if (chatTeamTitle) chatTeamTitle.textContent = chat.teamName;
    if (chatTeamStatus) chatTeamStatus.innerHTML = `<span class="status-dot"></span> ${chat.memberCount}`;
    if (chatTeamAvatar) chatTeamAvatar.style.backgroundImage = `url('${chat.teamAvatar}')`;

    chatMessagesArea.innerHTML = `
      <div class="chat-date-separator">
        <span class="chat-date-badge">TODAY</span>
      </div>
    `;

    chat.messages.forEach(msg => {
      if (msg.isAiCard) {
        if (msg.cardType === 'INSIGHT') {
          const cardEl = document.createElement('div');
          cardEl.className = 'ai-chat-card';
          cardEl.innerHTML = `
            <div class="ai-card-header">
              <div class="ai-badge-icon"><span class="material-symbols-outlined text-[16px]">magic_button</span></div>
              <span class="ai-card-title">${msg.title}</span>
            </div>
            <p class="text-xs text-on-surface">${msg.text}</p>
            <div class="ai-sub-card">
              <div class="text-[10px] font-mono font-bold text-on-surface-variant flex items-center gap-1 mb-1">
                <span class="material-symbols-outlined text-[13px] text-primary-fixed-dim">warning</span>
                ${msg.alertTitle}
              </div>
              <p class="text-xs text-on-surface-variant">${msg.alertText}</p>
            </div>
            <div class="ai-card-btns">
              ${msg.actions.map(a => `
                <button class="${a.isPrimary ? 'btn-primary-sm' : 'btn-outline-sm'}" data-chat-action="${a.actionKey}">
                  ${a.label}
                </button>
              `).join('')}
            </div>
          `;
          attachAiCardActions(cardEl);
          chatMessagesArea.appendChild(cardEl);
        } else if (msg.cardType === 'CONFLICT') {
          const cardEl = document.createElement('div');
          cardEl.className = 'ai-chat-card conflict-card';
          const itemsHtml = msg.items.map(it => `
            <div class="ai-sub-card">
              <div class="text-[10px] font-mono font-bold text-on-surface flex items-center gap-1 mb-1">
                <span class="material-symbols-outlined text-[14px] text-error">${it.icon}</span>
                ${it.label}
              </div>
              <p class="text-xs text-on-surface-variant">${it.text}</p>
            </div>
          `).join('');

          cardEl.innerHTML = `
            <div class="ai-card-header">
              <div class="ai-badge-icon"><span class="material-symbols-outlined text-[16px]">warning</span></div>
              <span class="ai-card-title">${msg.title}</span>
            </div>
            <div class="flex flex-col gap-2">
              ${itemsHtml}
            </div>
            <div class="ai-card-btns">
              ${msg.actions.map(a => `
                <button class="${a.isPrimary ? 'btn-primary-sm' : 'btn-outline-sm'}" style="${a.isError ? 'background: rgba(147,0,10,0.4); border-color: var(--color-error); color: var(--color-error);' : ''}" data-chat-action="${a.actionKey}">
                  ${a.label}
                </button>
              `).join('')}
            </div>
          `;
          attachAiCardActions(cardEl);
          chatMessagesArea.appendChild(cardEl);
        }
      } else {
        const msgEl = document.createElement('div');
        msgEl.className = `chat-msg-row ${msg.isOutgoing ? 'outgoing' : ''}`;
        msgEl.innerHTML = `
          <div class="msg-sender-avatar" style="background-image: url('${msg.avatar}')"></div>
          <div class="msg-content-col">
            <div class="msg-header-info">
              <span class="msg-sender-name">${msg.sender}</span>
              <span class="msg-timestamp">${msg.timestamp}</span>
            </div>
            <div class="msg-bubble">${msg.text}</div>
          </div>
        `;
        chatMessagesArea.appendChild(msgEl);
      }
    });

    // Auto scroll to bottom
    chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
  }

  function attachAiCardActions(container) {
    container.querySelectorAll('[data-chat-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.chatAction;
        if (action === 'schedule_meeting') {
          showToast('Sync meeting scheduled for 2:30 PM PST on shared team calendar!', 'calendar_month', true);
          state.sendChatMessage(state.state.activeChatTeamId, "I've added the 2:30 PM PST sync to our calendar!");
        } else if (action === 'find_designer') {
          showToast('AI Matcher dispatched 3 UI Designer invites for Team Cyber-X.', 'person_search', true);
          state.sendChatMessage(state.state.activeChatTeamId, "I requested the AI Matcher to find a UI Designer candidate for us!");
        } else if (action === 'adjust_roles') {
          showToast('Opened Role Rebalancer. Roles reassigned to Lead & API schema owner.', 'tune', true);
        } else if (action === 'find_pm') {
          showToast('Dispatched invite to top-rated PM candidates.', 'campaign', true);
        }
      });
    });
  }

  function handleSendChat() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    state.sendChatMessage(state.state.activeChatTeamId, text);
    chatInput.value = '';
    renderChatMessages(state.state.activeChatTeamId);
  }

  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', handleSendChat);
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendChat();
      }
    });
  }

  state.on('chat:updated', ({ teamId }) => {
    if (state.state.currentView === 'chat' && state.state.activeChatTeamId === teamId) {
      renderChatMessages(teamId);
    }
  });

  // Chat Quick Action Pills
  document.getElementById('action-schedule-sync')?.addEventListener('click', () => {
    state.sendChatMessage(state.state.activeChatTeamId, 'Let us schedule a 45-minute sync for architecture alignment.');
  });

  document.getElementById('action-share-file')?.addEventListener('click', () => {
    showToast('Uploaded: API_Schema_v2.1_Decentralized.json to shared drive.', 'folder_shared', true);
    state.sendChatMessage(state.state.activeChatTeamId, 'Shared API_Schema_v2.1_Decentralized.json with the team.');
  });

  document.getElementById('action-view-tasks')?.addEventListener('click', () => {
    showToast('Sprint Tasks: 4 In Progress | 2 In Review | 1 Blocked (UI Design).', 'task_alt');
  });

  document.getElementById('action-project-specs')?.addEventListener('click', () => {
    if (specsModal) specsModal.classList.add('active');
  });

  if (specsCloseBtn) {
    specsCloseBtn.addEventListener('click', () => specsModal.classList.remove('active'));
  }

  // =========================================================================
  // 8. Profile & AI Matches View
  // =========================================================================
  function renderProfile() {
    const profile = state.state.profile;
    const profileName = document.getElementById('profile-name');
    const profileTitle = document.getElementById('profile-title');
    const profileBio = document.getElementById('profile-bio');
    const profileTags = document.getElementById('profile-tags');
    const matchesList = document.getElementById('matches-list');
    const requestsList = document.getElementById('requests-list');

    if (profileName) profileName.textContent = profile.name;
    if (profileTitle) profileTitle.textContent = profile.title;
    if (profileBio) profileBio.textContent = profile.bio;

    if (profileTags) {
      profileTags.innerHTML = profile.skills.map(s => `
        <span class="chip chip-match">${s}</span>
      `).join('');
    }

    if (matchesList) {
      matchesList.innerHTML = profile.aiMatchSuggestions.map(m => `
        <div class="match-list-item">
          <div class="mini-score-gauge" style="--score: ${m.score}%;">
            <div class="mini-score-inner">${m.score}</div>
          </div>
          <div class="match-item-info">
            <h4>${m.name}</h4>
            <p>Needs: ${m.need}</p>
          </div>
          <button class="btn-primary-sm btn-connect-match" data-target="${m.name}">Connect</button>
        </div>
      `).join('');

      matchesList.querySelectorAll('.btn-connect-match').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.target;
          profile.myRequests.unshift({
            id: 'req_' + Date.now(),
            target: target,
            timeAgo: 'Just now',
            status: 'Pending',
            statusClass: 'status-badge-pending'
          });
          state.saveState();
          showToast(`Connection request sent to ${target}!`, 'send', true);
          renderProfile();
        });
      });
    }

    if (requestsList) {
      requestsList.innerHTML = profile.myRequests.map(r => `
        <div class="request-item">
          <div>
            <h4 class="text-xs font-bold text-on-surface">${r.target}</h4>
            <p class="text-[10px] text-on-surface-variant font-mono">${r.timeAgo}</p>
          </div>
          <span class="${r.statusClass}">${r.status}</span>
        </div>
      `).join('');
    }
  }

  // Quick Setup Wizard Modal Launcher
  document.getElementById('quick-setup-btn')?.addEventListener('click', () => {
    if (wizardModal) wizardModal.classList.add('active');
  });

  if (wizardCloseBtn) {
    wizardCloseBtn.addEventListener('click', () => wizardModal.classList.remove('active'));
  }

  if (wizardForm) {
    wizardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const primarySkill = document.querySelector('input[name="wizard-skill"]:checked')?.value || 'Developer';
      const commitment = document.getElementById('wizard-commitment')?.value || '20';
      const goal = document.querySelector('input[name="wizard-goal"]:checked')?.value || 'join';

      state.updateProfile({
        title: `Senior Full-Stack (${primarySkill})`,
        skills: [...new Set([primarySkill, ...state.state.profile.skills])]
      });

      wizardModal.classList.remove('active');
      showToast(`Profile & preferences configured! Filtering teams for ${primarySkill} (~${commitment} hrs/wk).`, 'check_circle', true);
      switchView('teams');
    });
  }

  // Post Idea Pitch Form
  if (pitchCloseBtn) {
    pitchCloseBtn.addEventListener('click', () => pitchModal.classList.remove('active'));
  }

  if (pitchForm) {
    pitchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('pitch-title')?.value.trim();
      const hackathon = document.getElementById('pitch-hackathon')?.value;
      const desc = document.getElementById('pitch-desc')?.value.trim();
      const needsRole = document.getElementById('pitch-role')?.value.trim() || 'UI/UX Designer';

      if (!title || !desc) {
        showToast('Please provide a project title and summary.', 'warning');
        return;
      }

      state.addTeam({
        title: title,
        description: desc,
        hackathon: hackathon,
        needsRole: needsRole,
        matchScore: 95,
        skills: ['React', 'Python', 'AI Agents']
      });

      pitchForm.reset();
      pitchModal.classList.remove('active');
      showToast(`Project "${title}" published to Live Board! AI Team Matching initiated.`, 'rocket_launch', true);
      switchView('teams');
    });
  }

  // Notifications Button Action
  document.getElementById('notifications-btn')?.addEventListener('click', () => {
    showToast('You have 2 new AI Match suggestions & 1 calendar invite.', 'notifications');
  });

  // Modal Backdrop Click Dismissal
  [interviewModal, pitchModal, wizardModal, specsModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }
  });

  console.log('ProjectMatch AI initialized successfully.');
});
