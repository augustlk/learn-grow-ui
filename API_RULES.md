# API Rules & Contributor Guidelines
# NutriLearn — User Tracking Workflow

> **Read this before making any changes to the app.**
> Every editor must follow these rules to avoid breaking the API workflow,
> user authentication, or per-user data tracking.

---

## 1. How User Identity Works

When a user logs in, the server returns a **JWT token** and a **userId**.
Both are stored in `localStorage`:

```
localStorage["token"]  → JWT string (used to authenticate every API request)
localStorage["userId"] → number as string (convenience reference)
```

The full user object (including `user_id`, `email`, `first_name`, `last_name`,
`current_streak`, `profile_picture`) is loaded from `GET /api/auth/me` and
stored in the **UserContext** (`src/hooks/useUserContext.tsx`).

**Rule:** Never hardcode a userId. Always read it from the UserContext:

```tsx
// CORRECT
const { user } = useUser();
const userId = user?.user_id;

// WRONG — never do this
const userId = 1;
const userId = localStorage.getItem("userId");
```

---

## 2. How to Make API Calls

All API calls must go through `apiFetch()` from `src/lib/api.ts`.
This function automatically:
- Prepends `VITE_API_URL` so it hits the right server port
- Attaches the `Authorization: Bearer {token}` header
- Redirects to `/auth` if the server returns 401

```ts
import { apiFetch } from "@/lib/api";

// GET example
const data = await apiFetch(`/users/${user.user_id}/lessons`);

// POST example
const data = await apiFetch(`/users/${user.user_id}/lessons/${lessonId}/complete`, {
  method: "POST",
});
```

**Rule:** Never use raw `fetch()` for API calls inside the app.
The only exception is `src/pages/Auth.tsx` (login/register), which runs
before a token exists and manually prepends `import.meta.env.VITE_API_URL`.

---

## 3. Which Pages Are Protected

Wrap any page that requires a logged-in user with `<ProtectedRoute>` in `src/App.tsx`.
If a user visits a protected page without a token, they are redirected to `/auth`
and the intended URL is saved so they are returned there after login.

```tsx
// CORRECT — user must be logged in
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

// CORRECT — public page, no auth needed
<Route path="/auth" element={<Auth />} />
```

**Rule:** Any page that calls `user.user_id` must be wrapped in `<ProtectedRoute>`.

---

## 4. Adding a New Page That Uses User Data

Follow these steps every time you add a new page that reads or writes user data:

### Step 1 — Add the route in `src/App.tsx`

```tsx
import MyNewPage from "./pages/MyNewPage";

<Route path="/my-new-page" element={<ProtectedRoute><MyNewPage /></ProtectedRoute>} />
```

### Step 2 — Get the user inside your page

```tsx
import { useUser } from "@/hooks/useUserContext";

const MyNewPage = () => {
  const { user } = useUser();

  if (!user) return null; // user is still loading

  // safe to use user.user_id from here
};
```

### Step 3 — Call the API using apiFetch

```tsx
import { apiFetch } from "@/lib/api";

useEffect(() => {
  apiFetch(`/users/${user.user_id}/my-endpoint`)
    .then((data) => setState(data.data))
    .catch(console.error);
}, [user.user_id]);
```

### Step 4 — Add the server endpoint in `api/server.mjs`

```js
app.get('/api/users/:userId/my-endpoint', authMiddleware, async (req, res) => {
  if (!checkUser(req, res)) return; // always include this line

  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT ... FROM SomeTable WHERE user_id = $1',
      [userId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
```

**Rule:** Every user-specific endpoint must call `checkUser(req, res)`.
This confirms the token's userId matches the userId in the URL.
Without it, any logged-in user could read another user's data.

---

## 5. Server Endpoint Rules

### Auth requirements

| Endpoint type | Requires `authMiddleware`? | Requires `checkUser()`? |
|---|---|---|
| Public data (lesson cards, quiz questions, all badges) | No | No |
| User-specific data (progress, results, preferences) | **Yes** | **Yes** |
| Auth endpoints (login, register) | No | No |

### Route ordering rule

Express matches routes top to bottom. Static path segments must come
**before** dynamic ones. Never put `/:param` above a static route with the same prefix.

```js
// CORRECT ORDER
app.get('/api/users/:userId/lessons/in-progress', ...); // static segment first
app.get('/api/users/:userId/lessons/:lessonId', ...);   // dynamic segment second

// WRONG ORDER — "in-progress" gets captured as :lessonId
app.get('/api/users/:userId/lessons/:lessonId', ...);
app.get('/api/users/:userId/lessons/in-progress', ...);
```

### Response format

All endpoints must return the same shape so the frontend can handle them consistently:

```js
// Success
res.json({ success: true, data: result.rows });

// Success with no data
res.json({ success: true });

// Error
res.status(500).json({ success: false, error: err.message });

// Not found
res.status(404).json({ success: false, error: 'Not found' });
```

---

## 6. Complete API Endpoint Reference

### Auth (no token required)
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create account (requires `email`, `password`, `first_name`, `last_name`) |
| POST | `/api/auth/login` | Login (returns `token` + `userId`) |
| GET | `/api/auth/me` | Get current user object from token |

