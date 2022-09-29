import { abstract } from '@internal/oop/abstract';
import { AppComponent } from './AppComponent';

const IdentitiveComponent = abstract(class extends AppComponent {
  getNextChildren() {
    return [];
  }

  resolve() {
    return this.render();
  }
});

export { IdentitiveComponent };