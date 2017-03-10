import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux'
import thunk from 'redux-thunk'
import {
  rareCaretDiamonds,
  idexDiamonds,
} from './reducers'

export const store = createStore(combineReducers({
  rareCaretDiamonds,
  idexDiamonds,
}), applyMiddleware(thunk));