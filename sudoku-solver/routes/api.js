'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { coordinate, value, puzzle } = req.body
      let conflicts = []

      if(!puzzle || !coordinate || !value) return res.json({error: 'Required field(s) missing'})
      if(solver.validate(puzzle)) return res.json({error: solver.validate(puzzle)})
      if(!/[a-i][1-9]/i.test(coordinate)) return res.json({error: 'Invalid coordinate'})
      if(!/[1-9]/.test(value)) return res.json({error: 'Invalid value'})

      if(!solver.checkRowPlacement(puzzle, coordinate[0], coordinate[1], value)) {conflicts.push('row')}
      if(!solver.checkColPlacement(puzzle, coordinate[0], coordinate[1], value)) {conflicts.push('column')}
      if(!solver.checkRegionPlacement(puzzle, coordinate[0], coordinate[1], value)) {conflicts.push('region')}

      return !conflicts.length ? res.json({valid: true}) : res.json({valid: false, conflict: conflicts})
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle

      if(solver.validate(puzzle)) return res.json({error: solver.validate(puzzle)})

      return solver.solve(puzzle) ? res.json({solution: solver.solve(puzzle)}) : res.json({error: 'Puzzle cannot be solved'})
    });
};
