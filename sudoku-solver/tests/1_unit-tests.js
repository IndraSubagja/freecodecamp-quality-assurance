const chai = require('chai');
const assert = chai.assert;
const puzzleLibs = require('../controllers/puzzle-strings.js').puzzlesAndSolutions

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver()

suite('UnitTests', () => {

  test('Valid puzzle string of 81 characters', (done) => {
    let puzzle = puzzleLibs[0][0]
    assert.isNotOk(solver.validate(puzzle))
    done()
  })

  test('Puzzle string with invalid characters', (done) => {
    let puzzle = '1.5..2.84..63.12.7.2..5invalid.1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'

    assert.isOk(solver.validate(puzzle))
    done()
  })

  test('Puzzle string that is not 81 characters in length', (done) => {
    let puzzle = 'invalid'

    assert.isOk(solver.validate(puzzle))
    done()
  })

  test('Valid row placement', (done) => {
    let puzzle = puzzleLibs[0][0]

    assert.isTrue(solver.checkRowPlacement(puzzle, 'A', 2, 3))
    done()
  })

  test('Invalid row placement', (done) => {
    let puzzle = puzzleLibs[0][0]
    
    assert.isNotTrue(solver.checkRowPlacement(puzzle, 'A', 1, 2))
    assert.isNotTrue(solver.checkRowPlacement(puzzle, 'A', 2, 'Q'))
    done()
  })

  test('Valid column placement', (done) => {
    let puzzle = puzzleLibs[0][0]
    
    assert.isTrue(solver.checkColPlacement(puzzle, 'C', 4, 4))
    assert.isNotTrue(solver.checkRowPlacement(puzzle, 'A', 2, 'Q'))
    done()
  })

  test('Invalid column placement', (done) => {
    let puzzle = puzzleLibs[0][0]
    
    assert.isNotTrue(solver.checkColPlacement(puzzle, 'A', 1, 6))
    assert.isNotTrue(solver.checkRowPlacement(puzzle, 'A', 2, 'Q'))
    done()
  })

  test('Valid region (3x3 grid) placement', (done) => {
    let puzzle = puzzleLibs[0][0]
    assert.isTrue(solver.checkRegionPlacement(puzzle, 'C', 4, 6))
    done()
  })

  test('Invalid region (3x3 grid) placement', (done) => {
    let puzzle = puzzleLibs[0][0]
    assert.isNotTrue(solver.checkRegionPlacement(puzzle, 'C', 4, 2))
    done()
  })

  test('Valid puzzle strings pass the solver', (done) => {
    let puzzle = puzzleLibs[0][1]
    assert.equal(solver.solve(puzzle), puzzle)
    done()
  })

  test('Invalid puzzle strings pass the solver', (done) => {
    let puzzle = '145..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
    assert.isNotTrue(solver.solve(puzzle))
    done()
  })

  test('Solver returns the the expected solution for an incomplete puzzzle', (done) => {
    let puzzle = puzzleLibs[0][0]
    assert.equal(solver.solve(puzzle), puzzleLibs[0][1])
    done()
  })

});
