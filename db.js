/* FORGE — Data Persistence Layer (localStorage with structured API) */

const DB = {
  KEYS: {
    settings: 'forge_settings',
    workouts: 'forge_workouts',
    history: 'forge_history',
    foodLog: 'forge_food_log',
    customFoods: 'forge_custom_foods',
    recipes: 'forge_recipes',
    favorites: 'forge_favorites',
    recentFoods: 'forge_recent_foods',
    prs: 'forge_prs',
    activeWorkout: 'forge_active_workout',
    apiConfig: 'forge_api_config',
    weightLog: 'forge_weight_log',
    activeProgram: 'forge_active_program'
  },

  get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('DB get error', key, e);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('DB set error', key, e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  },

  // Settings
  getSettings() {
    const defaults = {
      units: 'lb',
      heightUnit: 'in',
      calorieGoal: 2500,
      proteinGoal: 180,
      carbGoal: 250,
      fatGoal: 70,
      theme: 'dark',
      restTimerDefault: 90,
      workoutDays: [1, 2, 3, 4, 5],
      equipment: ['Barbell', 'Dumbbells', 'Cable', 'Machine', 'Pull-up Bar', 'Bodyweight'],
      goals: 'strength',
      bodyWeight: 0,
      targetWeight: 0,
      activityLevel: 'moderate',
      trainingFrequency: 4,
      nutritionGoal: 'maintain',
      nutritionPreference: 'balanced',
      accentColor: '#f97316',
      mainColor: '#0a0a0b',
      lastCheckIn: null
    };
    return { ...defaults, ...(this.get(this.KEYS.settings) || {}) };
  },

  saveSettings(settings) {
    return this.set(this.KEYS.settings, settings);
  },

  // Workouts (templates)
  getWorkouts() {
    let workouts = this.get(this.KEYS.workouts);
    if (!workouts) {
      workouts = JSON.parse(JSON.stringify(DEFAULT_WORKOUTS));
      this.set(this.KEYS.workouts, workouts);
    }
    return workouts;
  },

  saveWorkouts(workouts) {
    return this.set(this.KEYS.workouts, workouts);
  },

  getWorkout(id) {
    return this.getWorkouts().find(w => w.id === id) || null;
  },

  saveWorkout(workout) {
    const workouts = this.getWorkouts();
    const idx = workouts.findIndex(w => w.id === workout.id);
    if (idx >= 0) {
      workouts[idx] = workout;
    } else {
      workouts.push(workout);
    }
    return this.saveWorkouts(workouts);
  },

  deleteWorkout(id) {
    const workouts = this.getWorkouts().filter(w => w.id !== id);
    return this.saveWorkouts(workouts);
  },

  // History
  getHistory() {
    return this.get(this.KEYS.history) || [];
  },

  saveHistory(history) {
    return this.set(this.KEYS.history, history);
  },

  addHistoryEntry(entry) {
    const history = this.getHistory();
    history.unshift(entry);
    return this.saveHistory(history);
  },

  getHistoryEntry(id) {
    return this.getHistory().find(h => h.id === id) || null;
  },

  // Food Log (keyed by date YYYY-MM-DD)
  getFoodLog(date) {
    const all = this.get(this.KEYS.foodLog) || {};
    return all[date] || { breakfast: [], lunch: [], dinner: [], snacks: [] };
  },

  saveFoodLog(date, log) {
    const all = this.get(this.KEYS.foodLog) || {};
    all[date] = log;
    return this.set(this.KEYS.foodLog, all);
  },

  getAllFoodLogs() {
    return this.get(this.KEYS.foodLog) || {};
  },

  // Custom Foods
  getCustomFoods() {
    return this.get(this.KEYS.customFoods) || [];
  },

  saveCustomFood(food) {
    const foods = this.getCustomFoods();
    const idx = foods.findIndex(f => f.id === food.id);
    if (idx >= 0) foods[idx] = food;
    else foods.push(food);
    return this.set(this.KEYS.customFoods, foods);
  },

  deleteCustomFood(id) {
    const foods = this.getCustomFoods().filter(f => f.id !== id);
    return this.set(this.KEYS.customFoods, foods);
  },

  getAllFoods() {
    return [...FOOD_DATABASE, ...this.getCustomFoods()];
  },

  // Recipes / reusable meals
  getRecipes() {
    return this.get(this.KEYS.recipes) || [];
  },

  saveRecipe(recipe) {
    const list = this.getRecipes();
    const idx = list.findIndex(r => r.id === recipe.id);
    if (idx >= 0) list[idx] = recipe;
    else list.push(recipe);
    return this.set(this.KEYS.recipes, list);
  },

  deleteRecipe(id) {
    return this.set(this.KEYS.recipes, this.getRecipes().filter(r => r.id !== id));
  },

  // Favorites (food ids)
  getFavorites() {
    return this.get(this.KEYS.favorites) || [];
  },

  toggleFavorite(foodId) {
    let favs = this.getFavorites();
    if (favs.includes(foodId)) favs = favs.filter(id => id !== foodId);
    else favs.push(foodId);
    this.set(this.KEYS.favorites, favs);
    return favs;
  },

  isFavorite(foodId) {
    return this.getFavorites().includes(foodId);
  },

  // Recent foods (food objects, max 20)
  getRecentFoods() {
    return this.get(this.KEYS.recentFoods) || [];
  },

  pushRecentFood(food) {
    let recent = this.getRecentFoods().filter(f => f.id !== food.id);
    recent.unshift({ id: food.id, name: food.name, calories: food.calories, protein: food.protein, carbs: food.carbs, fat: food.fat, serving: food.serving });
    if (recent.length > 20) recent = recent.slice(0, 20);
    this.set(this.KEYS.recentFoods, recent);
  },

  getApiConfig() {
    return this.get(this.KEYS.apiConfig) || {
      visionProvider: 'openai', // openai | gemini
      visionApiKey: '',
      visionEndpoint: '', // optional custom endpoint
      barcodeApiKey: ''
    };
  },

  saveApiConfig(cfg) {
    return this.set(this.KEYS.apiConfig, cfg);
  },


  getWeightLog() {
    return this.get(this.KEYS.weightLog) || [];
  },

  addWeightEntry(weight, date) {
    const log = this.getWeightLog();
    const d = date || todayStr();
    const idx = log.findIndex(e => e.date === d);
    const entry = { date: d, weight: parseFloat(weight) };
    if (idx >= 0) log[idx] = entry;
    else log.push(entry);
    log.sort((a, b) => a.date.localeCompare(b.date));
    return this.set(this.KEYS.weightLog, log);
  },


  getActiveProgram() {
    return this.get(this.KEYS.activeProgram) || null;
  },

  setActiveProgram(programId) {
    if (!programId) {
      this.remove(this.KEYS.activeProgram);
      return true;
    }
    return this.set(this.KEYS.activeProgram, { programId, activatedAt: todayStr() });
  },

  clearActiveProgram() {
    return this.remove(this.KEYS.activeProgram);
  },

  // PRs
  getPRs() {
    return this.get(this.KEYS.prs) || {};
  },

  savePRs(prs) {
    return this.set(this.KEYS.prs, prs);
  },

  // Active workout (for resume)
  getActiveWorkout() {
    return this.get(this.KEYS.activeWorkout);
  },

  saveActiveWorkout(data) {
    if (data) return this.set(this.KEYS.activeWorkout, data);
    return this.remove(this.KEYS.activeWorkout);
  },

  // Export / Reset
  exportAll() {
    return {
      version: 2,
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      workouts: this.getWorkouts(),
      history: this.getHistory(),
      foodLog: this.getAllFoodLogs(),
      customFoods: this.getCustomFoods(),
      recipes: this.getRecipes(),
      favorites: this.getFavorites(),
      recentFoods: this.getRecentFoods(),
      prs: this.getPRs(),
      apiConfig: this.getApiConfig(),
      weightLog: this.getWeightLog()
    };
  },

  importAll(data) {
    if (!data || !data.version) return false;
    if (data.settings) this.saveSettings(data.settings);
    if (data.workouts) this.saveWorkouts(data.workouts);
    if (data.history) this.saveHistory(data.history);
    if (data.foodLog) this.set(this.KEYS.foodLog, data.foodLog);
    if (data.customFoods) this.set(this.KEYS.customFoods, data.customFoods);
    if (data.recipes) this.set(this.KEYS.recipes, data.recipes);
    if (data.favorites) this.set(this.KEYS.favorites, data.favorites);
    if (data.recentFoods) this.set(this.KEYS.recentFoods, data.recentFoods);
    if (data.prs) this.savePRs(data.prs);
    if (data.apiConfig) this.saveApiConfig(data.apiConfig);
    if (data.weightLog) this.set(this.KEYS.weightLog, data.weightLog);
    return true;
  },

  resetAll() {
    Object.values(this.KEYS).forEach(k => this.remove(k));
  }
};

