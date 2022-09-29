import { renderToString } from '../renderToString';
import { StoreProvider, connect, createStore } from '@msinnes/dom-redux-light';


describe('renderToString', () => {
  it('should be a function', () => {
    expect(renderToString).toBeInstanceOf(Function);
  });

  it('should render a simple app', () => {
    expect(renderToString(
      <div>
        <p innerText="some text 1" />
        <p innerHTML="<span>some text 2" />
        <p textContent="some text 3" />
        <p>some text 4</p>
      </div>
    )).toEqual('<div><p>some text 1</p><p><span>some text 2</span></p><p>some text 3</p><p>some text 4</p></div>');
    expect(global.window).toBeUndefined();
    expect(global.document).toBeUndefined();
  });

  it('should render a redux app', () => {
    const App = ({ text }) => text;

    const mapStateToProps = state => ({
      text: state,
    });

    const ConnectedApp = connect(mapStateToProps)(App);

    const store = createStore(() => {}, 'redux text');

    expect(renderToString(
      <StoreProvider store={store}>
        <ConnectedApp />
      </StoreProvider>
    )).toEqual('redux text');
  });
});