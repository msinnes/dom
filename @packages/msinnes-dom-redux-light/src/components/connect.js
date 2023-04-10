import * as Dom from '@msinnes/dom';

import { storeContext } from '../storeContext';

const defaultMergeProps = (stateProps, dispatchProps, ownProps) => {
  return { ...ownProps, ...stateProps, ...dispatchProps };
};

const connect = (mapStateToProps, mapDispatchToProps, mergeProps = defaultMergeProps) => component => props => {
  const { children, ...ownProps } = props;

  const appStore = Dom.useContext(storeContext);

  if (!appStore) throw new Error('ImplementationError: connected components require a configured store in the component tree.');

  const stateProps = mapStateToProps ? mapStateToProps(appStore.getState()) : {};
  const dispatchProps = mapDispatchToProps ? mapDispatchToProps(appStore.dispatch) : {};

  const mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
  const propsWithDispatch = { ...mergedProps, dispatch: appStore.dispatch };
  return Dom.createElement(component, {...propsWithDispatch}, [children]);
};

export { connect };
