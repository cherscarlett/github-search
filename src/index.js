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
  const [organization, setOrganization] = useState({name: pathname ? pathname : 'Netflix', repositories: []});

  useEffect(() => {
    if (organization && !organization.repositories.length) {
      const fetchRepos = async () => {
        const response = await fetch(`https://api.github.com/orgs/${organization.name}/repos`, {
          headers: {
            'User-Agent': 'cherscarlett',
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
    } else if (organization.repositories) {
      setRepos(organization.repositories);
    }
  }, [organization]);

  return (
    <OrganizationContext.Provider value={{organization, setOrganization}}>
      <div className="App">
        <h1>Github Repo Search</h1>
        <OrganizationSelect />

        <h2>{organization.name}</h2>
        {repos.map((repo, index) => (
          <RepositorySummary repo={repo} key={index} />
        ))}
      </div>
    </OrganizationContext.Provider>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