// Helpers
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    return `${h}h ${m % 60}m`;
  }
  return `${m} min`;
}

function estimate1RM(weight, reps) {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  // Epley formula
  return Math.round(weight * (1 + reps / 30));
}

function getExerciseById(id) {
  return EXERCISE_LIBRARY.find(e => e.id === id) || null;
}

function getPreviousPerformance(exerciseId) {
  const history = DB.getHistory();
  for (const entry of history) {
    const ex = entry.exercises.find(e => e.exerciseId === exerciseId);
    if (ex && ex.sets && ex.sets.length > 0) {
      const completed = ex.sets.filter(s => s.completed && s.reps > 0);
      if (completed.length > 0) {
        const best = [...completed].sort((a, b) => b.weight - a.weight || b.reps - a.reps)[0];
        return {
          weight: best.weight,
          reps: best.reps,
          sets: completed.length,
          date: entry.date,
          allSets: completed.map(s => ({ weight: s.weight, reps: s.reps }))
        };
      }
    }
  }
  return null;
}

/** Transparent progressive overload suggestion from real history */
function getProgressionSuggestion(exerciseId, targetReps, targetRepsMax) {
  const prev = getPreviousPerformance(exerciseId);
  if (!prev || !prev.allSets || prev.allSets.length === 0) {
    return { weight: 0, reason: null };
  }
  const topRep = targetRepsMax || targetReps || 8;
  const allHitTop = prev.allSets.every(s => s.reps >= topRep);
  const bestWeight = Math.max(...prev.allSets.map(s => s.weight));

  if (allHitTop && bestWeight > 0) {
    const increment = bestWeight >= 100 ? 5 : 2.5;
    return {
      weight: bestWeight + increment,
      reason: `You hit the top of the rep range last time (${prev.allSets.map(s => s.reps).join(', ')} reps @ ${bestWeight}). Try +${increment}.`
    };
  }
  return { weight: bestWeight, reason: null };
}

