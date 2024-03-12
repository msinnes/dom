import { isFunction } from '@internal/is';

/**
 * Mappings based on documentation at https://w3.org/TR/html-aria/
 */

const linkLike = elem => !!elem.href ? 'link' : 'generic';

const checkAncestors = (elem, fn) => {
  let parent = elem.parentElement;
  let found = false;
  while(!found && parent) {
    found = fn(parent);
    parent = parent.parentElement;
  }
  return found;
};

const HEADER_FOOTER_PARENT_TAGS = ['article', 'aside', 'main', 'nav', 'section'];
const HEADER_FOOTER_PARENT_ROLES = ['article', 'complementary', 'main', 'navigation', 'region'];

const isDescendantOf = (elem, cb) => {
  let parent = elem.parent;
  let found = false;
  while (!found && parent) {
    found = cb(parent);
    parent = parent.parent;
  }
  return found;
};

const checkHeaderAndFooter = elem => isDescendantOf(elem, parent =>
  HEADER_FOOTER_PARENT_TAGS.includes(parent.tagName.toLowerCase()) || HEADER_FOOTER_PARENT_ROLES.includes(parent.role)
);

const INPUT_TYPE_MAP = {
  button: 'button',
  checkbox: 'checkbox',
  image: 'button',
  number: 'spinbutton',
  radio: 'radio',
  range: 'slider',
  reset: 'button',
  submit: 'button'
};

const INPUT_NO_ROLE_TYPES = ['color', 'date', 'datetime-local', 'file', 'hidden', 'month', 'password', 'time', 'week'];
const INPUT_COMBOBOX_TYPES = ['email', 'tel', 'text', 'url'];

const LI_PARENT_TAGS = ['ul', 'ol', 'menu'];

const parentTableWithTableRole = elem => isDescendantOf(elem, parent => parent.role === 'table');
const parentWithGridOrTreegridRole = elem => isDescendantOf(elem, parent => parent.role === 'grid' || parent.role === 'treegrid');

const TagToRoleMap = {
  // a
  a: linkLike,
  abbr: undefined,
  address: 'group',
  area: linkLike,
  article: 'article',
  aside: 'complementary',
  audio: undefined,
  // b
  b: 'generic',
  base: undefined,
  bdi: 'generic',
  bdo: 'generic',
  blockquote: 'blockquote',
  body: 'generic',
  br: undefined,
  button: 'button',
  // c
  canvas: undefined,
  caption: 'caption',
  cite: undefined,
  code: 'code',
  col: undefined,
  colgroup: undefined,
  // d
  data: 'generic',
  datalist: 'listbox',
  dd: undefined,
  del: 'deletion',
  details: 'group',
  dfn: 'term',
  dialog: 'dialog',
  div: 'generic',
  dl: undefined,
  dt: undefined,
  // e
  em: 'emphasis',
  embed: undefined,
  // f
  fieldset: 'group',
  figcaption: undefined,
  figure: 'figure',
  footer: elem => checkHeaderAndFooter(elem) ? 'contentinfo' : 'generic',
  form: 'form',
  // g
  // h
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  h5: 'heading',
  h6: 'heading',
  header: elem => checkHeaderAndFooter(elem) ? 'banner' : 'generic',
  hgroup: 'group',
  hr: 'separator',
  html: 'document',
  // i
  i: 'generic',
  iframe: undefined,
  img: elem => {
    if (typeof elem.alt === 'string' && elem.alt.length === 0) return 'none';
    return 'img';
  },
  input: elem => {
    if (INPUT_TYPE_MAP[elem.type]) return INPUT_TYPE_MAP[elem.type];
    if (INPUT_NO_ROLE_TYPES.includes(elem.type)) return undefined;
    if (elem.type === 'search') return elem.list ? 'combobox' : 'searchbox';
    if (INPUT_COMBOBOX_TYPES.includes(elem.type)) return elem.list ? 'combobox' : 'textbox';
  },
  ins: 'insertion',
  // j
  // k
  kbd: undefined,
  // l
  label: undefined,
  legend: undefined,
  li: elem => {
    if (checkAncestors(elem, parent => LI_PARENT_TAGS.includes(parent.tagName.toLowerCase()))) return 'listitem';
    return 'generic';
  },
  link: undefined,
  // m
  main: 'main',
  map: undefined,
  math: 'math',
  menu: 'list',
  meta: undefined,
  meter: 'meter',
  // n
  nav: 'navigation',
  noscript: undefined,
  // o
  object: undefined,
  ol: 'list',
  optgroup: 'group',
  option: elem => {
    if (isDescendantOf(elem, parent => {
      const tag = parent.tagName.toLowerCase();
      return (tag === 'select' || tag === 'datalist');
    })) return 'option';
  },
  output: 'status',
  // p
  p: 'paragraph',
  param: undefined,
  picture: undefined,
  pre: 'generic',
  progress: 'progressbar',
  // q
  q: 'generic',
  // r
  rp: undefined,
  rt: undefined,
  ruby: undefined,
  // s
  s: 'deletion',
  samp: 'generic',
  script: undefined,
  search: 'search',
  section: elem => {
    if (elem.ariaLabel || elem.textContent) return 'region';
  },
  select: elem => {
    if (elem.multiple || (elem.size && elem.size > 1)) return 'listbox';
    return 'combobox';
  },
  slot: undefined,
  small: 'generic',
  source: undefined,
  span: 'generic',
  strong: 'strong',
  style: undefined,
  sub: 'subscript',
  style: undefined,
  summary: undefined,
  sup: 'superscript',
  SVG: 'graphics-document',
  // t
  table: 'table',
  tbody: 'rowgroup',
  td: elem => {
    if (parentTableWithTableRole(elem)) return 'cell';
    if (parentWithGridOrTreegridRole(elem)) return 'gridcell';
  },
  template: undefined,
  textarea: 'textbox',
  tfoot: 'rowgroup',
  th: elem => {
    if (parentTableWithTableRole(elem)) return 'cell';
    if (parentWithGridOrTreegridRole(elem)) return 'gridcell';
  },
  thead: 'rowgroup',
  time: 'time',
  title: undefined,
  tr: 'row',
  track: undefined,
  // u
  u: 'generic',
  ul: 'list',
  // v
  var: undefined,
  video: undefined,
  // w
  wbr: undefined,
  // x
  // y
  // z
};

function getRole(elem) {
  if (elem.role) return elem.role;
  const role = TagToRoleMap[elem.tagName.toLowerCase()];
  if (isFunction(role)) return role(elem);
  return role;
}

export { checkAncestors, getRole, TagToRoleMap };
