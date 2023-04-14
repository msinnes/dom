import * as DOM from '@msinnes/dom';

const UseRefTitle = () => {
  const Div = DOM.useRef('div');
  return <Div>Application that uses all hooks</Div>;
};

export { UseRefTitle };