function detectPRs(historyEntry) {
  const prs = DB.getPRs();
  const newPRs = [];
  const settings = DB.getSettings();

  for (const ex of historyEntry.exercises) {
    const completed = (ex.sets || []).filter(s => s.completed && s.weight > 0 && s.reps > 0);
    if (completed.length === 0) continue;

    const maxWeight = Math.max(...completed.map(s => s.weight));
    const bestAtWeight = completed.reduce((best, s) => {
      if (s.weight > (best.weight || 0) || (s.weight === best.weight && s.reps > best.reps)) return s;
      return best;
    }, { weight: 0, reps: 0 });

    const est1rm = estimate1RM(bestAtWeight.weight, bestAtWeight.reps);

    if (!prs[ex.exerciseId]) {
      prs[ex.exerciseId] = {
        heaviest: { weight: maxWeight, reps: bestAtWeight.reps, date: historyEntry.date },
        best1rm: { weight: bestAtWeight.weight, reps: bestAtWeight.reps, estimated: est1rm, date: historyEntry.date },
        history: []
      };
      newPRs.push({ exerciseId: ex.exerciseId, type: 'heaviest', weight: maxWeight, reps: bestAtWeight.reps });
    } else {
      const pr = prs[ex.exerciseId];
      if (maxWeight > (pr.heaviest?.weight || 0)) {
        pr.heaviest = { weight: maxWeight, reps: bestAtWeight.reps, date: historyEntry.date };
        newPRs.push({ exerciseId: ex.exerciseId, type: 'heaviest', weight: maxWeight, reps: bestAtWeight.reps });
      }
      if (est1rm > (pr.best1rm?.estimated || 0)) {
        pr.best1rm = { weight: bestAtWeight.weight, reps: bestAtWeight.reps, estimated: est1rm, date: historyEntry.date };
        newPRs.push({ exerciseId: ex.exerciseId, type: '1rm', weight: bestAtWeight.weight, reps: bestAtWeight.reps, estimated: est1rm });
      }
    }

    // Add to history
    if (!prs[ex.exerciseId].history) prs[ex.exerciseId].history = [];
    prs[ex.exerciseId].history.push({
      date: historyEntry.date,
      weight: bestAtWeight.weight,
      reps: bestAtWeight.reps,
      estimated1rm: est1rm
    });
  }

  DB.savePRs(prs);
  return newPRs;
}

