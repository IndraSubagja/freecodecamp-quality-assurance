const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('Route Tests', () => {
    let ID
    suite('POST /api/issues/{project}', () => {
      
      test('Create an issue with every field', (done) => {
       chai.request(server)
        .post('/api/issues/:project')
        .send({
          issue_title: 'FCC',
          issue_text: 'Test',
          created_by: 'Dobleh',
          assigned_to: 'Server',
          status_text: 'On QA'
        })
        .end((err, res) => {
          ID = res.body._id
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'FCC');
          assert.equal(res.body.issue_text, 'Test');
          assert.equal(res.body.created_by, 'Dobleh');
          assert.equal(res.body.assigned_to, 'Server');
          assert.equal(res.body.status_text, 'On QA')
          done();
        });
      })

      test('Create an issue with only required fields', (done) => {
       chai.request(server)
        .post('/api/issues/:project')
        .send({
          issue_title: 'FCC',
          issue_text: 'Test',
          created_by: 'Dobleh',
          assigned_to: '',
          status_text: ''
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'FCC');
          assert.equal(res.body.issue_text, 'Test');
          assert.equal(res.body.created_by, 'Dobleh');
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '')
          done();
        });
      })

      test('Create an issue with missing required fields', (done) => {
       chai.request(server)
        .post('/api/issues/:project')
        .send({
          issue_title: '',
          issue_text: '',
          created_by: '',
          assigned_to: '',
          status_text: ''
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
      })

    })

    suite('GET /api/issues/{project}', () => {

      test('View issues on a project', (done) => {
       chai.request(server)
        .get('/api/issues/:project')
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
      })

      test('View issues on a project with one filter', (done) => {
       chai.request(server)
        .get('/api/issues/:project')
        .query({open: true})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body[0].open, true)
          done();
        });
      })

      test('View issues on a project with multiple filters', (done) => {
       chai.request(server)
        .get('/api/issues/:project')
        .query({open: true, assigned_to: 'Server'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body[0].open, true);
          assert.equal(res.body[0].assigned_to, 'Server')
          done();
        });
      })

    })

    suite('PUT /api/issues/{project}', () => {

      test('Update one field on an issue', (done) => {
       chai.request(server)
        .put('/api/issues/:project')
        .send({_id: ID,issue_text: 'Updated'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body._id, ID)
          assert.equal(res.body.result, 'successfully updated')
          done();
        })
      })

      test('Update multiple fields on an issue', (done) => {
       chai.request(server)
        .put('/api/issues/:project')
        .send({_id: ID, issue_text: 'Updated', updated_to: 'Jamal'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body._id, ID)
          assert.equal(res.body.result, 'successfully updated')
          done();
        })
      })

      test('Update an issue with missing _id', (done) => {
       chai.request(server)
        .put('/api/issues/:project')
        .send({_id: '', issue_text: 'Updated'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id')
          done();
        })
      })

      test('Update an issue with no fields to update', (done) => {
       chai.request(server)
        .put('/api/issues/:project')
        .send({
          _id: ID,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body._id, ID)
          assert.equal(res.body.error, 'no update field(s) sent')
          done();
        })
      })

      test('Update an issue with an invalid _id', (done) => {
       chai.request(server)
        .put('/api/issues/:project')
        .send({_id: 'invalid', issue_text: 'Updated'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body._id, 'invalid')
          assert.equal(res.body.error, 'could not update')
          done();
        })
      })

    })

    suite('DELETE /api/issues/{project}', () => {

      test('Delete an issue', (done) => {
       chai.request(server)
        .delete('/api/issues/:project')
        .send({_id: ID})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body._id, ID);
          assert.equal(res.body.result, 'successfully deleted')
          done();
        })
      })

      test('Delete an issue with an invalid _id', (done) => {
       chai.request(server)
        .delete('/api/issues/:project')
        .send({_id: 'invalid'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body._id, 'invalid')
          assert.equal(res.body.error, 'could not delete');
          done();
        })
      })

      test('Delete an issue with missing _id', (done) => {
       chai.request(server)
        .delete('/api/issues/:project')
        .send({_id: ''})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        })
      })
    })
  })
});
