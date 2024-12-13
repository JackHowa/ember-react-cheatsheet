# Inline prop logic

In both Ember and React, inline prop logic is a way to dynamically calculate the value of a property or attribute based on some condition. This pattern simplifies code by avoiding separate conditional statements, instead embedding logic directly into the markup.

The provided examples showcase how inline logic works in Ember's Handlebars templates and React's JSX.

## Ember 

In Ember, the `{{if}}` helper allows you to define conditional logic inline within a template. This helper evaluates a condition and returns one of two values based on whether the condition is true or false. The reusability depends on Ember components or helpers with `{{if}}`.

The `@isTrue` signfifies the prop that Ember uses.

```hbs
<img
  alt={{if @isTrue 'True icon' 'False icon'}}
  src={{if
    @isTrue
    '/assets/svgs/true-icon.svg'
    '/assets/svgs/false-icon.svg'
  }}
/>
```

## React

React uses JavaScript expressions for inline logic, commonly leveraging the ternary operator (condition ? valueIfTrue : valueIfFalse) within JSX. Inline logic is written in plain JavaScript, leveraging its full power and flexibility.

`isTrue` is destructured from props, the common name for React props.


```jsx
const TruthyIcon = (props) => {
  const { isTrue } = props;
  return (
    <img
      alt={isTrue ? 'True icon' : 'False icon'}
      src={
        isTrue
          ? '/assets/svgs/true-icon.svg'
          : '/assets/svgs/false-icon.svg'
      }
    />
  );
};

export default TruthyIcon;
```