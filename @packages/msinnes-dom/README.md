[comment]: <> (// TODO: make a pass on this)
# `@msinnes/dom`

A lightweight dom rendering library. Can be implemented with our without JSX.

## Top Level API

Can be rendered with function components or class components.

### renderApp

A method for rendering an application to the DOM. Takes a render and an anchor element.

### createRef

A method for creating dom refs. The dom refs are usable as JSX signatures.

### Component

An abstract class that can be extended for creating class components. Any component extending this class must implement a render method.

### createContext

A method that returns a context object for use in function and class components. Each context has a `Provider` and a `Consumer`. Can take an initial value, or that value can be set by a provider. Consumers will return the value of the nearest provider in the Application tree, or will return the initial value if no Provider is present in the tree. An initial value is not required.

## Hooks

Hooks can be used in function components, and only function components.

### useContext

Allows the use of Contexts in function components. Takes a context as an argument and returns the current value of that context. The current value is either the value provided by the nearest Provider in the Application tree, or it will be the initial value if there is no Provider present in the Application tree.

### useEffect

Allows for implementing dom effects in function components. Dom effects are executed after updating the dom. Any function returned from an effect can by used for cleanup. Cleanup functions are executed after the component is removed from the dom. Effects will only run when the component is mounted to the DOM, but can be reexecuted if an element of an input dependency array is updated.

### useMemo

Allows for memoizing information in a function component. Information will only be calculated on the first run of the function component, but can be recalculated by updating an element of a dependency array.

### useState

Allows for use of state in function components. Returns a array with current state as the first element and a set function as the second element. If the set function is executed, the state will be updated and the application will be rerendered.

## Implementing without JSX

The following methods can be used to render an application without JSX. There are some other cases when these methods can be used to keep logic pure (not mutating elements when invoking the children prop is one example).

### createElement

A method that will output a valid dom render object from an input signature, props, and children.

### cloneElement

A method that takes an input element and outputs a new dom render object. If props are passed, those props will be spread on to the output render object. If children are passed as a third argument, they will replace any children on the cloned object.