function getSuggestedWeight(exerciseId, targetReps, targetRepsMax) {
  const suggestion = getProgressionSuggestion(exerciseId, targetReps, targetRepsMax);
  if (suggestion.weight > 0) return suggestion;
  return { weight: 0, reason: null };
}

function getWeekWorkoutCount() {
  const history = DB.getHistory();
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);
  return history.filter(h => new Date(h.date + 'T12:00:00') >= startOfWeek).length;
}

function getTodayCalories() {
  const log = DB.getFoodLog(todayStr());
  let cal = 0, protein = 0, carbs = 0, fat = 0;
  for (const meal of ['breakfast', 'lunch', 'dinner', 'snacks']) {
    for (const item of (log[meal] || [])) {
      cal += item.calories || 0;
      protein += item.protein || 0;
      carbs += item.carbs || 0;
      fat += item.fat || 0;
    }
  }
  return { calories: Math.round(cal), protein: Math.round(protein), carbs: Math.round(carbs), fat: Math.round(fat) };
}

function getNutritionTargets() {
  const s = DB.getSettings();
  return {
    calories: s.calorieGoal || 2500,
    protein: s.proteinGoal || 180,
    carbs: s.carbGoal || 250,
    fat: s.fatGoal || 70
  };
}

function getRemainingMacros() {
  const t = getNutritionTargets();
  const c = getTodayCalories();
  return {
    calories: Math.max(0, t.calories - c.calories),
    protein: Math.max(0, t.protein - c.protein),
    carbs: Math.max(0, t.carbs - c.carbs),
    fat: Math.max(0, t.fat - c.fat),
    consumed: c,
    targets: t
  };
}

