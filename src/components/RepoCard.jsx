import './RepoCard.css';

export default function RepoCard({ repo, stats }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatSize = (sizeKb) => {
    if (sizeKb < 1024) return `${sizeKb} KB`;
    if (sizeKb < 1024 * 1024) return `${(sizeKb / 1024).toFixed(1)} MB`;
    return `${(sizeKb / (1024 * 1024)).toFixed(1)} GB`;
  };

  const getActivityStatus = () => {
    if (!stats?.lastCommit) return 'unknown';

    const lastCommit = new Date(stats.lastCommit);
    const now = new Date();
    const daysSinceCommit = (now - lastCommit) / (1000 * 60 * 60 * 24);

    if (daysSinceCommit <= 90) return 'green';
    if (daysSinceCommit <= 180) return 'amber';
    return 'red';
  };

  return (
    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className={`repo-card status-${getActivityStatus()}`}>
      <div className="repo-header">
        <h3>{repo.name}</h3>
        {stats?.language && <span className="language">{stats.language}</span>}
      </div>

      {repo.description && <p className="description">{repo.description}</p>}

      <div className="stats">
        <div className="stat">
          <span className="label">Last commit</span>
          <span className="value">{stats?.lastCommit ? formatDate(stats.lastCommit) : 'N/A'}</span>
        </div>
        <div className="stat">
          <span className="label">Size</span>
          <span className="value">{repo.size ? formatSize(repo.size) : 'N/A'}</span>
        </div>
        <div className="stat">
          <span className="label">Issues</span>
          <span className="value">{stats?.openIssues ?? 0}</span>
        </div>
        <div className="stat">
          <span className="label">Pull requests</span>
          <span className="value">{stats?.openPRs ?? 0}</span>
        </div>
        <div className="stat">
          <span className="label">Stars</span>
          <span className="value">{repo.stargazers_count}</span>
        </div>
      </div>

      <div className="footer">
        {repo.private && <span className="badge private">Private</span>}
        {repo.fork && <span className="badge fork">Fork</span>}
      </div>
    </a>
  );
}
