import React, { useState, useContext, useEffect } from 'react';
import { writeStorage } from '@rehooks/local-storage';

import OrganizationContext from '../contexts/OrganizationContext';


function setHistory(search) {
  const historyUrl = new URL(`${window.location.origin}/${search}`);
  window.history.pushState({}, '', historyUrl);
}

function getSearchTerm(search) {
  const regex = /(stars+:([0-9]+|[\*])\.\.([0-9]+|[\*]))|(stars+:[\<\>\=]?[\<\>\=][0-9]+)/g;
  if (search.match(regex)) {
    return search;
  } else {
    return false;
  }
}

function isInputQualified(input) {
  const inputArray = input.split(' ');

  return Array.isArray(inputArray);
}

const OrganizationSelect = () => {
  const [error, setError] = useState([]);
  const [searchInputState, setSearchInputState] = useState([]);

  const { organization, setOrganization } = useContext(OrganizationContext);

  const [searchTerm, setSearchTerm] = useState(organization.name);

  useEffect(() => {
    const fetchOrganization = async () => {
      const regex = /^[a-zA-Z0-9]+$/;
      let query;
      let search = searchTerm;
      let url = `https://api.github.com/orgs/${search}`;
      let repositories = [];
  
      if (!search.match(regex)) {
        if (isInputQualified(search)) {
          const values = search.split(' ');
  
          values.forEach(value => {
            query = getSearchTerm(value);
  
            if (query) {
              url = `https://api.github.com/search/repositories?q=org:${search}%20${query}`
            } else if (value.match(regex)) {
              search = value;
            }
          });
        } else {
          setError('Please check your syntax');
          return;
        }
      }

      const storedRepos = sessionStorage.getItem(search) || [];

      if (!storedRepos.length) {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'cherscarlett',
          },
        });
  
        if (response.status !== 200) {
          setError('Please enter a valid Github Organization');
        } else {
          setError(null);
          const data = await response.json();
          
          if (data.items) {
            repositories = data.items;
            writeStorage(search, repositories);
          }
  
          setOrganization({name: search, repositories});
          setHistory(search);
        }
      } else {
        const repos = !JSON.parse(storedRepos);

        setOrganization({name: search, repositories: repos});
        setHistory(search);
      }
    };
    fetchOrganization();
  }, [searchTerm, setHistory, setOrganization, writeStorage]);

  const handleOrgInput = (event) => {
    setSearchInputState(event.target.value);
  }

  const handleOrgSet = (event) => {
    event.preventDefault();
    
    if (searchInputState) {
      setSearchTerm(searchInputState);
    }
  }

  return (
    <>
      <h2>
        Search for Repositories
      </h2>
      <p>Enter an organization's name to search for its Repositories</p>

      <form onSubmit={handleOrgSet}>
        <input type="text" placeholder={organization.name} value={searchInputState} onChange={handleOrgInput} className={error && 'hasError'} /> 
        <button className="organization-select__button" type="submit">Fetch Repositories</button>
      </form>

      {error}
    </>
  )
};

export default OrganizationSelect;