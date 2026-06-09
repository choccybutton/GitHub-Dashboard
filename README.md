# GitHub Dashboard

A React app to view the status of all your GitHub repositories at a glance.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a GitHub Personal Access Token (for development)

1. Go to https://github.com/settings/tokens/new
2. Select scopes: `repo` and `user`
3. Generate the token and copy it
4. When you run the app, paste this token when prompted

### 3. Run development server

```bash
npm run dev
```

The app will start at `http://localhost:5173`

## Authentication

### Current: Personal Access Token (Development)

For development, the app uses a personal access token. You'll be prompted to enter it when you open the app.

### Future: GitHub OAuth

To set up full GitHub OAuth:

1. Create a GitHub OAuth App:
   - Go to https://github.com/settings/developers
   - Click "New OAuth App"
   - Fill in details (Authorization callback URL should match your deployment URL)
   - Copy the Client ID

2. Create a `.env.local` file:
   ```
   VITE_GITHUB_CLIENT_ID=your_client_id
   VITE_GITHUB_REDIRECT_URI=http://localhost:5173
   ```

3. Set up a backend server to securely exchange the OAuth code for a token (keeps your client secret safe)

## Features

- View all your owned repositories
- See repository status:
  - Last commit date
  - Programming language
  - Number of open issues
  - Star count
- Quick links to each repository
- Private/Fork badges

## Build for production

```bash
npm run build
```

## Deploy to Firebase

### Initial Setup

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Authenticate: `firebase login`
3. Initialize Firebase project:
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Public directory: `dist`
   - Single-page app: Yes
   - Overwrite files: No

### Build & Deploy

#### Manual deployment
```bash
npm run build
firebase deploy
```

Or use the shortcut:
```bash
npm run deploy
```

#### Automatic deployment (GitHub Actions)
Set up a GitHub Actions workflow to deploy automatically on commits:
1. Add Firebase token as a secret: `FIREBASE_TOKEN`
2. Create `.github/workflows/deploy.yml` with Firebase CLI commands
3. Every commit to main will trigger an automatic deployment

Your app will be live at: `https://your-firebase-project.web.app`

## Next steps

- Add OAuth integration with backend
- Add ability to view followed repositories
- Add filtering/search
- Add more detailed repository information (collaborators, recent activity, etc.)
- Add deployment status indicator
- Add ability to sort/filter by activity status or project size
