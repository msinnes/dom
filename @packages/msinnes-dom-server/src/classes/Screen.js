// TODO: make a class in @internal/ssr and just expose this class
class Screen {
  constructor(scope) {
    this.html = scope.container.elem.innerHTML;
    this.url = scope.url;
  }
}

export { Screen };
