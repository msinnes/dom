import { createInfrastructure } from '@internal/infra';

const { hooks, services } = createInfrastructure();

export { hooks, services };