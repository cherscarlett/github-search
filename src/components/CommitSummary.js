import React from 'react';
import '@github/clipboard-copy-element';

const CommitSummary = ({commit}) => {
  const date = new Date(commit.commit.committer.date);
  const dateFormatted = Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);

  const author = commit.author ? 
    <a className="commit-summary__author__name" title={`View ${commit.author.name} on Github`} href={commit.author.html_url}>
      <div className="commit-summary__author__image">
        <img alt={`Avatar of ${commit.commit.author.name}`} src={commit.author.avatar_url} />
      </div>
      {commit.commit.author.name}
    </a> : <div>
      {commit.commit.author.name}
    </div>;

  return (
    <ul className="commit-summary">
      <li className="commit-summary__message">{commit.commit.message}</li>
      <li className="commit-summary__author">
        {author}
        <span className="commit-summary__time">
          &nbsp;committed on&nbsp;
          <time dateTime={commit.commit.committer.date}>
            {dateFormatted}
          </time>
        </span>
      </li>
      <li className="commit-summary__sha">
        <a title="View commit details on Github" href={commit.html_url}>
          <span id="sha">{commit.sha.substring(0,6)}</span>
        </a>
        <clipboard-copy title="Copy full sha" for="sha">
          <span aria-label="Copy full sha" role="img">📋</span>
        </clipboard-copy>
      </li>
    </ul>
  );
}

export default CommitSummary;