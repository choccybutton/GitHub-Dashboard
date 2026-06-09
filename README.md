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

The app uses GitHub OAuth for authentication. No credentials or tokens are stored on the client.

### Setup GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: GitHub Dashboard
   - **Homepage URL**: Your app URL (e.g., `https://your-firebase-project.web.app`)
   - **Authorization callback URL**: 
     - Development: `http://localhost:5173`
     - Production: `https://your-firebase-project.web.app`
4. Copy the **Client ID** and **Client Secret**

### Development Setup

1. Create a `.env.local` file in the root:
   ```
   VITE_GITHUB_CLIENT_ID=your_github_oauth_app_client_id
   VITE_GITHUB_REDIRECT_URI=http://localhost:5173
   VITE_FUNCTIONS_URL=http://localhost:5001/github-dashboard-642cb/us-central1
   ```

2. Set up Firebase Functions environment:
   ```bash
   cd functions
   npm install
   ```

3. Create a `.env` file in the `functions` directory:
   ```
   GITHUB_CLIENT_ID=your_github_oauth_app_client_id
   GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
   ```

4. Run the Firebase emulator to test locally:
   ```bash
   firebase emulators:start
   ```
   This will run the functions locally at the URL specified in `VITE_FUNCTIONS_URL`

### Production Deployment

1. Deploy Firebase Functions with your secrets:
   ```bash
   firebase functions:config:set github.client_id="your_client_id"
   firebase functions:config:set github.client_secret="your_client_secret"
   firebase deploy --only functions,hosting
   ```

2. Update your `.env.local` with the production functions URL:
   ```
   VITE_FUNCTIONS_URL=https://us-central1-github-dashboard-642cb.cloudfunctions.net
   ```

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