/** Ranked food recommendations from remaining macros — real data only */
function getFoodRecommendations(limit = 6) {
  const rem = getRemainingMacros();
  const foods = DB.getAllFoods();
  const favs = DB.getFavorites();
  const scored = [];

  for (const f of foods) {
    if (!f.calories || f.calories <= 0) continue;
    // Scale to ~1 serving that fits remaining calories
    let servings = 1;
    if (f.calories > rem.calories && rem.calories > 50) {
      servings = Math.max(0.25, Math.round((rem.calories / f.calories) * 4) / 4);
    }
    const cal = f.calories * servings;
    const p = f.protein * servings;
    const c = f.carbs * servings;
    const fat = f.fat * servings;
    if (cal > rem.calories + 80 && rem.calories < 2000) continue;

    let score = 0;
    let reasons = [];

    // Protein priority when short
    if (rem.protein > 20 && p > 15) {
      score += p * 3;
      reasons.push('High protein');
    } else if (rem.protein > 10 && p > 10) {
      score += p * 2;
      reasons.push('Adds protein');
    }

    // Carb when short and calories remain
    if (rem.carbs > 40 && c > 20 && rem.calories > 150) {
      score += c * 0.5;
      reasons.push('Carbs for remaining target');
    }

    // Fit remaining calories tightly
    const calFit = 1 - Math.abs(cal - Math.min(rem.calories, 500)) / 500;
    score += calFit * 20;
    if (cal <= rem.calories) {
      reasons.push('Fits remaining calories');
    }

    // Favorites boost
    if (favs.includes(f.id)) {
      score += 25;
      reasons.push('Favorite');
    }

    // Avoid high fat when fat budget is tight
    if (rem.fat < 15 && fat > 12) score -= 15;

    // Efficient protein (high P per calorie) when calories nearly full
    if (rem.calories < 400 && rem.protein > 15 && p > 0) {
      const efficiency = p / Math.max(cal, 1);
      score += efficiency * 200;
      if (efficiency > 0.1) reasons.push('Protein-efficient');
    }

    if (reasons.length === 0) reasons.push('Available option');

    scored.push({
      food: f,
      servings,
      calories: Math.round(cal),
      protein: Math.round(p * 10) / 10,
      carbs: Math.round(c * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      score,
      reason: reasons[0]
    });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

/** Build meal combinations matching calorie + protein targets */
function buildMealOptions(targetCal, minProtein, count = 3) {
  const foods = DB.getAllFoods();
  const proteins = foods.filter(f => f.protein >= 15 && f.calories > 0);
  const carbs = foods.filter(f => f.carbs >= 15 && f.protein < 15);
  const sides = foods.filter(f => f.calories < 120);
  const options = [];

  for (let i = 0; i < Math.min(proteins.length, 12) && options.length < count; i++) {
    const p = proteins[i];
    let pServ = 1;
    if (p.protein < minProtein) pServ = Math.ceil(minProtein / p.protein * 2) / 2;
    let cal = p.calories * pServ;
    let prot = p.protein * pServ;
    const items = [{ food: p, servings: pServ }];

    // Add carb source if room
    const room = targetCal - cal;
    if (room > 80 && carbs.length) {
      const c = carbs[i % carbs.length];
      let cServ = Math.min(2, Math.max(0.5, Math.round((room * 0.7 / c.calories) * 4) / 4));
      if (c.calories * cServ <= room + 50) {
        items.push({ food: c, servings: cServ });
        cal += c.calories * cServ;
        prot += c.protein * cServ;
      }
    }
    // Light side
    if (targetCal - cal > 40 && sides.length) {
      const s = sides[i % sides.length];
      items.push({ food: s, servings: 1 });
      cal += s.calories;
      prot += s.protein;
    }

    if (prot >= minProtein * 0.85 && cal <= targetCal * 1.15) {
      options.push({
        name: items.map(it => it.food.name).join(' + '),
        items: items.map(it => ({
          foodId: it.food.id,
          name: it.food.name,
          servings: it.servings,
          servingLabel: it.food.serving,
          calories: Math.round(it.food.calories * it.servings),
          protein: Math.round(it.food.protein * it.servings * 10) / 10,
          carbs: Math.round(it.food.carbs * it.servings * 10) / 10,
          fat: Math.round(it.food.fat * it.servings * 10) / 10
        })),
        calories: Math.round(cal),
        protein: Math.round(prot),
        carbs: Math.round(items.reduce((s, it) => s + it.food.carbs * it.servings, 0)),
        fat: Math.round(items.reduce((s, it) => s + it.food.fat * it.servings, 0))
      });
    }
  }
  return options;
}

function getNutritionInsight() {
  const rem = getRemainingMacros();
  const c = rem.consumed;
  const t = rem.targets;
  if (c.calories === 0 && c.protein === 0) {
    return 'No food logged today yet.';
  }
  // Weekly protein consistency (real logs only)
  let proteinDays = 0;
  let proteinSum = 0;
  let daysWithLog = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
    const m = getDayMacros(ds);
    if (m.calories > 0 || m.protein > 0) {
      daysWithLog++;
      proteinSum += m.protein;
      if (m.protein >= t.protein * 0.9) proteinDays++;
    }
  }
  if (daysWithLog >= 3 && proteinDays >= 3 && rem.protein < 25) {
    return `Protein on target ${proteinDays} of the last ${daysWithLog} logged days. Avg ${Math.round(proteinSum/daysWithLog)}g.`;
  }
  if (rem.protein >= 25) {
    return `You're ${rem.protein}g short of your protein target.`;
  }
  if (rem.calories < 150 && rem.protein >= 15) {
    return `Close on calories — still room for about ${rem.protein}g protein.`;
  }
  if (rem.calories < 100) {
    return `You're near your calorie target (${c.calories} / ${t.calories}).`;
  }
  if (c.protein >= t.protein) {
    return `Protein target hit (${c.protein}g). ${rem.calories} calories remaining.`;
  }
  return `${rem.calories} cal · ${rem.protein}g protein remaining today.`;
}

/** Rule-based nutrition answers using real remaining macros — not generative AI */
function answerNutritionQuestion(question) {
  const q = (question || '').toLowerCase();
  const rem = getRemainingMacros();
  const recs = getFoodRecommendations(4);
  const settings = DB.getSettings();

  if (!q.trim()) {
    return { text: 'Ask about remaining macros, protein ideas, or what fits your day.', suggestions: recs };
  }
  if (q.includes('protein') || q.includes('40g') || q.includes('more protein')) {
    const need = rem.protein;
    const lines = recs.filter(r => r.protein >= 15).slice(0, 3)
      .map(r => `• ${r.food.name}: ~${r.protein}g protein, ${r.calories} cal`);
    return {
      text: need > 5
        ? `You still need about ${need}g protein today (${rem.consumed.protein}/${rem.targets.protein}g). Options that fit:`
        : `Protein looks solid today (${rem.consumed.protein}g). These are still reasonable if you want more:`,
      suggestions: recs,
      lines
    };
  }
  if (q.includes('500') || q.includes('calories left') || q.includes('what can i eat')) {
    const budget = Math.min(rem.calories, 600);
    return {
      text: `You have ~${rem.calories} calories left. Here are options near ${budget} cal that respect your remaining macros:`,
      suggestions: getFoodRecommendations(5).filter(r => r.calories <= budget + 80),
      lines: []
    };
  }
  if (q.includes('breakfast')) {
    const foods = DB.getAllFoods().filter(f =>
      /egg|yogurt|oat|banana|toast|bread/i.test(f.name)
    ).slice(0, 4);
    return {
      text: `High-protein breakfast ideas from your database (adjust to your ${rem.targets.protein}g protein target):`,
      suggestions: foods.map(f => ({ food: f, servings: 1, calories: f.calories, protein: f.protein, carbs: f.carbs, fat: f.fat, reason: 'Breakfast option' })),
      lines: foods.map(f => `• ${f.name}: ${f.calories} cal, ${f.protein}g protein`)
    };
  }
  if (q.includes('tonight') || q.includes('dinner') || q.includes('should i eat')) {
    return {
      text: `With ${rem.calories} cal and ${rem.protein}g protein left, prioritize a protein source plus a carb if you trained today.`,
      suggestions: recs,
      lines: recs.slice(0, 3).map(r => `• ${r.food.name}: ${r.calories} cal, ${r.protein}g protein — ${r.reason}`)
    };
  }
  if (q.includes('hungry') || q.includes('appetite')) {
    return {
      text: 'Forge only sees what you log. If evenings feel hungry, check whether protein and total calories earlier in the day matched your targets. Higher-volume foods (yogurt, fruit, vegetables) can help fill remaining calories without blowing macros.',
      suggestions: recs.filter(r => r.calories < 250),
      lines: []
    };
  }
  return {
    text: `Today: ${rem.consumed.calories}/${rem.targets.calories} cal, ${rem.consumed.protein}/${rem.targets.protein}g protein. Remaining: ${rem.calories} cal, ${rem.protein}g protein.`,
    suggestions: recs,
    lines: recs.slice(0, 3).map(r => `• ${r.food.name}: ${r.calories} cal, ${r.protein}p — ${r.reason}`)
  };
}

function getDayMacros(dateStr) {
  const log = DB.getFoodLog(dateStr);
  let cal = 0, protein = 0, carbs = 0, fat = 0;
  for (const meal of ['breakfast', 'lunch', 'dinner', 'snacks']) {
    for (const item of (log[meal] || [])) {
      cal += item.calories || 0;
      protein += item.protein || 0;
      carbs += item.carbs || 0;
      fat += item.fat || 0;
    }
  }
  return { calories: Math.round(cal), protein: Math.round(protein), carbs: Math.round(carbs), fat: Math.round(fat) };
}
