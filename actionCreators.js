import * as C from './constants'
import { caratIncrement } from './config'
import mongoose from 'mongoose'


export const diamondsAddedRareCaret = (diamonds) => dispatch => {
  return new Promise(resolve => {
    dispatch({
      type: C.DIAMONDS_ADDED_RARECARET,
      diamonds
    })
    resolve()
  })

}

export const diamondsAddedIdex = (diamonds) => dispatch => {
  return new Promise(resolve => {
    dispatch({
      type: C.DIAMONDS_ADDED_IDEX,
      diamonds
    })
    resolve()
  })
    
}

