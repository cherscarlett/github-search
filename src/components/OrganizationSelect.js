import React, { useState, useContext } from 'react';

import OrganizationContext from '../contexts/OrganizationContext';

const OrganizationSelect = () => {
  const [error, setError] = useState([]);
  const [orgInputState, setOrgInputState] = useState([]);

  const { organization, setOrganization } = useContext(OrganizationContext);

 const fetchOrganization = async () => {
    const response = await fetch(`https://api.github.com/orgs/${orgInputState}`, {
      headers: {
        Authorization: `token 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`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (response.status !== 200) {
      setError('Please enter a valid Github Organization');
    } else {
      setError(null);
      const data = await response.json();
      setOrganization(data.login);
      const url = new URL(`${window.location.origin}/${data.login}`);
      window.history.pushState({}, '', url);
    }
  };

  const handleOrgInput = (event) => {
    setOrgInputState(event.target.value);
  }

  const handleOrgSet = (event) => {
    event.preventDefault();
    
    if (orgInputState) {
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
        <input type="text" placeholder={organization} value={orgInputState} onChange={handleOrgInput} className={error && 'hasError'} /> 
        <button className="organization-select__button" type="submit">Fetch Repositories</button>
      </form>

      {error}
    </>
  )
};

export default OrganizationSelect;