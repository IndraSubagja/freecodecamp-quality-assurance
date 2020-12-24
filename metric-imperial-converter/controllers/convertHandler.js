/*
*
*
*       Complete the handler logic below
*       
*       
*/

function ConvertHandler() {
  
  this.getNum = function(input) {
    const regex = /^([0-9\.]+(\/[0-9\.]+)?)?([A-Za-z]+)?$/
    input = regex.test(input) && !input.match(regex)[1] ? '1' : input

    let result = (regex.test(input)) ? eval(input.match(regex)[1]) : "Error";
    
    return result;
  };
  
  this.getUnit = function(input) {
    const unit = ['gal','L','mi','km','lbs','kg'];
    const regex = /[A-Za-z]+/i
    let value = input.match(regex)[0]
    value = /^l$/i.test(value) ? 'L' : value.toLowerCase()
    
    let result = unit.includes(value) ? value : 'Error'
    
    return result;
  };
  
  this.getReturnUnit = function(initUnit) {
    const unit = [['gal', 'L'], ['mi', 'km'], ['lbs', 'kg']]
    initUnit = initUnit === 'l' ? 'L' : initUnit

    let result = unit.filter(pair => pair.includes(initUnit))
    return result[0].filter(res => res !== initUnit)[0]
  };

  this.spellOutUnit = function(unit) {
    const spellOut = [['gal', 'gallons'], ['L', 'liters'], ['mi', 'miles'], ['km', 'kilometers'], ['lbs', 'pounds'], ['kg', 'kilograms']]
    unit = unit === 'l' ? 'L' : unit

    let result = spellOut.filter(pair => pair.includes(unit));
    return result[0][1]
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    const datas = [{
      galToL: ['gal', 'L', galToL]
    }, {
      lbsToKg: ['lbs', 'kg', lbsToKg]
    }, {
      miToKm: ['mi', 'km', miToKm]
    }]

    let result = datas.filter(data => data[Object.keys(data)].includes(initUnit))
    let val = result[0][Object.keys(result[0])]
    
    if(val[0] === initUnit) {
      return parseFloat((initNum * val[2]).toFixed(5))
    } else {
      return parseFloat((initNum / val[2]).toFixed(5))
    }
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    let result = `${initNum} ${initUnit} converts to ${returnNum} ${returnUnit}`
    
    return result;
  };
  
}

module.exports = ConvertHandler;
