---
name: hbs-to-jsx-migration
description: Migrate Ember Handlebars templates (.hbs) to React JSX (.jsx) components. Use when converting .hbs templates, controllers, or routes to React, or when asked to "migrate this component", "convert to React", or "rewrite in JSX".
license: MIT
metadata:
  version: '1.0'
  tags: ember react migration handlebars jsx
---

# Handlebars to JSX Migration

This skill helps migrate Ember.js Handlebars templates to React JSX components. Remember: Ember can render React, but React cannot render Ember. Always migrate **leaf nodes first**.

## Migration Strategy

### Bottom-Up (Leaf Nodes First)

Ember can render React inside it, but React **cannot** render Ember. This means complex pages must be migrated **leaf nodes first**, working upward through the component tree.

**How to identify leaf nodes:**

1. Read the target template (`.hbs`)
2. List all child Ember components it renders
3. For each child, read _its_ template and repeat
4. The deepest components with no further Ember children are leaf nodes

**Example bottom-up migration plan:**

```
page-template.hbs
├── ChildA (Ember)
│   └── LeafX (Ember)  ← migrate first (PR 1)
├── ChildB (Ember)
│   └── LeafY (Ember)  ← migrate second (PR 2)
├── ChildA (Ember)      ← migrate after LeafX (PR 3)
├── ChildB (Ember)      ← migrate after LeafY (PR 4)
└── page-template.hbs   ← migrate last (PR 5)
```

Because Ember can seamlessly render a React component in place of an Ember one, **parent Ember templates need zero changes** when a child is migrated.

### One Component Per PR, Stacked When Dependent

Each migrated component should get its own branch and PR. When components depend on each other, stack the PRs — the child PR targets the parent's branch. When the parent merges, the child auto-retargets to the main branch. This keeps PRs small and reviewable.

### Partial Template Extraction

You don't always need to migrate a full Ember component. You can extract sections of a route template into new React components while leaving the rest as Ember.

When extracting a section that was inside a conditional, the remaining template may need its conditional inverted. For example, if you extract the content from both branches of `{{#if}}...{{else}}...{{/if}}` into a React component, the remaining Ember block may become `{{#unless}}...{{/unless}}`.

## Migration Eligibility

### Easy to Migrate (Template-Only)

Components with only `template.hbs` (no `component.js`) are easiest to migrate.

### Require Special Handling

| Pattern                  | Reason                         | React Replacement                     |
| ------------------------ | ------------------------------ | ------------------------------------- |
| `<LinkTo>`               | Ember routing component        | React Router `<Link>` or `<a>`        |
| `{{moment-format date}}` | Date formatting helper         | Native `Date` / `Intl.DateTimeFormat` |
| `light-table` components | Complex value binding patterns | A React data grid library             |

### Migration Boundaries

Some Ember files cannot be fully removed even after migrating to React:

| File                  | Why It Must Stay                                   | What to Do                                               |
| --------------------- | -------------------------------------------------- | -------------------------------------------------------- |
| `app/routes/*.js`     | Access control (`beforeModel`), route registration | Keep route, remove `model()` hook if data moved to React |
| `app/templates/*.hbs` | Ember router requires template to render React     | Keep minimal template that renders the React component   |
| `app/router.js`       | Route definitions                                  | Cannot remove route entries                              |

## Migration Steps

1. **Find unused components first** — remove dead code before migrating
2. **Read existing Ember code** — template (`.hbs`), controller (`.js`), route (`.js`), and styles (`.scss`)
3. **Check eligibility** — identify any blockers from the table above
4. **Map the component tree** — identify leaf nodes and plan bottom-up order
5. **Create React component** — replacing the Ember component in the same location
6. **Preserve existing styles** — keep `.scss` files; only introduce CSS-in-JS for new conditional styles
7. **Add tests** — write tests for the migrated component
8. **Post-migration cleanup** — check for now-unused Ember helpers, tests, and packages

## Core Transformation Rules

### Children & Composition

```hbs
{{! Ember }}
<div>{{yield}}</div>
```

