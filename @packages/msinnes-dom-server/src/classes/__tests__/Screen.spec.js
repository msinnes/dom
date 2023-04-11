import { Screen } from '../Screen';

describe('Screen', () => {
  it('should be a class', () => {
    expect(Screen).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    beforeEach(() => {
      instance = new Screen({ html: 'html', url: 'url' });
    });

    it('should have an html prop', () => {
      expect(instance.html).toEqual('html');
    });

    it('should have a url prop', () => {
      expect(instance.url).toEqual('url');
    });
  });
});
