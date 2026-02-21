# Learn & Grow — Nutrition Education App

## 1. App Summary

Learn & Grow is a gamified nutrition education web application designed to help everyday users build healthy eating habits through structured, bite-sized lessons and quizzes. The problem it addresses is simple: most people lack reliable, engaging, and accessible nutrition knowledge, and existing resources are either too technical or too passive to drive real behavior change. The primary user is a health-conscious individual — a student, young professional, or anyone beginning their wellness journey — who wants to learn about nutrition in an interactive, trackable way. The application presents a sequence of lessons (e.g., Nutrition Basics, Proteins, Healthy Fats) that unlock progressively as the user advances. After reading each lesson, users can take a quiz and must score 60% or higher to mark it complete. Progress is saved to a PostgreSQL database so that users can pick up exactly where they left off across sessions.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 (TypeScript) |
| **Frontend Tooling** | Vite, Tailwind CSS, shadcn/ui, Radix UI |
| **Routing** | React Router DOM v6 |
| **Backend Framework** | Node.js with Express 5 |
| **Database** | PostgreSQL (v12+) |
| **Database Client** | node-postgres (`pg`) |
| **Environment Config** | dotenv |
| **Authentication** | None (demo user auto-login as Alice, user_id = 1) |
| **External Services** | None |

---

## 3. Architecture Diagram

![Architecture Diagram](architecture_png.png)

**Data flow:** The React frontend (Vite dev server on port 8080) makes REST API calls to the Express backend (port 3000). The backend queries the PostgreSQL database using `pg` and returns JSON. No external APIs or third-party services are used.

---

## 4. Prerequisites

Ensure the following are installed before proceeding. Each item includes a verification command to confirm it is available in your system PATH.

**Node.js** (v16 or higher) — [Download here](https://nodejs.org/)
```sh
node --version   # should print v16.x.x or higher
```

**npm** (comes bundled with Node.js)
```sh
npm --version
```

**PostgreSQL** (v12 or higher) — [Download here](https://www.postgresql.org/download/)
```sh
psql --version   # should print psql (PostgreSQL) 12.x or higher
```
> **Windows users:** After installing PostgreSQL, ensure the `bin` folder (e.g., `C:\Program Files\PostgreSQL\16\bin`) is added to your system PATH so that `psql` is accessible from the terminal.

**Git** — [Download here](https://git-scm.com/)
```sh
git --version
```

**A code editor** (VS Code recommended) — [Download here](https://code.visualstudio.com/)

---

## 5. Installation and Setup

### Step 1: Clone the Repository

```sh
git clone <REPOSITORY_URL>
cd learn-grow-ui
```

### Step 2: Install Dependencies

```sh
npm install
```

Or if you prefer Bun ([Download Bun here](https://bun.sh/)):

```sh
bun install
```

### Step 3: Set Up PostgreSQL Database

1. **Start PostgreSQL** on your machine and ensure the service is running.

2. **Open a PostgreSQL client** — either `psql` in your terminal or pgAdmin.

3. **Create the database:**
   ```sql
   CREATE DATABASE nutrition_lessons;
   ```

4. **Run the schema** to create all tables. In `psql`:
   ```sh
   psql -U postgres -d nutrition_lessons -f schema.sql
   ```
   Or open `schema.sql` from the project root in pgAdmin and execute it.

5. **Seed the database** with sample users and lessons:
   ```sh
   psql -U postgres -d nutrition_lessons -f seed.sql
   ```
   Or open `seed.sql` in pgAdmin and execute it.

### Step 4: Configure Environment Variables

The project uses a `.env` file that is **not included in the repository** (it is listed in `.gitignore`). You must create it manually.

In the project root, create a new file named exactly `.env` (no `.example` extension). You can do this from your terminal:

**macOS / Linux:**
```sh
cp .env.example .env
```

**Windows (PowerShell):**
```powershell
copy .env.example .env
```

Then open `.env` in your code editor and fill in your credentials. The file should look like this:

```env
# API Configuration
VITE_API_URL=http://localhost:3000
API_PORT=3000

# Database Configuration
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
VITE_DB_USER=postgres
VITE_DB_PASSWORD=<YOUR_POSTGRES_PASSWORD>
VITE_DB_NAME=nutrition_lessons
```

**Important:** Replace `<YOUR_POSTGRES_PASSWORD>` with your actual PostgreSQL password. If you did not set a password when installing PostgreSQL, try leaving the value blank or using `postgres`.

---

## 6. Running the Application

The application requires **two terminals running simultaneously.**

**Terminal 1 — Start the API Server** (port 3000):
```sh
npm run api
```
You should see: `API server running on port 3000`

**Terminal 2 — Start the Frontend Dev Server** (port 8080):
```sh
npm run dev
```
You should see: `Local: http://localhost:8080/`

**Then open your browser and navigate to:**
```
http://localhost:8080
```

The application will automatically log you in as the demo user Alice. The home page should display three lessons:
1. **Nutrition Basics** — Completed
2. **Proteins** — In Progress
3. **Healthy Fats** — Locked

To stop the application, press `Ctrl+C` in both terminal windows.

---

## 7. Verifying the Vertical Slice

This section walks through the full vertical slice: triggering a feature in the UI, confirming the database was updated, and verifying the change persists after a page refresh.

**The feature:** Completing the "Proteins" quiz marks the lesson as `Completed` in the database and unlocks the next lesson ("Healthy Fats").

### Steps to trigger the feature:

1. Open the app at `http://localhost:8080` — you should see the three lessons with "Proteins" marked as In Progress.
2. Click on **"Proteins"** to open the lesson and read through the material.
3. Click **"Quiz Me"** to start the quiz.
4. Answer the questions and submit. You need a score of **60% or higher** to pass.
5. Upon passing, the app will mark "Proteins" as Completed and "Healthy Fats" should become unlocked on the home screen.

### Confirm the database was updated:

Open pgAdmin or a `psql` terminal and run:

```sql
SELECT * FROM user_lessons WHERE user_id = 1;
```

You should see a row for `lesson_id = 2` (Proteins) with `status = 'Completed'` and a timestamp in the `completed_at` column.

### Verify persistence after refresh:

1. Refresh the browser page (`Ctrl+R` or `F5`).
2. The home screen should still show **Proteins** as Completed and **Healthy Fats** as unlocked — confirming the state was read back from the database and not just held in memory.
