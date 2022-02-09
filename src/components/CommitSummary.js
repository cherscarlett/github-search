import React from 'react';

const CommitSummary = ({commit}) => {
  const date = new Date(commit.commit.committer.date);
  const dateFormatted = Intl.DateTimeFormat('en-US').format(date);

  const author = commit.author && 
    <a href={commit.author.url}>
      <img alt={`avatar of ${commit.commit.author.name}`} src={commit.author.avatar_url} />
      {commit.commit.author.name}
    </a>;

  return (
    <ul className="commit-summary">
      <li className="commit-summary__author">
        {author}
      </li>
      <li className="commit-summary__message">{commit.commit.message}</li>
      <li className="commit-summary__time">
        <time dateTime={commit.commit.committer.date}>
          {dateFormatted}
        </time>
      </li>
      <li className="commit-summary__sha">
        <a href={commit.url}>
          {commit.sha}
        </a>
      </li>
    </ul>
  );
}

export default CommitSummary;