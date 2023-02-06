import * as DOM from '@new-msinnes/dom';

import { RouterContext } from './RouterContext';

const useLocation = () => DOM.useContext(RouterContext).location;

const useNavigate = () => DOM.useContext(RouterContext).navigate;

const useParams = () => DOM.useContext(RouterContext).params;

export { useLocation, useNavigate, useParams };