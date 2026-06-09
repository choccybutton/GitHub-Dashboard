import { useState, useEffect } from 'react';
import RepoCard from './components/RepoCard';
import { getAuthUrl, fetchUserRepos, getRepoStats } from './services/github';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('github_token'));
  const [repos, setRepos] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Handle OAuth callback - only run on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code && !token) {
      exchangeCodeForToken(code);
    }
  }, []); // Empty dependency array - run only once on mount

  const exchangeCodeForToken = async (code) => {
    try {
      setLoading(true);
      const functionsUrl = import.meta.env.VITE_FUNCTIONS_URL;

      if (!functionsUrl) {
        setError('Functions URL not configured. Check VITE_FUNCTIONS_URL env var.');
        return;
      }

      console.log('Exchanging code with:', `${functionsUrl}/exchangeGitHubCode`);

      const response = await fetch(
        `${functionsUrl}/exchangeGitHubCode`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        }
      );

      const data = await response.json();
      console.log('Token exchange response:', { status: response.status, hasToken: !!data.token, error: data.error });

      if (data.token) {
        localStorage.setItem('github_token', data.token);
        setToken(data.token);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setError(`Authentication failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      setError(`Authentication failed: ${err.message}`);
      console.error('Token exchange error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch repos when token is available
  useEffect(() => {
    if (token) {
      loadRepos();
    }
  }, [token]);

  const loadRepos = async () => {
    try {
      setLoading(true);
      setError(null);
      const userRepos = await fetchUserRepos(token);
      setRepos(userRepos);

      // Fetch stats for each repo
      const statsMap = {};
      for (const repo of userRepos) {
        statsMap[repo.id] = await getRepoStats(token, repo.owner.login, repo.name);
      }
      setStats(statsMap);
    } catch (err) {
      setError('Failed to load repositories. Check your token.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI;

    if (!clientId) {
      setError('GitHub OAuth not configured. Please set VITE_GITHUB_CLIENT_ID environment variable.');
      return;
    }

    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', 'repo user');

    window.location.href = authUrl.toString();
  };

  const handleLogout = () => {
    localStorage.removeItem('github_token');
    setToken(null);
    setRepos([]);
    setStats({});
    setUser(null);
  };

  if (!token) {
    return (
      <div className="container login-container">
        <div className="login-box">
          <h1>GitHub Dashboard</h1>
          <p>View the status of all your repositories at a glance</p>
          <button onClick={handleLogin} className="login-btn">
            Login with GitHub OAuth
          </button>
          <p className="note">
            You'll be redirected to GitHub to authorize this application.
            <br />
            No tokens are stored on this site—authentication is handled securely.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>GitHub Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading">Loading repositories...</div>
      ) : repos.length === 0 ? (
        <div className="empty">No repositories found</div>
      ) : (
        <div className="repos-grid">
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} stats={stats[repo.id]} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
