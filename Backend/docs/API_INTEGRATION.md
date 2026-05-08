# API Integration Guide

This guide shows how to use CodePath Backend APIs from your frontend.

## Frontend Setup

### 1. Create API Client

Create `lib/api-client.js`:

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

class APIClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Include cookies for auth
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  }

  // Auth endpoints
  signup(email, password, name) {
    return this.request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  signin(email, password) {
    return this.request("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  logout() {
    return this.request("/api/auth/logout", {
      method: "POST",
    });
  }

  // User endpoints
  getProfile() {
    return this.request("/api/users/profile");
  }

  updateProfile(data) {
    return this.request("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  getProgress() {
    return this.request("/api/users/progress");
  }

  // Roadmap endpoints
  getRoadmaps(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/roadmaps?${query}`);
  }

  getRoadmap(id) {
    return this.request(`/api/roadmaps/${id}`);
  }

  createRoadmap(data) {
    return this.request("/api/roadmaps", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  updateRoadmap(id, data) {
    return this.request(`/api/roadmaps/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  deleteRoadmap(id) {
    return this.request(`/api/roadmaps/${id}`, {
      method: "DELETE",
    });
  }

  // Module endpoints
  getModule(id) {
    return this.request(`/api/modules/${id}`);
  }

  completeModule(id) {
    return this.request(`/api/modules/${id}`, {
      method: "POST",
      body: JSON.stringify({}),
    });
  }

  // Chat endpoints
  getChatHistory(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/chat?${query}`);
  }

  sendMessage(message, roadmapId = null) {
    return this.request("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message,
        roadmap_id: roadmapId,
      }),
    });
  }

  // Gamification endpoints
  getGamificationStats() {
    return this.request("/api/gamification/stats");
  }

  getBadges() {
    return this.request("/api/gamification/badges");
  }

  getLeaderboard(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/leaderboard?${query}`);
  }

  // Course endpoints
  getCourses(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/courses?${query}`);
  }

  enrollCourse(courseId) {
    return this.request("/api/courses", {
      method: "POST",
      body: JSON.stringify({ course_id: courseId }),
    });
  }

  getEnrollments(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/courses/enrollments?${query}`);
  }
}

export const apiClient = new APIClient();
```

---

## Usage Examples

### Authentication

```javascript
import { apiClient } from "@/lib/api-client";

// Sign up
async function handleSignup(email, password, name) {
  try {
    const response = await apiClient.signup(email, password, name);
    console.log("User created:", response.data);
    // Redirect to dashboard
  } catch (error) {
    console.error("Signup failed:", error.message);
  }
}

// Sign in
async function handleSignin(email, password) {
  try {
    const response = await apiClient.signin(email, password);
    console.log("Logged in as:", response.data.name);
    // Redirect to dashboard
  } catch (error) {
    console.error("Signin failed:", error.message);
  }
}

// Logout
async function handleLogout() {
  try {
    await apiClient.logout();
    // Redirect to login
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
}
```

---

### User Profile

```javascript
// Get profile
async function loadProfile() {
  try {
    const response = await apiClient.getProfile();
    console.log("Profile:", response.data);
    // Display user info
  } catch (error) {
    console.error("Failed to load profile:", error.message);
  }
}

// Update profile
async function handleUpdateProfile(updates) {
  try {
    const response = await apiClient.updateProfile(updates);
    console.log("Profile updated:", response.data);
  } catch (error) {
    console.error("Update failed:", error.message);
  }
}

// Get progress
async function loadProgress() {
  try {
    const response = await apiClient.getProgress();
    console.log("Progress:", response.data);
    // Display progress stats
  } catch (error) {
    console.error("Failed to load progress:", error.message);
  }
}
```

---

### Roadmap Management

```javascript
// List roadmaps
async function loadRoadmaps() {
  try {
    const response = await apiClient.getRoadmaps({
      limit: 20,
      offset: 0,
      status: "active",
    });
    console.log("Roadmaps:", response.data.roadmaps);
  } catch (error) {
    console.error("Failed to load roadmaps:", error.message);
  }
}

// Get single roadmap
async function loadRoadmap(roadmapId) {
  try {
    const response = await apiClient.getRoadmap(roadmapId);
    console.log("Roadmap:", response.data);
    // Display modules
  } catch (error) {
    console.error("Failed to load roadmap:", error.message);
  }
}

// Create roadmap
async function handleCreateRoadmap(title, topic, duration) {
  try {
    const response = await apiClient.createRoadmap({
      title,
      topic,
      duration_days: duration,
      generateAI: true,
    });
    console.log("Roadmap created:", response.data._id);
  } catch (error) {
    console.error("Failed to create roadmap:", error.message);
  }
}

// Update roadmap
async function handleUpdateRoadmap(roadmapId, updates) {
  try {
    const response = await apiClient.updateRoadmap(roadmapId, updates);
    console.log("Roadmap updated:", response.data);
  } catch (error) {
    console.error("Failed to update roadmap:", error.message);
  }
}

// Delete roadmap
async function handleDeleteRoadmap(roadmapId) {
  try {
    await apiClient.deleteRoadmap(roadmapId);
    console.log("Roadmap deleted");
  } catch (error) {
    console.error("Failed to delete roadmap:", error.message);
  }
}
```

---

### Module Progress

```javascript
// Get module details
async function loadModule(moduleId) {
  try {
    const response = await apiClient.getModule(moduleId);
    console.log("Module:", response.data);
    // Display module content
  } catch (error) {
    console.error("Failed to load module:", error.message);
  }
}

// Mark module as complete
async function handleCompleteModule(moduleId) {
  try {
    const response = await apiClient.completeModule(moduleId);
    console.log("Module completed!", response.data);
    // Show success toast
    // Update UI
  } catch (error) {
    console.error("Failed to complete module:", error.message);
  }
}
```

---

### Chat & AI Mentor

```javascript
// Get chat history
async function loadChatHistory(roadmapId = null) {
  try {
    const response = await apiClient.getChatHistory({
      limit: 50,
      offset: 0,
      roadmap_id: roadmapId,
    });
    console.log("Chat history:", response.data.messages);
  } catch (error) {
    console.error("Failed to load chat:", error.message);
  }
}

// Send message to AI mentor
async function handleSendMessage(message, roadmapId = null) {
  try {
    const response = await apiClient.sendMessage(message, roadmapId);
    console.log("User message:", response.data.user_message);
    console.log("AI response:", response.data.ai_message);
    // Update chat UI
  } catch (error) {
    console.error("Failed to send message:", error.message);
  }
}
```

---

### Gamification

```javascript
// Get gamification stats
async function loadGamificationStats() {
  try {
    const response = await apiClient.getGamificationStats();
    console.log("Stats:", response.data);
    // {
    //   points: 250,
    //   level: 3,
    //   rank: 15,
    //   streak: { current: 5, longest: 12 },
    //   badges: [...]
    // }
  } catch (error) {
    console.error("Failed to load stats:", error.message);
  }
}

// Get badges
async function loadBadges() {
  try {
    const response = await apiClient.getBadges();
    console.log("Badges:", response.data.badges);
    if (response.data.newly_earned.length > 0) {
      console.log("🎉 New badges:", response.data.newly_earned);
      // Show achievement popup
    }
  } catch (error) {
    console.error("Failed to load badges:", error.message);
  }
}

// Get leaderboard
async function loadLeaderboard() {
  try {
    const response = await apiClient.getLeaderboard({
      limit: 10,
      offset: 0,
    });
    console.log("Top users:", response.data.leaderboard);
  } catch (error) {
    console.error("Failed to load leaderboard:", error.message);
  }
}
```

---

### Courses & Enrollment

```javascript
// List courses
async function loadCourses(category = null) {
  try {
    const response = await apiClient.getCourses({
      limit: 20,
      offset: 0,
      category,
    });
    console.log("Courses:", response.data.courses);
  } catch (error) {
    console.error("Failed to load courses:", error.message);
  }
}

// Enroll in course
async function handleEnrollCourse(courseId) {
  try {
    const response = await apiClient.enrollCourse(courseId);
    console.log("Enrolled!", response.data);
    // Update UI
  } catch (error) {
    console.error("Failed to enroll:", error.message);
  }
}

// Get user enrollments
async function loadEnrollments() {
  try {
    const response = await apiClient.getEnrollments({
      limit: 20,
      offset: 0,
    });
    console.log("Enrollments:", response.data.enrollments);
  } catch (error) {
    console.error("Failed to load enrollments:", error.message);
  }
}
```

---

## Error Handling

```javascript
// Global error handler
async function apiRequest(fn) {
  try {
    const result = await fn();
    return { success: true, data: result };
  } catch (error) {
    if (error.message.includes("Unauthorized")) {
      // Redirect to login
      window.location.href = "/login";
    }
    return { success: false, error: error.message };
  }
}

// Usage
const result = await apiRequest(() => apiClient.getProfile());
if (result.success) {
  console.log("Profile:", result.data);
} else {
  console.error("Error:", result.error);
}
```

---

## React Hooks

```javascript
// useAPI hook
import { useState, useEffect } from "react";

export function useAPI(apiCall) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiCall()
      .then((response) => {
        setData(response.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Usage
function ProfilePage() {
  const {
    data: profile,
    loading,
    error,
  } = useAPI(() => apiClient.getProfile());

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>Hello, {profile?.name}!</div>;
}
```

---

## Testing with cURL

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123","name":"Test User"}'

# Sign in
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123"}' \
  -c cookies.txt

# Get profile (with session cookie)
curl http://localhost:3000/api/users/profile \
  -b cookies.txt

# Create roadmap
curl -X POST http://localhost:3000/api/roadmaps \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title":"React Learning",
    "topic":"React",
    "duration_days":30,
    "generateAI":true
  }'
```

---

## Next Steps

1. Add TypeScript types for API responses
2. Implement request caching
3. Add request interceptors for auth headers
4. Set up offline support with service workers
5. Add performance monitoring
6. Implement optimistic updates

---

See `docs/BACKEND_GUIDE.md` for full API documentation.
