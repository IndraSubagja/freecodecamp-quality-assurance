const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {

  suite('POST /api/translates', () => {

    test(' POST /api/translate => Translation with text and locale fields', (done) => {
     chai.request(server)
      .post('/api/translate')
      .send({text: 'Mangoes are my favorite fruit.', locale: 'american-to-british'})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.text, 'Mangoes are my favorite fruit.')
        assert.equal(res.body.translation, "Mangoes are my <span class=\"highlight\">favourite</span> fruit.")
        done()
      })
    })

    test(' POST /api/translate => Translation with text and invalid locale field', (done) => {
     chai.request(server)
      .post('/api/translate')
      .send({text: 'Mangoes are my favorite fruit.', locale: 'invalid'})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.error, 'Invalid value for locale field')

        done()
      })
    })

    test(' POST /api/translate => Translation with missing text field', (done) => {
     chai.request(server)
      .post('/api/translate')
      .send({locale: 'american-to-british'})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.error, 'Required field(s) missing')

        done()
      })
    })

    test(' POST /api/translate => Translation with missing locale field', (done) => {
     chai.request(server)
      .post('/api/translate')
      .send({text: 'Mangoes are my favorite fruit.'})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.error, 'Required field(s) missing')

        done()
      })
    })

    test(' POST /api/translate => Translation with empty text', (done) => {
     chai.request(server)
      .post('/api/translate')
      .send({text: '', locale: 'american-to-british'})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.error, 'No text to translate')

        done()
      })
    })

    test(' POST /api/translate => Translation with text that needs no translation', (done) => {
     chai.request(server)
      .post('/api/translate')
      .send({text: 'Mangoes are my favorite fruit.', locale: 'british-to-american'})
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.text, 'Mangoes are my favorite fruit.')
        assert.equal(res.body.translation, 'Everything looks good to me!')

        done()
      })
    })
  })

});
