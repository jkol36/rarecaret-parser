import { expect } from 'chai'
import { initializeDatabase } from './config'
import mongoose from 'mongoose'
import fs from 'fs'
import csv2json from 'csv2json'
import json2csv from 'json2csv'
import { store } from './store'
import {
  diamondsAddedRareCaret, 
  diamondsAddedIdex
} from './actionCreators'
require('./config')

const { getState, dispatch } = store

const convertCsvToJson = (filename, csv) => {
    return Promise.resolve(fs.createReadStream(csv)
    .pipe(csv2json({
      separator: ','
    }))
    .pipe(fs.createWriteStream(`${filename}.json`)))
}
const openIdexJsonFile = () => {
  return new Promise(resolve => {
    let json = require('./idex.json')
    resolve(json)
  })
}

const syncRareCaretDiamondsWithRedux = () => {
      return mongoose
        .model('rareCaratDiamond')
        .find({})
        .then(diamonds => dispatch(diamondsAddedRareCaret(diamonds)))
        .then(() => mongoose.connection.close())
      

}

const findDiamondsCheaperThanRareCaretTwo = () => {
  const { idexDiamonds } = getState()
  for(var i = 0; i<idexDiamonds.length; i++) {
     let idexDiamond = idexDiamonds[i]
     let {
      Cut, 
      Carat, 
      Color, 
      Clarity, 
      Polish,
      Symmetry,
      Depth,
      Table,
      Price,
    } = idexDiamond
    mongoose
      .model('rareCaratDiamond')
      .find({
        Carat,
        Color,
        Clarity,
        Polish,
        Symmetry,
        Depth,
        Table
      })
      .then(res => {
        console.log(res)
      })
  }
}
const findDiamondsCheaperThanRareCaret = () => {
  console.log('finding cheaper diamonds')
  const {rareCaretDiamonds, idexDiamonds} = getState()
  console.log(`got ${rareCaretDiamonds.length} rare caret diamonds and ${idexDiamonds.length} idex diamonds`)
  let cheaperThanRareCaret = []
  //for each idex diamond I need to find a sibling rare caret diamond for a specific Carat,
  //how many of the idex diamonds do we havet that are cheaper than rare caret
  //create a new mapping between rarecaret diamond keys, place all diamonds with a cut of 'something' accessible
  // with that key. So if i put something into the object it will return the full rare caret diamond.

  for(var i=0; i<idexDiamonds.length; i++) {
    let idexDiamond = idexDiamonds[i]
    let {
      Cut, 
      Carat, 
      Color, 
      Clarity, 
      Polish,
      Symmetry,
      Depth,
      Table,
      Price,
    } = idexDiamond
    expect(Cut).to.not.be.undefined
    expect(Carat).to.not.be.undefined
    expect(Color).to.not.be.undefined
    expect(Clarity).to.not.be.undefined
    expect(Polish).to.not.be.undefined
    expect(Symmetry).to.not.be.undefined
    expect(Depth).to.not.be.undefined
    expect(Table).to.not.be.undefined
    let price = idexDiamond['Total Price']
    let Fluorescence = idexDiamond['Fluorescence Intensity']
    expect(Fluorescence).to.not.be.null
    let found = rareCaretDiamonds.find((rd) => {
      return (
        +rd.Carat === +Carat &&
        rd.Clarity === Clarity && 
        rd.Color === Color &&
        rd.Polish === Polish &&
        rd.Symmetry === Symmetry &&
        rd.Fluorescence === Fluorescence &&
        Math.round(+rd.Price) >= Math.round(+price)
      )
    })
    
    if(found) {
      let priceVariance = (Math.round(+price) / Math.round(+found.Price))      
      cheaperThanRareCaret.push(Object.assign({}, idexDiamond, {priceVariance}, {rareCaretPrice:found.Price}, {idexPrice:price}))
    }
  }
  return Promise.resolve(cheaperThanRareCaret)

}


const syncIdexDiamondsWithRedux = () => {
  return openIdexJsonFile()
          .then(json => dispatch(diamondsAddedIdex(json)))
}

const writeResultsToCsv = (results) => {
  return new Promise(resolve => {
    let csv = json2csv({data:results})
    fs.writeFile('results.csv', csv, (err) => {
      if(!err) {
        resolve(results)
      }
    })
  })
}


initializeDatabase()
.then(syncRareCaretDiamondsWithRedux)
.then(syncIdexDiamondsWithRedux)
.then(findDiamondsCheaperThanRareCaret)
.then(cheaperThanRareCaret => writeResultsToCsv(cheaperThanRareCaret))
.then(() => console.log('done'))
.then(console.log)
.catch(console.log)

// initializeDatabase()
// .then(syncRareCaretDiamondsWithRedux)
// .then(syncIdexDiamondsWithRedux)
// .then(testingSomething)
// .catch(console.log)

