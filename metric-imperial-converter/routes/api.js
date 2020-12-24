/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get(function (req, res){
      let input = req.query.input;
      let initNum = convertHandler.getNum(input);
      let initUnit = convertHandler.getUnit(input);

      if(initUnit === 'Error' && initNum === 'Error') {
        res.json("invalid number and unit")
      } else if(initUnit === 'Error' || initNum === 'Error') {
        res.json(`${initUnit === 'Error' ? 'invalid unit' : 'invalid number'}`)
      } else {
        let returnNum = convertHandler.convert(initNum, initUnit);
        let returnUnit = convertHandler.getReturnUnit(initUnit);
        let spellOutUnit = convertHandler.spellOutUnit(initUnit)
        let spellOutReturnUnit = convertHandler.spellOutUnit(returnUnit)
        let toString = convertHandler.getString(initNum, spellOutUnit, returnNum, spellOutReturnUnit);

        res.json({
        "initNum":initNum,
        "initUnit":initUnit,
        "returnNum":returnNum,
        "returnUnit":returnUnit,
        "string":toString
        })
      }
    });
    
};
