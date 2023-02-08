const linkLike = elem => !!elem.href ? 'link' : 'generic';

const isDescendantOf = (elem, cb) => {
  let parent = elem.parent;
  let found = false;
  while (!found && parent) {
    found = cb(parent);
    parent = parent.parent;
  }
  return found;
};

const HEADER_FOOTER_PARENT_TAGS = ['article', 'aside', 'main', 'nav', 'section'];
const HEADER_FOOTER_PARENT_ROLES = ['article', 'complementary', 'main', 'navigation', 'region'];

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

const INPUT_COMBOBOX_TYPES = ['email', 'tel', 'text', 'url'];

const parentTableWithTableRole = elem => isDescendantOf(elem, parent => parent.role === 'table');
const parentWithGridOrTreegridRole = elem => isDescendantOf(elem, parent => parent.role === 'grid' || parent.role === 'treegrid');

const TagToRoleMap = {
  // a
  a: linkLike,
  area: linkLike,
  article: 'article',
  aside: 'complementary',
  // b
  b: 'generic',
  bdi: 'generic',
  bdo: 'generic',
  blockquote: 'blockquote',
  body: 'generic',
  button: 'button',
  // c
  caption: 'caption',
  code: 'code',
  // d
  data: 'generic',
  datalist: 'listbox',
  del: 'deletion',
  details: 'group',
  dfn: 'term',
  dialog: 'dialog',
  div: 'generic',
  // e
  em: 'emphasis',
  // f
  fieldset: 'group',
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
  hgroup: 'generic',
  hr: 'separator',
  html: 'document',
  // i
  i: 'generic',
  img: elem => {
    if (typeof elem.alt === 'string' && elem.alt.length === 0) return 'presentation';
    return 'img';
  },
  input: elem => {
    if (INPUT_TYPE_MAP[elem.type]) return INPUT_TYPE_MAP[elem.type];
    if (elem.type === 'search' && typeof elem.list === 'undefined') return 'searchbox';
    if (INPUT_COMBOBOX_TYPES.includes(elem.type) && !elem.list) return 'textbox';
    return !elem.list ? 'textbox' : 'combobox';
  },
  ins: 'insertion',
  // j
  // k
  // l
  li: 'listitem',
  // m
  main: 'main',
  math: 'math',
  menu: 'list',
  meter: 'meter',
  // n
  nav: 'navigation',
  // o
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
  pre: 'generic',
  progress: 'progressbar',
  // q
  q: 'generic',
  // r
  // s
  samp: 'generic',
  section: elem => {
    if (elem.ariaLabel || elem.textContent) return 'region';
  },
  select: elem => {
    if (elem.multiple || (elem.size && elem.size > 1)) return 'listbox';
    return 'combobox';
  },
  small: 'generic',
  span: 'generic',
  strong: 'strong',
  sub: 'subscript',
  summary: 'button',
  sup: 'superscript',
  SVG: 'graphics-document',
  // t
  table: 'table',
  tbody: 'rowgroup',
  textarea: 'textbox',
  tfoot: 'rowgroup',
  thead: 'rowgroup',
  time: 'time',
  td: elem => {
    if (parentTableWithTableRole(elem)) return 'cell';
    if (parentWithGridOrTreegridRole(elem)) return 'gridcell';
  },
  th: elem => {
    if (parentTableWithTableRole(elem)) return 'cell';
    if (parentWithGridOrTreegridRole(elem)) return 'gridcell';
  },
  tr: 'row',
  // u
  u: 'generic',
  ul: 'list',
  // v
  // w
  // x
  // y
  // z
};

const getRole = elem => {
  if (elem.role) return elem.role;
  const role = TagToRoleMap[elem.tagName.toLowerCase()];
  if (role instanceof Function) return role(elem);
  return role;
};

export { getRole, TagToRoleMap };
