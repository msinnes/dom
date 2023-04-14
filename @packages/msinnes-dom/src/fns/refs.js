import { infra } from '../infra';
import { AppRef } from '../classes/AppRef';

const createRef = render => new AppRef(render);

const useRef = render => infra.hooks.useMemo(() => {
  return createRef(render);
}, []);

export { createRef, useRef };
