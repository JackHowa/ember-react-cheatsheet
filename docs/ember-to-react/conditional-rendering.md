# Conditional Rendering

Conditional rendering enables showing different UI elements or components based on specific conditions. This can change the whole render of a component or part of it.

## Ember 

Logic is expressed declaratively with Handlebars helpers like `if` and `else` are used to manage conditions directly in the markup. 

For complex conditions, you can use helpers like `eq` or computed properties in the component's JavaScript file.

```hbs
{{#if @myObject.something}}
  <b>This Thing</b>
{{else if (eq @myObject.thatThing 'That Thing')}}
  <b>That Thing</b>
{{else}}
  <b>{{@myObject.defaultThing}}</b>
{{/if}}
```

## React

Conditional rendering is done directly within JSX, which allows you to use JavaScript for dynamic logic. This includes if statements, ternary operators, and logical operators. 

JSX combines logic and UI, keeping the rendering logic in the component file.

```jsx
const ComplexLogic = (props) => {
  const { myObject } = props;

  if (myObject.something) {
    return <b>This Thing</b>;
  } else if (myObject.thatThing === 'That Thing') {
    return <b>That Thing</b>;
  } else {
    return <b>{myObject.defaultThing}</b>;
  }
};

export default ComplexLogic;
```