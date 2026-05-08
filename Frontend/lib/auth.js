export const authStorage = {
  setUser: (user) => {
    if (user === undefined || user === null) {
      localStorage.removeItem("user");
      return;
    }
    localStorage.setItem("user", JSON.stringify(user));
  },
  getUser: () => {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    if (!user || user === "undefined") return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  },
  logout: () => {
    localStorage.removeItem("user");
  },
  signup: (email, password, name) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u) => u.email === email)) {
      throw new Error("User already exists");
    }
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      createdAt: new Date().toISOString(),
      profilePhoto: null,
      bio: "",
      location: "",
      website: "",
      phone: "",
      streak: 0,
      lastActiveDate: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return newUser;
  },
  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) {
      throw new Error("Invalid credentials");
    }
    return user;
  },
  updateUser: (userId, updates) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");

    const updatedUser = { ...user, ...updates };
    users[users.indexOf(user)] = updatedUser;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  },
  getUserById: (userId) => {
    if (typeof window === "undefined") return null;
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    return users.find((u) => u.id === userId);
  },
};

export const roadmapStorage = {
  saveRoadmap: (roadmap) => {
    const user = authStorage.getUser();
    if (!user) throw new Error("Not authenticated");

    const roadmaps = JSON.parse(
      localStorage.getItem(`roadmaps_${user.id}`) || "[]",
    );
    const newRoadmap = {
      id: Date.now().toString(),
      ...roadmap,
      userId: user.id,
      createdAt: new Date().toISOString(),
      progress: 0,
    };
    roadmaps.push(newRoadmap);
    localStorage.setItem(`roadmaps_${user.id}`, JSON.stringify(roadmaps));
    return newRoadmap;
  },
  getRoadmaps: () => {
    const user = authStorage.getUser();
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`roadmaps_${user.id}`) || "[]");
  },
  getRoadmap: (id) => {
    const roadmaps = roadmapStorage.getRoadmaps();
    return roadmaps.find((r) => r.id === id);
  },
  updateProgress: (roadmapId, progress) => {
    const user = authStorage.getUser();
    if (!user) throw new Error("Not authenticated");

    const roadmaps = JSON.parse(
      localStorage.getItem(`roadmaps_${user.id}`) || "[]",
    );
    const roadmap = roadmaps.find((r) => r.id === roadmapId);
    if (roadmap) {
      roadmap.progress = progress;
      localStorage.setItem(`roadmaps_${user.id}`, JSON.stringify(roadmaps));
    }
    return roadmap;
  },
};

export const streakStorage = {
  recordActivity: (userId, activityType, details) => {
    const activities = JSON.parse(
      localStorage.getItem(`activities_${userId}`) || "[]",
    );
    const today = new Date().toISOString().split("T")[0];

    const activity = {
      id: Date.now().toString(),
      type: activityType, // 'problem_solved', 'course_completed', 'quiz_passed', 'learning'
      details,
      date: new Date().toISOString(),
      timestamp: Date.now(),
    };

    activities.push(activity);
    localStorage.setItem(`activities_${userId}`, JSON.stringify(activities));

    // Update streak
    streakStorage.updateStreak(userId);

    return activity;
  },

  getActivities: (userId, limit = 100) => {
    const activities = JSON.parse(
      localStorage.getItem(`activities_${userId}`) || "[]",
    );
    return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  },

  updateStreak: (userId) => {
    const user = authStorage.getUserById(userId);
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = new Date(user.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

    let newStreak = user.streak || 0;
    if (daysDiff === 0) {
      // Same day, streak continues
      newStreak = user.streak;
    } else if (daysDiff === 1) {
      // Next day, increment streak
      newStreak = (user.streak || 0) + 1;
    } else {
      // Streak broken
      newStreak = 1;
    }

    authStorage.updateUser(userId, {
      streak: newStreak,
      lastActiveDate: new Date().toISOString(),
    });

    return newStreak;
  },

  getStreak: (userId) => {
    const user = authStorage.getUserById(userId);
    return user?.streak || 0;
  },

  getActivityStats: (userId) => {
    const activities = JSON.parse(
      localStorage.getItem(`activities_${userId}`) || "[]",
    );

    const stats = {
      totalActivities: activities.length,
      problemsSolved: activities.filter((a) => a.type === "problem_solved")
        .length,
      coursesCompleted: activities.filter((a) => a.type === "course_completed")
        .length,
      quizzesPassed: activities.filter((a) => a.type === "quiz_passed").length,
      learningActivities: activities.filter((a) => a.type === "learning")
        .length,
    };

    return stats;
  },
};

export const progressStorage = {
  saveQuizScore: (userId, roadmapId, quizId, score, totalQuestions) => {
    const quizScores = JSON.parse(
      localStorage.getItem(`quiz_scores_${userId}`) || "[]",
    );
    quizScores.push({
      roadmapId,
      quizId,
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      completedAt: new Date().toISOString(),
    });
    localStorage.setItem(`quiz_scores_${userId}`, JSON.stringify(quizScores));

    // Record activity
    streakStorage.recordActivity(userId, "quiz_passed", {
      roadmapId,
      quizId,
      score: Math.round((score / totalQuestions) * 100),
    });
  },

  getQuizScores: (userId) => {
    return JSON.parse(localStorage.getItem(`quiz_scores_${userId}`) || "[]");
  },

  saveChallengeCompletion: (userId, roadmapId, challengeId, timeSpent) => {
    const completions = JSON.parse(
      localStorage.getItem(`challenge_completions_${userId}`) || "[]",
    );
    completions.push({
      roadmapId,
      challengeId,
      timeSpent,
      completedAt: new Date().toISOString(),
    });
    localStorage.setItem(
      `challenge_completions_${userId}`,
      JSON.stringify(completions),
    );

    // Record activity
    streakStorage.recordActivity(userId, "problem_solved", {
      roadmapId,
      challengeId,
      timeSpent,
    });
  },

  getChallengeCompletions: (userId) => {
    return JSON.parse(
      localStorage.getItem(`challenge_completions_${userId}`) || "[]",
    );
  },

  getStudentAnalytics: (userId) => {
    const quizScores = JSON.parse(
      localStorage.getItem(`quiz_scores_${userId}`) || "[]",
    );
    const completions = JSON.parse(
      localStorage.getItem(`challenge_completions_${userId}`) || "[]",
    );
    const roadmaps = JSON.parse(
      localStorage.getItem(`roadmaps_${userId}`) || "[]",
    );

    const avgQuizScore =
      quizScores.length > 0
        ? Math.round(
            quizScores.reduce((sum, q) => sum + q.percentage, 0) /
              quizScores.length,
          )
        : 0;
    const totalChallengesCompleted = completions.length;
    const totalTimeSpent = completions.reduce(
      (sum, c) => sum + (c.timeSpent || 0),
      0,
    );

    return {
      totalRoadmaps: roadmaps.length,
      averageQuizScore: avgQuizScore,
      totalChallengesCompleted,
      totalTimeSpent,
      quizScores,
      completions,
      roadmaps,
    };
  },
};
