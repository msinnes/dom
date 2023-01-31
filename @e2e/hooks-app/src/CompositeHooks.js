import { useMemo, useState } from '@new-msinnes/dom';

const TextInput = ({ updateText, text }) => (
  <div>
    <input type="text" oninput={e => updateText(e.target.value)} value={text} />
  </div>
);

const NumberInput = ({ updateNumber, number }) => (
  <div>
    <input type="number" oninput={e => updateNumber(e.target.value)} value={number} />
  </div>
);

const InputDisplay = ({ text, number, memo }) => (
  <>
    <div>{text + ' ' + number}</div>
    <div>{memo}</div>
  </>

);

const CompositeHooks = () => {
  const [text, setText] = useState('text');
  const [number, setNumber] = useState(0);
  const memo = useMemo(() => `${text} ${number}`);

  return (
    <>
      <TextInput updateText={setText} text={text} />
      <NumberInput updateNumber={setNumber} number={number} />
      <InputDisplay text={text} number={number} memo={memo} />
    </>
  );
};

export { CompositeHooks };
