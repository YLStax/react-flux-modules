import * as React from 'react'

export type ActionType = string

export type Meta = null | { [key: string]: any }

export interface IAction<T extends ActionType, P> {
    type: T
    payload: P
    error?: boolean
    meta?: Meta
}

export interface IActionCreator<T extends ActionType, P> {
    type: T
    (payload: P, meta?: Meta): IAction<T, P>
}

export function createActionCreator<P=void>() {
    return <T extends ActionType>(type: T, isError?: (payload: P) => boolean): IActionCreator<T, P> => {
        const actionCreator = (payload: P, meta?: Meta) =>
            ({ type, payload, error: isError && isError(payload), meta })
        actionCreator.type = type
        return actionCreator
    }
}

export interface IReduceCase<T extends ActionType, S, P> {
    actionCreator: IActionCreator<T, P>
    reducer: React.Reducer<S, IAction<T, P>>
}

export interface IReducerCreatorBase<T extends ActionType, S> {
    initialState: S
    reduceCases: IReduceCase<T, S, any>[]
}

export interface IReducerCreatorInitiator<S> extends IReducerCreatorBase<any, S> {
    case<T extends ActionType, P>(actionCreator: IActionCreator<T, P>, reducer: React.Reducer<S, IAction<T, P>>): IReducerCreator<T, S>
}

export interface IReducerCreator<T extends ActionType, S> extends IReducerCreatorBase<T, S> {
    case<NT extends ActionType, P>(actionCreator: IActionCreator<NT, P>, reducer: React.Reducer<S, IAction<NT, P>>): IReducerCreator<T | NT, S>
}

export function createReducer<T extends ActionType, S>(reducerCreator: IReducerCreatorBase<T, S>): React.Reducer<S, IAction<T, any>> {
    return (state = reducerCreator.initialState, action) =>
        reducerCreator.reduceCases.reduce((prev, cur) => {
            if (action.type === cur.actionCreator.type) {
                return cur.reducer(prev, action)
            }
            else {
                return prev
            }
        }, state)
}

export function createReducerCreator<S>(initialState: S): IReducerCreatorInitiator<S> {
    return {
        initialState,
        reduceCases: [],
        case(actionCreator, reducer) {
            this.reduceCases.push({ actionCreator, reducer })
            return this as any
        }
    }
}

export interface IStore<T extends ActionType, S> {
    state: S
    dispatch: React.Dispatch<IAction<T, any>>
}

export function useReducerCreator<T extends ActionType, S>(reducerCreator: IReducerCreator<T, S>) {
    const reducer = createReducer(reducerCreator)
    const initialStore: IStore<T, S> = { state: reducerCreator.initialState, dispatch: () => { } }
    const Context = React.createContext(initialStore)

    const Provider: React.FunctionComponent = props => {
        const [state, dispatch] = React.useReducer(reducer, reducerCreator.initialState)
        return <Context.Provider value={{ state, dispatch }}>{props.children}</Context.Provider>
    }

    function connect<P>(mapStoreToProps: (store: IStore<T, S>) => P) {
        return (Component: React.FunctionComponent<P>): React.FunctionComponent => () => {
            const store = React.useContext(Context)
            const props = React.useMemo(() => mapStoreToProps(store), [store.state])
            return <Component {...props} />
        }
    }

    return { Context, Provider, connect }
}
