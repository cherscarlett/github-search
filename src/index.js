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
  const name = pathname ? pathname : 'netflix';
  const storedRepos = sessionStorage.getItem(name) || [];
  let repositories = [];

  if (storedRepos.length) {
    repositories = JSON.parse(storedRepos);
  }

  const [repos, setRepos] = useState([]);
  const [organization, setOrganization] = useState({name, repositories});

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
          sessionStorage.setItem(organization.name, JSON.stringify(data));
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
  }, [organization, setRepos, setOrganization]);

  useEffect(() => {
    window.addEventListener('beforeunload', sessionStorage.clear());

    return () => {
      window.removeEventListener('beforeunload', sessionStorage.clear());
    };
  }, []);

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
