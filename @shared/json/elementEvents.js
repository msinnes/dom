const windowEvents = [
  'onafterprint',
  'onbeforeprint',
  'onbeforeunload',
  'onerror',
  'onhaschange',
  'onload',
  'onmessage',
  'onoffline',
  'onpagehide',
  'onpageshow',
  'onpopstate',
  'onredo',
  'onresize',
  'onstorage',
  'onundo',
  'onunload',
];

const formEvents = [
  'onblur',
  'onchange',
  'oncontextmenu',
  'onfocus',
  'onformchange',
  'onforminput',
  'oninput',
  'oninvalid',
  'onreset',
  'onselect',
  'onsubmit',
];

const keyboardEvents = [
  'onkeydown',
  'onkeypress',
  'onkeyup',
];

const mouseEvents = [
  'onclick',
  'ondblclick',
  'ondrag',
  'ondragend',
  'ondragenter',
  'ondragleave',
  'ondragover',
  'ondragstart',
  'ondrop',
  'onmousedown',
  'onmousemove',
  'onmouseout',
  'onmouseover',
  'onmouseup',
  'onmousewheel',
  'onscroll',
];

const mediaEvents = [
  'onabort',
  'oncanplay',
  'oncanplaythrough',
  'ondurationchange',
  'onemptied',
  'onended',
  'onerror',
  'onloadeddata',
  'onloadedmetadata',
  'onloadstart',
  'onpause',
  'onplay',
  'onplaying',
  'onprogress',
  'onratechange',
  'onreadystatechange',
  'onseeked',
  'onseeking',
  'onstalled',
  'onsuspend',
  'ontimeupdate',
  'onvolumechange',
  'onwaiting',
];

const elementEvents = [
  ...formEvents,
  ...keyboardEvents,
  ...mediaEvents,
  ...mouseEvents,
  ...windowEvents,
];

export { elementEvents };
