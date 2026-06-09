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

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code && !token) {
      // Exchange code for token via your backend
      // For now, we'll use the code as a temporary measure
      // In production, you need a backend to securely exchange the code for a token
      alert(
        'OAuth code received! You need to set up a backend to securely exchange this code for a GitHub token. See the README for setup instructions.'
      );
    }
  }, [token]);

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
    // For development, you can manually enter a token
    const devToken = prompt('Enter your GitHub Personal Access Token (for development):');
    if (devToken) {
      localStorage.setItem('github_token', devToken);
      setToken(devToken);
    }
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
            Login with GitHub
          </button>
          <p className="note">
            For now, use a Personal Access Token with 'repo' and 'user' scopes.
            <br />
            <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">
              Create a token here
            </a>
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
