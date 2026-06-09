export const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
export const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI;

export const getAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: 'repo user',
    allow_signup: true,
  });
  return `https://github.com/login/oauth/authorize?${params}`;
};

export const exchangeCodeForToken = async (code) => {
  // Note: In production, this should be done via a backend proxy
  // to avoid exposing your client secret. For now, we'll store the token
  // in localStorage after OAuth callback.
  return code;
};

export const fetchUserRepos = async (token) => {
  try {
    const response = await fetch('https://api.github.com/user/repos', {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch repos');

    const repos = await response.json();
    return repos.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
  } catch (error) {
    console.error('Error fetching repos:', error);
    throw error;
  }
};

export const getRepoStats = async (token, owner, repo) => {
  try {
    const [repoData, issues] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }).then(r => r.json()),
      fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }).then(r => r.json()),
    ]);

    return {
      lastCommit: repoData.pushed_at,
      language: repoData.language,
      openIssues: Array.isArray(issues) ? issues.length : 0,
    };
  } catch (error) {
    console.error('Error fetching repo stats:', error);
    return { lastCommit: null, language: null, openIssues: 0 };
  }
};
