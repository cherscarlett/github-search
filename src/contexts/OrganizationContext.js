import { createContext } from 'react';
 
const OrganizationContext = createContext({organization: {name: '', repositories: []}, setOrganization: () => {}});

export default OrganizationContext;