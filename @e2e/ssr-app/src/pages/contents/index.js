import { createRef } from '@new-msinnes/dom';

import { App } from './App';

createRef(document.body).hydrate(<App />);