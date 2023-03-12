# `@msinnes/dom-testing-library-jest`

Jest dependent helpers for use in conjunction with `@msinnes/dom-testing-library`. The library will not work outside of a jest environment.

# Screen Assertions

the `render` function in the `@msinnes/dom-testing-library` returns a screen objects, and this library adds some jest matching extensions. Matchers can be run against elements on the screen.

## - `toBeOnScreen`

Checks an element against a screen.

```TypeScript
const screen = render(/*some application render*/);
const element = screen.getByText('text');

expect(element).toBeOnScreen(screen);
```

Will pass the assertion if the element is found on the screen, and will throw an assertion error if the element is not found on the screen.

## - `toHaveAttribute`

Checks an html element for an attribute.

```TypeScript
const screen = render(/*some application render*/);
const element = screen.getByText('text');

expect(element).toHaveAttribute('class', 'my-class');
```

## - `toHaveAttributes`

Checks an html element for a map of attributes.

```TypeScript
const screen = render(/*some application render*/);
const element = screen.getByText('text');

expect(element).toHaveAttribute({
  class: 'my-class',
  id: 'element-id',
});
```
