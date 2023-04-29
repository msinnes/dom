import { Scope } from '../Scope';

import { DigestibleScope } from '../DigestibleScope';

describe('DigestibleScope', () => {
  it('should be a class', () => {
    expect(DigestibleScope).toBeAClass();
  });

  it('should extend Scope', () => {
    expect(DigestibleScope).toExtend(Scope);
  });

  it('should have an abstract method digest', () => {
    class NoDigestScope extends DigestibleScope {
      enable() {}
      disable() {}
    }
    expect(NoDigestScope).toHaveAbstractMethod('digest');
  });
});