### Public Lesson Data (no token required)
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/units` | Get all units and their lessons |
| GET | `/api/lessons/:lessonId/cards` | Get lesson cards |
| GET | `/api/lessons/:lessonId/quiz` | Get quiz questions with answers |
| GET | `/api/badges` | Get all available badges |

### User Lesson Progress (token + userId match required)
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/users/:userId/lessons` | Get all user lessons with status |
| GET | `/api/users/:userId/lessons/in-progress` | Get in-progress lessons |
| GET | `/api/users/:userId/lessons/:lessonId` | Get progress for one lesson |
| POST | `/api/users/:userId/lessons/:lessonId/progress` | Save current card position |
| POST | `/api/users/:userId/lessons/:lessonId/complete` | Mark lesson as complete |

### Quiz Results (token + userId match required)
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/users/:userId/quiz/:quizId/result` | Save quiz score and pass/fail |

### Badges (token + userId match required)
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/users/:userId/badges` | Get badges earned by user |
| POST | `/api/users/:userId/badges/:badgeId/award` | Award a badge to user |

### Stats & Preferences (token + userId match required)
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/users/:userId/stats` | Get aggregated user stats |
| GET | `/api/users/:userId/preferences` | Get reminder settings |
| PATCH | `/api/users/:userId/preferences` | Update reminder settings |

### Profile Picture (token + userId match required)
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/users/:userId/profile-picture` | Upload base64 profile picture |
| DELETE | `/api/users/:userId/profile-picture` | Remove profile picture |

---

## 7. How User Data Flows Per Page

### Home (`/`) — `src/pages/Index.tsx`
- Reads: `user.user_id` from context
- Calls: `useUserLessonsWithStatus(user.user_id)` — merges unit catalog with user progress
- Displays: lesson nodes with locked/active/completed state

### Lesson (`/lesson?lessonId=N`) — `src/pages/Lesson.tsx`
- On load: `GET /api/lessons/:lessonId/cards` (public)
- On load: `GET /api/users/:userId/lessons/:lessonId` → restores saved card position
- On card change: `POST /api/users/:userId/lessons/:lessonId/progress` → saves position
- On finish: navigates to `/quiz?lessonId=N`

### Quiz (`/quiz?lessonId=N`) — `src/pages/Quiz.tsx`
- On load: `GET /api/lessons/:lessonId/quiz` (public)
- On complete: `POST /api/users/:userId/quiz/:quizId/result` → saves score
- If passed: `POST /api/users/:userId/lessons/:lessonId/complete` → marks lesson done
- If passed: runs `checkBadges(userId)` → awards any newly earned badges

### Profile (`/profile`) — `src/pages/Profile.tsx`
- Calls: `useUserLessonsWithStatus(user.user_id)` and `useInProgressLessons(user.user_id)`
- Calls: `GET /api/users/:userId/badges`
- On photo upload: `POST /api/users/:userId/profile-picture` with base64 string
- On photo delete: `DELETE /api/users/:userId/profile-picture`

### Badges (`/badges`) — `src/pages/Badges.tsx`
- Calls: `GET /api/badges` (all badges, public)
- Calls: `GET /api/users/:userId/badges` (which ones user earned)
- Merges both lists to show earned vs locked

### Settings (`/settings`) — `src/pages/Settings.tsx`
- Calls: `GET /api/users/:userId/preferences` on load
- Calls: `PATCH /api/users/:userId/preferences` on any setting change

---

## 8. Badge Award Workflow

Badges are checked automatically after every passed quiz.
Do not award badges manually. The flow is handled in `src/lib/checkBadges.ts`:

1. Fetch in parallel: all badges, user's earned badges, user lessons, user stats
2. Compare user stats against each badge's requirement
3. For any badge not yet earned but now qualified: call `POST /api/users/:userId/badges/:badgeId/award`
4. Return array of newly awarded badges — Quiz page shows a toast notification for each

**Rule:** If you add a new badge to the `Badges` table, also add its requirement
check logic inside `checkBadges.ts`. The frontend will pick it up automatically.

---

## 9. Adding a New Feature Checklist

Use this checklist every time you add a feature that touches user data:

- [ ] New server endpoint added to `api/server.mjs`
- [ ] Endpoint uses `authMiddleware` if it accesses user data
- [ ] Endpoint calls `checkUser(req, res)` if the URL contains `:userId`
- [ ] Response follows `{ success: true, data: ... }` format
- [ ] Static routes placed above dynamic routes (e.g. `/in-progress` before `/:lessonId`)
- [ ] Frontend uses `apiFetch()` — not raw `fetch()`
- [ ] Page wrapped in `<ProtectedRoute>` if it requires login
- [ ] Route added to `src/App.tsx` with correct import
- [ ] User ID read from `useUser()` — not hardcoded or from localStorage directly

---

## 10. What Must Never Change

These are load-bearing parts of the system. Changing them will break the app
for all users. Do not modify without team discussion:

| Item | Location | Why it matters |
|---|---|---|
| `apiFetch()` signature | `src/lib/api.ts` | Every API call in the app depends on it |
| `UserContext` shape (`user_id`, `email`, etc.) | `src/hooks/useUserContext.tsx` | All pages read from this |
| JWT secret fallback | `api/server.mjs` line 16 | Changing breaks all existing tokens |
| `checkUser()` function | `api/server.mjs` | Removing it exposes all user data |
| `ProtectedRoute` logic | `src/components/ProtectedRoute.tsx` | Removing it exposes protected pages |
| localStorage keys (`token`, `userId`) | Used across the app | Renaming breaks login persistence |
