import React, { useState, useContext, useEffect } from 'react';

import OrganizationContext from '../contexts/OrganizationContext';

const errors =  {
  notStars: 'You may only filter by a range of stars, e.g. stars:1..50',
  usedADash: 'You can search a range of stars using .., e.g. stars:1..50 or stars:50..*',
  wrongSyntax: 'You can search stars using a range, e.g. 1..50, or comparison symbols like stars:<=50 or stars:>50',
  tooManySearchTerms: 'You can only search for one organization at a time, and optionally, filter by stars, e.g. airbnb stars:1..50'
}

function setHistory(search) {
  const historyUrl = new URL(`${window.location.origin}/${search}`);
  window.history.pushState({}, '', historyUrl);
}

function getSearchTerm(search) {
  const regex = /(stars+:([0-9]+|[\*])\.\.([0-9]+|[\*]))|(stars+:[\<\>\=]?[\<\>\=][0-9]+)/g;
  if (search.match(regex)) {
    return search;
  } else {
    const terms = search.split(':');

    if (terms.length === 2) {
      if (!terms.includes('stars')) {
        return errors.notStars;
      }

      for (let i = 0; i <= 1; i++) {
        const term = terms[i];

        if (term.match(/([0-9]+|[\*])\-([0-9]+|[\*])/g)) {
          return errors.usedADash;
        } else if (!term.match(/^[a-zA-Z0-9]+$/)) {
          return errors.wrongSyntax;
        }
      }
    }

    return false;
  }
}

function isInputQualified(input) {
  const inputArray = input.split(' ');

  return Array.isArray(inputArray);
}

const OrganizationSelect = () => {
  const [error, setError] = useState(null);
  const [searchInputState, setSearchInputState] = useState([]);

  const { organization, setOrganization } = useContext(OrganizationContext);

  const [searchTerm, setSearchTerm] = useState(organization.name);

  useEffect(() => {
    const fetchOrganization = async () => {
      setError(null);
      const regex = /^[a-zA-Z0-9]+$/;
      let query;
      let search = searchTerm;
      let url = `https://api.github.com/orgs/${search}`;
      let repositories = [];
  
      if (!search.match(regex)) {
        if (isInputQualified(search)) {
          const values = search.split(' ');

          if (values.length > 2) {
            setError(errors.tooManySearchTerms);

            return;
          }
  
          values.forEach(value => {
            query = getSearchTerm(value);
            if (value.match(regex)) {
              search = value;
            }
          });
        } else {
          setError(errors.tooManySearchTerms);

          return;
        }

        if (search && query) {
          if (Object.values(errors).indexOf(query) > -1) {
            setError(query);
          } else {
            url = `https://api.github.com/search/repositories?q=org:${search}%20${query}`;
          }
        } 
      }
      
      const storedRepos = sessionStorage.getItem(`${search}+${query}`) || [];

      if (!storedRepos.length && !error && Object.values(errors).indexOf(query) === -1) {
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
            !query && sessionStorage.setItem(search, JSON.stringify(repositories));
          }
  
          setOrganization({name: search, repositories});
          setHistory(search);
        }
      } else if (storedRepos.length) {
        const repos = !JSON.parse(storedRepos);

        setOrganization({name: search, repositories: repos});
        setHistory(search);
      } else {
        return;
      }
    }

    fetchOrganization();
  }, [searchTerm, setHistory, setOrganization]);

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
      <p className='filter-hint'>You can also filter by star count, eg `airbnb stars:1..50`</p>

      <form onSubmit={handleOrgSet}>
        <input type="text" placeholder={organization.name} value={searchInputState} onChange={handleOrgInput} className={error && 'hasError'} /> 
        <button className="organization-select__button" type="submit">Fetch Repositories</button>
      </form>

      {error && <span className="error">{error}</span>}
    </>
  )
};

export default OrganizationSelect;