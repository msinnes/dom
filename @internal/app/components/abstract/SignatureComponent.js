import { AppComponent } from './AppComponent';

class SignatureComponent extends AppComponent {
  canUpdate({ render }) {
    const { signature } = render || {};
    return !!signature && this.signature && signature === this.signature;
  }
}

export { SignatureComponent };