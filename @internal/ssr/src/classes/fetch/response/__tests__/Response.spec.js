import { Response } from '../Response';

describe('Response', () => {
  it('should be a class', () => {
    expect(Response).toBeAClass();
  });

  describe('instance', () => {
    let mockContext;

    let instance;
    beforeEach(() => {
      mockContext = {
        getData: jest.fn(),
        ok: false,
      };

      instance = new Response(mockContext);
    });

    describe('ok', () => {
      it('should return the ok value from the mock context', () => {
        expect(instance.ok).toBe(false);
        mockContext.ok = true;
        expect(instance.ok).toBe(true);
      });

      it('should be a read-only prop', () => {
        expect(() => {
          instance.ok = true;
        }).toThrow();
      });
    });

    describe('json', () => {
      it('should be a function', () => {
        expect(instance.json).toBeInstanceOf(Function);
      });

      it('should return the data in the value slot wrapped in a promise', () => {
        const mockData = {};
        mockContext.getData.mockReturnValue(mockData);
        instance.json().then(data => expect(data).toBe(mockData));
      });
    });

    describe('text', () => {
      it('should be a function', () => {
        expect(instance.text).toBeInstanceOf(Function);
      });

      it('should return the data in the value slot wrapped in a promise', () => {
        const mockData = 'data';
        mockContext.getData.mockReturnValue(mockData);
        instance.text().then(data => expect(data).toBe(mockData));
      });
    });
  });
});
