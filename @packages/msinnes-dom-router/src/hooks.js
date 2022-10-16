import * as DOM from '@msinnes/dom';
import { RouterContext } from "./RouterContext";

export const useLocation = () => DOM.useContext(RouterContext).location;

export const useNavigate = () => DOM.useContext(RouterContext).navigate;

export const useParams = () => DOM.useContext(RouterContext).params;
