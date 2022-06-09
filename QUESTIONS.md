1. What is the difference between Component and PureComponent? give an example where it might break my app.
   If you use class components, a component that extends PureComponent will have the shouldComponentUpdate lifecycle method implemented. But if the class extends Component, then you have to implement it yourself. If you want a component to rerender every time, you should not implement it as a PureComponent, because that could be a hit on performance (React would be comparing props with previous props and state with previous state every time to see if the component has to be rerendered).

2. Context + ShouldComponentUpdate might be dangerous. Can think of why is that?
   shouldComponentUpdate only allows the rerender of a component if the props or the state has changed, so it could block a rerender when something in the context has changed.

3. Describe 3 ways to pass information from a component to its PARENT.

-   Callbacks. The parent provides a callback function that the child component can call, providing the information as a parameter
-   Context (ContextAPI, Redux, MobX). A child component could update data in the context, and the parent component could read the modified data
-   Observables (rxjs): The parent component would subscribe to changes, and the child component could notify all the subscribers of a change in the data

4. Give 2 ways to prevent components from re-rendering.

-   React.memo can memoize a component, so it will only rerender if any of its props has changed
-   useMemo hook can also memoize a component, and it receives an array of dependencies. It will only rerender the component if any of the dependencies change

5. What is a fragment and why do we need it? Give an example where it might break my app.
   When using JSX you can only have 1 parent element, so in React we used to wrap everything in a `<div>` tag. The problem is that we where introducing unnecesary tags in the resulting HTML. Fragment was released to be used instead of those `<div>` tags, and it won't produce any additional tag.

6. Give 3 examples of the HOC pattern.

-   withKeyboardListeners. An HOC that sets up listeners for keyboard events
-   withCard. An HOC which creates a card layout with styles
-   withDataFetch. And HOC that handles the fetching of data from an API and passes the data to the component it wraps

7. what's the difference in handling exceptions in promises, callbacks and async...await.

-   Callbacks. Usually the callback function of an async operation provides a parameter with the error
-   Promises. The promise provides a catch method to catch any errors. For example. `fetch(url).then(data => {// do something with the response}).catch(error => {// do something with the error})`
-   Async/await. You have to wrap the await call in a try-catch block, so that you can handle the error. Example: `try { const data = await fetch(url)} catch(error) {// do something with the error}`

8. How many arguments does setState take and why is it async.
   setState takes 2 arguments: the piece of state to change and a callback function (optional) to be called once the state has been updated
   It is async because React doesn't know how much time it will take to complete. If it were sync, then the page may get unresponsive

9. List the steps needed to migrate a Class to Function Component.

-   Change the component signature, from `class MyComponent extends...` to `const MyComponent = (props) => ...`
-   Replace "this." for ""
-   Replace "state." for ""
-   Create a state with useState for any piece of the original state object. Another approach would be to create an object with the same shape as the original state and store it with useState
-   Replace any calls to setState with the appropiate "set" call. For example: `setValue(newValue)` instead of `setState({value: newValue})`
-   For every callback (if any) in the setState calls, implement a useEffect call, being careful about the dependencies
-   Replace `componentDidMount` with `useEffect` with an empty set of dependencies
-   Replace `componentDidUpdate` with `useEffect` (the dependencies for useEffect depend on the conditions set inside the componendDidUpdate block)
-   If there is a `componentWillUnmount` call, remove it and set a `useEffect` with an empty set of dependencies. This useEffect must return a function with the code removed from componentWillUnmount
-   If there is an interface or type for the component state, remove it, as we won't use it
-   Replace any call to `createRef` for `useRef`
-   Remove the `render` method to call the return statement directly

10. List a few ways styles can be used with components.

-   Importing CSS files in the component file
-   Importing CSS files as CSS modules, so that the classnames can be used directly in the code
-   Styled components
-   Importing SCSS in the component file (you have to install the "sass" module)

11. How to render an HTML string coming from the server.
    As a string coming from the server is not the same as JSX, if you try to render it directly, it won't render as HTML tags but as a simple string.
    You could use:

-   An HTML tag with dangerouslySetInnerHTML. This approach as security issues, as it could open the door to XSS attacks. Also, if the string coming from the server is not properly formatted (an HTML tag is not closed, for example) it may break the page layout
-   An external module like react-jsx-parser. This approach is better because this module will filter the string to prevent XSS attacks and has the ability to show an error if the string provided is not valid HTML