```jsx
// React
const Component = ({ children }) => <div>{children}</div>;
```

### Class Names

```hbs
{{! Ember }}
<div class='my-class'>content</div>
```

```jsx
// React
<div className="my-class">content</div>
```

### Props from Arguments

```hbs
{{! Ember }}
<div>{{@message}}</div>
```

```jsx
// React
const Component = ({ message }) => <div>{message}</div>;
```

### Conditional Rendering

Prefer ternary operators over logical AND (`&&`).

```hbs
{{! Ember }}
{{#if @myObject.something}}
  <b>This Thing</b>
{{else}}
  <b>That Thing</b>
{{/if}}
```

```jsx
// React
{myObject.something ? <b>This Thing</b> : <b>That Thing</b>}
```

For multiple conditions, use early returns instead of nested ternaries:

```hbs
{{! Ember }}
{{#if @myObject.something}}
  <b>This Thing</b>
{{else if (eq @myObject.thatThing 'That Thing')}}
  <b>That Thing</b>
{{else}}
  <b>{{@myObject.defaultThing}}</b>
{{/if}}
```

```jsx
// React
const Component = ({ myObject }) => {
  if (myObject.something) return <b>This Thing</b>;
  if (myObject.thatThing === 'That Thing') return <b>That Thing</b>;
  return <b>{myObject.defaultThing}</b>;
};
```

### List Rendering (each)

```hbs
{{! Ember }}
{{#each @items as |item|}}
  <li>{{item.name}}</li>
{{/each}}
```

```jsx
// React
{items.map((item) => <li key={item.id}>{item.name}</li>)}
```

### List with Empty State (each...else)

```hbs
{{! Ember }}
{{#each @items as |item|}}
  <li>{{item.name}}</li>
{{else}}
  <div>No results found</div>
{{/each}}
```

```jsx
// React
{items.length > 0
  ? items.map((item) => <li key={item.id}>{item.name}</li>)
  : <div>No results found</div>}
```

### Fragments (Multiple Root Elements)

```hbs
{{! Ember }}
Text outside
<p>Text inside</p>
```

```jsx
// React
<>
  Text outside
  <p>Text inside</p>
</>
```

### Spread Attributes (`...attributes`)

```hbs
{{! Ember }}
<div ...attributes class='ember-view'>
  <p>content</p>
</div>
```

```jsx
// React — simple case: remove ...attributes
const Component = () => (
  <div className="ember-view">
    <p>content</p>
  </div>
);

// React — if props need forwarding
const Component = (props) => (
  <div className="ember-view" {...props}>
    <p>content</p>
  </div>
);
```

### Inline Prop Logic

Prefer ternary operators over `&&` for inline conditional attributes.

```hbs
{{! Ember }}
<img
  alt={{if @isMelting 'Melting Ice Cream Icon' 'Icon'}}
  src={{if @isMelting '/assets/melting.svg' '/assets/normal.svg'}}
/>
```

```jsx
// React
<img
  alt={isMelting ? 'Melting Ice Cream Icon' : 'Icon'}
  src={isMelting ? '/assets/melting.svg' : '/assets/normal.svg'}
/>
```

### Lifecycle (`@tracked` + `{{did-insert}}` → `useState` + `useEffect`)

```hbs
{{! Ember }}
<div {{did-insert this.initComponent}}>
  {{this.loadingState}}
</div>
```

```js
// component.js
export default class LoadingIndicator extends Component {
  @tracked loadingState = 'Loading...';

  @action
  initComponent() {
    setTimeout(() => {
      this.loadingState = 'Component initialized';
    }, 2000);
  }
}
```

```jsx
// React
import { useState, useEffect } from 'react';

function LoadingIndicator() {
  const [loadingState, setLoadingState] = useState('Loading...');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingState('Component initialized');
    }, 2000);
    return () => clearTimeout(timer);
  }, []); // empty array = run once on mount, like {{did-insert}}

  return <div>{loadingState}</div>;
}
```

