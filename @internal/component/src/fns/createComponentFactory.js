import { extendz } from '@internal/oop';

import { ArrayComponent } from '../classes/ArrayComponent';
import { ClassComponent } from '../classes/ClassComponent';
import { EmptyComponent } from '../classes/EmptyComponent';
import { FunctionComponent } from '../classes/FunctionComponent';
import { HtmlComponent } from '../classes/HtmlComponent';
import { SvgComponent } from '../classes/SvgComponent';
import { TextComponent } from '../classes/TextComponent';

const createDomComponent = (render, domContext) => {
  if (render.signature === 'svg' || domContext.value.isSvgParent) return new SvgComponent(render.signature, render.props);
  else return new HtmlComponent(render.signature, render.props);
};

const createComponentFactory = (BaseClass, domContext, services) => render => {
  let component;
  if (render.isArrayRender) component = new ArrayComponent(render.render);
  else if (render.isElementRender) component = createDomComponent(render, domContext);
  else if (render.isEmptyRender) component = new EmptyComponent();
  else if (render.isTextRender) component = new TextComponent(render.render);
  else if (render.isJSXRender) component = extendz(render.signature, BaseClass)
    ? new ClassComponent(render.signature, render.props)
    : new FunctionComponent(render.signature, render.props);

  component.domContext = domContext;
  component.services = services;
  return component;
};

export { createComponentFactory };
