import * as DOM from '@msinnes/dom';

import { App } from './App';

DOM.createRef(document.body).hydrate(<App />);
