# Conditional rendering

Conditional rendering enables showing different UI elements or components based on specific conditions. This can change the whole render of a component or part of it.

## Ember 

Logic is expressed declaratively with Handlebars helpers like `if` and `else` are used to manage conditions directly in the markup ([docs](https://handlebarsjs.com/guide/builtin-helpers.html)). 

For complex conditions, you can use the Ember addon Ember Truth Helpers like `eq` or computed properties in the component's JavaScript file ([docs](https://github.com/jmurphyau/ember-truth-helpers?tab=readme-ov-file#usage)).

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

Conditional rendering is done directly within JSX, which allows you to use JavaScript for dynamic logic. This includes if statements, ternary operators, and logical operators ([docs](https://react.dev/learn/conditional-rendering)).

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