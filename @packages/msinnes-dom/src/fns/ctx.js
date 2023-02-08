import { infra } from '../infra';

const createContext = defaultValue => infra.services.createApiContext(defaultValue);

export { createContext };
