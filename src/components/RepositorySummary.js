import React, { useEffect, useState } from 'react';
import CommitSummary from './CommitSummary';

const RepositorySummary = ({repo}) => {
  const repoCreatedAt = new Date(repo.created_at);
  const repoCreatedAtFormatted = Intl.DateTimeFormat('en-US').format(repoCreatedAt);

  const [commitsVisible, setCommitsVisible] = useState(false);
  const [commitsList, setCommitsList] = useState([]);

  useEffect(() => {
    if (commitsVisible) {
      const fetchCommits = async () => {
        const response = await fetch(repo.commits_url.replace('{/sha}', ''), {
          headers: {
            'User-Agent': 'cherscarlett',
          },
        });
    
        const data = await response.json();
        setCommitsList(data);
      };

      fetchCommits();
    }
  }, [commitsVisible]);

  return (
    <article className="repository-summary">
      <header>
        <h1>
          <a href={repo.html_url}>{repo.name}</a>
        </h1>
        <div className="repository-summary__meta">
          <time dateTime={repo.created_at}>
            {repoCreatedAtFormatted}
          </time>
          <ul>
            <li className="repository-summary__meta__issues">
              <span>Open Issues:</span> <a href={repo.issues_url}>{repo.open_issues_count}</a>
            </li>
            <li className="repository-summary__meta__forks">
              <span>Forks:</span> <a href={repo.forks_url}>{repo.forks_count}</a>
            </li>
            <li className="repository-summary__meta__stars">
              <span>Stars:</span> <a href={repo.stargazers_url}>{repo.stargazers_count}</a>
            </li>
          </ul>
        </div>
      </header>
      <div className="repository-summary__description">
        {repo.description}
      </div>
      <button className="repository-summary__button" type="button" onClick={() => setCommitsVisible(!commitsVisible)}>{commitsVisible ? 'Hide' : 'Show'} Recent Commits</button>

      {commitsVisible && commitsList.map((commit, index) =>(
        <CommitSummary commit={commit} key={index} />
      ))}
    </article>
  )
};

export default RepositorySummary;