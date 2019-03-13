import * as React from "react";
import * as ReactDOM from "react-dom";
import { createActionCreator, createReducerCreator, createReducer, useReducerCreator } from '../src/react-flux-modules'

const setIdActionCreator = createActionCreator<number>()('@TESTS/SETID')
const setTextActionCreator = createActionCreator<{ text: string }>()('@TESTS/SETTEXT')
const addIdActionCreator = createActionCreator()('@TESTS/ADDID')

interface ITestState {
	id: number
	text: string
}

const reducerCreator = createReducerCreator<ITestState>({ id: 1, text: 'init' })
	.case(setIdActionCreator, (state, action) => ({ ...state, id: action.payload }))
	.case(setTextActionCreator, (state, action) => ({ ...state, text: action.payload.text }))
	.case(addIdActionCreator, state => ({ ...state, id: state.id + 1 }))

const reducer = createReducer(reducerCreator)

const fooActionCreator = createActionCreator<string>()('@TEST/FOO')

const fooReducerCreator = createReducerCreator<{ foo: string }>({ foo: '' })
	.case(fooActionCreator, (state, action) => ({ ...state, foo: action.payload }))

const { Provider, connect } = useReducerCreator(fooReducerCreator)

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

describe('action', () => {
	it("setIdActionCreator.type toBe '@TESTS/SETID'", () => {
		expect(setIdActionCreator.type).toBe('@TESTS/SETID')
	})

	it("setTextActionCreator({ text: 'test' }).payload toEqual { text: 'test' }", () => {
		expect(setTextActionCreator({ text: 'test' }).payload).toEqual({ text: 'test' })
	})
})

describe('reducer', () => {
	it("reducer({ id: 1, text: 'test' }, setIdActionCreator(10))) toEqual { id: 10, text: 'test' }", () => {
		expect(reducer({ id: 1, text: 'test' }, setIdActionCreator(10))).toEqual({ id: 10, text: 'test' })
	})

	it("reducer({ id: 1, text: 'test' }, setTextActionCreator({ text: 'changed!' }))) toEqual { id: 10, text: 'changed!' }", () => {
		expect(reducer({ id: 1, text: 'test' }, setTextActionCreator({ text: 'changed!' }))).toEqual({ id: 1, text: 'changed!' })
	})

	it("reducer({ id: 1, text: 'test' }, addIdActionCreator({}))) toEqual { id: 2, text: 'test' }", () => {
		expect(reducer({ id: 1, text: 'test' }, addIdActionCreator())).toEqual({ id: 2, text: 'test' })
	})
})
