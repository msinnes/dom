/**
 * @jest-environment jsdom
 */
 import { BaseDomRenderController } from '../BaseDomRenderController';

 import { DomHydrateController } from '../DomHydrateController';

 import createElement from '@internal/utils/createElement';

 describe('DomHydrateController', () => {
   it('should be a class', () => {
     expect(DomHydrateController).toBeInstanceOf(Function);
   });

   describe('instance', () => {
     let instance;
     let rootRender;
     beforeEach(() => {
       rootRender = createElement('div');
       instance = new DomHydrateController(rootRender, document.body);
     });

     it('should be an instance of BaseDomRenderController', () => {
       expect(instance).toBeInstanceOf(BaseDomRenderController);
     });

     describe('emptyElementChildren', () => {
       function createDivWithText(text) {
         const div = document.createElement('div');
         div.innerHTML = text;
         return div;
       }

       it('should be a function', () => {
         expect(instance.emptyElementChildren).toBeInstanceOf(Function);
       });

       it('should empty all element children from the input anchor', () => {
         document.body.appendChild(createDivWithText('text 1'));
         document.body.appendChild(createDivWithText('text 2'));
         expect(document.body.innerHTML).toEqual('<div>text 1</div><div>text 2</div>');
         instance.emptyElementChildren(document.body);
         expect(document.body.innerHTML).toEqual('');
       });

       it('should empty a string child from the input anchor', () => {
         document.body.innerHTML = 'text';
         instance.emptyElementChildren(document.body);
         expect(document.body.innerHTML).toEqual('');
       });
     });

     describe('hydrate', () => {
       it('should be a function', () => {
         expect(instance.hydrate).toBeInstanceOf(Function);
       });

       it('should render the app, empty the anchor, and then render the dom', done => {
         const renderAppMock = jest.fn();
         const emtpyElementChildrenMock = jest.fn();
         const renderDomMock = jest.fn();
         instance.renderApp = renderAppMock;
         instance.emptyElementChildren = emtpyElementChildrenMock;
         instance.renderDom = renderDomMock;
         instance.hydrate();
         setTimeout(() => {
          setTimeout(() => {
            expect(renderAppMock).toHaveBeenCalledTimes(1);
            expect(emtpyElementChildrenMock).toHaveBeenCalledTimes(1);
            expect(emtpyElementChildrenMock).toHaveBeenCalledWith(document.body);
            expect(renderDomMock).toHaveBeenCalledTimes(1);
            done();
          });
         });
       });
     });
   });
 });