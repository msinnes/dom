import * as DOM from '@msinnes/dom';

const App = () => {
  const [text, setText] = DOM.useState('default text');
  DOM.useEffect(() => {
    setTimeout(() => {
      setText('async text');
    });
  }, []);
  return text;
};

export { App };