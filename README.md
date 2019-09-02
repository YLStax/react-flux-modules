# React Flux Modules

## Installation

```
npm install --save react-flux-modules
```

## Usage

### ActionCreator

```ts
import { createActionCreator } from 'react-flux-modules';

const fooActionCreator = createActionCreator<string>()('@TEST/FOO');
```

### ReducerCreator

```ts
import { createReducerCreator } from 'react-flux-modules';

const fooReducerCreator = createReducerCreator<{ foo: string }>({ foo: '' })
	.case(fooActionCreator, (state, action) => ({ ...state, foo: action.payload }));
```

### Store

```ts
import { useReducerCreator } from 'react-flux-modules';

const { Provider, connect } = useReducerCreator(fooReducerCreator);
```

### Render

```tsx
import * as React from "react";
import * as ReactDOM from "react-dom";

interface ITestProps {
	foo: string
	bar: () => void
}

const Test = (props: ITestProps) => (
	<div>
		<label>{props.foo}</label>
		<button onClick={() => props.bar()}>bar</button>
	</div>
)

const TestContainer = connect<ITestProps>(store => ({
	foo: store.state.foo,
	bar: () => store.dispatch(fooActionCreator('bar'))
}))(Test)

ReactDOM.render((
	<Provider>
		<TestContainer />
	</Provider>
), document.getElementById('test'));
```
