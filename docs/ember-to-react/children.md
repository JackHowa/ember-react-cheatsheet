# Children 

## Ember 

`{{yield}}` is used to render the content passed to a component from its parent ([doc](https://guides.emberjs.com/v3.24.0/components/block-content/)).


```hbs title="/components/text.hbs"
<p>
  {{yield}}
</p>
```

```hbs title="/components/parent.hbs"
<div>
  <Text>
    This is important text.
  </Text>
  <Text>
    This is also important text.
  </Text>
</div>
```

## React

`children` is accessed from `props` to render nested content within a component ([doc](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)). Child components must be imported in React.

```jsx title="/components/text/index.jsx"
const Text = (props) => {
  const { children } = props;
  return <p>{children}</p>;
};

export default Text;
```

```jsx title="/components/parent/index.jsx"
import Text from './text';

const Parent = () => (
	<div>
		<Text>This is important text.</Text>
		<Text>This is also important text.</Text>
	</div>
);

export default Parent;
```
