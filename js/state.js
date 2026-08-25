/**
 * ProjectMatch AI - Reactive State Manager
 * Persists user actions to LocalStorage
 */

class AppState {
  constructor() {
    this.STORAGE_KEY = 'PROJECT_MATCH_AI_STATE_V1';
    this.listeners = new Map();
    this.loadState();
  }

  getInitialState() {
    return {
      currentView: 'feed',
      isDesktopMode: false,
      projects: JSON.parse(JSON.stringify(DEFAULT_PROJECTS)),
      deckIndex: 0,
      swipedHistory: [],
      connectedProjects: [],
      teams: JSON.parse(JSON.stringify(DEFAULT_TEAMS)),
      chats: JSON.parse(JSON.stringify(DEFAULT_CHATS)),
      activeChatTeamId: 't-cyberx',
      profile: JSON.parse(JSON.stringify(USER_PROFILE)),
      tickerEvents: [...INITIAL_TICKER_EVENTS],
      interview: {
        active: false,
        targetItem: null,
        currentStep: 0,
        selectedAnswers: [],
        baseScore: 88,
        finalScore: 88
      }
    };
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = {
          ...this.getInitialState(),
          ...parsed
        };
      } else {
        this.state = this.getInitialState();
      }
    } catch (e) {
      console.warn('Failed to parse saved state, resetting to initial', e);
      this.state = this.getInitialState();
    }
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        isDesktopMode: this.state.isDesktopMode,
        deckIndex: this.state.deckIndex,
        swipedHistory: this.state.swipedHistory,
        connectedProjects: this.state.connectedProjects,
        teams: this.state.teams,
        chats: this.state.chats,
        activeChatTeamId: this.state.activeChatTeamId,
        profile: this.state.profile,
        tickerEvents: this.state.tickerEvents
      }));
    } catch (e) {
      console.error('Failed to persist state to LocalStorage', e);
    }
  }

  // Event Subscription System
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event).filter(cb => cb !== callback);
    this.listeners.set(event, callbacks);
  }

  emit(event, payload) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`Error in event listener for ${event}:`, err);
        }
      });
    }
  }

  // View Navigation
  setView(viewName) {
    this.state.currentView = viewName;
    this.emit('view:changed', viewName);
  }

  toggleDesktopMode() {
    this.state.isDesktopMode = !this.state.isDesktopMode;
    this.saveState();
    this.emit('mode:changed', this.state.isDesktopMode);
  }

  // Discovery Deck Actions
  getCurrentProject() {
    if (this.state.deckIndex < this.state.projects.length) {
      return this.state.projects[this.state.deckIndex];
    }
    return null;
  }

  swipeCard(direction) {
    const project = this.getCurrentProject();
    if (!project) return;

    this.state.swipedHistory.push({
      projectId: project.id,
      direction: direction,
      timestamp: Date.now()
    });

    if (direction === 'like') {
      if (!this.state.connectedProjects.includes(project.id)) {
        this.state.connectedProjects.push(project.id);
      }
      this.state.profile.myRequests.unshift({
        id: 'req_' + Date.now(),
        target: project.title,
        timeAgo: 'Just now',
        status: 'Pending',
        statusClass: 'status-badge-pending'
      });
      this.addTickerEvent(`You matched with ${project.title} (${project.matchScore}%)`);
    }

    this.state.deckIndex++;
    this.saveState();
    this.emit('deck:swiped', { project, direction, remaining: this.state.projects.length - this.state.deckIndex });
  }

  resetDeck() {
    this.state.deckIndex = 0;
    this.saveState();
    this.emit('deck:reset');
  }

  // Teams & Ideas Actions
  addTeam(newTeamData) {
    const team = {
      id: 't-' + Date.now(),
      name: newTeamData.title,
      description: newTeamData.description,
      matchScore: newTeamData.matchScore || 92,
      hackathon: newTeamData.hackathon || 'Hackathon Alpha',
      slotsTotal: newTeamData.slotsTotal || 5,
      slotsFilled: 1,
      skills: newTeamData.skills || ['React', 'Python'],
      needsRole: newTeamData.needsRole || 'UI/UX Designer',
      conflict: null,
      members: [
        {
          name: this.state.profile.name,
          role: 'Team Lead',
          avatar: this.state.profile.avatar
        }
      ]
    };

    this.state.teams.unshift(team);
    this.addTickerEvent(`New team formed: ${team.name} (${team.hackathon})`);
    this.saveState();
    this.emit('teams:updated', this.state.teams);
    return team;
  }

  joinTeam(teamId) {
    const team = this.state.teams.find(t => t.id === teamId);
    if (!team) return;

    if (team.slotsFilled < team.slotsTotal) {
      team.slotsFilled++;
      team.members.push({
        name: this.state.profile.name,
        role: this.state.profile.title,
        avatar: this.state.profile.avatar
      });

      this.state.profile.myRequests.unshift({
        id: 'req_' + Date.now(),
        target: team.name,
        timeAgo: 'Just now',
        status: 'Accepted',
        statusClass: 'status-badge-accepted'
      });

      this.addTickerEvent(`You joined ${team.name}!`);
      this.saveState();
      this.emit('teams:updated', this.state.teams);
    }
  }

  // Chat Actions
  getChat(teamId) {
    return this.state.chats[teamId] || null;
  }

  sendChatMessage(teamId, text) {
    if (!this.state.chats[teamId]) {
      const team = this.state.teams.find(t => t.id === teamId);
      this.state.chats[teamId] = {
        teamId: teamId,
        teamName: team ? team.name : 'Team Channel',
        teamAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
        memberCount: `${team ? team.slotsFilled : 3}/${team ? team.slotsTotal : 5} Members`,
        messages: []
      };
    }

    const newMsg = {
      id: 'm_' + Date.now(),
      sender: this.state.profile.name + ' (You)',
      role: this.state.profile.title,
      avatar: this.state.profile.avatar,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOutgoing: true,
      text: text
    };

    this.state.chats[teamId].messages.push(newMsg);
    this.saveState();
    this.emit('chat:updated', { teamId, message: newMsg });

    // Simulated Smart Response from AI / Teammates
    this.simulateChatReply(teamId, text);
  }

  simulateChatReply(teamId, userText) {
    setTimeout(() => {
      const chat = this.state.chats[teamId];
      if (!chat) return;

      const lower = userText.toLowerCase();
      let replyText = "Sounds good! I'll update the project board and sync the API schemas.";

      if (lower.includes('schedule') || lower.includes('time') || lower.includes('sync') || lower.includes('meet')) {
        replyText = "2:30 PM PST works perfectly for me. I'll prepare the demo slides!";
      } else if (lower.includes('ui') || lower.includes('design') || lower.includes('figma')) {
        replyText = "Great point. I reviewed the wireframes and our component tokens look solid in Synthetix Pulse dark mode.";
      } else if (lower.includes('backend') || lower.includes('api') || lower.includes('database')) {
        replyText = "The GraphQL endpoints and Redis pub/sub channels are tested and ready for the load test.";
      }

      const botMsg = {
        id: 'm_' + (Date.now() + 1),
        sender: 'Sarah J.',
        role: 'Project Lead',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOutgoing: false,
        text: replyText
      };

      chat.messages.push(botMsg);
      this.saveState();
      this.emit('chat:updated', { teamId, message: botMsg });
    }, 1200);
  }

  // Ticker Activity
  addTickerEvent(text) {
    this.state.tickerEvents.unshift(text);
    if (this.state.tickerEvents.length > 15) {
      this.state.tickerEvents.pop();
    }
    this.emit('ticker:updated', this.state.tickerEvents);
  }

  // AI Fit Interview Machine
  startInterview(targetItem) {
    this.state.interview = {
      active: true,
      targetItem: targetItem || this.getCurrentProject() || this.state.teams[0],
      currentStep: 0,
      selectedAnswers: [],
      baseScore: (targetItem && targetItem.matchScore) ? targetItem.matchScore : 88,
      finalScore: (targetItem && targetItem.matchScore) ? targetItem.matchScore : 88
    };
    this.emit('interview:started', this.state.interview);
  }

  selectInterviewOption(stepIndex, optionIndex) {
    const stepData = AI_INTERVIEW_FLOW[stepIndex];
    if (!stepData) return;

    const opt = stepData.options[optionIndex];
    this.state.interview.selectedAnswers[stepIndex] = opt;
    this.state.interview.finalScore = Math.min(99, this.state.interview.baseScore + (opt.scoreBoost || 4));
    this.emit('interview:stepSelected', { stepIndex, optionIndex, currentScore: this.state.interview.finalScore });
  }

  nextInterviewStep() {
    if (this.state.interview.currentStep < AI_INTERVIEW_FLOW.length - 1) {
      this.state.interview.currentStep++;
      this.emit('interview:stepChanged', this.state.interview.currentStep);
    } else {
      this.completeInterview();
    }
  }

  completeInterview() {
    const target = this.state.interview.targetItem;
    const finalScore = this.state.interview.finalScore;

    if (target) {
      target.matchScore = finalScore;
    }

    this.state.interview.active = false;
    this.saveState();
    this.emit('interview:completed', { target, finalScore });
    this.addTickerEvent(`AI Fit verified: Alex Mercer + ${target ? target.title || target.name : 'Team'} (${finalScore}%)`);
  }

  // Profile Management
  updateProfile(updates) {
    this.state.profile = {
      ...this.state.profile,
      ...updates
    };
    this.saveState();
    this.emit('profile:updated', this.state.profile);
  }
}

// Global App State Instance
window.appState = new AppState();
