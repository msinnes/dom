import * as queryFns from '../queryFns';

describe('queryFns', () => {
  describe('getByLabelText', () => {
    const { getByLabelText } = queryFns;

    it('should be a function', () => {
      expect(getByLabelText).toBeInstanceOf(Function);
    });

    it('should return an element with innerText equal to the input query', () => {
      const label = { for: 'name', textContent: 'query' };
      const input = { name: 'name' };
      const root = {
        children: [label, input],
      };
      const result = getByLabelText(root, 'query');
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(1);
      expect(result[0]).toBe(input);
    });

    it('should return an element with innerText equal to the input query', () => {
      const label = { for: 'name', textContent: 'query' };
      const input = { name: 'name' };
      const root = {
        children: [label, { children: [input] }],
      };
      const result = getByLabelText(root, 'query');
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(1);
      expect(result[0]).toBe(input);
    });

    it('should return an element with innerText equal to the input query', () => {
      const label = { for: 'name', textContent: 'query' };
      const input = { name: 'name' };
      const root = {
        children: [{ children: [label] }, input],
      };
      const result = getByLabelText(root, 'query');
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(1);
      expect(result[0]).toBe(input);
    });
  });

  describe('getByText', () => {
    const { getByText } = queryFns;

    it('should be a function', () => {
      expect(getByText).toBeInstanceOf(Function);
    });

    it('should return an element with innerText equal to the input query', () => {
      const root = {
        innerText: 'query',
      };
      const result = getByText(root, 'query');
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(1);
      expect(result[0]).toBe(root);
    });

    it('should return an element with innerText equal to the input query', () => {
      const firstChild = {
        innerText: 'query',
      };
      const secondChild = {
        innerText: 'query',
      };
      const root = {
        children: [firstChild, secondChild],
      };
      const result = getByText(root, 'query');
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
      expect(result[0]).toBe(firstChild);
      expect(result[1]).toBe(secondChild);
    });

    it('should query recursively down the tree', () => {
      const firstChild = {
        innerText: 'query',
      };
      const secondChild = {
        innerText: 'query',
      };
      const root = {
        children: [firstChild, {
          children: [secondChild],
        }],
      };
      const result = getByText(root, 'query');
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
      expect(result[0]).toBe(firstChild);
      expect(result[1]).toBe(secondChild);
    });
  });
});