import { createContext } from 'react';
 
const OrganizationContext = createContext({organization: '', setOrganization: () => {}});

export default OrganizationContext;