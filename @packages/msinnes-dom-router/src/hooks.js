import * as DOM from '@msinnes/dom';
import { ParamsContext } from "./ParamsContext";

export const useParams = () => DOM.useContext(ParamsContext);