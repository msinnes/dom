import { SvgComponent } from './SvgComponent';

class ForeignObjectComponent extends SvgComponent {
  isForeignObjectComponent = true;

  constructor(ref, props) {
    super(ref, props);

    if (this.elem.tag !== 'foreignobject') this.elem.setXMLNS('http://www.w3.org/1999/xhtml');
  }
}

export { ForeignObjectComponent };