Key differences:
- `useState` replaces `@tracked` for reactive state
- `useEffect` with `[]` replaces `{{did-insert}}`
- No `@action` decorator needed — regular functions work

### SVG (`{{svg-jar}}` → `<img>`)

```hbs
{{! Ember }}
{{svg-jar "ice-cream-cone"}}
{{svg-jar "ice-cream-cone-sized" height="20px" width="20px"}}
```

```jsx
// React — always include alt text; use empty alt="" for decorative SVGs
<>
  <img alt="" src="assets/ice-cream/ice-cream-cone.svg" />
  <img alt="" src="assets/ice-cream/ice-cream-cone-sized.svg" height="20" width="20" />
</>
```

### Portal / Wormhole (`{{in-element}}` → `createPortal`)

```hbs
{{! Ember — modern (v3.20+) }}
{{#in-element this.destinationElement}}
  <div>Modal content</div>
{{/in-element}}

{{! Ember — legacy (ember-wormhole) }}
{{#ember-wormhole to="modal-root"}}
  Modal content
{{/ember-wormhole}}
```

```jsx
// React
import { createPortal } from 'react-dom';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}
```

### Media Queries

Prefer CSS media queries over JavaScript-based Ember media helpers.

```hbs
{{! Ember — JS-based media helper }}
{{#if (media "isMobile")}}
  <h2>Mobile view</h2>
{{/if}}
```

```css
/* React — prefer CSS media queries */
@media (max-width: 813px) {
  .mobile-heading { display: block; }
}
@media (min-width: 814px) {
  .mobile-heading { display: none; }
}
```

```jsx
// React — use a hook only when conditional rendering truly requires JS
import { useState, useEffect } from 'react';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const matcher = window.matchMedia(query);
    const handler = () => setMatches(matcher.matches);
    matcher.addEventListener('change', handler);
    return () => matcher.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Usage
const isMobile = useMediaQuery('(max-width: 813px)');
```

### Whitespace

React strips whitespace between elements. Add explicitly when needed:

```jsx
<span>Hello</span>{' '}<span>World</span>
```

### Match Original Structure First

When migrating, match the original Ember template structure first to preserve styling. Optimize later if needed.

## Ember Helper Reference

### Comparison Operators

| Ember Helper   | React Equivalent |
| -------------- | ---------------- |
| `(eq a b)`     | `a === b`        |
| `(not-eq a b)` | `a !== b`        |
| `(and a b)`    | `a && b`         |
| `(or a b)`     | `a \|\| b`       |
| `(not a)`      | `!a`             |
| `(gt a b)`     | `a > b`          |
| `(gte a b)`    | `a >= b`         |
| `(lt a b)`     | `a < b`          |
| `(lte a b)`    | `a <= b`         |

### Common Helper Replacements

| Ember Helper                                    | React Replacement                            |
| ----------------------------------------------- | -------------------------------------------- |
| `{{lowercase value}}`                           | `{value.toLowerCase()}`                      |
| `{{uppercase value}}`                           | `{value.toUpperCase()}`                      |
| `{{pluralize count "item" without-count=true}}` | `{count === 1 ? 'item' : 'items'}`           |
| `{{array a b c}}`                               | `{[a, b, c]}`                                |
| `{{hash key=value}}`                            | `{{ key: value }}`                           |
| `{{concat a b}}`                                | `` {`${a}${b}`} ``                           |
| `{{fn @action arg}}`                            | `() => action(arg)`                          |
| `{{on "click" @handler}}`                       | `onClick={handler}`                          |
| `{{stop-propagation (fn ...)}}`                 | `(e) => { e.stopPropagation(); handler(); }` |
| `{{toggle "prop" this}}`                        | `() => setState(prev => !prev)`              |

## Async Tasks (ember-concurrency)

ember-concurrency tasks are generator functions (`function*`) that use `yield` like `await`. In most cases, a plain async function is all you need. Only add loading state tracking when you need to disable a button or show a spinner.

### `@task` → async function

```js
// Ember
@task
selectFlavor = function* (flavor) {
  const ice = yield this.store.createRecord('ice-cream', { flavorSlug: flavor.slug });
  return ice;
};
```

