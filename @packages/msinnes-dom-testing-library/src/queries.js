import * as queryFns from './queryFns';

export const getByLabelText = (root, query) => {
  const result = queryFns.getByLabelText(root, query);
  if (result.length === 0) throw new Error('getByLabelText did not find any results');
  if (result.length > 1) throw new Error ('getByLabelText found too many results');
  return result[0];
};

export const getAllByLabelText = (root, query) => {
  const result = queryFns.getByLabelText(root, query);
  if (result.length === 0) throw new Error('getAllByLabelText did not find any results');
  return result;
};

export const queryAllByLabelText = (root, query) => queryFns.getByLabelText(root, query);

export const getByText = (root, query) => {
  const result = queryFns.getByText(root, query);
  if (result.length === 0) throw new Error('getByText did not find any results');
  if (result.length > 1) throw new Error ('getByText found too many results');
  return result[0];
};

export const getAllByText = (root, query) => {
  const result = queryFns.getByText(root, query);
  if (result.length === 0) throw new Error('getAllByText did not find any results');
  return result;
};

export const queryAllByText = (root, query) => queryFns.getByText(root, query);
