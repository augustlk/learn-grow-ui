# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How to Run on Local Machine

This guide will help you set up and run the Learn & Grow nutrition education application locally. The application consists of a React frontend and a Node.js/Express backend API connected to a PostgreSQL database.

### Prerequisites

Before getting started, ensure you have the following installed on your machine:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **Bun** - [Download Bun here](https://bun.sh/) (optional, but recommended)
- **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)
- **A code editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)

### Step 1: Clone the Repository

```sh
git clone <REPOSITORY_URL>
cd learn-grow-ui
```

### Step 2: Install Dependencies

```sh
npm install
```

Or if you prefer Bun:

```sh
bun install
```

### Step 3: Set Up PostgreSQL Database

1. **Start PostgreSQL** on your machine (ensure the service is running)

2. **Create a new database** named `nutrition_lessons`:
   ```sql
   CREATE DATABASE nutrition_lessons;
   ```

3. **Create the database schema**:
   - Open [schema.sql](schema.sql) from the project root
   - Copy and paste the contents into your PostgreSQL client (pgAdmin, psql, etc.)
   - Execute the SQL to create the `users` and `user_lessons` tables

4. **Seed the database** with sample data:
   - Open [seed.sql](seed.sql) from the project root
   - Copy and paste the contents into your PostgreSQL client
   - Execute the SQL to populate the database with sample users and lessons

### Step 4: Configure Environment Variables

The `.env` file in the project root contains necessary configuration. Verify/update the following variables:

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

**Important**: Make sure to replace `<YOUR_POSTGRES_PASSWORD>` with your actual PostgreSQL password.

### Step 5: Start the Application

The application requires two servers running simultaneously:

**Terminal 1 - Start the API Server** (port 3000):
```sh
npm run api
```

You should see: `API Server running on port 3000`

**Terminal 2 - Start the Development Server** (port 8080):
```sh
npm run dev
```

You should see: `Local: http://localhost:8080/`

### Step 6: Access the Application

Open your web browser and navigate to:

```
http://localhost:8080
```

The application will automatically log you in as the demo user (Alice). You should see the home page displaying 3 lessons:
1. Nutrition Basics (Completed)
2. Proteins (In Progress)
3. Healthy Fats (Locked)

### Testing the Application

1. **View a lesson**: Click on "Proteins" to read the lesson material
2. **Take a quiz**: Click "Quiz Me" to attempt the quiz (get 60% or higher to pass)
3. **Verify database persistence**: Complete the quiz, then refresh the page - your progress should be saved
4. **Check database**: Open pgAdmin and query `SELECT * FROM user_lessons WHERE user_id = 1;` to verify the completion status

### Troubleshooting

**Issue: "Cannot connect to database"**
- Ensure PostgreSQL is running on your machine
- Verify the database credentials in `.env` match your PostgreSQL setup
- Check that the `nutrition_lessons` database exists

**Issue: "API not responding" (port 3000 error)**
- Ensure the API server is running in Terminal 1 (`npm run api`)
- Check that port 3000 is not in use by another application
- Verify the `.env` file has `API_PORT=3000`

**Issue: "Page showing 'Connecting to API...'" for a long time**
- Check that both servers are running (Terminal 1 and Terminal 2)
- Open browser Developer Tools (F12) → Console tab to see any error messages
- Verify `VITE_API_URL=http://localhost:3000` in `.env`

**Issue: "Cannot find module" after fresh install**
- Try deleting `node_modules` folder and `.env` cache:
  ```sh
  rm -r node_modules
  npm install
  ```
- Or on Windows:
  ```powershell
  Remove-Item -Recurse node_modules
  npm install
  ```

### Stopping the Application

Press `Ctrl+C` in both terminal windows to stop the servers.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
