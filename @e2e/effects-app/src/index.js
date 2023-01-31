import { createRef, Component } from '@new-msinnes/dom';

class Page1 extends Component {
  render() {
    return 'Page 1';
  }
}

class Page2 extends Component {
  componentDidMount() {
    this.originalTitle = window.document.title;
    window.document.title = 'set title';
  }

  componentWillUnmount() {
    window.document.title = this.originalTitle;
  }

  render() {
    return 'Page 2';
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageTwoOpen: false,
    };

    this.togglePageTwoOpen = this.togglePageTwoOpen.bind(this);
  }

  componentDidMount() {
    window.document.title = 'default title';
  }

  togglePageTwoOpen() {
    this.setState({ pageTwoOpen: !this.state.pageTwoOpen });
  }

  render() {
    return [
      <button type="button" onclick={this.togglePageTwoOpen}>Click Me</button>,
      this.state.pageTwoOpen ? <Page2 /> : <Page1 />,
    ];
  }
}

createRef(document.body).render(<App />);