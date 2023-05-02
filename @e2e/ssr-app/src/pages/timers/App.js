import * as DOM from '@msinnes/dom';

const App = () => {
  const [text1, setText1] = DOM.useState('setTimeout default text');
  const [text2, setText2] = DOM.useState('clearInterval default text');
  DOM.useEffect(() => {
    setTimeout(() => {
      setText1('setTimeout async text');
    });
  }, []);
  DOM.useEffect(() => {
    setInterval(() => {
      setText2('setInterval async text');
    });
  }, []);
  return (
    <div>
      <p>{text1}</p>
      <p>{text2}</p>
    </div>
  );
};

export { App };