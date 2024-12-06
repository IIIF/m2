import { createContext } from 'react';

const WorkspaceContext = createContext({ current: document.body });

export default WorkspaceContext;
