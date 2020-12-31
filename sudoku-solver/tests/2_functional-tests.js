const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzleLibs = require('../controllers/puzzle-strings.js').puzzlesAndSolutions

chai.use(chaiHttp);

suite('Functional Tests', () => {
  let invalidPuzzle = '1.5..2.84..63.12.7.2..5invalid.1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'

  test('POST /api/solve => Solve a puzzle with valid puzzle string', (done) => {
   chai.request(server)
    .post('/api/solve')
    .send({puzzle: puzzleLibs[0][0]})
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.equal(res.body.solution, puzzleLibs[0][1])
      done()
    })
  })

  test('POST /api/solve => Solve a puzzle with missing puzzle string', (done) => {
   chai.request(server)
    .post('/api/solve')
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.equal(res.body.error, 'Required field missing')
      done()
    })
  })

  test('POST /api/solve => Solve a puzzle with invalid characters', (done) => {
   chai.request(server)
    .post('/api/solve')
    .send({puzzle: invalidPuzzle})
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.equal(res.body.error, 'Invalid characters in puzzle')
      done()
    })
  })

  test('POST /api/solve => Solve a puzzle with incorrect length', (done) => {
   chai.request(server)
    .post('/api/solve')
    .send({puzzle: '123'})
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
      done()
    })
  })

  test('POST /api/solve => Solve a puzzle that cannot be solved', (done) => {
   chai.request(server)
    .post('/api/solve')
    .send({puzzle: '145..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.equal(res.body.error, 'Puzzle cannot be solved')
      done()
    })
  })

  test('POST /api/check => Check a puzzle placement with all fields', (done) => {
   chai.request(server)
    .post('/api/check')
    .send({puzzle: puzzleLibs[0][0], coordinate: 'A2', value: 3})
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.equal(res.body.valid, true)
      done()
    })
  })

  test('POST /api/check => Check a puzzle placement with single placement conflict', (done) => {
   chai.request(server)
    .post('/api/check')
    .send({puzzle: puzzleLibs[0][0], coordinate: 'A2', value: 4})
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.equal(res.body.valid, false)
      assert.include(res.body.conflict, 'row')
      assert.notInclude(res.body.conflict, 'region')
      assert.notInclude(res.body.conflict, 'column')
      done()
    })
  })

  test('POST /api/check => Check a puzzle placement with multiple placement conflicts', (done) => {
   chai.request(server)
    .post('/api/check')
    .send({puzzle: puzzleLibs[0][0], coordinate: 'A2', value: 1})
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.equal(res.body.valid, false)
      assert.include(res.body.conflict, 'row')
      assert.include(res.body.conflict, 'region')
      assert.notInclude(res.body.conflict, 'column')
      done()
    })
  })

  test('POST /api/check => Check a puzzle placement with all placement conflicts', (done) => {
   chai.request(server)
    .post('/api/check')
    .send({puzzle: puzzleLibs[0][0], coordinate: 'A2', value: 2})
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.equal(res.body.valid, false)
      assert.include(res.body.conflict, 'row')
      assert.include(res.body.conflict, 'region')
      assert.include(res.body.conflict, 'column')
      done()
    })
  })

  test('POST /api/check => Check a puzzle placement with missing required fields', (done) => {
   chai.request(server)
    .post('/api/check')
    .send({puzzle: puzzleLibs[0][0], value: 2})
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.equal(res.body.error, 'Required field(s) missing')
      done()
    })
  })

  test('POST /api/check => Check a puzzle placement with invalid characters', (done) => {
   chai.request(server)
    .post('/api/check')
    .send({puzzle: invalidPuzzle, coordinate: 'A2', value: 2})
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.equal(res.body.error, 'Invalid characters in puzzle')
      done()
    })
  })

  test('POST /api/solve => Check a puzzle placement with incorrect length', (done) => {
   chai.request(server)
    .post('/api/check')
    .send({puzzle: '123', coordinate: 'A2', value: 2})
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
      done()
    })
  })

  test('POST /api/solve => Check a puzzle placement with invalid placement coordinate', (done) => {
   chai.request(server)
    .post('/api/check')
    .send({puzzle: puzzleLibs[0][0], coordinate: 'Z9', value: 2})
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.equal(res.body.error, 'Invalid coordinate')
      done()
    })
  })

  test('POST /api/solve => Check a puzzle placement with invalid placement value', (done) => {
   chai.request(server)
    .post('/api/check')
    .send({puzzle: puzzleLibs[0][0], coordinate: 'A2', value: 'Two'})
    .end((err, res) => {
      assert.equal(res.status, 200)
      assert.equal(res.body.error, 'Invalid value')
      done()
    })
  })
});

