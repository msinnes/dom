import { useState } from '@msinnes/dom';

import { AddItem } from './AddItem';
import { ItemList } from './ItemList';

const Content = () => {
  const [inputOpen, setInputOpen] = useState(false);

  return inputOpen ? (
    <AddItem setInputOpen={setInputOpen} />
    ) : (
    <ItemList setInputOpen={setInputOpen} />
  );
};

// Keep this to show class w/ state v. function w/ hooks
// class Content extends Component {
//   state = {
//     inputOpen: false,
//   };

//   setInputOpen(bool) {
//     this.setState({ inputOpen: bool });
//   }

//   render() {
//     const { inputOpen } = this.state;
//     const setInputOpen = open => this.setInputOpen(open);
//     return inputOpen ? (
//       <AddItem setInputOpen={setInputOpen} />
//       ) : (
//       <ItemList setInputOpen={setInputOpen} />
//     );
//   }
// }

export { Content };