import { FetchRequest } from '../FetchRequest';

describe('FetchRequest', () => {
  it('should be a class', () => {
    expect(FetchRequest).toBeAClass();
  });

  describe('instance', () => {
    let instance;
    let configRef;

    beforeEach(() => {
      configRef = {};
      instance = new FetchRequest('url', configRef);
    });

    it('should have a url prop', () => {
      expect(instance.url).toEqual('url');
    });

    it('should have a config prop', () => {
      expect(instance.config).toBeDefined();
      expect(instance.config).toBe(configRef);
    });
  });
});
