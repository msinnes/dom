import { useState } from '@new-msinnes/dom';

const IncrementButton = () => {
  const [state, setState] = useState(0);
  const incrementState = () => {
    setState(state + 1);
  };

  return (
    <div>
      <button onclick={incrementState}>Click {state}</button>
    </div>
  );
};

export { IncrementButton };