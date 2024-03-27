// Check against https://developer.mozilla.org/en-US/docs/Web/SVG/Element#obsolete_and_deprecated_elements
const deprecatedSvgTags = [
  'cursor',
  'font',
  'font-face',
  'font-face-format',
  'font-face-src',
  'font-face-uri',
  'glyph',
  'glyphRef',
  'hkern',
  'missing-glyph',
  'tref',
  'vkern',
];

// Check against https://developer.mozilla.org/en-US/docs/Web/SVG/Element
const validSvgTags = [
  // A
  'a',
  'animate',
  'animateMotion',
  'animateTransform',
  // C
  'circle',
  'clipPath',
  // D
  'defs',
  'desc',
  // E
  'ellipse',
  // F
  'feBlend',
  'feColorMatrix',
  'feComponentTransfer',
  'feComposite',
  'feConvolveMatrix',
  'feDiffuseLighting',
  'feDisplacementMap',
  'feDistantLight',
  'feDropShadow',
  'feFlood',
  'feFuncA',
  'feFuncB',
  'feFuncG',
  'feFuncR',
  'feGaussianBlur',
  'feImage',
  'feMerge',
  'feMergeNode',
  'feMorphology',
  'feOffset',
  'fePointLight',
  'feSpecularLighting',
  'feSpotLight',
  'feTile',
  'feTurbulence',
  'filter',
  'foreignObject',
  // G
  'g',
  // H
  'hatch',
  'hatchpath',
  // I
  'image',
  // L
  'line',
  'linearGradient',
  // M
  'marker',
  'mask',
  'metadata',
  'mpath',
  // P
  'path',
  'pattern',
  'polygon',
  'polyline',
  // R
  'radialGradient',
  'rect',
  // S
  'script',
  'set',
  'stop',
  'style',
  'svg',
  'switch',
  'symbol',
  // T
  'text',
  'textPath',
  'title',
  'tspan',
  // U
  'use',
  // V
  'view',
];

export { validSvgTags };
