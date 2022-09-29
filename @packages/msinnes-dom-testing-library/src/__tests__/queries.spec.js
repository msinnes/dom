import * as queryFns from '../queryFns';
import * as queries from '../queries';

describe('queries', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getByLabelText', () => {
    const { getByLabelText } = queries;
    let getByLabelTextMock;

    beforeEach(() => {
      getByLabelTextMock = jest.spyOn(queryFns, 'getByLabelText');
    });

    it('should be a function', () => {
      expect(getByLabelText).toBeInstanceOf(Function);
    });

    it('should call the queryFns.getByLabelText method', () => {
      const root = {};
      const text = 'query';
      const resultNode = {};
      const result = [resultNode];
      getByLabelTextMock.mockReturnValue(result);
      const output = getByLabelText(root, text);
      expect(getByLabelTextMock).toHaveBeenCalledTimes(1);
      expect(getByLabelTextMock).toHaveBeenCalledWith(root, 'query');
      expect(output).toBe(resultNode);
    });

    it('should throw an error if results are empty', () => {
      const root = {};
      const text = 'query';
      const result = [];
      getByLabelTextMock.mockReturnValue(result);
      expect(() => {
        getByLabelText(root, 'query');
      }).toThrow('getByLabelText did not find any results');
    });

    it('should throw an error if more then one result is found', () => {
      const root = {};
      const text = 'query';
      const resultNode = {};
      const result = [resultNode, resultNode];
      getByLabelTextMock.mockReturnValue(result);
      expect(() => {
        getByLabelText(root, 'query');
      }).toThrow('getByLabelText found too many results');
    });
  });

  describe('getAllByLabelText', () => {
    const { getAllByLabelText } = queries;
    let getByLabelText;

    beforeEach(() => {
      getByLabelText = jest.spyOn(queryFns, 'getByLabelText');
    });

    it('should be a function', () => {
      expect(getAllByLabelText).toBeInstanceOf(Function);
    });

    it('should call the queryFns.getAllByLabelText method', () => {
      const root = {};
      const text = 'query';
      const result = [{}];
      getByLabelText.mockReturnValue(result);
      const output = getAllByLabelText(root, text);
      expect(getByLabelText).toHaveBeenCalledTimes(1);
      expect(getByLabelText).toHaveBeenCalledWith(root, 'query');
      expect(output).toBe(result);
    });

    it('should throw an error if results are empty', () => {
      const root = {};
      const text = 'query';
      const result = [];
      getByLabelText.mockReturnValue(result);
      expect(() => {
        getAllByLabelText(root, text);
      }).toThrow('getAllByLabelText did not find any results');
    });
  });

  describe('queryAllByLabelText', () => {
    const { queryAllByLabelText } = queries;
    let getByLabelTextMock;

    beforeEach(() => {
      getByLabelTextMock = jest.spyOn(queryFns, 'getByLabelText');
    });

    it('should be a function', () => {
      expect(queryAllByLabelText).toBeInstanceOf(Function);
    });

    it('should call the queryFns.getByLabelText method', () => {
      const root = {};
      const text = 'query';
      const result = [];
      getByLabelTextMock.mockReturnValue(result);
      const output = queryAllByLabelText(root, text);
      expect(getByLabelTextMock).toHaveBeenCalledTimes(1);
      expect(getByLabelTextMock).toHaveBeenCalledWith(root, 'query');
      expect(output).toBe(result);
    });
  });

  describe('getByText', () => {
    const { getByText } = queries;
    let getByTextMock;

    beforeEach(() => {
      getByTextMock = jest.spyOn(queryFns, 'getByText');
    });

    it('should be a function', () => {
      expect(getByText).toBeInstanceOf(Function);
    });

    it('should call the queryFns.getByText method', () => {
      const root = {};
      const text = 'query';
      const resultNode = {};
      const result = [resultNode];
      getByTextMock.mockReturnValue(result);
      const output = getByText(root, text);
      expect(getByTextMock).toHaveBeenCalledTimes(1);
      expect(getByTextMock).toHaveBeenCalledWith(root, 'query');
      expect(output).toBe(resultNode);
    });

    it('should throw an error if results are empty', () => {
      const root = {};
      const text = 'query';
      const result = [];
      getByTextMock.mockReturnValue(result);
      expect(() => {
        getByText(root, 'query');
      }).toThrow('getByText did not find any results');
    });

    it('should throw an error if more then one result is found', () => {
      const root = {};
      const text = 'query';
      const resultNode = {};
      const result = [resultNode, resultNode];
      getByTextMock.mockReturnValue(result);
      expect(() => {
        getByText(root, 'query');
      }).toThrow('getByText found too many results');
    });
  });

  describe('getAllByText', () => {
    const { getAllByText } = queries;
    let getByTextMock;

    beforeEach(() => {
      getByTextMock = jest.spyOn(queryFns, 'getByText');
    });

    it('should be a function', () => {
      expect(getAllByText).toBeInstanceOf(Function);
    });

    it('should call the queryFns.getAllByText method', () => {
      const root = {};
      const text = 'query';
      const result = [{}];
      getByTextMock.mockReturnValue(result);
      const output = getAllByText(root, text);
      expect(getByTextMock).toHaveBeenCalledTimes(1);
      expect(getByTextMock).toHaveBeenCalledWith(root, 'query');
      expect(output).toBe(result);
    });

    it('should throw an error if results are empty', () => {
      const root = {};
      const text = 'query';
      const result = [];
      getByTextMock.mockReturnValue(result);
      expect(() => {
        getAllByText(root, text);
      }).toThrow('getAllByText did not find any results');
    });
  });

  describe('queryAllByText', () => {
    const { queryAllByText } = queries;
    let getByTextMock;

    beforeEach(() => {
      getByTextMock = jest.spyOn(queryFns, 'getByText');
    });

    it('should be a function', () => {
      expect(queryAllByText).toBeInstanceOf(Function);
    });

    it('should call the queryFns.getByText method', () => {
      const root = {};
      const text = 'query';
      const result = [];
      getByTextMock.mockReturnValue(result);
      const output = queryAllByText(root, text);
      expect(getByTextMock).toHaveBeenCalledTimes(1);
      expect(getByTextMock).toHaveBeenCalledWith(root, 'query');
      expect(output).toBe(result);
    });
  });
});