import { renderApp, Component } from '@msinnes/dom';

class Page1 extends Component {
  render() {
    return 'Page 1';
  }
}

class Page2 extends Component {
  effect() {
    const originalTitle = window.document.title;
    window.document.title = 'set title';
    return () => {
      window.document.title = originalTitle;
    };
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

  effect() {
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

renderApp(<App />, document.body);