/* FORGE — Main Application */

const App = {
  currentScreen: 'home',
  activeWorkout: null,
  restInterval: null,
  workoutTimerInterval: null,
  modalCallback: null,

  init() {
    this.applyAccentColor();
    this.ensurePersonalSetup();
    this.bindNav();
    this.checkActiveWorkout();
    this.render();
    this.registerSW();
  },

  /** Personal app: Jack's 5-day dumbbell plan is the default schedule */
  ensurePersonalSetup() {
    try {
      const active = DB.getActiveProgram && DB.getActiveProgram();
      if (!active || !active.programId) {
        // Auto-activate personal program without toast spam
        if (typeof PROGRAMS !== 'undefined' && PROGRAMS.find(p => p.id === 'db-5day-strength')) {
          DB.setActiveProgram('db-5day-strength');
        }
      }
      // Seed My Workouts with plan days if empty or missing plan templates
      const prog = (typeof PROGRAMS !== 'undefined') ? PROGRAMS.find(p => p.id === 'db-5day-strength') : null;
      if (!prog) return;
      let mine = DB.getWorkouts() || [];
      const planIds = Object.values(prog.schedule).filter(Boolean);
      let changed = false;
      planIds.forEach(libId => {
        const lib = WORKOUT_LIBRARY.find(w => w.id === libId);
        if (!lib) return;
        const payload = {
          libraryId: libId,
          name: lib.name,
          personal: true,
          exercises: lib.exercises.map(ex => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            repsMax: ex.repsMax || null,
            rest: ex.rest,
            note: ex.note || ''
          }))
        };
        const idx = mine.findIndex(m => m.libraryId === libId);
        if (idx >= 0) {
          // Keep id; refresh prescription from plan
          mine[idx] = { ...mine[idx], ...payload };
          changed = true;
        } else {
          mine.push({ id: generateId(), ...payload, createdAt: new Date().toISOString() });
          changed = true;
        }
      });
      if (changed) DB.saveWorkouts(mine);
    } catch (e) {
      console.warn('Personal setup', e);
    }
  },


  registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  },

  bindNav() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const screen = btn.dataset.screen;
        this.navigate(screen);
      });
    });
    document.getElementById('logo-btn').addEventListener('click', () => this.navigate('home'));
  },

  navigate(screen) {
    this.currentScreen = screen;
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.screen === screen);
    });
    this.render();
    document.getElementById('main').scrollTop = 0;
  },

  render() {
    const main = document.getElementById('main');
    const map = {
      home: () => this.renderHome(),
      workouts: () => this.renderWorkouts(),
      nutrition: () => this.renderNutrition(),
      progress: () => this.renderProgress(),
      profile: () => this.renderProfile()
    };
    main.innerHTML = (map[this.currentScreen] || map.home)();
    this.bindScreenEvents();
  },

  handleAction(action, data) {
    const actions = {
      'start-workout': () => this.startWorkout(data.id, data.source || 'my'),
      'start-lib-workout': () => this.startWorkout(data.id, 'library'),
      'start-today': () => this.startTodayWorkout(),
      'create-workout': () => this.showCreateWorkout(),
      'edit-workout': () => this.showEditWorkout(data.id),
      'delete-workout': () => this.confirmDeleteWorkout(data.id),
      'view-history': () => this.showHistoryDetail(data.id),
      'open-exercise': () => this.showExerciseDetail(data.id),
      'add-food': () => this.showAddFoodSheet(data.meal || 'breakfast'),
      'edit-food': () => this.showEditFood(data.meal, data.idx),
      'delete-food': () => this.deleteFood(data.meal, data.idx),
      'nutrition-history': () => this.showNutritionHistory(),
      'build-meal': () => this.showBuildMeal(),
      'scan-meal': () => this.showScanMeal(data.meal || 'lunch'),
      'scan-label': () => this.showScanLabel(),
      'scan-barcode': () => this.showScanBarcode(data.meal || 'lunch'),
      'recipes': () => this.showRecipes(),
      'log-recipe': () => this.logRecipe(data.id, data.meal || 'lunch'),
      'quick-add-food': () => this.quickLogRecommendation(data.foodId, data.servings, data.meal || 'snacks'),
      'nutrition-assistant': () => this.showNutritionAssistant(),
      'weekly-checkin': () => this.showWeeklyCheckIn(),
      'log-weight': () => this.showLogWeight(),
      'exercise-library': () => this.showExerciseLibrary(),
      'view-program': () => this.showProgramDetail('db-5day-strength'),
      'activate-program': () => this.activateProgram(data.id || 'db-5day-strength'),
      'deactivate-program': () => this.deactivateProgram(),
      'workout-library': () => this.showWorkoutLibrary(),
      'view-lib-workout': () => this.showLibraryWorkoutDetail(data.id),
      'add-lib-to-my': () => this.addLibraryToMyWorkouts(data.id),
      'customize-lib': () => this.customizeLibraryWorkout(data.id),
      'add-to-workout': () => this.showAddToWorkout(data.id),
      'export-data': () => this.exportData(),
      'reset-data': () => this.confirmReset(),
      'save-settings': () => this.saveSettingsFromForm(),
      'view-prs': () => this.showPRList(),
      'resume-workout': () => this.resumeWorkout()
    };
    if (actions[action]) actions[action]();
  },

  // ========== HOME ==========
  renderHome() {
    const settings = DB.getSettings();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const macros = getTodayCalories();
    const weekCount = getWeekWorkoutCount();
    const history = DB.getHistory();
    const recent = history[0];
    const prs = DB.getPRs();
    const recentPR = this.getMostRecentPR(prs);
    const active = DB.getActiveWorkout();
    const todayWorkout = this.getTodaySuggestedWorkout();

    let html = `
      <div class="screen">
        <p class="greeting">${greeting}.</p>
        <h1 class="brand-title">
          <span class="logo-mark" aria-hidden="true"><svg viewBox="0 0 100 100" width="32" height="32"><path fill="currentColor" d="M22 8 L72 8 L82 22 L40 22 L40 38 L68 38 L76 50 L40 50 L40 82 L22 92 Z"/></svg></span>
          <span class="logo-text">FORGE</span>
        </h1>
    `;

    if (active) {
      html += `
        <div class="card" style="border-color: var(--accent); margin-top: 16px;">
          <div class="card-title">Workout In Progress</div>
          <div style="font-weight:700;font-size:18px;margin-bottom:8px;">${active.workoutName}</div>
          <p class="text-secondary" style="font-size:13px;margin-bottom:12px;">Exercise ${active.currentExerciseIndex + 1} of ${active.exercises.length}</p>
          <button class="btn btn-primary btn-block" data-action="resume-workout">Resume Workout</button>
        </div>
      `;
    }

    const intensity = todayWorkout && todayWorkout.intensity;
    const intensityLabel = intensity === 'heavy' ? 'Heavy' : intensity === 'medium' ? 'Medium' : intensity === 'light' ? 'Light' : intensity === 'recovery' ? 'Optional recovery' : '';
    const intensityColor = intensity === 'heavy' ? 'var(--danger)' : intensity === 'medium' ? 'var(--accent)' : intensity === 'light' ? 'var(--success)' : 'var(--text-muted)';
    const ap = DB.getActiveProgram && DB.getActiveProgram();
    const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const dayName = dayNames[new Date().getDay()];

    html += `
        <div class="card" style="margin-top:16px;">
          <div class="card-title">Today · ${dayName}</div>
          ${todayWorkout ? `
            <div style="font-weight:700;font-size:18px;margin-bottom:4px;">${todayWorkout.name}</div>
            ${intensityLabel ? `<span class="tag" style="margin-bottom:8px;border-color:${intensityColor};color:${intensityColor}">${intensityLabel}</span>` : ''}
            <p class="text-secondary" style="font-size:13px;margin-bottom:12px;">
              ${todayWorkout.exercises.length} exercises · ${todayWorkout.exercises.reduce((s,e) => s + e.sets, 0)} sets
              ${todayWorkout.optional ? ' · Optional — skip if you need full rest' : ''}
            </p>
            <button class="btn btn-primary btn-block" data-action="start-workout" data-id="${todayWorkout.id}" data-source="library">Start Workout</button>
          ` : ap ? `
            <p class="text-secondary" style="margin-bottom:8px;">Rest day on your 5-Day plan. Recover well.</p>
            <p class="text-muted" style="font-size:12px;margin-bottom:12px;">Saturday/Sunday optional cardio is available from the program calendar if you want light movement.</p>
            <button class="btn btn-secondary btn-block" data-action="view-program">View week plan</button>
          ` : `
            <p class="text-secondary" style="margin-bottom:12px;">No workout scheduled. Activate a plan or pick one below.</p>
            <button class="btn btn-primary btn-block" data-action="view-program">5-Day Dumbbell Plan</button>
            <button class="btn btn-secondary btn-block mt-8" data-action="start-today">Choose Workout</button>
          `}
        </div>

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-value">${macros.calories}</div>
            <div class="stat-label">Calories</div>
            <div class="stat-sub">/ ${settings.calorieGoal}</div>
            <div class="progress-bar"><div class="progress-fill" style="width:${Math.min(100, (macros.calories/settings.calorieGoal)*100)}%"></div></div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${macros.protein}g</div>
            <div class="stat-label">Protein</div>
            <div class="stat-sub">/ ${settings.proteinGoal}g</div>
            <div class="progress-bar"><div class="progress-fill green" style="width:${Math.min(100, (macros.protein/settings.proteinGoal)*100)}%"></div></div>
          </div>
        </div>

        <div class="card" style="margin-bottom:12px;">
          <div class="text-secondary" style="font-size:13px;">${getNutritionInsight()}</div>
          <button class="btn btn-sm btn-secondary mt-8" data-action="add-food" data-meal="lunch" style="width:auto;">Log Food</button>
        </div>

        <div class="stat-card" style="margin-bottom:16px;">
          <div class="stat-value">${weekCount}</div>
          <div class="stat-label">Workouts This Week</div>
        </div>

        <div class="card-title">Quick Actions</div>
        <div class="quick-actions">
          <button class="quick-action" data-action="start-today">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Start Workout
          </button>
          <button class="quick-action" data-action="add-food" data-meal="breakfast">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            Log Food
          </button>
          <button class="quick-action" data-action="workout-library">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
            Workout Library
          </button>
          <button class="quick-action" data-action="exercise-library">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            Exercise Library
          </button>
        </div>

        <div class="card-title">Recent Activity</div>
    `;

    if (recent) {
      const volume = recent.totalVolume || 0;
      html += `
        <div class="list-item" data-action="view-history" data-id="${recent.id}">
          <div class="list-item-content">
            <div class="list-item-title">${recent.workoutName}</div>
            <div class="list-item-sub">${formatDate(recent.date)} · ${formatDuration(recent.duration)} · ${recent.totalSets || 0} sets</div>
          </div>
          <div class="list-item-meta">${volume.toLocaleString()} ${settings.units}</div>
        </div>
      `;
    } else {
      html += `
        <div class="empty-state" style="padding:24px;">
          <p>No workouts yet. Complete your first workout to start tracking.</p>
        </div>
      `;
    }

    if (recentPR) {
      const ex = getExerciseById(recentPR.exerciseId);
      html += `
        <div class="card" style="margin-top:12px;">
          <div class="card-title">Recent PR</div>
          <div class="pr-badge">🏆 ${ex ? ex.name : recentPR.exerciseId}</div>
          <p style="margin-top:8px;font-size:14px;">${recentPR.weight} ${settings.units} × ${recentPR.reps}</p>
        </div>
      `;
    }

    html += `</div>`;
    return html;
  },


  showProgramDetail(programId) {
    const prog = (typeof PROGRAMS !== 'undefined' ? PROGRAMS : []).find(p => p.id === programId);
    if (!prog) { this.toast('Program not found'); return; }
    const active = DB.getActiveProgram();
    const isActive = active && active.programId === prog.id;
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const days = [1,2,3,4,5,6,0];

    let scheduleHtml = '';
    days.forEach(d => {
      const libId = prog.schedule[d];
      const label = (prog.dayLabels && prog.dayLabels[d]) || dayNames[d];
      const w = libId ? WORKOUT_LIBRARY.find(x => x.id === libId) : null;
      const intens = w && w.intensity;
      const tag = intens === 'heavy' ? 'Heavy' : intens === 'medium' ? 'Medium' : intens === 'light' ? 'Light' : intens === 'recovery' ? 'Optional' : (libId ? '' : 'Rest');
      scheduleHtml += `
        <div class="list-item" ${libId ? 'data-view-lib="' + libId + '" style="cursor:pointer;"' : 'style="cursor:default;opacity:0.75;"'}>
          <div class="list-item-content">
            <div class="list-item-title">${dayNames[d]} · ${label}</div>
            <div class="list-item-sub">${w ? (w.exercises.length + ' exercises · ~' + w.duration + ' min') : 'Full rest recommended'}</div>
          </div>
          ${tag ? '<span class="tag">' + tag + '</span>' : ''}
        </div>
      `;
    });

    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">${prog.name}</div>
        <button class="modal-close" id="modal-close">×</button>
      </div>
      <p class="text-secondary" style="font-size:13px;margin-bottom:12px;">${prog.description}</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">
        <span class="tag tag-accent">${prog.goal}</span>
        <span class="tag">${prog.daysPerWeek} days/week</span>
        <span class="tag">${prog.sessionLength}</span>
        <span class="tag">${(prog.equipment||[]).join(', ')}</span>
      </div>
      <p class="text-muted" style="font-size:12px;margin-bottom:12px;">Use controlled technique. Avoid failed reps and unsupervised max attempts. Dumbbell loads are not barbell competition equivalents.</p>
      <h3 style="margin-bottom:8px;">Weekly schedule</h3>
      ${scheduleHtml}
      ${isActive
        ? '<button class="btn btn-secondary btn-block mt-16" id="prog-off">Deactivate plan</button>'
        : '<button class="btn btn-primary btn-block mt-16" id="prog-on">Activate plan</button>'}
      <p class="text-muted" style="font-size:11px;margin-top:10px;">Activating sets this as your Home schedule. Sat/Sun cardio is optional — skip anytime for full rest.</p>
    `, () => {
      document.getElementById('modal-close').onclick = () => this.hideModal();
      const on = document.getElementById('prog-on');
      const off = document.getElementById('prog-off');
      if (on) on.onclick = () => { this.activateProgram(prog.id); this.hideModal(); };
      if (off) off.onclick = () => { this.deactivateProgram(); this.hideModal(); };
      document.querySelectorAll('[data-view-lib]').forEach(el => {
        el.onclick = () => {
          this.hideModal();
          this.showLibraryWorkoutDetail(el.dataset.viewLib);
        };
      });
    });
  },

  activateProgram(programId) {
    const prog = (typeof PROGRAMS !== 'undefined' ? PROGRAMS : []).find(p => p.id === programId);
    if (!prog) { this.toast('Program not found'); return; }
    DB.setActiveProgram(programId);
    const mine = DB.getWorkouts();
    Object.values(prog.schedule).forEach(libId => {
      if (!libId) return;
      const lib = WORKOUT_LIBRARY.find(w => w.id === libId);
      if (!lib) return;
      if (mine.some(m => m.libraryId === libId || m.name === lib.name)) return;
      mine.push({
        id: generateId(),
        libraryId: libId,
        name: lib.name,
        exercises: lib.exercises.map(ex => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets,
          reps: ex.reps,
          repsMax: ex.repsMax || null,
          rest: ex.rest,
          note: ex.note || ''
        })),
        createdAt: new Date().toISOString()
      });
    });
    DB.saveWorkouts(mine);
    this.toast('5-Day plan activated');
    this.render();
  },

  deactivateProgram() {
    DB.clearActiveProgram();
    this.toast('Plan deactivated');
    this.render();
  },

  getTodaySuggestedWorkout() {
    // Active program schedule takes priority
    const active = DB.getActiveProgram && DB.getActiveProgram();
    if (active && active.programId && typeof PROGRAMS !== 'undefined') {
      const prog = PROGRAMS.find(p => p.id === active.programId);
      if (prog && prog.schedule) {
        const day = new Date().getDay();
        const libId = prog.schedule[day];
        if (libId) {
          const lib = WORKOUT_LIBRARY.find(w => w.id === libId);
          if (lib) return { ...lib, source: 'library', isProgramDay: true, optional: !!lib.optional };
        }
        // Rest day with no optional session
        return null;
      }
    }
    const workouts = DB.getWorkouts();
    if (workouts.length === 0) return null;
    const day = new Date().getDay();
    return workouts[day % workouts.length];
  },


  getMostRecentPR(prs) {
    let latest = null;
    let latestDate = '';
    for (const [exId, data] of Object.entries(prs)) {
      if (data.heaviest && data.heaviest.date > latestDate) {
        latestDate = data.heaviest.date;
        latest = { exerciseId: exId, ...data.heaviest };
      }
    }
    return latest;
  },

  startTodayWorkout() {
    this.navigate('workouts');
  },

  // ========== WORKOUTS ==========
  renderWorkouts() {
    const workouts = DB.getWorkouts();
    const history = DB.getHistory();
    const settings = DB.getSettings();
    const todayWorkout = this.getTodaySuggestedWorkout();

    let html = `
      <div class="screen">
        <div class="section-header">
          <h2>Workouts</h2>
          <button class="btn btn-primary btn-sm" data-action="create-workout">+ Create</button>
        </div>
    `;

    // Today's Workout
    if (todayWorkout) {
      const totalSets = todayWorkout.exercises.reduce((s, e) => s + e.sets, 0);
      html += `
        <div class="card" style="border-color: var(--accent);">
          <div class="card-title">Today's Workout</div>
          <div style="font-weight:700;font-size:18px;margin-bottom:4px;">${todayWorkout.name}</div>
          <p class="text-secondary" style="font-size:13px;margin-bottom:12px;">
            ${todayWorkout.exercises.length} exercises · ${totalSets} sets
          </p>
          <button class="btn btn-primary btn-block" data-action="start-workout" data-id="${todayWorkout.id}" data-source="my">Start Workout</button>
        </div>
      `;
    }

    // My Workouts
    html += `<div class="section-header mt-16"><h3>My Workouts</h3></div>`;
    if (workouts.length === 0) {
      html += `
        <div class="empty-state" style="padding:20px;">
          <p>No saved workouts yet. Browse the Workout Library or create your own.</p>
        </div>
      `;
    } else {
      workouts.forEach(w => {
        const totalSets = w.exercises.reduce((s, e) => s + e.sets, 0);
        html += `
          <div class="list-item">
            <div class="list-item-content" data-action="start-workout" data-id="${w.id}" data-source="my" style="cursor:pointer;">
              <div class="list-item-title">${w.name}</div>
              <div class="list-item-sub">${w.exercises.length} exercises · ${totalSets} sets</div>
            </div>
            <button class="btn btn-sm btn-secondary" data-action="edit-workout" data-id="${w.id}">Edit</button>
          </div>
        `;
      });
    }

    // Library shortcuts
    html += `
      <div class="section-header mt-16"><h3>Discover</h3></div>
      <div class="list-item" data-action="view-program">
        <div class="list-item-content">
          <div class="list-item-title">My Plan · 5-Day Dumbbell</div>
          <div class="list-item-sub">Your schedule · Mon–Fri · Sat/Sun optional</div>
        </div>
        <span class="text-muted">→</span>
      </div>
      <div class="list-item" data-action="workout-library">
        <div class="list-item-content">
          <div class="list-item-title">Workout Library</div>
          <div class="list-item-sub">${WORKOUT_LIBRARY.length} ready-to-use workouts</div>
        </div>
        <span class="text-muted">→</span>
      </div>
      <div class="list-item" data-action="exercise-library">
        <div class="list-item-content">
          <div class="list-item-title">Exercise Library</div>
          <div class="list-item-sub">${EXERCISE_LIBRARY.length} exercises with guides</div>
        </div>
        <span class="text-muted">→</span>
      </div>
    `;

    // History
    html += `<div class="section-header mt-16"><h3>History</h3></div>`;
    if (history.length === 0) {
      html += `
        <div class="empty-state" style="padding:20px;">
          <p>No workout history yet. Complete a workout to see it here.</p>
        </div>
      `;
    } else {
      history.slice(0, 15).forEach(h => {
        const prCount = (h.newPRs && h.newPRs.length) || 0;
        html += `
          <div class="list-item" data-action="view-history" data-id="${h.id}">
            <div class="list-item-content">
              <div class="list-item-title">${h.workoutName}</div>
              <div class="list-item-sub">${formatDate(h.date)} · ${formatDuration(h.duration)} · ${h.totalSets || 0} sets${prCount ? ' · PR' : ''}</div>
            </div>
            <div class="list-item-meta">${(h.totalVolume || 0).toLocaleString()} ${settings.units}</div>
          </div>
        `;
      });
    }

    html += `</div>`;
    return html;
  },



  // Large set of main+accent pairs that read well
  getThemePresets() {
    return [
      { id: 'forge-orange', name: 'Forge Orange', main: '#0a0a0b', accent: '#f97316' },
      { id: 'ember', name: 'Ember', main: '#0c0a09', accent: '#ea580c' },
      { id: 'crimson', name: 'Crimson', main: '#0a0a0b', accent: '#ef4444' },
      { id: 'rose', name: 'Rose', main: '#0c0a0b', accent: '#f43f5e' },
      { id: 'pink', name: 'Pink', main: '#0b0a0c', accent: '#ec4899' },
      { id: 'fuchsia', name: 'Fuchsia', main: '#0b0a0c', accent: '#d946ef' },
      { id: 'purple', name: 'Purple', main: '#0a0a0c', accent: '#a855f7' },
      { id: 'violet', name: 'Violet', main: '#0a0a0c', accent: '#8b5cf6' },
      { id: 'indigo', name: 'Indigo', main: '#09090b', accent: '#6366f1' },
      { id: 'blue', name: 'Blue', main: '#09090b', accent: '#3b82f6' },
      { id: 'sky', name: 'Sky', main: '#0a0b0c', accent: '#0ea5e9' },
      { id: 'cyan', name: 'Cyan', main: '#0a0c0c', accent: '#06b6d4' },
      { id: 'teal', name: 'Teal', main: '#0a0c0c', accent: '#14b8a6' },
      { id: 'emerald', name: 'Emerald', main: '#0a0c0b', accent: '#10b981' },
      { id: 'green', name: 'Green', main: '#0a0c0a', accent: '#22c55e' },
      { id: 'lime', name: 'Lime', main: '#0a0c09', accent: '#84cc16' },
      { id: 'yellow', name: 'Yellow', main: '#0c0c0a', accent: '#eab308' },
      { id: 'amber', name: 'Amber', main: '#0c0b0a', accent: '#f59e0b' },
      { id: 'gold', name: 'Gold', main: '#0c0b09', accent: '#d4a017' },
      { id: 'copper', name: 'Copper', main: '#0c0a09', accent: '#c2410c' },
      { id: 'slate', name: 'Slate', main: '#0f172a', accent: '#38bdf8' },
      { id: 'zinc', name: 'Zinc', main: '#09090b', accent: '#a1a1aa' },
      { id: 'stone', name: 'Stone', main: '#0c0a09', accent: '#a8a29e' },
      { id: 'ocean', name: 'Ocean', main: '#0c1929', accent: '#38bdf8' },
      { id: 'midnight', name: 'Midnight', main: '#020617', accent: '#818cf8' },
      { id: 'forest', name: 'Forest', main: '#052e16', accent: '#4ade80' },
      { id: 'wine', name: 'Wine', main: '#1a0a0e', accent: '#fb7185' },
      { id: 'navy', name: 'Navy', main: '#0a1628', accent: '#60a5fa' },
      { id: 'charcoal', name: 'Charcoal', main: '#141414', accent: '#f97316' },
      { id: 'graphite', name: 'Graphite', main: '#1c1917', accent: '#fb923c' },
      { id: 'obsidian', name: 'Obsidian', main: '#000000', accent: '#f43f5e' },
      { id: 'deep-teal', name: 'Deep Teal', main: '#042f2e', accent: '#2dd4bf' },
      { id: 'plum', name: 'Plum', main: '#1e1033', accent: '#c084fc' },
      { id: 'berry', name: 'Berry', main: '#1a0a14', accent: '#e879f9' },
      { id: 'arctic', name: 'Arctic', main: '#0f172a', accent: '#e2e8f0' },
      { id: 'mint', name: 'Mint', main: '#0a1f1a', accent: '#6ee7b7' },
      { id: 'sunset', name: 'Sunset', main: '#1c0f0a', accent: '#fb7185' },
      { id: 'lava', name: 'Lava', main: '#1a0505', accent: '#ff4d4d' },
      { id: 'neon-green', name: 'Neon Green', main: '#0a0a0b', accent: '#39ff14' },
      { id: 'neon-pink', name: 'Neon Pink', main: '#0a0a0b', accent: '#ff2bd6' },
      { id: 'neon-cyan', name: 'Neon Cyan', main: '#0a0a0b', accent: '#00f0ff' },
      { id: 'soft-coral', name: 'Soft Coral', main: '#12101a', accent: '#ff7f6a' },
      { id: 'steel', name: 'Steel', main: '#111827', accent: '#9ca3af' },
      { id: 'royal', name: 'Royal', main: '#0b1026', accent: '#7c3aed' },
      { id: 'mocha', name: 'Mocha', main: '#1a1410', accent: '#c4a484' },
      { id: 'olive', name: 'Olive', main: '#12140e', accent: '#a3b18a' },
      { id: 'sand', name: 'Sand', main: '#1a1814', accent: '#e7d5b5' },
      { id: 'ice', name: 'Ice', main: '#0b1220', accent: '#93c5fd' },
      { id: 'magma', name: 'Magma', main: '#140a08', accent: '#ff6b35' },
      { id: 'toxic', name: 'Toxic', main: '#0a0f0a', accent: '#b8ff3c' },
      { id: 'plasma', name: 'Plasma', main: '#0d0a1a', accent: '#a78bfa' },
      { id: 'blood-orange', name: 'Blood Orange', main: '#120a08', accent: '#ff5a1f' },
      { id: 'aqua', name: 'Aqua', main: '#061820', accent: '#22d3ee' },
      { id: 'hot-pink', name: 'Hot Pink', main: '#120812', accent: '#ff3d9a' },
      { id: 'lemon', name: 'Lemon', main: '#121208', accent: '#fde047' },
      { id: 'seafoam', name: 'Seafoam', main: '#0a1614', accent: '#5eead4' },
      { id: 'cobalt', name: 'Cobalt', main: '#0a1228', accent: '#2563eb' },
      { id: 'maroon', name: 'Maroon', main: '#1a080c', accent: '#be123c' },
      { id: 'bronze', name: 'Bronze', main: '#14100c', accent: '#cd7f32' },
      { id: 'silver', name: 'Silver', main: '#121214', accent: '#d4d4d8' },
      { id: 'white-hot', name: 'White Hot', main: '#0a0a0b', accent: '#ffffff' },
      { id: 'peach', name: 'Peach', main: '#140f0c', accent: '#fdba74' },
      { id: 'lavender', name: 'Lavender', main: '#120f18', accent: '#c4b5fd' },
      { id: 'matcha', name: 'Matcha', main: '#0e140c', accent: '#86efac' },
      { id: 'electric', name: 'Electric', main: '#080812', accent: '#4f46e5' },
      { id: 'rust', name: 'Rust', main: '#140c0a', accent: '#b45309' },
      { id: 'denim', name: 'Denim', main: '#0c1220', accent: '#3b82f6' },
      { id: 'cherry', name: 'Cherry', main: '#14080a', accent: '#dc2626' },
      { id: 'jade', name: 'Jade', main: '#0a1412', accent: '#059669' },
      { id: 'ultraviolet', name: 'Ultraviolet', main: '#0c0a16', accent: '#7c3aed' },
      { id: 'tangerine', name: 'Tangerine', main: '#120c08', accent: '#ff8c42' },
      { id: 'glacier', name: 'Glacier', main: '#0a1218', accent: '#67e8f9' },
      { id: 'noir-red', name: 'Noir Red', main: '#000000', accent: '#ff0033' },
      { id: 'noir-blue', name: 'Noir Blue', main: '#000000', accent: '#00a2ff' },
      { id: 'noir-green', name: 'Noir Green', main: '#000000', accent: '#00ff88' },
      { id: 'warm-gray', name: 'Warm Gray', main: '#1c1917', accent: '#fafaf9' },
      { id: 'cool-gray', name: 'Cool Gray', main: '#18181b', accent: '#f4f4f5' },
      { id: 'aurora', name: 'Aurora', main: '#0a1020', accent: '#34d399' },
      { id: 'nebula', name: 'Nebula', main: '#0f0a1a', accent: '#e879f9' },
      { id: 'citrus', name: 'Citrus', main: '#101208', accent: '#a3e635' },
      { id: 'flamingo', name: 'Flamingo', main: '#140c10', accent: '#fb7185' },
      { id: 'sapphire', name: 'Sapphire', main: '#0a1024', accent: '#1d4ed8' },
      { id: 'onyx-gold', name: 'Onyx Gold', main: '#0a0a0a', accent: '#fbbf24' },
      { id: 'ink', name: 'Ink', main: '#020617', accent: '#38bdf8' },
      { id: 'dusk', name: 'Dusk', main: '#1e1b4b', accent: '#f472b6' },
      { id: 'pine', name: 'Pine', main: '#022c22', accent: '#34d399' },
      { id: 'brick', name: 'Brick', main: '#1c0a0a', accent: '#f87171' },
      { id: 'fog', name: 'Fog', main: '#1f2937', accent: '#e5e7eb' },
      { id: 'volt', name: 'Volt', main: '#0a0a0b', accent: '#ccff00' },
      { id: 'orchid', name: 'Orchid', main: '#140a18', accent: '#e879f9' },
      { id: 'storm', name: 'Storm', main: '#0f172a', accent: '#64748b' },
      { id: 'honey', name: 'Honey', main: '#1a1408', accent: '#fbbf24' },
      { id: 'pacific', name: 'Pacific', main: '#082f49', accent: '#38bdf8' },
      { id: 'ember-dark', name: 'Ember Dark', main: '#1c0a00', accent: '#ff6b00' },
      { id: 'mint-chip', name: 'Mint Chip', main: '#022c22', accent: '#99f6e4' },
      { id: 'grape', name: 'Grape', main: '#1e0a2e', accent: '#c026d3' },
      { id: 'slate-orange', name: 'Slate Orange', main: '#1e293b', accent: '#fb923c' },
      { id: 'black-lime', name: 'Black Lime', main: '#000000', accent: '#d9f99d' },
      { id: 'twilight', name: 'Twilight', main: '#1e1b4b', accent: '#a5b4fc' },
      { id: 'canyon', name: 'Canyon', main: '#1c1008', accent: '#ea580c' },
      { id: 'kelp', name: 'Kelp', main: '#022c22', accent: '#84cc16' },
      { id: 'orchid-night', name: 'Orchid Night', main: '#0f0a14', accent: '#f0abfc' },
      { id: 'signal', name: 'Signal', main: '#0a0a0b', accent: '#ff003c' },
      { id: 'iceberg', name: 'Iceberg', main: '#0c1524', accent: '#bae6fd' },
      { id: 'forge-classic', name: 'Forge Classic', main: '#0a0a0b', accent: '#ff6b00' }
    ];
  },

  applyAccentColor() {
    this.applyTheme();
  },

  applyTheme(previewMain, previewAccent) {
    const s = DB.getSettings();
    const main = previewMain || s.mainColor || '#0a0a0b';
    const accent = previewAccent || s.accentColor || '#f97316';
    const root = document.documentElement;

    // Derive surface colors from main
    const elev = this.mixHex(main, '#ffffff', 0.05);
    const card = this.mixHex(main, '#ffffff', 0.08);
    const cardHover = this.mixHex(main, '#ffffff', 0.11);
    const input = this.mixHex(main, '#ffffff', 0.14);
    const border = this.mixHex(main, '#ffffff', 0.12);
    // Text: light on dark mains
    const lum = this.hexLuminance(main);
    const text = lum < 0.45 ? '#fafafa' : '#0a0a0b';
    const textSec = lum < 0.45 ? '#a1a1aa' : '#52525b';
    const textMuted = lum < 0.45 ? '#71717a' : '#71717a';

    root.style.setProperty('--bg', main);
    root.style.setProperty('--bg-elevated', elev);
    root.style.setProperty('--bg-card', card);
    root.style.setProperty('--bg-card-hover', cardHover);
    root.style.setProperty('--bg-input', input);
    root.style.setProperty('--border', border);
    root.style.setProperty('--text', text);
    root.style.setProperty('--text-secondary', textSec);
    root.style.setProperty('--text-muted', textMuted);
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--logo', accent);
    root.style.setProperty('--accent-hover', this.mixHex(accent, '#ffffff', 0.15));
    root.style.setProperty('--accent-dim', this.hexToRgba(accent, 0.15));

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', main);
    if (document.body) document.body.style.background = main;
  },

  hexLuminance(hex) {
    const h = (hex || '#000').replace('#','');
    const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const r = parseInt(n.slice(0,2), 16) / 255;
    const g = parseInt(n.slice(2,4), 16) / 255;
    const b = parseInt(n.slice(4,6), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },

  mixHex(a, b, t) {
    const parse = (hex) => {
      const h = (hex || '#000000').replace('#','');
      const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h.padEnd(6, '0').slice(0, 6);
      return [parseInt(n.slice(0,2), 16), parseInt(n.slice(2,4), 16), parseInt(n.slice(4,6), 16)];
    };
    const [r1,g1,b1] = parse(a);
    const [r2,g2,b2] = parse(b);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const bl = Math.round(b1 + (b2 - b1) * t);
    return '#' + [r,g,bl].map(x => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0')).join('');
  },

  hexToRgba(hex, a) {
    const h = (hex || '#f97316').replace('#','');
    const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const r = parseInt(n.slice(0,2), 16) || 249;
    const g = parseInt(n.slice(2,4), 16) || 115;
    const b = parseInt(n.slice(4,6), 16) || 22;
    return `rgba(${r},${g},${b},${a})`;
  },

  setAccentColor(color) {
    const s = DB.getSettings();
    s.accentColor = color;
    DB.saveSettings(s);
    this.applyTheme();
    this.toast('Accent updated');
    this.render();
  },

  setMainColor(color) {
    const s = DB.getSettings();
    s.mainColor = color;
    DB.saveSettings(s);
    this.applyTheme();
    this.toast('Main color updated');
    this.render();
  },

  applyThemePreset(presetId) {
    const p = this.getThemePresets().find(x => x.id === presetId);
    if (!p) return;
    const s = DB.getSettings();
    s.mainColor = p.main;
    s.accentColor = p.accent;
    DB.saveSettings(s);
    this.applyTheme();
    this.toast(p.name + ' applied');
    this.render();
  },

  previewTheme(main, accent) {
    this.applyTheme(main, accent);
    this.updateThemePreview(main, accent);
  },

  updateThemePreview(main, accent) {
    const box = document.getElementById('theme-preview');
    if (!box) return;
    const elev = this.mixHex(main, '#ffffff', 0.06);
    const card = this.mixHex(main, '#ffffff', 0.1);
    const lum = this.hexLuminance(main);
    const text = lum < 0.45 ? '#fafafa' : '#0a0a0b';
    const muted = lum < 0.45 ? '#a1a1aa' : '#52525b';
    box.style.background = main;
    box.style.color = text;
    const bar = box.querySelector('.theme-preview-bar');
    const body = box.querySelector('.theme-preview-body');
    const cardEl = box.querySelector('.theme-preview-card');
    const btn = box.querySelector('.theme-preview-btn');
    if (bar) { bar.style.background = elev; bar.style.color = text; }
    if (body) body.style.background = main;
    if (cardEl) { cardEl.style.background = card; cardEl.style.color = text; }
    if (btn) { btn.style.background = accent; btn.style.color = this.hexLuminance(accent) < 0.55 ? '#fff' : '#0a0a0b'; }
    const mark = box.querySelector('.theme-preview-mark');
    if (mark) mark.style.color = accent;
    const sub = box.querySelector('.theme-preview-sub');
    if (sub) sub.style.color = muted;
  },

  bindScreenEvents() {
    const main = document.getElementById('main');
    main.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleAction(el.dataset.action, el.dataset);
      });
    });
    // Theme studio
    const mainPicker = document.getElementById('theme-main');
    const accentPicker = document.getElementById('theme-accent');
    const mainHex = document.getElementById('theme-main-hex');
    const accentHex = document.getElementById('theme-accent-hex');
    const themeSave = document.getElementById('theme-save');
    const norm = (v) => {
      let x = (v || '').trim();
      if (!x.startsWith('#')) x = '#' + x;
      if (/^#[0-9a-fA-F]{3}$/.test(x) || /^#[0-9a-fA-F]{6}$/.test(x)) return x.toLowerCase();
      return null;
    };
    const live = () => {
      const m = norm(mainHex && mainHex.value) || (mainPicker && mainPicker.value) || '#0a0a0b';
      const a = norm(accentHex && accentHex.value) || (accentPicker && accentPicker.value) || '#f97316';
      if (mainPicker) mainPicker.value = m.length === 7 ? m : mainPicker.value;
      if (accentPicker) accentPicker.value = a.length === 7 ? a : accentPicker.value;
      this.previewTheme(m, a);
    };
    if (mainPicker) mainPicker.addEventListener('input', () => {
      if (mainHex) mainHex.value = mainPicker.value;
      live();
    });
    if (accentPicker) accentPicker.addEventListener('input', () => {
      if (accentHex) accentHex.value = accentPicker.value;
      live();
    });
    if (mainHex) mainHex.addEventListener('input', live);
    if (accentHex) accentHex.addEventListener('input', live);
    if (themeSave) themeSave.onclick = () => {
      const m = norm(mainHex.value) || mainPicker.value;
      const a = norm(accentHex.value) || accentPicker.value;
      const s = DB.getSettings();
      s.mainColor = m;
      s.accentColor = a;
      DB.saveSettings(s);
      this.applyTheme();
      this.toast('Theme saved');
      this.render();
    };
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const p = this.getThemePresets().find(x => x.id === btn.dataset.preset);
        if (!p) return;
        if (mainPicker) mainPicker.value = p.main;
        if (accentPicker) accentPicker.value = p.accent;
        if (mainHex) mainHex.value = p.main;
        if (accentHex) accentHex.value = p.accent;
        document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        this.previewTheme(p.main, p.accent);
      });
    });
    // init preview from current settings
    if (document.getElementById('theme-preview')) {
      const s = DB.getSettings();
      this.updateThemePreview(s.mainColor || '#0a0a0b', s.accentColor || '#f97316');
    }
    // Profile API settings
    const apiBtn = document.getElementById('save-api-btn');
    if (apiBtn) {
      const cfg = DB.getApiConfig();
      const prov = document.getElementById('set-vision-provider');
      const key = document.getElementById('set-vision-key');
      const ep = document.getElementById('set-vision-endpoint');
      const status = document.getElementById('api-status');
      if (prov) prov.value = cfg.visionProvider || 'openai';
      if (key && cfg.visionApiKey) key.placeholder = '•••• key saved on device';
      if (ep) ep.value = cfg.visionEndpoint || '';
      if (status) status.textContent = cfg.visionApiKey ? 'Key on device · ' + (cfg.visionProvider || 'openai') : 'No key saved';
      apiBtn.onclick = () => {
        const next = {
          visionProvider: prov ? prov.value : 'openai',
          visionApiKey: (key && key.value.trim()) ? key.value.trim() : (cfg.visionApiKey || ''),
          visionEndpoint: ep ? ep.value.trim() : '',
          barcodeApiKey: cfg.barcodeApiKey || ''
        };
        DB.saveApiConfig(next);
        if (key) key.value = '';
        if (status) status.textContent = next.visionApiKey ? 'Saved · ' + next.visionProvider : 'No key saved';
        this.toast(next.visionApiKey ? 'API settings saved' : 'Cleared or empty key');
      };
    }
  },

  startWorkout(workoutId, source = 'my') {
    let workout = null;
    if (source === 'library') {
      workout = WORKOUT_LIBRARY.find(w => w.id === workoutId);
    } else {
      workout = DB.getWorkout(workoutId);
    }
    if (!workout) {
      this.toast('Workout not found');
      return;
    }
    const settings = DB.getSettings();
    const exercises = workout.exercises.map(ex => {
      const suggestion = getSuggestedWeight(ex.exerciseId, ex.reps, ex.repsMax);
      const suggested = suggestion.weight || ex.weight || 0;
      return {
        exerciseId: ex.exerciseId,
        targetSets: ex.sets,
        targetReps: ex.reps,
        targetRepsMax: ex.repsMax || ex.reps,
        targetWeight: suggested,
        progressionReason: suggestion.reason || null,
        rest: ex.rest || settings.restTimerDefault,
        sets: Array.from({ length: ex.sets }, () => ({
          weight: suggested,
          reps: ex.reps,
          completed: false
        }))
      };
    });

    this.activeWorkout = {
      id: generateId(),
      workoutId: workout.id,
      workoutName: workout.name,
      exercises,
      currentExerciseIndex: 0,
      startTime: Date.now(),
      elapsed: 0,
      status: 'active'
    };
    DB.saveActiveWorkout(this.activeWorkout);
    this.showWorkoutPlayer();
  },

  resumeWorkout() {
    const active = DB.getActiveWorkout();
    if (active) {
      this.activeWorkout = active;
      this.showWorkoutPlayer();
    }
  },

  checkActiveWorkout() {
    const active = DB.getActiveWorkout();
    if (active && active.status === 'active') {
      this.activeWorkout = active;
    }
  },

  showWorkoutPlayer() {
    const player = document.getElementById('workout-player');
    player.classList.remove('hidden');
    document.getElementById('bottom-nav').style.display = 'none';
    this.renderWorkoutPlayer();
    this.startWorkoutTimer();
  },

  hideWorkoutPlayer() {
    const player = document.getElementById('workout-player');
    player.classList.add('hidden');
    document.getElementById('bottom-nav').style.display = '';
    this.stopWorkoutTimer();
    this.stopRestTimer();
  },

  startWorkoutTimer() {
    this.stopWorkoutTimer();
    this.workoutTimerInterval = setInterval(() => {
      if (this.activeWorkout) {
        this.activeWorkout.elapsed = Math.floor((Date.now() - this.activeWorkout.startTime) / 1000);
        const el = document.getElementById('wp-elapsed');
        if (el) el.textContent = this.formatTimer(this.activeWorkout.elapsed);
        DB.saveActiveWorkout(this.activeWorkout);
      }
    }, 1000);
  },

  stopWorkoutTimer() {
    if (this.workoutTimerInterval) {
      clearInterval(this.workoutTimerInterval);
      this.workoutTimerInterval = null;
    }
  },

  formatTimer(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },

  renderWorkoutPlayer() {
    const aw = this.activeWorkout;
    if (!aw) return;
    const player = document.getElementById('workout-player');
    const ex = aw.exercises[aw.currentExerciseIndex];
    const exercise = getExerciseById(ex.exerciseId);
    const prev = getPreviousPerformance(ex.exerciseId);
    const settings = DB.getSettings();
    const totalExercises = aw.exercises.length;
    const completedSets = aw.exercises.reduce((s, e) => s + e.sets.filter(x => x.completed).length, 0);
    const totalSets = aw.exercises.reduce((s, e) => s + e.sets.length, 0);

    let html = `
      <div class="wp-header">
        <button class="btn btn-ghost btn-sm" id="wp-leave">Leave</button>
        <div class="wp-timer" id="wp-elapsed">${this.formatTimer(aw.elapsed || 0)}</div>
        <div class="wp-progress">${aw.currentExerciseIndex + 1}/${totalExercises}</div>
      </div>
      <div class="wp-body">
        <div class="wp-exercise-name" id="wp-ex-name" data-id="${ex.exerciseId}">${exercise ? exercise.name : ex.exerciseId}</div>
        <div class="wp-muscles">${exercise ? [...exercise.primaryMuscles, ...exercise.secondaryMuscles].join(' · ') : ''}</div>
        
        <div class="wp-previous">
          ${prev && prev.allSets ? `
            <div style="margin-bottom:6px;"><strong>Last time</strong></div>
            ${prev.allSets.map(s => `<div>${s.weight} ${settings.units} × ${s.reps}</div>`).join('')}
          ` : '<div class="text-muted">No previous performance</div>'}
          <div style="margin-top:8px;">
            Target: ${ex.targetSets} × ${ex.targetReps}${ex.targetRepsMax && ex.targetRepsMax !== ex.targetReps ? '–' + ex.targetRepsMax : ''}
            ${ex.targetWeight ? ` · Suggested: <strong>${ex.targetWeight} ${settings.units}</strong>` : ''}
          </div>
          ${ex.progressionReason ? `<div style="margin-top:6px;font-size:12px;color:var(--accent);">${ex.progressionReason}</div>` : ''}
        </div>

        <div class="wp-sets" id="wp-sets">
    `;

    ex.sets.forEach((set, i) => {
      html += `
        <div class="wp-set ${set.completed ? 'completed' : ''}" data-set-idx="${i}">
          <div class="wp-set-num">${i + 1}</div>
          <input type="number" inputmode="decimal" min="0" step="0.5" value="${set.weight}" 
            data-field="weight" data-set="${i}" ${set.completed ? 'readonly' : ''} placeholder="lbs">
          <input type="number" inputmode="numeric" min="0" step="1" value="${set.reps}" 
            data-field="reps" data-set="${i}" ${set.completed ? 'readonly' : ''} placeholder="reps">
          <button class="wp-set-check" data-set="${i}">${set.completed ? '✓' : ''}</button>
        </div>
      `;
    });

    html += `
        </div>
        <div style="display:flex;gap:8px;margin-bottom:16px;">
          <button class="btn btn-secondary btn-sm" id="wp-add-set">+ Set</button>
        </div>
      </div>
      <div class="wp-footer">
        <button class="btn btn-secondary" id="wp-prev" ${aw.currentExerciseIndex === 0 ? 'disabled' : ''}>Prev</button>
        ${aw.currentExerciseIndex < totalExercises - 1 
          ? `<button class="btn btn-primary" id="wp-next">Next</button>`
          : `<button class="btn btn-success" id="wp-finish">Finish</button>`}
      </div>
      <div id="rest-container"></div>
    `;

    player.innerHTML = html;

    // Bind events
    document.getElementById('wp-leave').onclick = () => this.leaveWorkout();
    document.getElementById('wp-prev').onclick = () => this.prevExercise();
    const nextBtn = document.getElementById('wp-next');
    if (nextBtn) nextBtn.onclick = () => this.nextExercise();
    const finishBtn = document.getElementById('wp-finish');
    if (finishBtn) finishBtn.onclick = () => this.finishWorkout();
    document.getElementById('wp-add-set').onclick = () => this.addSet();

    player.querySelectorAll('.wp-set-check').forEach(btn => {
      btn.onclick = () => this.toggleSet(parseInt(btn.dataset.set));
    });

    player.querySelectorAll('.wp-set input').forEach(input => {
      input.addEventListener('change', () => {
        const setIdx = parseInt(input.dataset.set);
        const field = input.dataset.field;
        let val = parseFloat(input.value) || 0;
        if (val < 0) val = 0;
        ex.sets[setIdx][field] = val;
        DB.saveActiveWorkout(this.activeWorkout);
      });
    });

    const exName = document.getElementById('wp-ex-name');
    if (exName) {
      exName.onclick = () => this.showExerciseDetail(exName.dataset.id, true);
    }
  },

  toggleSet(setIdx) {
    const aw = this.activeWorkout;
    const ex = aw.exercises[aw.currentExerciseIndex];
    const set = ex.sets[setIdx];
    set.completed = !set.completed;
    if (set.completed) {
      // Start rest timer
      this.startRestTimer(ex.rest || 90);
    }
    DB.saveActiveWorkout(aw);
    this.renderWorkoutPlayer();
  },

  addSet() {
    const aw = this.activeWorkout;
    const ex = aw.exercises[aw.currentExerciseIndex];
    const last = ex.sets[ex.sets.length - 1];
    ex.sets.push({
      weight: last ? last.weight : ex.targetWeight,
      reps: last ? last.reps : ex.targetReps,
      completed: false
    });
    DB.saveActiveWorkout(aw);
    this.renderWorkoutPlayer();
  },

  startRestTimer(seconds) {
    this.stopRestTimer();
    let remaining = seconds;
    const container = document.getElementById('rest-container');
    if (!container) return;

    const renderRest = () => {
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      container.innerHTML = `
        <div class="rest-overlay">
          <div class="rest-label">Rest</div>
          <div class="rest-time">${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}</div>
          <button class="btn btn-primary" id="skip-rest">Skip Rest</button>
        </div>
      `;
      document.getElementById('skip-rest').onclick = () => this.stopRestTimer();
    };

    renderRest();
    this.restInterval = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        this.stopRestTimer();
        this.toast('Rest complete');
      } else {
        renderRest();
      }
    }, 1000);
  },

  stopRestTimer() {
    if (this.restInterval) {
      clearInterval(this.restInterval);
      this.restInterval = null;
    }
    const container = document.getElementById('rest-container');
    if (container) container.innerHTML = '';
  },

  nextExercise() {
    this.stopRestTimer();
    if (this.activeWorkout.currentExerciseIndex < this.activeWorkout.exercises.length - 1) {
      this.activeWorkout.currentExerciseIndex++;
      DB.saveActiveWorkout(this.activeWorkout);
      this.renderWorkoutPlayer();
    }
  },

  prevExercise() {
    this.stopRestTimer();
    if (this.activeWorkout.currentExerciseIndex > 0) {
      this.activeWorkout.currentExerciseIndex--;
      DB.saveActiveWorkout(this.activeWorkout);
      this.renderWorkoutPlayer();
    }
  },

  leaveWorkout() {
    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">Leave Workout?</div>
        <button class="modal-close" id="modal-close">×</button>
      </div>
      <p class="text-secondary" style="margin-bottom:20px;">Your progress is saved. You can resume later.</p>
      <button class="btn btn-primary btn-block mb-8" id="leave-save">Save & Leave</button>
      <button class="btn btn-danger btn-block" id="leave-discard">Discard Workout</button>
    `, () => {
      document.getElementById('modal-close').onclick = () => this.hideModal();
      document.getElementById('leave-save').onclick = () => {
        this.hideModal();
        this.hideWorkoutPlayer();
        this.navigate('home');
      };
      document.getElementById('leave-discard').onclick = () => {
        DB.saveActiveWorkout(null);
        this.activeWorkout = null;
        this.hideModal();
        this.hideWorkoutPlayer();
        this.navigate('home');
      };
    });
  },

  finishWorkout() {
    this.stopRestTimer();
    const aw = this.activeWorkout;
    const duration = Math.floor((Date.now() - aw.startTime) / 1000);
    let totalVolume = 0;
    let totalSets = 0;

    const exercises = aw.exercises.map(ex => {
      const sets = ex.sets.map(s => ({
        weight: s.weight,
        reps: s.reps,
        completed: s.completed
      }));
      sets.forEach(s => {
        if (s.completed) {
          totalVolume += s.weight * s.reps;
          totalSets++;
        }
      });
      return {
        exerciseId: ex.exerciseId,
        sets
      };
    });

    const entry = {
      id: aw.id,
      workoutId: aw.workoutId,
      workoutName: aw.workoutName,
      date: todayStr(),
      duration,
      exercises,
      totalVolume: Math.round(totalVolume),
      totalSets,
      completedAt: new Date().toISOString()
    };

    DB.addHistoryEntry(entry);
    const newPRs = detectPRs(entry);
    DB.saveActiveWorkout(null);
    this.activeWorkout = null;
    this.hideWorkoutPlayer();

    let msg = `Workout complete! ${totalSets} sets · ${entry.totalVolume.toLocaleString()} lb volume`;
    if (newPRs.length > 0) {
      msg += ` · ${newPRs.length} new PR${newPRs.length > 1 ? 's' : ''}!`;
    }
    const macros = getTodayCalories();
    const rem = getRemainingMacros();
    if (macros.protein > 0) {
      msg += ` · ${macros.protein}g protein logged today`;
    } else if (rem.protein > 30) {
      msg += ` · still ${rem.protein}g protein to go today`;
    }
    this.toast(msg);
    this.navigate('home');
  },

  // ========== WORKOUT BUILDER ==========
  showCreateWorkout() {
    this.showWorkoutBuilder(null);
  },

  showEditWorkout(id) {
    const workout = DB.getWorkout(id);
    if (workout) this.showWorkoutBuilder(workout);
  },

  showWorkoutBuilder(existing, forceNew = false) {
    const isEdit = !!existing && !forceNew && !!DB.getWorkout(existing.id);
    let exercises = existing ? JSON.parse(JSON.stringify(existing.exercises)) : [];
    let name = existing ? existing.name : '';

    const renderBuilder = () => {
      let exHtml = '';
      exercises.forEach((ex, i) => {
        const e = getExerciseById(ex.exerciseId);
        exHtml += `
          <div class="card" style="padding:12px;" data-ex-idx="${i}">
            <div class="flex-between mb-8">
              <div style="font-weight:600;cursor:pointer;" data-action="open-exercise" data-id="${ex.exerciseId}">${e ? e.name : ex.exerciseId}</div>
              <button class="btn btn-sm btn-danger" data-remove="${i}">Remove</button>
            </div>
            <div class="input-row">
              <div class="input-group" style="margin:0;">
                <label class="input-label">Sets</label>
                <input type="number" min="1" max="20" value="${ex.sets}" data-field="sets" data-idx="${i}" class="input">
              </div>
              <div class="input-group" style="margin:0;">
                <label class="input-label">Reps</label>
                <input type="number" min="1" max="100" value="${ex.reps}" data-field="reps" data-idx="${i}" class="input">
              </div>
              <div class="input-group" style="margin:0;">
                <label class="input-label">Rest (s)</label>
                <input type="number" min="0" max="600" value="${ex.rest || 90}" data-field="rest" data-idx="${i}" class="input">
              </div>
            </div>
            <div style="display:flex;gap:8px;margin-top:8px;">
              <button class="btn btn-sm btn-secondary" data-move-up="${i}" ${i===0?'disabled':''}>↑</button>
              <button class="btn btn-sm btn-secondary" data-move-down="${i}" ${i===exercises.length-1?'disabled':''}>↓</button>
            </div>
          </div>
        `;
      });

      this.showModal(`
        <div class="modal-header">
          <div class="modal-title">${isEdit ? 'Edit Workout' : 'Create Workout'}</div>
          <button class="modal-close" id="modal-close">×</button>
        </div>
        <div class="input-group">
          <label class="input-label">Workout Name</label>
          <input type="text" class="input" id="wo-name" value="${name}" placeholder="e.g. Upper Strength">
        </div>
        <div class="section-header">
          <h3>Exercises</h3>
          <button class="btn btn-sm btn-secondary" id="add-ex">+ Add</button>
        </div>
        <div id="builder-exercises">${exHtml || '<p class="text-muted">No exercises yet.</p>'}</div>
        <button class="btn btn-primary btn-block mt-16" id="save-wo">Save Workout</button>
        ${isEdit ? `<button class="btn btn-danger btn-block mt-8" id="delete-wo">Delete Workout</button>` : ''}
      `, () => {
        document.getElementById('modal-close').onclick = () => this.hideModal();
        document.getElementById('add-ex').onclick = () => {
          name = document.getElementById('wo-name').value;
          this.showExercisePicker((exId) => {
            const e = getExerciseById(exId);
            exercises.push({
              exerciseId: exId,
              sets: e ? e.defaultSets : 3,
              reps: e ? e.defaultReps : 8,
              weight: 0,
              rest: e ? e.defaultRest : 90
            });
            renderBuilder();
          });
        };
        document.getElementById('save-wo').onclick = () => {
          name = document.getElementById('wo-name').value.trim();
          if (!name) { this.toast('Enter a workout name'); return; }
          if (exercises.length === 0) { this.toast('Add at least one exercise'); return; }
          // Read current values
          document.querySelectorAll('#builder-exercises [data-field]').forEach(inp => {
            const idx = parseInt(inp.dataset.idx);
            const field = inp.dataset.field;
            let val = parseInt(inp.value) || 0;
            if (val < 0) val = 0;
            exercises[idx][field] = val;
          });
          const workout = {
            id: existing ? existing.id : generateId(),
            name,
            exercises
          };
          DB.saveWorkout(workout);
          this.hideModal();
          this.toast('Workout saved');
          this.render();
        };
        if (isEdit) {
          document.getElementById('delete-wo').onclick = () => {
            this.hideModal();
            this.confirmDeleteWorkout(existing.id);
          };
        }
        // Remove / reorder
        document.querySelectorAll('[data-remove]').forEach(btn => {
          btn.onclick = () => {
            exercises.splice(parseInt(btn.dataset.remove), 1);
            renderBuilder();
          };
        });
        document.querySelectorAll('[data-move-up]').forEach(btn => {
          btn.onclick = () => {
            const i = parseInt(btn.dataset.moveUp);
            if (i > 0) {
              [exercises[i], exercises[i-1]] = [exercises[i-1], exercises[i]];
              renderBuilder();
            }
          };
        });
        document.querySelectorAll('[data-move-down]').forEach(btn => {
          btn.onclick = () => {
            const i = parseInt(btn.dataset.moveDown);
            if (i < exercises.length - 1) {
              [exercises[i], exercises[i+1]] = [exercises[i+1], exercises[i]];
              renderBuilder();
            }
          };
        });
        document.querySelectorAll('[data-action="open-exercise"]').forEach(el => {
          el.onclick = () => this.showExerciseDetail(el.dataset.id);
        });
      });
    };
    renderBuilder();
  },

  showExercisePicker(callback) {
    let search = '';
    const render = () => {
      const q = search.toLowerCase();
      const filtered = EXERCISE_LIBRARY.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.primaryMuscles.some(m => m.toLowerCase().includes(q)) ||
        e.equipment.toLowerCase().includes(q)
      );
      let list = filtered.map(e => `
        <div class="list-item" data-pick="${e.id}">
          <div class="list-item-content">
            <div class="list-item-title">${e.name}</div>
            <div class="list-item-sub">${e.primaryMuscles.join(', ')} · ${e.equipment}</div>
          </div>
        </div>
      `).join('');

      this.showModal(`
        <div class="modal-header">
          <div class="modal-title">Add Exercise</div>
          <button class="modal-close" id="modal-close">×</button>
        </div>
        <div class="search-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="search" id="ex-search" placeholder="Search exercises..." value="${search}">
        </div>
        <div style="max-height:50vh;overflow-y:auto;">${list || '<p class="text-muted">No exercises found</p>'}</div>
      `, () => {
        document.getElementById('modal-close').onclick = () => this.hideModal();
        document.getElementById('ex-search').oninput = (e) => {
          search = e.target.value;
          render();
        };
        document.querySelectorAll('[data-pick]').forEach(el => {
          el.onclick = () => {
            this.hideModal();
            callback(el.dataset.pick);
          };
        });
      });
    };
    render();
  },

  confirmDeleteWorkout(id) {
    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">Delete Workout?</div>
        <button class="modal-close" id="modal-close">×</button>
      </div>
      <p class="text-secondary mb-16">This cannot be undone.</p>
      <button class="btn btn-danger btn-block" id="confirm-del">Delete</button>
    `, () => {
      document.getElementById('modal-close').onclick = () => this.hideModal();
      document.getElementById('confirm-del').onclick = () => {
        DB.deleteWorkout(id);
        this.hideModal();
        this.toast('Workout deleted');
        this.render();
      };
    });
  },

  // ========== HISTORY DETAIL ==========
  showHistoryDetail(id) {
    const entry = DB.getHistoryEntry(id);
    if (!entry) return;
    const settings = DB.getSettings();
    let exHtml = '';
    entry.exercises.forEach(ex => {
      const e = getExerciseById(ex.exerciseId);
      const setsHtml = (ex.sets || []).filter(s => s.completed).map((s, i) =>
        `<div style="font-size:13px;color:var(--text-secondary);">Set ${i+1}: ${s.weight} ${settings.units} × ${s.reps}</div>`
      ).join('');
      exHtml += `
        <div class="card" style="padding:12px;">
          <div style="font-weight:600;cursor:pointer;margin-bottom:6px;" data-action="open-exercise" data-id="${ex.exerciseId}">
            ${e ? e.name : ex.exerciseId}
          </div>
          ${setsHtml || '<div class="text-muted">No completed sets</div>'}
        </div>
      `;
    });

    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">${entry.workoutName}</div>
        <button class="modal-close" id="modal-close">×</button>
      </div>
      <p class="text-secondary mb-8">${formatDate(entry.date)} · ${formatDuration(entry.duration)}</p>
      <p class="text-secondary mb-16">${entry.totalSets} sets · ${(entry.totalVolume||0).toLocaleString()} ${settings.units} volume</p>
      ${exHtml}
    `, () => {
      document.getElementById('modal-close').onclick = () => this.hideModal();
      document.querySelectorAll('[data-action="open-exercise"]').forEach(el => {
        el.onclick = () => this.showExerciseDetail(el.dataset.id);
      });
    });
  },

  // ========== WORKOUT LIBRARY ==========
  showWorkoutLibrary() {
    let search = '';
    let filterCat = 'All';
    const categories = ['All', 'Program', 'Strength', 'Hypertrophy', 'Beginner', 'At Home', 'Athletic', 'Dumbbells'];

    const render = () => {
      const q = search.toLowerCase();
      let list = WORKOUT_LIBRARY.filter(w => {
        if (filterCat === 'Dumbbells') {
          const eq = (w.equipment || []).map(e => e.toLowerCase());
          const isDb = eq.includes('dumbbells') && !eq.some(e => e.includes('barbell'));
          const isDbNamed = /dumbbell/i.test(w.name);
          if (!isDb && !isDbNamed) return false;
        } else if (filterCat !== 'All' && w.category !== filterCat) {
          return false;
        }
        if (!q) return true;
        return w.name.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q) ||
          w.goal.toLowerCase().includes(q) ||
          w.difficulty.toLowerCase().includes(q) ||
          (w.muscles || []).some(m => m.toLowerCase().includes(q)) ||
          (w.equipment || []).some(e => e.toLowerCase().includes(q)) ||
          (w.description || '').toLowerCase().includes(q);
      });

      const cards = list.map(w => {
        const totalSets = w.exercises.reduce((s, e) => s + e.sets, 0);
        return `
          <div class="card" style="cursor:pointer;padding:14px;" data-view-lib="${w.id}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
              <div>
                <div style="font-weight:700;font-size:16px;">${w.name}</div>
                <div class="text-secondary" style="font-size:12px;margin-top:4px;">${w.category} · ${w.difficulty} · ~${w.duration} min</div>
              </div>
              <span class="tag tag-accent">${w.goal}</span>
            </div>
            <div class="text-muted" style="font-size:12px;margin-top:8px;">${w.exercises.length} exercises · ${totalSets} sets · ${(w.equipment || []).join(', ')}</div>
          </div>
        `;
      }).join('');

      this.showModal(`
        <div class="modal-header">
          <div class="modal-title">Workout Library</div>
          <button class="modal-close" id="modal-close">×</button>
        </div>
        <div class="search-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="search" id="wl-search" placeholder="Search: chest, strength, home..." value="${search}">
        </div>
        <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:8px;margin-bottom:8px;-webkit-overflow-scrolling:touch;">
          ${categories.map(c => `
            <button class="btn btn-sm ${filterCat === c ? 'btn-primary' : 'btn-secondary'}" data-cat="${c}" style="flex-shrink:0;">${c}</button>
          `).join('')}
        </div>
        <div style="max-height:55vh;overflow-y:auto;">
          ${cards || '<p class="text-muted" style="padding:20px;text-align:center;">No workouts match.</p>'}
        </div>
      `, () => {
        document.getElementById('modal-close').onclick = () => this.hideModal();
        document.getElementById('wl-search').oninput = (e) => { search = e.target.value; render(); };
        document.querySelectorAll('[data-cat]').forEach(btn => {
          btn.onclick = () => { filterCat = btn.dataset.cat; render(); };
        });
        document.querySelectorAll('[data-view-lib]').forEach(el => {
          el.onclick = () => {
            this.hideModal();
            this.showLibraryWorkoutDetail(el.dataset.viewLib);
          };
        });
      });
    };
    render();
  },

  showLibraryWorkoutDetail(id) {
    const w = WORKOUT_LIBRARY.find(x => x.id === id);
    if (!w) { this.toast('Workout not found'); return; }
    const totalSets = w.exercises.reduce((s, e) => s + e.sets, 0);
    const exList = w.exercises.map((ex, i) => {
      const e = getExerciseById(ex.exerciseId);
      const repStr = ex.repsMax && ex.repsMax !== ex.reps ? `${ex.reps}–${ex.repsMax}` : `${ex.reps}`;
      return `
        <div class="list-item" style="cursor:default;">
          <div class="list-item-content">
            <div class="list-item-title" style="cursor:pointer;color:var(--accent);" data-open-ex="${ex.exerciseId}">${i + 1}. ${e ? e.name : ex.exerciseId}</div>
            <div class="list-item-sub">${ex.sets} × ${repStr} · Rest ${ex.rest}s</div>
          </div>
        </div>
      `;
    }).join('');

    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">${w.name}</div>
        <button class="modal-close" id="modal-close">×</button>
      </div>
      <p class="text-secondary" style="font-size:14px;margin-bottom:12px;">${w.description}</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">
        <span class="tag tag-accent">${w.goal}</span>
        <span class="tag">${w.difficulty}</span>
        <span class="tag">~${w.duration} min</span>
      </div>
      <p class="text-muted" style="font-size:13px;margin-bottom:4px;">${(w.equipment || []).join(' · ')}</p>
      <p class="text-muted" style="font-size:13px;margin-bottom:16px;">${w.exercises.length} exercises · ${totalSets} sets · ${(w.muscles || []).join(', ')}</p>
      <h3 style="margin-bottom:8px;">Exercises</h3>
      ${exList}
      <button class="btn btn-primary btn-block mt-16" id="lib-start">Start Workout</button>
      ${w.dumbbellVariantId ? '<button class="btn btn-secondary btn-block mt-8" id="lib-db-version">Dumbbell version</button>' : ''}
      <button class="btn btn-secondary btn-block mt-8" id="lib-add">Add to My Workouts</button>
      <button class="btn btn-ghost btn-block mt-8" id="lib-custom">Customize</button>
    `, () => {
      document.getElementById('modal-close').onclick = () => this.hideModal();
      document.getElementById('lib-start').onclick = () => {
        this.hideModal();
        this.startWorkout(w.id, 'library');
      };
      const dbBtn = document.getElementById('lib-db-version');
      if (dbBtn && w.dumbbellVariantId) {
        dbBtn.onclick = () => {
          this.hideModal();
          this.showLibraryWorkoutDetail(w.dumbbellVariantId);
        };
      }
      document.getElementById('lib-add').onclick = () => {
        this.addLibraryToMyWorkouts(w.id);
      };
      document.getElementById('lib-custom').onclick = () => {
        this.hideModal();
        this.customizeLibraryWorkout(w.id);
      };
      document.querySelectorAll('[data-open-ex]').forEach(el => {
        el.onclick = (e) => {
          e.stopPropagation();
          this.showExerciseDetail(el.dataset.openEx, true);
        };
      });
    });
  },

  addLibraryToMyWorkouts(libId) {
    const w = WORKOUT_LIBRARY.find(x => x.id === libId);
    if (!w) return;
    const copy = {
      id: generateId(),
      name: w.name,
      exercises: w.exercises.map(ex => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        reps: ex.reps,
        weight: 0,
        rest: ex.rest || 90
      })),
      fromLibrary: libId
    };
    DB.saveWorkout(copy);
    this.toast(`"${w.name}" added to My Workouts`);
  },

  customizeLibraryWorkout(libId) {
    const w = WORKOUT_LIBRARY.find(x => x.id === libId);
    if (!w) return;
    const copy = {
      id: generateId(),
      name: w.name + ' (Custom)',
      exercises: w.exercises.map(ex => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        reps: ex.reps,
        weight: 0,
        rest: ex.rest || 90
      }))
    };
    // Open builder with this as starting point (save on confirm)
    this.showWorkoutBuilder(copy, true);
  },

  // ========== EXERCISE LIBRARY ==========
  showExerciseLibrary() {
    let search = '';
    let filterMuscle = 'All';
    const muscles = ['All', 'Chest', 'Back', 'Shoulders', 'Quads', 'Glutes', 'Hamstrings', 'Biceps', 'Triceps', 'Core', 'Lats'];

    const render = () => {
      const q = search.toLowerCase();
      const filtered = EXERCISE_LIBRARY.filter(e => {
        if (filterMuscle !== 'All') {
          const allM = [...e.primaryMuscles, ...e.secondaryMuscles];
          if (!allM.some(m => m.toLowerCase().includes(filterMuscle.toLowerCase()))) return false;
        }
        if (!q) return true;
        return e.name.toLowerCase().includes(q) ||
          e.primaryMuscles.some(m => m.toLowerCase().includes(q)) ||
          e.equipment.toLowerCase().includes(q) ||
          e.difficulty.toLowerCase().includes(q);
      });
      let list = filtered.map(e => `
        <div class="list-item" data-open-ex="${e.id}">
          <div class="list-item-content">
            <div class="list-item-title">${e.name}</div>
            <div class="list-item-sub">${e.primaryMuscles.join(', ')} · ${e.equipment} · ${e.difficulty}</div>
          </div>
        </div>
      `).join('');

      this.showModal(`
        <div class="modal-header">
          <div class="modal-title">Exercise Library</div>
          <button class="modal-close" id="modal-close">×</button>
        </div>
        <div class="search-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="search" id="lib-search" placeholder="Search exercises..." value="${search}">
        </div>
        <div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:8px;margin-bottom:8px;-webkit-overflow-scrolling:touch;">
          ${muscles.map(m => `
            <button class="btn btn-sm ${filterMuscle === m ? 'btn-primary' : 'btn-secondary'}" data-muscle="${m}" style="flex-shrink:0;">${m}</button>
          `).join('')}
        </div>
        <div style="max-height:55vh;overflow-y:auto;">${list || '<p class="text-muted">No exercises found</p>'}</div>
      `, () => {
        document.getElementById('modal-close').onclick = () => this.hideModal();
        document.getElementById('lib-search').oninput = (e) => { search = e.target.value; render(); };
        document.querySelectorAll('[data-muscle]').forEach(btn => {
          btn.onclick = () => { filterMuscle = btn.dataset.muscle; render(); };
        });
        document.querySelectorAll('[data-open-ex]').forEach(el => {
          el.onclick = () => this.showExerciseDetail(el.dataset.openEx);
        });
      });
    };
    render();
  },

  showExerciseDetail(id, keepStack) {
    const e = getExerciseById(id);
    if (!e) { this.toast('Exercise not found'); return; }
    const prev = getPreviousPerformance(id);
    const prs = DB.getPRs()[id];
    const settings = DB.getSettings();
    // Split instructions into Setup / Execution when possible
    const setup = e.instructions.slice(0, Math.min(2, e.instructions.length));
    const execution = e.instructions.slice(Math.min(2, e.instructions.length));

    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">${e.name}</div>
        <button class="modal-close" id="modal-close">×</button>
      </div>
      <div class="demo-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <span>Demo video placeholder</span>
        <span style="font-size:12px;">Real videos can be added later</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;">
        ${e.primaryMuscles.map(m => `<span class="tag tag-accent">${m}</span>`).join('')}
        ${e.secondaryMuscles.map(m => `<span class="tag">${m}</span>`).join('')}
      </div>
      <p class="text-secondary" style="font-size:13px;margin-bottom:12px;">${e.equipment} · ${e.difficulty}</p>
      ${prev && prev.allSets ? `
        <div class="card" style="padding:10px;margin-bottom:12px;">
          <strong>Last time</strong>
          ${prev.allSets.map(s => `<div style="font-size:13px;">${s.weight} ${settings.units} × ${s.reps}</div>`).join('')}
        </div>
      ` : ''}
      ${prs?.heaviest ? `<div class="pr-badge mb-8">PR: ${prs.heaviest.weight} ${settings.units} × ${prs.heaviest.reps}</div>` : ''}
      <div class="exercise-guide">
        <div class="guide-section">
          <h4>Setup</h4>
          <ol>${setup.map(i => `<li>${i}</li>`).join('')}</ol>
        </div>
        <div class="guide-section">
          <h4>Execution</h4>
          <ol>${execution.map(i => `<li>${i}</li>`).join('')}</ol>
        </div>
        <div class="guide-section">
          <h4>Common Mistakes</h4>
          <ul>${e.commonMistakes.map(m => `<li>${m}</li>`).join('')}</ul>
        </div>
      </div>
      <button class="btn btn-primary btn-block mt-16" id="add-ex-to-wo">Add to Workout</button>
    `, () => {
      document.getElementById('modal-close').onclick = () => this.hideModal();
      document.getElementById('add-ex-to-wo').onclick = () => {
        this.hideModal();
        this.showAddToWorkout(id);
      };
    });
  },

  showAddToWorkout(exerciseId) {
    const workouts = DB.getWorkouts();
    if (workouts.length === 0) {
      this.toast('Create a workout first');
      return;
    }
    let list = workouts.map(w => `
      <div class="list-item" data-add-to="${w.id}">
        <div class="list-item-content">
          <div class="list-item-title">${w.name}</div>
          <div class="list-item-sub">${w.exercises.length} exercises</div>
        </div>
      </div>
    `).join('');

    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">Add to Workout</div>
        <button class="modal-close" id="modal-close">×</button>
      </div>
      ${list}
    `, () => {
      document.getElementById('modal-close').onclick = () => this.hideModal();
      document.querySelectorAll('[data-add-to]').forEach(el => {
        el.onclick = () => {
          const workout = DB.getWorkout(el.dataset.addTo);
          const e = getExerciseById(exerciseId);
          workout.exercises.push({
            exerciseId,
            sets: e ? e.defaultSets : 3,
            reps: e ? e.defaultReps : 8,
            weight: 0,
            rest: e ? e.defaultRest : 90
          });
          DB.saveWorkout(workout);
          this.hideModal();
          this.toast(`Added to ${workout.name}`);
        };
      });
    });
  },

  // ========== NUTRITION ==========
  renderNutrition() {
    const settings = DB.getSettings();
    const log = DB.getFoodLog(todayStr());
    const totals = getTodayCalories();
    const rem = getRemainingMacros();
    const insight = getNutritionInsight();
    const recs = getFoodRecommendations(4);
    const meals = ['breakfast', 'lunch', 'dinner', 'snacks'];
    const mealLabels = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snacks: 'Snacks' };

    let html = `
      <div class="screen">
        <div class="section-header">
          <h2>Nutrition</h2>
          <div style="display:flex;gap:6px;">
            <button class="btn btn-sm btn-secondary" data-action="nutrition-assistant">Help</button>
            <button class="btn btn-sm btn-secondary" data-action="nutrition-history">History</button>
            <button class="btn btn-sm btn-secondary" data-action="recipes">Recipes</button>
          </div>
        </div>
        <p class="text-secondary" style="font-size:13px;margin-bottom:12px;">${formatDate(todayStr())}</p>

        <div class="card">
          <div class="flex-between" style="margin-bottom:12px;">
            <div>
              <div style="font-size:28px;font-weight:800;">${totals.calories}</div>
              <div class="text-muted" style="font-size:12px;">of ${settings.calorieGoal} cal</div>
            </div>
            <div style="text-align:right;font-size:13px;color:var(--text-secondary);line-height:1.6;">
              <div><span style="color:var(--text);font-weight:600;">${totals.protein}g</span> / ${settings.proteinGoal}g protein</div>
              <div><span style="color:var(--text);font-weight:600;">${totals.carbs}g</span> / ${settings.carbGoal}g carbs</div>
              <div><span style="color:var(--text);font-weight:600;">${totals.fat}g</span> / ${settings.fatGoal}g fat</div>
            </div>
          </div>
          <div class="progress-bar" style="height:8px;"><div class="progress-fill" style="width:${Math.min(100, (totals.calories/settings.calorieGoal)*100)}%"></div></div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:12px;font-size:11px;color:var(--text-muted);text-align:center;">
            <div>Left<br><strong style="color:var(--text);font-size:14px;">${rem.calories}</strong></div>
            <div>Protein left<br><strong style="color:var(--text);font-size:14px;">${rem.protein}g</strong></div>
            <div>Carbs left<br><strong style="color:var(--text);font-size:14px;">${rem.carbs}g</strong></div>
          </div>
        </div>

        <div class="card" style="padding:12px;">
          <div style="font-size:13px;color:var(--text-secondary);">${insight}</div>
        </div>

        <button class="btn btn-primary btn-block mb-16" data-action="add-food" data-meal="lunch">+ Add Food</button>
    `;

    if (recs.length && totals.calories > 0 || rem.protein > 15) {
      html += `<div class="card-title">What fits your day</div>`;
      recs.forEach(r => {
        html += `
          <div class="list-item" style="cursor:default;">
            <div class="list-item-content">
              <div class="list-item-title">${r.food.name}</div>
              <div class="list-item-sub">${r.calories} cal · ${r.protein}p · ${r.reason}</div>
            </div>
            <button class="btn btn-sm btn-secondary" data-action="quick-add-food" data-food-id="${r.food.id}" data-servings="${r.servings}" data-meal="snacks">Add</button>
          </div>
        `;
      });
      html += `<button class="btn btn-ghost btn-sm btn-block mb-16" data-action="build-meal">Build a meal around remaining macros →</button>`;
    }

    meals.forEach(meal => {
      const items = log[meal] || [];
      const mealCal = items.reduce((s, i) => s + (i.calories || 0), 0);
      html += `
        <div class="meal-section">
          <div class="meal-header">
            <h3>${mealLabels[meal]} <span class="text-muted" style="font-weight:400;font-size:13px;">${Math.round(mealCal)} cal</span></h3>
            <button class="btn btn-sm btn-secondary" data-action="add-food" data-meal="${meal}">+</button>
          </div>
      `;
      if (items.length === 0) {
        html += `<p class="text-muted" style="font-size:13px;padding:4px 0 8px;">Nothing logged</p>`;
      } else {
        items.forEach((item, idx) => {
          html += `
            <div class="food-item">
              <div class="food-item-info">
                <div class="food-item-name">${item.name}</div>
                <div class="food-item-macros">${Math.round(item.calories)} cal · ${Math.round(item.protein)}p · ${Math.round(item.carbs)}c · ${Math.round(item.fat)}f</div>
              </div>
              <div class="food-item-actions">
                <button class="btn btn-sm btn-ghost" data-action="edit-food" data-meal="${meal}" data-idx="${idx}">Edit</button>
                <button class="btn btn-sm btn-ghost" data-action="delete-food" data-meal="${meal}" data-idx="${idx}" style="color:var(--danger);">×</button>
              </div>
            </div>
          `;
        });
      }
      html += `</div>`;
    });

    html += `</div>`;
    return html;
  },

  showAddFoodSheet(meal) {
    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">Add Food</div>
        <button class="modal-close" id="modal-close">×</button>
      </div>
      <p class="text-secondary mb-12" style="font-size:13px;">Logging to ${meal.charAt(0).toUpperCase() + meal.slice(1)}</p>
      <button class="btn btn-primary btn-block mb-8" id="opt-search">Search Foods</button>
      <button class="btn btn-secondary btn-block mb-8" id="opt-scan-meal">📷 Scan Meal</button>
      <button class="btn btn-secondary btn-block mb-8" id="opt-scan-label">🏷 Scan Nutrition Label</button>
      <button class="btn btn-secondary btn-block mb-8" id="opt-barcode">▣ Scan Barcode</button>
      <button class="btn btn-secondary btn-block mb-8" id="opt-recipe">Recipes</button>
      <button class="btn btn-secondary btn-block mb-8" id="opt-build">Build a Meal</button>
      <button class="btn btn-ghost btn-block" id="opt-custom">Create Custom Food</button>
    `, () => {
      document.getElementById('modal-close').onclick = () => this.hideModal();
      document.getElementById('opt-search').onclick = () => { this.hideModal(); this.showAddFood(meal); };
      document.getElementById('opt-scan-meal').onclick = () => { this.hideModal(); this.showScanMeal(meal); };
      document.getElementById('opt-scan-label').onclick = () => { this.hideModal(); this.showScanLabel(); };
      document.getElementById('opt-barcode').onclick = () => { this.hideModal(); this.showScanBarcode(meal); };
      document.getElementById('opt-recipe').onclick = () => { this.hideModal(); this.showRecipes(meal); };
      document.getElementById('opt-build').onclick = () => { this.hideModal(); this.showBuildMeal(meal); };
      document.getElementById('opt-custom').onclick = () => { this.hideModal(); this.showCreateCustomFood(meal); };
    });
  },

  showAddFood(meal) {
    let search = '';
    let selected = null;
    let servings = 1;
    let tab = 'all';

    const render = () => {
      if (selected) {
        const cal = Math.round(selected.calories * servings);
        const p = Math.round(selected.protein * servings * 10) / 10;
        const c = Math.round(selected.carbs * servings * 10) / 10;
        const f = Math.round(selected.fat * servings * 10) / 10;
        const isFav = DB.isFavorite(selected.id);
        this.showModal(`
          <div class="modal-header">
            <div class="modal-title">${selected.name}</div>
            <button class="modal-close" id="modal-close">×</button>
          </div>
          <p class="text-secondary mb-8">Serving: ${selected.serving || '1 serving'}</p>
          <div class="input-group">
            <label class="input-label">Number of servings</label>
            <input type="number" class="input" id="food-servings" value="${servings}" min="0.1" step="0.1">
          </div>
          <div class="card" style="padding:12px;margin-bottom:12px;">
            <div>${cal} cal · ${p}g protein · ${c}g carbs · ${f}g fat</div>
          </div>
          <button class="btn btn-primary btn-block" id="log-food">Log Food</button>
          <button class="btn btn-secondary btn-block mt-8" id="toggle-fav">${isFav ? '★ Favorited' : '☆ Favorite'}</button>
          <button class="btn btn-ghost btn-block mt-8" id="back-search">Back</button>
        `, () => {
          document.getElementById('modal-close').onclick = () => this.hideModal();
          document.getElementById('food-servings').oninput = (e) => {
            servings = parseFloat(e.target.value) || 1;
            render();
          };
          document.getElementById('log-food').onclick = () => {
            const s = parseFloat(document.getElementById('food-servings').value) || 1;
            if (s <= 0) { this.toast('Invalid serving'); return; }
            this.logFoodItem(meal, {
              foodId: selected.id,
              name: selected.name,
              servings: s,
              servingLabel: selected.serving || '1 serving',
              calories: selected.calories * s,
              protein: selected.protein * s,
              carbs: selected.carbs * s,
              fat: selected.fat * s
            });
            DB.pushRecentFood(selected);
            this.hideModal();
            this.toast('Food logged');
            this.render();
          };
          document.getElementById('toggle-fav').onclick = () => {
            DB.toggleFavorite(selected.id);
            render();
          };
          document.getElementById('back-search').onclick = () => { selected = null; render(); };
        });
        return;
      }

      const allFoods = DB.getAllFoods();
      const q = search.toLowerCase();
      let pool = allFoods;
      if (tab === 'recent') {
        const recentIds = DB.getRecentFoods().map(f => f.id);
        pool = recentIds.map(id => allFoods.find(f => f.id === id)).filter(Boolean);
      } else if (tab === 'favorites') {
        const favs = DB.getFavorites();
        pool = allFoods.filter(f => favs.includes(f.id));
      } else if (tab === 'custom') {
        pool = DB.getCustomFoods();
      }
      const filtered = pool.filter(f => !q || f.name.toLowerCase().includes(q));
      let list = filtered.slice(0, 40).map(f => `
        <div class="list-item" data-food="${f.id}">
          <div class="list-item-content">
            <div class="list-item-title">${f.name}</div>
            <div class="list-item-sub">${f.calories} cal · ${f.protein}p · ${f.serving || ''}</div>
          </div>
        </div>
      `).join('');

      this.showModal(`
        <div class="modal-header">
          <div class="modal-title">Search Foods</div>
          <button class="modal-close" id="modal-close">×</button>
        </div>
        <div class="search-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="search" id="food-search" placeholder="Search foods..." value="${search}">
        </div>
        <div class="tabs mb-8">
          <button class="tab ${tab==='all'?'active':''}" data-ftab="all">All</button>
          <button class="tab ${tab==='recent'?'active':''}" data-ftab="recent">Recent</button>
          <button class="tab ${tab==='favorites'?'active':''}" data-ftab="favorites">Favorites</button>
          <button class="tab ${tab==='custom'?'active':''}" data-ftab="custom">Custom</button>
        </div>
        <div style="max-height:45vh;overflow-y:auto;">${list || '<p class="text-muted" style="padding:16px;text-align:center;">No foods found</p>'}</div>
      `, () => {
        document.getElementById('modal-close').onclick = () => this.hideModal();
        document.getElementById('food-search').oninput = (e) => { search = e.target.value; render(); };
        document.querySelectorAll('[data-ftab]').forEach(t => {
          t.onclick = () => { tab = t.dataset.ftab; render(); };
        });
        document.querySelectorAll('[data-food]').forEach(el => {
          el.onclick = () => {
            selected = allFoods.find(f => f.id === el.dataset.food) || DB.getCustomFoods().find(f => f.id === el.dataset.food);
            servings = 1;
            render();
          };
        });
      });
    };
    render();
  },

  logFoodItem(meal, item) {
    const log = DB.getFoodLog(todayStr());
    if (!log[meal]) log[meal] = [];
    log[meal].push({ id: generateId(), ...item });
    DB.saveFoodLog(todayStr(), log);
  },

  quickLogRecommendation(foodId, servings, meal) {
    const food = DB.getAllFoods().find(f => f.id === foodId);
    if (!food) return;
    const s = parseFloat(servings) || 1;
    this.logFoodItem(meal, {
      foodId: food.id,
      name: food.name,
      servings: s,
      servingLabel: food.serving,
      calories: food.calories * s,
      protein: food.protein * s,
      carbs: food.carbs * s,
      fat: food.fat * s
    });
    DB.pushRecentFood(food);
    this.toast(`Added ${food.name}`);
    this.render();
  },

  showCreateCustomFood(meal) {
    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">Custom Food</div>
        <button class="modal-close" id="modal-close">×</button>
      </div>
      <div class="input-group"><label class="input-label">Name</label><input type="text" class="input" id="cf-name" placeholder="e.g. Homemade Shake"></div>
      <div class="input-group"><label class="input-label">Serving label</label><input type="text" class="input" id="cf-serving" value="1 serving"></div>
      <div class="input-row">
        <div class="input-group"><label class="input-label">Calories</label><input type="number" class="input" id="cf-cal" min="0" value="0"></div>
        <div class="input-group"><label class="input-label">Protein (g)</label><input type="number" class="input" id="cf-protein" min="0" step="0.1" value="0"></div>
      </div>
      <div class="input-row">
        <div class="input-group"><label class="input-label">Carbs (g)</label><input type="number" class="input" id="cf-carbs" min="0" step="0.1" value="0"></div>
        <div class="input-group"><label class="input-label">Fat (g)</label><input type="number" class="input" id="cf-fat" min="0" step="0.1" value="0"></div>
      </div>
      <button class="btn btn-primary btn-block" id="save-cf">Save & Log</button>
    `, () => {
      document.getElementById('modal-close').onclick = () => this.hideModal();
      document.getElementById('save-cf').onclick = () => {
        const name = document.getElementById('cf-name').value.trim();
        if (!name) { this.toast('Enter a name'); return; }
        const food = {
          id: 'custom-' + generateId(),
          name,
          serving: document.getElementById('cf-serving').value || '1 serving',
          calories: parseFloat(document.getElementById('cf-cal').value) || 0,
          protein: parseFloat(document.getElementById('cf-protein').value) || 0,
          carbs: parseFloat(document.getElementById('cf-carbs').value) || 0,
          fat: parseFloat(document.getElementById('cf-fat').value) || 0
        };
        DB.saveCustomFood(food);
        this.logFoodItem(meal, {
          foodId: food.id, name: food.name, servings: 1, servingLabel: food.serving,
          calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat
        });
        this.hideModal();
        this.toast('Custom food logged');
        this.render();
      };
    });
  },

  showEditFood(meal, idx) {
    const log = DB.getFoodLog(todayStr());
    const item = log[meal][parseInt(idx)];
    if (!item) return;
    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">Edit Food</div>
        <button class="modal-close" id="modal-close">×</button>
      </div>
      <p style="font-weight:600;margin-bottom:12px;">${item.name}</p>
      <div class="input-group">
        <label class="input-label">Servings</label>
        <input type="number" class="input" id="edit-servings" value="${item.servings}" min="0.1" step="0.1">
      </div>
      <div class="input-group">
        <label class="input-label">Move to meal</label>
        <select class="select" id="edit-meal">
          ${['breakfast','lunch','dinner','snacks'].map(m => `<option value="${m}" ${m===meal?'selected':''}>${m}</option>`).join('')}
        </select>
      </div>
      <button class="btn btn-primary btn-block" id="save-edit">Save</button>
      <button class="btn btn-secondary btn-block mt-8" id="dup-edit">Duplicate</button>
      <button class="btn btn-danger btn-block mt-8" id="del-edit">Delete</button>
    `, () => {
      document.getElementById('modal-close').onclick = () => this.hideModal();
      document.getElementById('save-edit').onclick = () => {
        const newS = parseFloat(document.getElementById('edit-servings').value) || 1;
        if (newS <= 0) { this.toast('Invalid serving'); return; }
        const oldS = item.servings || 1;
        const ratio = newS / oldS;
        item.servings = newS;
        item.calories *= ratio;
        item.protein *= ratio;
        item.carbs *= ratio;
        item.fat *= ratio;
        const newMeal = document.getElementById('edit-meal').value;
        if (newMeal !== meal) {
          log[meal].splice(parseInt(idx), 1);
          if (!log[newMeal]) log[newMeal] = [];
          log[newMeal].push(item);
        }
        DB.saveFoodLog(todayStr(), log);
        this.hideModal();
        this.toast('Updated');
        this.render();
      };
      document.getElementById('dup-edit').onclick = () => {
        const copy = { ...item, id: generateId() };
        log[meal].push(copy);
        DB.saveFoodLog(todayStr(), log);
        this.hideModal();
        this.toast('Duplicated');
        this.render();
      };
      document.getElementById('del-edit').onclick = () => {
        this.deleteFood(meal, idx);
        this.hideModal();
      };
    });
  },

  deleteFood(meal, idx) {
    const log = DB.getFoodLog(todayStr());
    log[meal].splice(parseInt(idx), 1);
    DB.saveFoodLog(todayStr(), log);
    this.toast('Food removed');
    this.render();
  },

  showBuildMeal(defaultMeal) {
    const rem = getRemainingMacros();
    const targetCal = Math.min(Math.max(rem.calories || 500, 300), 800);
    const minP = Math.min(Math.max(rem.protein || 30, 20), 50);
    let cal = targetCal;
    let prot = minP;

    const render = () => {
      const options = buildMealOptions(cal, prot, 4);
      let cards = options.map((opt, i) => `
        <div class="card" style="padding:12px;">
          <div style="font-weight:600;margin-bottom:4px;">Option ${i+1}: ${opt.name}</div>
          <div class="text-secondary" style="font-size:13px;margin-bottom:8px;">~${opt.calories} cal · ${opt.protein}g protein · ${opt.carbs}g carbs · ${opt.fat}g fat</div>
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">
            ${opt.items.map(it => `${it.name} (${it.servings}×)`).join(' · ')}
          </div>
          <button class="btn btn-sm btn-primary" data-opt="${i}">Add to log</button>
        </div>
      `).join('') || '<p class="text-muted">No combinations found. Try adjusting targets.</p>';

      this.showModal(`
        <div class="modal-header">
          <div class="modal-title">Build a Meal</div>
          <button class="modal-close" id="modal-close">×</button>
        </div>
        <p class="text-secondary mb-12" style="font-size:13px;">Based on remaining macros. Adjust targets below.</p>
        <div class="input-row">
          <div class="input-group"><label class="input-label">Calories ~</label><input type="number" class="input" id="bm-cal" value="${cal}"></div>
          <div class="input-group"><label class="input-label">Min protein</label><input type="number" class="input" id="bm-prot" value="${prot}"></div>
        </div>
        <button class="btn btn-secondary btn-block mb-12" id="bm-refresh">Refresh options</button>
        <div style="max-height:45vh;overflow-y:auto;">${cards}</div>
      `, () => {
        document.getElementById('modal-close').onclick = () => this.hideModal();
        document.getElementById('bm-refresh').onclick = () => {
          cal = parseInt(document.getElementById('bm-cal').value) || 500;
          prot = parseInt(document.getElementById('bm-prot').value) || 30;
          render();
        };
        document.querySelectorAll('[data-opt]').forEach(btn => {
          btn.onclick = () => {
            const opt = options[parseInt(btn.dataset.opt)];
            const meal = defaultMeal || 'lunch';
            opt.items.forEach(it => {
              this.logFoodItem(meal, {
                foodId: it.foodId, name: it.name, servings: it.servings, servingLabel: it.servingLabel,
                calories: it.calories, protein: it.protein, carbs: it.carbs, fat: it.fat
              });
            });
            this.hideModal();
            this.toast('Meal logged');
            this.render();
          };
        });
      });
    };
    render();
  },

  showRecipes(logMeal) {
    const recipes = DB.getRecipes();
    let list = recipes.map(r => `
      <div class="card" style="padding:12px;">
        <div style="font-weight:600;">${r.name}</div>
        <div class="text-secondary" style="font-size:13px;margin:4px 0;">${r.calories} cal · ${r.protein}g protein · ${r.items.length} ingredients</div>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-sm btn-primary" data-log-recipe="${r.id}">Log 1 serving</button>
          <button class="btn btn-sm btn-danger" data-del-recipe="${r.id}">Delete</button>
        </div>
      </div>
    `).join('') || '<p class="text-muted" style="padding:16px;">No recipes yet. Save a multi-item meal as a recipe from Build a Meal or create one below.</p>';

    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">Recipes</div>
        <button class="modal-close" id="modal-close">×</button>
      </div>
      <button class="btn btn-secondary btn-block mb-12" id="new-recipe">+ New Recipe</button>
      <div style="max-height:55vh;overflow-y:auto;">${list}</div>
    `, () => {
      document.getElementById('modal-close').onclick = () => this.hideModal();
      document.getElementById('new-recipe').onclick = () => { this.hideModal(); this.showCreateRecipe(); };
      document.querySelectorAll('[data-log-recipe]').forEach(btn => {
        btn.onclick = () => {
          this.logRecipe(btn.dataset.logRecipe, logMeal || 'lunch');
          this.hideModal();
        };
      });
      document.querySelectorAll('[data-del-recipe]').forEach(btn => {
        btn.onclick = () => {
          DB.deleteRecipe(btn.dataset.delRecipe);
          this.hideModal();
          this.showRecipes(logMeal);
        };
      });
    });
  },

  logRecipe(id, meal) {
    const r = DB.getRecipes().find(x => x.id === id);
    if (!r) return;
    r.items.forEach(it => {
      this.logFoodItem(meal, { ...it, id: generateId() });
    });
    this.toast(`Logged ${r.name}`);
    this.render();
  },

  showCreateRecipe() {
    let items = [];
    const render = () => {
      const totals = items.reduce((a, it) => ({
        cal: a.cal + it.calories, p: a.p + it.protein, c: a.c + it.carbs, f: a.f + it.fat
      }), { cal: 0, p: 0, c: 0, f: 0 });
      this.showModal(`
        <div class="modal-header">
          <div class="modal-title">New Recipe</div>
          <button class="modal-close" id="modal-close">×</button>
        </div>
        <div class="input-group"><label class="input-label">Recipe name</label><input type="text" class="input" id="rc-name" placeholder="Chicken Rice Bowl"></div>
        <div class="card" style="padding:10px;margin-bottom:8px;">${Math.round(totals.cal)} cal · ${Math.round(totals.p)}p · ${Math.round(totals.c)}c · ${Math.round(totals.f)}f</div>
        <div style="margin-bottom:8px;">${items.map((it,i) => `<div class="food-item"><div class="food-item-name">${it.name} × ${it.servings}</div><button class="btn btn-sm btn-ghost" data-rm="${i}">×</button></div>`).join('') || '<p class="text-muted">No ingredients</p>'}</div>
        <button class="btn btn-secondary btn-block mb-8" id="rc-add">+ Add ingredient</button>
        <button class="btn btn-primary btn-block" id="rc-save">Save Recipe</button>
      `, () => {
        document.getElementById('modal-close').onclick = () => this.hideModal();
        document.getElementById('rc-add').onclick = () => {
          this.showExercisePickerFood((food, serv) => {
            items.push({
              foodId: food.id, name: food.name, servings: serv, servingLabel: food.serving,
              calories: food.calories * serv, protein: food.protein * serv, carbs: food.carbs * serv, fat: food.fat * serv
            });
            render();
          });
        };
        document.querySelectorAll('[data-rm]').forEach(btn => {
          btn.onclick = () => { items.splice(parseInt(btn.dataset.rm), 1); render(); };
        });
        document.getElementById('rc-save').onclick = () => {
          const name = document.getElementById('rc-name').value.trim();
          if (!name || items.length === 0) { this.toast('Name and ingredients required'); return; }
          DB.saveRecipe({
            id: generateId(), name, items,
            calories: Math.round(totals.cal), protein: Math.round(totals.p),
            carbs: Math.round(totals.c), fat: Math.round(totals.f)
          });
          this.hideModal();
          this.toast('Recipe saved');
        };
      });
    };
    render();
  },

  showExercisePickerFood(callback) {
    // reuse food search for recipe ingredients
    let search = '';
    const render = () => {
      const foods = DB.getAllFoods().filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()));
      this.showModal(`
        <div class="modal-header"><div class="modal-title">Add ingredient</div><button class="modal-close" id="modal-close">×</button></div>
        <div class="search-bar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="search" id="ing-search" value="${search}" placeholder="Search..."></div>
        <div style="max-height:40vh;overflow-y:auto;">
          ${foods.slice(0,30).map(f => `<div class="list-item" data-fid="${f.id}"><div class="list-item-content"><div class="list-item-title">${f.name}</div><div class="list-item-sub">${f.calories} cal</div></div></div>`).join('')}
        </div>
      `, () => {
        document.getElementById('modal-close').onclick = () => this.hideModal();
        document.getElementById('ing-search').oninput = e => { search = e.target.value; render(); };
        document.querySelectorAll('[data-fid]').forEach(el => {
          el.onclick = () => {
            const food = DB.getAllFoods().find(f => f.id === el.dataset.fid);
            this.hideModal();
            // ask servings
            this.showModal(`
              <div class="modal-header"><div class="modal-title">${food.name}</div><button class="modal-close" id="modal-close">×</button></div>
              <div class="input-group"><label class="input-label">Servings</label><input type="number" class="input" id="ing-s" value="1" min="0.1" step="0.1"></div>
              <button class="btn btn-primary btn-block" id="ing-ok">Add</button>
            `, () => {
              document.getElementById('modal-close').onclick = () => this.hideModal();
              document.getElementById('ing-ok').onclick = () => {
                const s = parseFloat(document.getElementById('ing-s').value) || 1;
                this.hideModal();
                callback(food, s);
              };
            });
          };
        });
      });
    };
    render();
  },

  showScanMeal(meal) {
    const cfg = DB.getApiConfig();
    const hasKey = !!(cfg.visionApiKey && cfg.visionApiKey.trim());

    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">Scan Meal</div>
        <button class="modal-close" id="modal-close">×</button>
      </div>
      <p class="text-secondary mb-12" style="font-size:13px;">
        ${hasKey
          ? `Using <strong>${cfg.visionProvider === 'gemini' ? 'Gemini' : 'OpenAI'}</strong> vision. Estimates are approximate — always review before logging.`
          : 'No vision API key set. Add one in Profile → API, or enter foods manually.'}
      </p>
      <input type="file" accept="image/*" capture="environment" id="meal-photo" class="input" style="padding:8px;">
      <div id="scan-preview" class="mt-12"></div>
      <button class="btn btn-primary btn-block mt-12" id="analyze-meal" disabled>
        ${hasKey ? 'Analyze Photo' : 'Analyze (needs API key)'}
      </button>
      <button class="btn btn-secondary btn-block mt-8" id="manual-meal">Enter foods manually</button>
      ${!hasKey ? '<button class="btn btn-ghost btn-block mt-8" id="go-api">Set API key in Profile</button>' : ''}
    `, () => {
      document.getElementById('modal-close').onclick = () => this.hideModal();
      let fileData = null;
      document.getElementById('meal-photo').onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 8 * 1024 * 1024) {
          this.toast('Image too large — try under 8MB');
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          fileData = reader.result;
          document.getElementById('scan-preview').innerHTML =
            `<img src="${fileData}" style="width:100%;border-radius:12px;max-height:200px;object-fit:cover;">`;
          document.getElementById('analyze-meal').disabled = !hasKey;
        };
        reader.readAsDataURL(file);
      };
      document.getElementById('analyze-meal').onclick = async () => {
        if (!fileData) { this.toast('Choose a photo first'); return; }
        if (!hasKey) { this.toast('Set an API key in Profile'); return; }
        const btn = document.getElementById('analyze-meal');
        btn.disabled = true;
        btn.textContent = 'Analyzing…';
        try {
          const items = await this.analyzeMealImage(fileData);
          if (!items || items.length === 0) {
            this.toast('No foods detected — add manually');
            this.showScanMealReview(meal, []);
          } else {
            this.hideModal();
            this.showScanMealReview(meal, items);
          }
        } catch (err) {
          console.error(err);
          this.toast(err.message || 'Analysis failed');
          btn.disabled = false;
          btn.textContent = 'Analyze Photo';
        }
      };
      document.getElementById('manual-meal').onclick = () => {
        this.hideModal();
        this.showAddFood(meal);
      };
      const goApi = document.getElementById('go-api');
      if (goApi) goApi.onclick = () => { this.hideModal(); this.navigate('profile'); };
    });
  },

  async analyzeMealImage(dataUrl) {
    const cfg = DB.getApiConfig();
    const key = (cfg.visionApiKey || '').trim();
    if (!key) throw new Error('No API key');

    const prompt = `You are a nutrition assistant. Look at this meal photo and identify distinct food items with estimated portions.
Return ONLY valid JSON (no markdown) in this exact shape:
{"items":[{"name":"Chicken breast","portion":"6 oz","calories":280,"protein":52,"carbs":0,"fat":6},{"name":"White rice","portion":"1 cup","calories":200,"protein":4,"carbs":45,"fat":0}]}
Rules:
- Estimate realistic calories and macros for each item
- Use common serving descriptions in "portion"
- Include every visible food if possible
- If unsure, still estimate and keep names simple
- Numbers must be numbers, not strings
- Never invent items that are clearly not in the image`;

    const provider = cfg.visionProvider || 'openai';

    if (provider === 'gemini') {
      const endpoint = (cfg.visionEndpoint || '').trim() ||
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`;
      // dataUrl is data:image/jpeg;base64,....
      const base64 = dataUrl.split(',')[1] || dataUrl;
      const mime = (dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);/) || [])[1] || 'image/jpeg';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mime, data: base64 } }
            ]
          }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 1024 }
        })
      });
      if (!res.ok) {
        // Retry with alternate current model IDs if this one 404s
        const t = await res.text();
        if (res.status === 404 && !(cfg.visionEndpoint || '').trim()) {
          const alts = ['gemini-2.0-flash', 'gemini-2.5-flash-preview-05-20', 'gemini-flash-latest', 'gemini-2.0-flash-001'];
          let last = t;
          for (const m of alts) {
            const altUrl = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(key)}`;
            const r2 = await fetch(altUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{
                  parts: [
                    { text: prompt },
                    { inline_data: { mime_type: mime, data: base64 } }
                  ]
                }],
                generationConfig: { temperature: 0.2, maxOutputTokens: 1024 }
              })
            });
            if (!r2.ok) { last = await r2.text(); continue; }
            const d2 = await r2.json();
            const tx = d2?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
            return this.parseVisionFoodJson(tx);
          }
          throw new Error('Gemini error: ' + (last.slice(0, 140) || 'model not found'));
        }
        throw new Error('Gemini error: ' + (t.slice(0, 140) || res.status));
      }
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
      return this.parseVisionFoodJson(text);
    }

    // OpenAI-compatible (OpenAI, or custom endpoint)
    const endpoint = (cfg.visionEndpoint || '').trim() || 'https://api.openai.com/v1/chat/completions';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: dataUrl, detail: 'low' } }
            ]
          }
        ]
      })
    });
    if (!res.ok) {
      const t = await res.text();
      let msg = 'OpenAI error ' + res.status;
      try {
        const j = JSON.parse(t);
        if (j.error?.message) msg = j.error.message;
      } catch (_) {}
      throw new Error(msg);
    }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || '';
    return this.parseVisionFoodJson(text);
  },

  parseVisionFoodJson(text) {
    if (!text) return [];
    let raw = text.trim();
    // strip markdown fences if model added them
    const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence) raw = fence[1].trim();
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start >= 0 && end > start) raw = raw.slice(start, end + 1);
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error('Vision JSON parse failed', text);
      throw new Error('Could not parse AI response — try again or enter manually');
    }
    const items = parsed.items || parsed.foods || [];
    return items.map(it => ({
      name: String(it.name || 'Food').slice(0, 80),
      portion: String(it.portion || it.serving || '1 serving').slice(0, 40),
      servings: 1,
      servingLabel: String(it.portion || it.serving || '1 serving').slice(0, 40),
      calories: Math.max(0, Math.round(Number(it.calories) || 0)),
      protein: Math.max(0, Math.round((Number(it.protein) || 0) * 10) / 10),
      carbs: Math.max(0, Math.round((Number(it.carbs) || 0) * 10) / 10),
      fat: Math.max(0, Math.round((Number(it.fat) || 0) * 10) / 10),
      source: 'vision'
    })).filter(it => it.name && (it.calories > 0 || it.protein > 0));
  },

  showScanMealReview(meal, detectedItems) {
    // detectedItems: [{name, calories, protein, carbs, fat, servings, note}]
    let items = detectedItems.length ? detectedItems : [];
    const render = () => {
      const totals = items.reduce((a, it) => ({
        cal: a.cal + (it.calories || 0), p: a.p + (it.protein || 0),
        c: a.c + (it.carbs || 0), f: a.f + (it.fat || 0)
      }), { cal: 0, p: 0, c: 0, f: 0 });
      this.showModal(`
        <div class="modal-header">
          <div class="modal-title">Review Meal</div>
          <button class="modal-close" id="modal-close">×</button>
        </div>
        <div class="card" style="padding:10px;margin-bottom:12px;border-color:var(--warning);">
          <strong style="color:var(--warning);">AI estimate — review before logging</strong>
          <p class="text-muted" style="font-size:12px;margin-top:4px;">${items.length ? 'Edit any values before logging. AI estimates are approximate.' : 'Add foods from the database below.'}</p>
        </div>
        <div class="card" style="padding:10px;margin-bottom:12px;">
          Total: ${Math.round(totals.cal)} cal · ${Math.round(totals.p)}p · ${Math.round(totals.c)}c · ${Math.round(totals.f)}f
        </div>
        ${items.map((it, i) => `
          <div class="card" style="padding:10px;margin-bottom:8px;">
            <div class="flex-between mb-8">
              <div style="font-weight:600;">${it.name}</div>
              <button class="btn btn-sm btn-ghost" data-rm-scan="${i}" style="color:var(--danger);">×</button>
            </div>
            <div class="text-muted" style="font-size:12px;margin-bottom:8px;">${it.portion || it.servingLabel || ''}</div>
            <div class="input-row">
              <div class="input-group" style="margin:0;"><label class="input-label">Cal</label>
                <input type="number" class="input" data-scan-field="calories" data-scan-i="${i}" value="${Math.round(it.calories)}" min="0"></div>
              <div class="input-group" style="margin:0;"><label class="input-label">P</label>
                <input type="number" class="input" data-scan-field="protein" data-scan-i="${i}" value="${it.protein}" min="0" step="0.1"></div>
              <div class="input-group" style="margin:0;"><label class="input-label">C</label>
                <input type="number" class="input" data-scan-field="carbs" data-scan-i="${i}" value="${it.carbs}" min="0" step="0.1"></div>
              <div class="input-group" style="margin:0;"><label class="input-label">F</label>
                <input type="number" class="input" data-scan-field="fat" data-scan-i="${i}" value="${it.fat}" min="0" step="0.1"></div>
            </div>
          </div>
        `).join('')}
        <button class="btn btn-secondary btn-block mb-8" id="add-scan-food">+ Add food from database</button>
        <button class="btn btn-primary btn-block" id="confirm-scan" ${items.length===0?'disabled':''}>Add to ${meal}</button>
      `, () => {
        document.getElementById('modal-close').onclick = () => this.hideModal();
        document.querySelectorAll('[data-rm-scan]').forEach(btn => {
          btn.onclick = () => { items.splice(parseInt(btn.dataset.rmScan), 1); render(); };
        });
        document.querySelectorAll('[data-scan-field]').forEach(inp => {
          inp.onchange = () => {
            const i = parseInt(inp.dataset.scanI);
            const field = inp.dataset.scanField;
            let v = parseFloat(inp.value) || 0;
            if (v < 0) v = 0;
            items[i][field] = v;
            // refresh totals only - lightweight re-render
            render();
          };
        });
        document.getElementById('add-scan-food').onclick = () => {
          this.showExercisePickerFood((food, serv) => {
            items.push({
              name: food.name, foodId: food.id, servings: serv, servingLabel: food.serving,
              calories: food.calories * serv, protein: food.protein * serv,
              carbs: food.carbs * serv, fat: food.fat * serv
            });
            render();
          });
        };
        document.getElementById('confirm-scan').onclick = () => {
          items.forEach(it => this.logFoodItem(meal, { id: generateId(), ...it }));
          this.hideModal();
          this.toast('Meal logged');
          this.render();
        };
      });
    };
    render();
  },

  showScanLabel() {
    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">Scan Nutrition Label</div>
        <button class="modal-close" id="modal-close">×</button>
      </div>
      <p class="text-secondary mb-12" style="font-size:13px;">Photo optional. Enter values from the label — saved as a reusable custom food.</p>
      <input type="file" accept="image/*" capture="environment" id="label-photo" class="input mb-8" style="padding:8px;">
      <div id="label-preview"></div>
      <div class="input-group"><label class="input-label">Food name</label><input type="text" class="input" id="lb-name" placeholder="Product name"></div>
      <div class="input-group"><label class="input-label">Serving size</label><input type="text" class="input" id="lb-serving" placeholder="e.g. 1 cup (240g)"></div>
      <div class="input-row">
        <div class="input-group"><label class="input-label">Calories</label><input type="number" class="input" id="lb-cal" min="0"></div>
        <div class="input-group"><label class="input-label">Protein (g)</label><input type="number" class="input" id="lb-p" min="0" step="0.1"></div>
      </div>
      <div class="input-row">
        <div class="input-group"><label class="input-label">Carbs (g)</label><input type="number" class="input" id="lb-c" min="0" step="0.1"></div>
        <div class="input-group"><label class="input-label">Fat (g)</label><input type="number" class="input" id="lb-f" min="0" step="0.1"></div>
      </div>
      <div class="input-row">
        <div class="input-group"><label class="input-label">Fiber (g)</label><input type="number" class="input" id="lb-fiber" min="0" step="0.1"></div>
        <div class="input-group"><label class="input-label">Sodium (mg)</label><input type="number" class="input" id="lb-na" min="0"></div>
      </div>
      <button class="btn btn-primary btn-block" id="lb-save">Save as Custom Food</button>
      <button class="btn btn-secondary btn-block mt-8" id="lb-save-log">Save & Log to Lunch</button>
    `, () => {
      document.getElementById('modal-close').onclick = () => this.hideModal();
      document.getElementById('label-photo').onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          document.getElementById('label-preview').innerHTML = `<img src="${reader.result}" style="width:100%;border-radius:12px;max-height:160px;object-fit:cover;margin-bottom:12px;">`;
        };
        reader.readAsDataURL(file);
      };
      const saveFood = () => {
        const name = document.getElementById('lb-name').value.trim();
        if (!name) { this.toast('Enter a name'); return null; }
        const food = {
          id: 'custom-' + generateId(),
          name,
          serving: document.getElementById('lb-serving').value || '1 serving',
          calories: parseFloat(document.getElementById('lb-cal').value) || 0,
          protein: parseFloat(document.getElementById('lb-p').value) || 0,
          carbs: parseFloat(document.getElementById('lb-c').value) || 0,
          fat: parseFloat(document.getElementById('lb-f').value) || 0,
          fiber: parseFloat(document.getElementById('lb-fiber').value) || 0,
          sodium: parseFloat(document.getElementById('lb-na').value) || 0
        };
        DB.saveCustomFood(food);
        return food;
      };
      document.getElementById('lb-save').onclick = () => {
        if (saveFood()) { this.hideModal(); this.toast('Custom food saved'); }
      };
      document.getElementById('lb-save-log').onclick = () => {
        const food = saveFood();
        if (!food) return;
        this.logFoodItem('lunch', {
          foodId: food.id, name: food.name, servings: 1, servingLabel: food.serving,
          calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat
        });
        this.hideModal();
        this.toast('Saved & logged');
        this.render();
      };
    });
  },

  showScanBarcode(meal) {
    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">Barcode</div>
        <button class="modal-close" id="modal-close">×</button>
      </div>
      <p class="text-secondary mb-12" style="font-size:13px;">Barcode lookup requires an API key (Open Food Facts or similar). Enter a barcode manually to search when configured, or create a custom food.</p>
      <div class="input-group">
        <label class="input-label">Barcode number</label>
        <input type="text" class="input" id="bc-code" inputmode="numeric" placeholder="e.g. 0012345678905">
      </div>
      <button class="btn btn-primary btn-block" id="bc-lookup">Look Up</button>
      <button class="btn btn-secondary btn-block mt-8" id="bc-custom">Create Custom Food Instead</button>
      <p class="text-muted mt-12" style="font-size:12px;">Architecture is ready for Open Food Facts / UPC API. Configure in Profile when available.</p>
    `, () => {
      document.getElementById('modal-close').onclick = () => this.hideModal();
      document.getElementById('bc-lookup').onclick = () => {
        const code = document.getElementById('bc-code').value.trim();
        if (!code) { this.toast('Enter a barcode'); return; }
        // Attempt Open Food Facts (public, no key) — real API
        this.toast('Looking up…');
        fetch(`https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(code)}.json`)
          .then(r => r.json())
          .then(data => {
            if (data.status !== 1 || !data.product) {
              this.toast('Product not found');
              return;
            }
            const p = data.product;
            const n = p.nutriments || {};
            const food = {
              id: 'barcode-' + code,
              name: p.product_name || p.generic_name || 'Unknown product',
              serving: p.serving_size || '100g',
              calories: Math.round(n['energy-kcal_serving'] || n['energy-kcal_100g'] || 0),
              protein: Math.round((n.proteins_serving || n.proteins_100g || 0) * 10) / 10,
              carbs: Math.round((n.carbohydrates_serving || n.carbohydrates_100g || 0) * 10) / 10,
              fat: Math.round((n.fat_serving || n.fat_100g || 0) * 10) / 10
            };
            DB.saveCustomFood(food);
            this.hideModal();
            // show confirm
            this.showModal(`
              <div class="modal-header"><div class="modal-title">${food.name}</div><button class="modal-close" id="modal-close">×</button></div>
              <div class="card" style="padding:12px;margin-bottom:12px;">${food.calories} cal · ${food.protein}p · ${food.carbs}c · ${food.fat}f<br><span class="text-muted">per ${food.serving}</span></div>
              <div class="input-group"><label class="input-label">Servings</label><input type="number" class="input" id="bc-s" value="1" min="0.1" step="0.1"></div>
              <button class="btn btn-primary btn-block" id="bc-log">Log Food</button>
            `, () => {
              document.getElementById('modal-close').onclick = () => this.hideModal();
              document.getElementById('bc-log').onclick = () => {
                const s = parseFloat(document.getElementById('bc-s').value) || 1;
                this.logFoodItem(meal, {
                  foodId: food.id, name: food.name, servings: s, servingLabel: food.serving,
                  calories: food.calories * s, protein: food.protein * s, carbs: food.carbs * s, fat: food.fat * s
                });
                this.hideModal();
                this.toast('Logged');
                this.render();
              };
            });
          })
          .catch(() => this.toast('Lookup failed — check connection'));
      };
      document.getElementById('bc-custom').onclick = () => {
        this.hideModal();
        this.showCreateCustomFood(meal);
      };
    });
  },

  showNutritionHistory() {
    const targets = getNutritionTargets();
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
      const m = getDayMacros(ds);
      days.push({ date: ds, label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), short: d.toLocaleDateString('en-US', { weekday: 'short' }), ...m });
    }
    const last7 = days.slice(-7);
    const maxCal = Math.max(...last7.map(d => d.calories), targets.calories, 1);
    let range = '7';

    const render = () => {
      const view = range === '7' ? last7 : days;
      const chartDays = range === '7' ? last7 : days.slice(-14);
      const maxC = Math.max(...chartDays.map(d => d.calories), 1);

      this.showModal(`
        <div class="modal-header">
          <div class="modal-title">Nutrition History</div>
          <button class="modal-close" id="modal-close">×</button>
        </div>
        <div class="tabs mb-12">
          <button class="tab ${range==='7'?'active':''}" data-range="7">7 days</button>
          <button class="tab ${range==='30'?'active':''}" data-range="30">30 days</button>
        </div>
        <div class="chart-bar" style="height:100px;">
          ${chartDays.map(d => `
            <div class="chart-col">
              <div class="chart-bar-fill" style="height:${d.calories? (d.calories/maxC)*100 : 2}%;opacity:${d.calories?1:0.3}"></div>
              <div class="chart-label">${range==='7'?d.short:d.short[0]}</div>
            </div>
          `).join('')}
        </div>
        <p class="text-muted" style="font-size:12px;margin:8px 0 12px;">Tap a day for full log. Only real logged data.</p>
        <div style="max-height:40vh;overflow-y:auto;">
          ${[...view].reverse().map(d => `
            <div class="list-item" data-day="${d.date}">
              <div class="list-item-content">
                <div class="list-item-title">${d.label}</div>
                <div class="list-item-sub">${d.calories} cal · ${d.protein}p · ${d.carbs}c · ${d.fat}f</div>
              </div>
            </div>
          `).join('')}
        </div>
      `, () => {
        document.getElementById('modal-close').onclick = () => this.hideModal();
        document.querySelectorAll('[data-range]').forEach(btn => {
          btn.onclick = () => { range = btn.dataset.range; render(); };
        });
        document.querySelectorAll('[data-day]').forEach(el => {
          el.onclick = () => this.showDayFoodLog(el.dataset.day);
        });
      });
    };
    render();
  },

  showDayFoodLog(dateStr) {
    const log = DB.getFoodLog(dateStr);
    const m = getDayMacros(dateStr);
    const meals = ['breakfast','lunch','dinner','snacks'];
    const labels = { breakfast:'Breakfast', lunch:'Lunch', dinner:'Dinner', snacks:'Snacks' };
    let body = '';
    meals.forEach(meal => {
      const items = log[meal] || [];
      if (!items.length) return;
      body += `<h3 style="margin:12px 0 6px;">${labels[meal]}</h3>`;
      items.forEach(it => {
        body += `<div class="food-item"><div class="food-item-info"><div class="food-item-name">${it.name}</div><div class="food-item-macros">${Math.round(it.calories)} cal · ${Math.round(it.protein)}p</div></div></div>`;
      });
    });
    if (!body) body = '<p class="text-muted">No food logged this day.</p>';

    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">${formatDate(dateStr)}</div>
        <button class="modal-close" id="modal-close">×</button>
      </div>
      <div class="card" style="padding:10px;margin-bottom:12px;">${m.calories} cal · ${m.protein}p · ${m.carbs}c · ${m.fat}f</div>
      ${body}
    `, () => {
      document.getElementById('modal-close').onclick = () => this.hideModal();
    });
  },

  showNutritionAssistant() {
    const rem = getRemainingMacros();
    let answer = null;

    const render = () => {
      this.showModal(`
        <div class="modal-header">
          <div class="modal-title">Nutrition Help</div>
          <button class="modal-close" id="modal-close">×</button>
        </div>
        <p class="text-secondary mb-12" style="font-size:13px;">Answers use your real targets and today's log — not generative AI.</p>
        <div class="card" style="padding:10px;margin-bottom:12px;font-size:13px;">
          Remaining today: <strong>${rem.calories}</strong> cal · <strong>${rem.protein}g</strong> protein
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">
          <button class="btn btn-sm btn-secondary" data-q="How can I get more protein?">More protein</button>
          <button class="btn btn-sm btn-secondary" data-q="What can I eat with calories left?">Calories left</button>
          <button class="btn btn-sm btn-secondary" data-q="Give me a high-protein breakfast">Breakfast ideas</button>
          <button class="btn btn-sm btn-secondary" data-q="What should I eat tonight?">Tonight</button>
        </div>
        <div class="input-group">
          <input type="text" class="input" id="na-q" placeholder="Or type a question…">
        </div>
        <button class="btn btn-primary btn-block mb-12" id="na-ask">Ask</button>
        <div id="na-answer">${answer ? `
          <div class="card" style="padding:12px;">
            <p style="font-size:14px;margin-bottom:8px;">${answer.text}</p>
            ${(answer.lines||[]).map(l => `<div style="font-size:13px;color:var(--text-secondary);">${l}</div>`).join('')}
            ${(answer.suggestions||[]).slice(0,4).map(r => `
              <div class="list-item" style="margin-top:6px;">
                <div class="list-item-content">
                  <div class="list-item-title">${r.food.name}</div>
                  <div class="list-item-sub">${r.calories} cal · ${r.protein}p · ${r.reason||''}</div>
                </div>
                <button class="btn btn-sm btn-secondary" data-qa-food="${r.food.id}" data-qa-serv="${r.servings||1}">Add</button>
              </div>
            `).join('')}
          </div>
        ` : ''}</div>
      `, () => {
        document.getElementById('modal-close').onclick = () => this.hideModal();
        const ask = (q) => {
          answer = answerNutritionQuestion(q);
          render();
        };
        document.querySelectorAll('[data-q]').forEach(btn => {
          btn.onclick = () => ask(btn.dataset.q);
        });
        document.getElementById('na-ask').onclick = () => {
          ask(document.getElementById('na-q').value);
        };
        document.querySelectorAll('[data-qa-food]').forEach(btn => {
          btn.onclick = () => {
            this.quickLogRecommendation(btn.dataset.qaFood, btn.dataset.qaServ, 'snacks');
            this.hideModal();
          };
        });
      });
    };
    render();
  },

  showWeeklyCheckIn() {
    const rem = getRemainingMacros();
    const settings = DB.getSettings();
    // Adherence last 7 days
    let daysLogged = 0, calSum = 0, protSum = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
      const m = getDayMacros(ds);
      if (m.calories > 0) {
        daysLogged++;
        calSum += m.calories;
        protSum += m.protein;
      }
    }
    const avgCal = daysLogged ? Math.round(calSum / daysLogged) : 0;
    const avgP = daysLogged ? Math.round(protSum / daysLogged) : 0;
    const target = settings.calorieGoal;
    let adherenceNote = daysLogged === 0
      ? 'No nutrition logs this week yet.'
      : `You logged ${daysLogged}/7 days. Avg ${avgCal} cal (target ${target}), avg ${avgP}g protein.`;

    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">Weekly Check-in</div>
        <button class="modal-close" id="modal-close">×</button>
      </div>
      <p class="text-secondary mb-12" style="font-size:13px;">${adherenceNote}</p>
      <div class="input-group">
        <label class="input-label">Current weight (${settings.units})</label>
        <input type="number" class="input" id="ci-weight" value="${settings.bodyWeight || ''}" min="0" step="0.1">
      </div>
      <div class="input-group">
        <label class="input-label">How was adherence this week?</label>
        <select class="select" id="ci-adhere">
          <option value="good">Mostly on target</option>
          <option value="ok">Mixed</option>
          <option value="low">Often off target</option>
        </select>
      </div>
      <div class="input-group">
        <label class="input-label">Energy / training</label>
        <select class="select" id="ci-energy">
          <option value="good">Good</option>
          <option value="ok">Okay</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div class="input-group">
        <label class="input-label">Hunger</label>
        <select class="select" id="ci-hunger">
          <option value="managed">Managed</option>
          <option value="high">Often hungry</option>
          <option value="low">Rarely hungry</option>
        </select>
      </div>
      <button class="btn btn-primary btn-block" id="ci-save">Save Check-in</button>
      <div id="ci-rec" class="mt-12"></div>
    `, () => {
      document.getElementById('modal-close').onclick = () => this.hideModal();
      document.getElementById('ci-save').onclick = () => {
        const w = parseFloat(document.getElementById('ci-weight').value) || 0;
        if (w > 0) {
          settings.bodyWeight = w;
          DB.addWeightEntry(w);
        }
        settings.lastCheckIn = todayStr();
        DB.saveSettings(settings);
        const adhere = document.getElementById('ci-adhere').value;
        const energy = document.getElementById('ci-energy').value;
        const hunger = document.getElementById('ci-hunger').value;
        let rec = '';
        if (daysLogged >= 3 && avgCal > target * 1.15 && settings.nutritionGoal === 'cut') {
          rec = 'Your logged intake has been above target on average. If fat loss is the goal, consider a small, deliberate calorie reduction — only if adherence feels sustainable.';
        } else if (daysLogged >= 3 && avgCal < target * 0.85 && energy === 'low') {
          rec = 'Intake looks below target and energy is low. Consider eating closer to your calorie target, especially around training.';
        } else if (hunger === 'high' && avgP < settings.proteinGoal * 0.85) {
          rec = 'Hunger is high and protein has been below target. Prioritizing protein at each meal often helps.';
        } else if (adhere === 'good') {
          rec = 'Nice consistency. Keep logging — Forge will keep recommendations tied to your real remaining macros.';
        } else {
          rec = 'Focus on logging consistently this week. Recommendations improve when the data is complete.';
        }
        document.getElementById('ci-rec').innerHTML = `<div class="card" style="padding:12px;"><strong>Suggestion</strong><p style="font-size:13px;margin-top:6px;color:var(--text-secondary);">${rec}</p><p style="font-size:11px;color:var(--text-muted);margin-top:8px;">Targets are never changed automatically.</p></div>`;
        this.toast('Check-in saved');
      };
    });
  },

  showLogWeight() {
    const settings = DB.getSettings();
    const log = DB.getWeightLog().slice(-10).reverse();
    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">Body Weight</div>
        <button class="modal-close" id="modal-close">×</button>
      </div>
      <div class="input-group">
        <label class="input-label">Today's weight (${settings.units})</label>
        <input type="number" class="input" id="wt-val" value="${settings.bodyWeight || ''}" min="0" step="0.1">
      </div>
      <button class="btn btn-primary btn-block mb-16" id="wt-save">Save</button>
      <div class="card-title">Recent</div>
      ${log.length ? log.map(e => `<div class="list-item" style="cursor:default;"><div class="list-item-content"><div class="list-item-title">${e.weight} ${settings.units}</div><div class="list-item-sub">${formatDate(e.date)}</div></div></div>`).join('') : '<p class="text-muted">No weight entries yet.</p>'}
    `, () => {
      document.getElementById('modal-close').onclick = () => this.hideModal();
      document.getElementById('wt-save').onclick = () => {
        const w = parseFloat(document.getElementById('wt-val').value);
        if (!w || w <= 0) { this.toast('Enter a valid weight'); return; }
        settings.bodyWeight = w;
        DB.saveSettings(settings);
        DB.addWeightEntry(w);
        this.hideModal();
        this.toast('Weight saved');
        this.render();
      };
    });
  },

  // ========== PROGRESS ==========
  // ========== PROGRESS ==========
  // ========== PROGRESS ==========
  renderProgress() {
    const history = DB.getHistory();
    const settings = DB.getSettings();
    const prs = DB.getPRs();
    const weekCount = getWeekWorkoutCount();

    // Last 7 days volume
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
      const dayWorkouts = history.filter(h => h.date === ds);
      const vol = dayWorkouts.reduce((s, h) => s + (h.totalVolume || 0), 0);
      days.push({ date: ds, label: d.toLocaleDateString('en-US', { weekday: 'short' }), volume: vol, count: dayWorkouts.length });
    }
    const maxVol = Math.max(...days.map(d => d.volume), 1);

    let html = `
      <div class="screen">
        <h2>Progress</h2>

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-value">${weekCount}</div>
            <div class="stat-label">This Week</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${history.length}</div>
            <div class="stat-label">Total Workouts</div>
          </div>
        </div>

        <div class="card">
          <div class="card-title">Weekly Volume</div>
          ${history.length === 0 ? '<p class="text-muted">No workout data yet.</p>' : `
            <div class="chart-bar">
              ${days.map(d => `
                <div class="chart-col">
                  <div class="chart-bar-fill" style="height:${(d.volume / maxVol) * 100}%"></div>
                  <div class="chart-label">${d.label}</div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <div class="section-header">
          <h3>Personal Records</h3>
        </div>
    `;

    const prEntries = Object.entries(prs);
    if (prEntries.length === 0) {
      html += `
        <div class="empty-state" style="padding:24px;">
          <h3>No PRs yet</h3>
          <p>Your first PR will appear here after you complete a workout.</p>
        </div>
      `;
    } else {
      prEntries.forEach(([exId, data]) => {
        const e = getExerciseById(exId);
        if (!data.heaviest) return;
        html += `
          <div class="list-item">
            <div class="list-item-content">
              <div class="list-item-title" data-action="open-exercise" data-id="${exId}" style="cursor:pointer;">${e ? e.name : exId}</div>
              <div class="list-item-sub">${data.heaviest.weight} ${settings.units} × ${data.heaviest.reps} · ${formatDate(data.heaviest.date)}</div>
            </div>
            <div class="pr-badge">PR</div>
          </div>
        `;
      });
    }

    // Exercise progress - show top exercises with history
    html += `
        <div class="section-header mt-16">
          <h3>Exercise History</h3>
        </div>
    `;

    if (history.length === 0) {
      html += `<p class="text-muted">Complete workouts to see exercise progress.</p>`;
    } else {
      // Collect unique exercises
      const exMap = {};
      history.forEach(h => {
        h.exercises.forEach(ex => {
          if (!exMap[ex.exerciseId]) exMap[ex.exerciseId] = [];
          const best = (ex.sets || []).filter(s => s.completed).sort((a,b) => b.weight - a.weight || b.reps - a.reps)[0];
          if (best) {
            exMap[ex.exerciseId].push({ date: h.date, weight: best.weight, reps: best.reps });
          }
        });
      });
      Object.entries(exMap).slice(0, 8).forEach(([exId, entries]) => {
        const e = getExerciseById(exId);
        const latest = entries[0];
        html += `
          <div class="list-item" data-action="open-exercise" data-id="${exId}">
            <div class="list-item-content">
              <div class="list-item-title">${e ? e.name : exId}</div>
              <div class="list-item-sub">Latest: ${latest.weight} ${settings.units} × ${latest.reps} · ${entries.length} sessions</div>
            </div>
          </div>
        `;
      });
    }

    html += `</div>`;
    return html;
  },

  showPRList() {
    this.navigate('progress');
  },

  // ========== PROFILE ==========
  renderProfile() {
    const settings = DB.getSettings();
    const needsCheckIn = !settings.lastCheckIn || ((Date.now() - new Date(settings.lastCheckIn+'T12:00:00').getTime()) > 6 * 86400000);
    return `
      <div class="screen">
        <h2>Profile</h2>

        <div class="card">
          <div class="card-title">Theme</div>
          <p class="text-muted" style="font-size:12px;margin-bottom:10px;">Main background + accent. Preview updates as you change colors.</p>

          <div class="theme-preview" id="theme-preview">
            <div class="theme-preview-bar">
              <span class="theme-preview-mark" style="display:flex;color:var(--accent)">
                <svg viewBox="0 0 100 100" width="22" height="22"><path fill="currentColor" d="M22 8 L72 8 L82 22 L40 22 L40 38 L68 38 L76 50 L40 50 L40 82 L22 92 Z"/></svg>
              </span>
              FORGE
            </div>
            <div class="theme-preview-body">
              <div class="theme-preview-card">
                <div style="font-weight:700;margin-bottom:4px;">Today's Workout</div>
                <div class="theme-preview-sub" style="font-size:12px;margin-bottom:10px;">Preview card · 5 exercises</div>
                <button type="button" class="theme-preview-btn">Start Workout</button>
              </div>
            </div>
          </div>

          <div class="theme-color-row">
            <label>Main color</label>
            <input type="color" id="theme-main" value="${settings.mainColor || '#0a0a0b'}">
            <input type="text" class="input" id="theme-main-hex" value="${settings.mainColor || '#0a0a0b'}" maxlength="7">
          </div>
          <div class="theme-color-row">
            <label>Accent color</label>
            <input type="color" id="theme-accent" value="${settings.accentColor || '#f97316'}">
            <input type="text" class="input" id="theme-accent-hex" value="${settings.accentColor || '#f97316'}" maxlength="7">
          </div>
          <button class="btn btn-primary btn-block mb-12" id="theme-save">Save colors</button>

          <div class="card-title" style="margin-top:8px;">Presets</div>
          <p class="text-muted" style="font-size:11px;margin-bottom:8px;">Tap a preset to preview · Save colors to keep it</p>
          <div class="preset-grid" id="preset-grid">
            ${this.getThemePresets().map(p => {
              const active = (settings.mainColor || '#0a0a0b').toLowerCase() === p.main.toLowerCase()
                && (settings.accentColor || '#f97316').toLowerCase() === p.accent.toLowerCase();
              return `<button type="button" class="preset-chip ${active ? 'active' : ''}" data-preset="${p.id}" title="${p.name}">
                <div class="preset-chip-inner">
                  <div class="preset-chip-top" style="background:${p.main}"><span class="preset-chip-dot" style="background:${p.accent}"></span></div>
                  <div class="preset-chip-label">${p.name}</div>
                </div>
              </button>`;
            }).join('')}
          </div>
        </div>

        <div class="card">
          <div class="card-title">Units</div>
          <div class="setting-row">
            <div>
              <div class="setting-label">Weight</div>
              <div class="setting-desc">lb or kg</div>
            </div>
            <select class="select" id="set-units" style="width:100px;">
              <option value="lb" ${settings.units === 'lb' ? 'selected' : ''}>lb</option>
              <option value="kg" ${settings.units === 'kg' ? 'selected' : ''}>kg</option>
            </select>
          </div>
        </div>

        <div class="card">
          <div class="card-title">Body & Goals</div>
          <div class="input-row">
            <div class="input-group">
              <label class="input-label">Current weight</label>
              <input type="number" class="input" id="set-bw" value="${settings.bodyWeight || ''}" min="0" step="0.1">
            </div>
            <div class="input-group">
              <label class="input-label">Target weight</label>
              <input type="number" class="input" id="set-tw" value="${settings.targetWeight || ''}" min="0" step="0.1">
            </div>
          </div>
          <div class="input-group">
            <label class="input-label">Nutrition goal</label>
            <select class="select" id="set-ngoal">
              <option value="cut" ${settings.nutritionGoal==='cut'?'selected':''}>Fat loss</option>
              <option value="maintain" ${settings.nutritionGoal==='maintain'?'selected':''}>Maintain</option>
              <option value="bulk" ${settings.nutritionGoal==='bulk'?'selected':''}>Muscle gain</option>
            </select>
          </div>
          <div class="input-group">
            <label class="input-label">Activity level</label>
            <select class="select" id="set-act">
              <option value="sedentary" ${settings.activityLevel==='sedentary'?'selected':''}>Sedentary</option>
              <option value="moderate" ${settings.activityLevel==='moderate'?'selected':''}>Moderate</option>
              <option value="active" ${settings.activityLevel==='active'?'selected':''}>Active</option>
              <option value="very_active" ${settings.activityLevel==='very_active'?'selected':''}>Very active</option>
            </select>
          </div>
          <div class="input-group">
            <label class="input-label">Training days / week</label>
            <input type="number" class="input" id="set-tfreq" value="${settings.trainingFrequency || 4}" min="0" max="7">
          </div>
          <button class="btn btn-sm btn-secondary" data-action="log-weight">Weight log</button>
        </div>

        <div class="card">
          <div class="card-title">Daily Macro Targets</div>
          <div class="input-group">
            <label class="input-label">Calories</label>
            <input type="number" class="input" id="set-cal" value="${settings.calorieGoal}" min="500" max="10000">
          </div>
          <div class="input-row">
            <div class="input-group">
              <label class="input-label">Protein (g)</label>
              <input type="number" class="input" id="set-protein" value="${settings.proteinGoal}" min="0">
            </div>
            <div class="input-group">
              <label class="input-label">Carbs (g)</label>
              <input type="number" class="input" id="set-carbs" value="${settings.carbGoal}" min="0">
            </div>
          </div>
          <div class="input-group">
            <label class="input-label">Fat (g)</label>
            <input type="number" class="input" id="set-fat" value="${settings.fatGoal}" min="0">
          </div>
        </div>

        <div class="card">
          <div class="card-title">Training</div>
          <div class="input-group">
            <label class="input-label">Default Rest Timer (seconds)</label>
            <input type="number" class="input" id="set-rest" value="${settings.restTimerDefault}" min="30" max="600">
          </div>
          <div class="input-group">
            <label class="input-label">Training focus</label>
            <select class="select" id="set-goal">
              <option value="strength" ${settings.goals === 'strength' ? 'selected' : ''}>Strength</option>
              <option value="hypertrophy" ${settings.goals === 'hypertrophy' ? 'selected' : ''}>Hypertrophy</option>
              <option value="endurance" ${settings.goals === 'endurance' ? 'selected' : ''}>Endurance</option>
              <option value="general" ${settings.goals === 'general' ? 'selected' : ''}>General Fitness</option>
            </select>
          </div>
        </div>

        <button class="btn btn-primary btn-block" data-action="save-settings">Save Settings</button>

        <div class="card mt-16">
          <div class="card-title">API (Meal Scanner)</div>
          <p class="text-muted" style="font-size:12px;margin-bottom:10px;">Key is stored only on this device. Client-side keys can be inspected — use a restricted key for personal use.</p>
          <div class="input-group">
            <label class="input-label">Provider</label>
            <select class="select" id="set-vision-provider">
              <option value="openai">OpenAI (gpt-4o-mini)</option>
              <option value="gemini">Google Gemini (1.5 Flash)</option>
            </select>
          </div>
          <div class="input-group">
            <label class="input-label">API key</label>
            <input type="password" class="input" id="set-vision-key" placeholder="sk-… or AIza…" autocomplete="off">
          </div>
          <div class="input-group">
            <label class="input-label">Custom endpoint (optional)</label>
            <input type="text" class="input" id="set-vision-endpoint" placeholder="Leave blank for default">
          </div>
          <button class="btn btn-secondary btn-block" id="save-api-btn">Save API settings</button>
          <p class="text-muted" style="font-size:11px;margin-top:8px;" id="api-status"></p>
        </div>

        <div class="card mt-16">
          <div class="card-title">Nutrition tools</div>
          <button class="btn btn-secondary btn-block mb-8" data-action="nutrition-assistant">Nutrition help</button>
          <button class="btn btn-secondary btn-block mb-8" data-action="weekly-checkin">${needsCheckIn ? 'Weekly check-in' : 'Weekly check-in (done)'}</button>
        </div>

        <div class="card mt-16">
          <div class="card-title">Data</div>
          <button class="btn btn-secondary btn-block mb-8" data-action="export-data">Export Data</button>
          <button class="btn btn-danger btn-block" data-action="reset-data">Reset All Data</button>
        </div>

        <p class="text-muted" style="text-align:center;margin-top:24px;font-size:12px;">FORGE v1.1 · Build your strongest self.</p>
      </div>
    `;
  },

  saveSettingsFromForm() {
    const settings = DB.getSettings();
    settings.units = document.getElementById('set-units').value;
    settings.calorieGoal = parseInt(document.getElementById('set-cal').value) || 2500;
    settings.proteinGoal = parseInt(document.getElementById('set-protein').value) || 180;
    settings.carbGoal = parseInt(document.getElementById('set-carbs').value) || 250;
    settings.fatGoal = parseInt(document.getElementById('set-fat').value) || 70;
    settings.restTimerDefault = parseInt(document.getElementById('set-rest').value) || 90;
    settings.goals = document.getElementById('set-goal').value;
    const bw = document.getElementById('set-bw');
    const tw = document.getElementById('set-tw');
    const ngoal = document.getElementById('set-ngoal');
    const act = document.getElementById('set-act');
    const tfreq = document.getElementById('set-tfreq');
    if (bw) settings.bodyWeight = parseFloat(bw.value) || 0;
    if (tw) settings.targetWeight = parseFloat(tw.value) || 0;
    if (ngoal) settings.nutritionGoal = ngoal.value;
    if (act) settings.activityLevel = act.value;
    if (tfreq) settings.trainingFrequency = parseInt(tfreq.value) || 4;
    DB.saveSettings(settings);
    this.toast('Settings saved');
  },

  exportData() {
    const data = DB.exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forge-backup-${todayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast('Data exported');
  },

  confirmReset() {
    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">Reset All Data?</div>
        <button class="modal-close" id="modal-close">×</button>
      </div>
      <p class="text-secondary mb-16">This will permanently delete all workouts, history, food logs, and PRs. This cannot be undone.</p>
      <button class="btn btn-danger btn-block" id="confirm-reset">Yes, Reset Everything</button>
    `, () => {
      document.getElementById('modal-close').onclick = () => this.hideModal();
      document.getElementById('confirm-reset').onclick = () => {
        DB.resetAll();
        this.activeWorkout = null;
        this.hideModal();
        this.toast('All data reset');
        this.navigate('home');
      };
    });
  },

  // ========== MODAL / TOAST ==========
  showModal(html, onReady) {
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('modal');
    modal.innerHTML = html;
    overlay.classList.remove('hidden');
    if (onReady) onReady();
    overlay.onclick = (e) => {
      if (e.target === overlay) this.hideModal();
    };
  },

  hideModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
  },

  toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.add('hidden'), 2500);
  }
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
