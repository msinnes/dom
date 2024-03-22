import { builder } from './builder';

import { validHtmlTags } from '@shared/json/htmlTags';
import { validSvgTags } from '@shared/json/svgTags';
import { validSvgAttributes } from '@shared/json/svgAttributes';
import { deprecatedHtmlTags } from '@shared/json/htmlTags';

const memberExpressionSignature = node => {
  return builder.memberExpression(node.object.name, node.property.name);
};

const nameSignature = node => {
  const id = node.name;
  let value;
  if (validHtmlTags.indexOf(id) >= 0 || validSvgTags.indexOf(id) >= 0) value = builder.stringLiteral(id);
  else if (deprecatedHtmlTags.indexOf(id) >= 0) throw new Error('TypeError: Deprecated html tags are not supported');
  else value = builder.identifier(id);
  return value;
};

const getSignatureProperty = node => {
  const name = node.openingElement.name;
  let value;
  if (name.type === 'JSXMemberExpression') value = memberExpressionSignature(name);
  else value = nameSignature(name);
  return builder.objectProperty('signature', value);
};

const getPropsProperty = node => {
  const attrs = node.openingElement.attributes;
  if (!attrs.length) return;

  const props = attrs.map(attr => {
    if (attr.type === 'JSXSpreadAttribute') return builder.spreadElement(attr.argument);
    let name = attr.name.name;
    // TODO: it should throw a warning if the name is deprecated
    if (/[-]/.test(name) && validSvgAttributes.indexOf(name)) name = `'${name}'`;
    let prop = attr.value;
    if (prop === null) prop = builder.booleanLiteral(true);
    else if (prop.type === 'JSXExpressionContainer') prop = prop.expression;
    return builder.objectProperty(name, prop);
  });
  const propsExpression = builder.objectExpression(props);
  return builder.objectProperty('props', propsExpression);
};

const processArrayLikeNode = node => {
  const children = node.children;
  if(!children.length) return;

  return children.map(child => {
    if (child.type === 'JSXText') {
      const value = child.value;
      const isEmpty = !value.trim().length;
      if (isEmpty) return;
      return builder.stringLiteral(child.value);
    } else if (child.type === 'JSXExpressionContainer') {
      if (child.expression.type === 'JSXEmptyExpression') return;
      return child.expression;
    } else {
      return child;
    }
  }).filter(c => !!c);
};

const getChildrenProperty = node => {
  const kids = processArrayLikeNode(node);
  if (!kids) return;

  const childrenExpression = builder.arrayExpression(kids);
  return builder.objectProperty('children', childrenExpression);
};

const getFragment = node => {
  const kids = processArrayLikeNode(node) || [];
  return builder.arrayExpression(kids);
};

export default () => ({
  visitor: {
    JSXElement: path => {
      const node = path.node;
      const props = [
        getSignatureProperty(node),
        getPropsProperty(node),
        getChildrenProperty(node),
      ].filter(i => !!i);

      const objectExpression = builder.objectExpression(props);
      path.replaceWith(objectExpression);
    },
    JSXFragment: path => {
      const fragment = getFragment(path.node);
      path.replaceWith(fragment);
    },
  },
});