```jsx
// React — plain async
const handleSelect = async (flavor) => {
  const ice = await createIceCream({ flavorSlug: flavor.slug });
  setLastIce(ice);
};

// React — with loading state
const [isRunning, setIsRunning] = useState(false);

const handleSelect = async (flavor) => {
  setIsRunning(true);
  try {
    const ice = await createIceCream({ flavorSlug: flavor.slug });
    setLastIce(ice);
  } finally {
    setIsRunning(false);
  }
};
```

### `@dropTask` → ignore calls while in-flight

```js
// Ember
@dropTask
submitForm = function* () {
  yield this.store.createRecord('submission', this.formData).save();
};
```

```jsx
// React — drop concurrent calls with a ref
const isRunningRef = useRef(false);

const submitForm = async () => {
  if (isRunningRef.current) return;
  isRunningRef.current = true;
  try {
    await saveOrder(formData);
  } finally {
    isRunningRef.current = false;
  }
};

<button disabled={isRunning} onClick={submitForm}>Submit</button>
```

### `@restartableTask` + `yield timeout(ms)` → debounce

```js
// Ember — cancel-and-restart on each keystroke
@restartableTask
searchFlavors = function* (query) {
  yield timeout(250);
  const results = yield this.fetch.request('/api/tags', { query });
  this.results = results;
};
```

```jsx
// React — debounce with useEffect
const [query, setQuery] = useState('');

useEffect(() => {
  const timer = setTimeout(async () => {
    if (!query) return;
    const results = await fetchFlavors(query);
    setResults(results);
  }, 250);
  return () => clearTimeout(timer);
}, [query]);

<input onChange={(e) => setQuery(e.target.value)} />
```

### `yield all([...])` → `Promise.all([...])`

```js
// Ember
yield all(this.scoopsToRemove.map((file) => file.destroyRecord()));

// React
await Promise.all(scoopsToRemove.map((file) => deleteFile(file)));
```

### `{{perform this.task args}}` in templates

```hbs
{{! Ember }}
{{on 'click' (perform this.loadFlavors)}}
{{on 'input' (perform this.searchTask value)}}
```

```jsx
// React
onClick={() => loadFlavors()}
onChange={(e) => search(e.target.value)}
```

### `@keepLatestTask` and `@enqueueTask`

- **`@keepLatestTask`** — while running, queues only the latest call. Use `AbortController`: abort the previous controller on each call, start a new one.
- **`@enqueueTask`** — runs all calls sequentially. Chain promises via a ref: `queueRef.current = queueRef.current.then(() => fn())`.

## Import / Export Rules

- Do **not** use `import React from 'react'` — import hooks directly
- Do **not** use PropTypes
- Always use **default exports** for components (named exports break React-in-Ember resolver wrappers)

```jsx
// Good
import { useState, useEffect } from 'react';

const MyComponent = () => { /* ... */ };

export default MyComponent;
```

```jsx
// Good — importing another component
import FlavorSelector from './flavor-selector';
```

```jsx
// Bad — named export/import breaks React-in-Ember interop
export { MyComponent };
import { MyComponent } from './my-component';
```

## Component Naming

Name React components based on the Ember file path:

| Ember Path                                   | React Component Name |
| -------------------------------------------- | -------------------- |
| `app/components/ice-cream-list/template.hbs` | `IceCreamList`       |
| `app/components/grid-sort-icon/template.hbs` | `GridSortIcon`       |
| `app/templates/change-ice-cream-cart.hbs`    | `ChangeIceCreamCart` |

## Data Attributes

Preserve all `data-*` attributes exactly:

```hbs
{{! Ember }}
<div data-test-component-hi>hi</div>
```

```jsx
// React
<div data-test-component-hi>hi</div>
```

## PR Descriptions

Include a component tree diagram in migration PR descriptions:

```
page-template.hbs
├── Sidebar (already React)
├── ContentContainer (Ember)
│   └── Content (Ember → React) <-- this PR
└── Footer (Ember)
```
