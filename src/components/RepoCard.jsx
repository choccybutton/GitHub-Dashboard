import './RepoCard.css';

export default function RepoCard({ repo, stats }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-card">
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
          <span className="label">Open issues</span>
          <span className="value">{stats?.openIssues ?? 0}</span>
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
