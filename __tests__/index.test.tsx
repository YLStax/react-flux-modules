import { createActionCreator, createReducerCreator, createReducer } from '../src/react-flux-modules'

interface ITestState {
	id: number
	text: string
}

const setIdActionCreator = createActionCreator<number>()('@TESTS/SETID')
const setTextActionCreator = createActionCreator<{ text: string }>()('@TESTS/SETTEXT')
const addIdActionCreator = createActionCreator()('@TESTS/ADDID')

const reducerCreator = createReducerCreator<ITestState>({ id: 1, text: 'init' })
	.case(setIdActionCreator, (state, action) => ({ ...state, id: action.payload }))
	.case(setTextActionCreator, (state, action) => ({ ...state, text: action.payload.text }))
	.case(addIdActionCreator, state => ({ ...state, id: state.id + 1 }))

const reducer = createReducer(reducerCreator)

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
