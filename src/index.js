import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import OrganizationSelect from './components/OrganizationSelect';
import RepositorySummary from './components/RepositorySummary';
import OrganizationContext from './contexts/OrganizationContext';

import './styles.css';

/**
 * Refer to the README for instructions on completing the exercise
 */

const App = () => {
  const pathname = encodeURIComponent(window.location.pathname.replace('/', ''));

  const [repos, setRepos] = useState([]);
  const [organization, setOrganization] = useState(pathname ? pathname : 'Netflix');

  useEffect(() => {
    if (organization) {
      const fetchRepos = async () => {
        const response = await fetch(`https://api.github.com/orgs/${organization}/repos`, {
          headers: {
            Authorization: `token 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`,
            Accept: 'application/vnd.github.v3+json',
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          setRepos(data);
        } else {
         const url = new URL(window.location.origin);
          window.history.pushState({}, '', url);
          setOrganization('Netflix');
        }
      };
      fetchRepos();
    }
  }, [organization]);

  return (
    <OrganizationContext.Provider value={{organization, setOrganization}}>
      <div className="App">
        <h1>Github Repo Search</h1>
        <OrganizationSelect />

        <h2>{organization}</h2>
        {repos.map((repo, index) => (
          <RepositorySummary repo={repo} key={index} />
        ))}
      </div>
    </OrganizationContext.Provider>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
