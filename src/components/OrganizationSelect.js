import React, { useState, useContext } from 'react';

import OrganizationContext from '../contexts/OrganizationContext';

const OrganizationSelect = () => {
  const [error, setError] = useState([]);
  const [searchInputState, setSearchInputState] = useState([]);

  const { organization, setOrganization } = useContext(OrganizationContext);

 const fetchOrganization = async () => {
    const regex = /^[a-zA-Z0-9]+$/;
    let query;
    let search = searchInputState;
    let url = `https://api.github.com/orgs/${search}`;
    let repositories = [];

    if (!searchInputState.match(regex)) {
      if (isInputQualified(searchInputState)) {
        const values = searchInputState.split(' ');

        values.forEach(value => {
          query = getSearchTerm(value);

          if (query) {
            url = `https://api.github.com/search/repositories?q=org:${search}%20${query}`
          } else if (value.match(regex)) {
            setSearchInputState(value)
            search = value;
          }
        });
      } else {
        setError('Please check your syntax');
        return;
      }
    }

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
      }

      setOrganization({name: search, repositories});
      const historyUrl = new URL(`${window.location.origin}/${search}`);
      window.history.pushState({}, '', historyUrl);
    }
  };

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

  const handleOrgInput = (event) => {
    setSearchInputState(event.target.value);
  }

  const handleOrgSet = (event) => {
    event.preventDefault();
    
    if (searchInputState) {
      fetchOrganization();
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