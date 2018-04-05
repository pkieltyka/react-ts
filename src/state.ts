import { createStore, Reducer } from 'redux'

export interface AppState {
  player: string
}

const initState = {
  player: 'dude!!'
}

export const rootReducer: Reducer<AppState> = (state = initState, action) => {
  return state
}

export const store = createStore(rootReducer)
