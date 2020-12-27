'use strict';
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const filterer = (arr, obj) => {
  arr.filter(a => !!a[1]).map(a => obj[a[0]] = a[1])
}

module.exports = function (app, issueSchema) {
  app.route('/api/issues/:project')
    
    .post(async function (req, res){
      let project = req.params.project;
      const Tracker = mongoose.model(project, issueSchema)
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body

      let issues = new Tracker({
        assigned_to: assigned_to,
        status_text: status_text,
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        created_on: new Date(),
        updated_on: new Date()
      })
      await issues.save((err, data) => {
        if(err) return res.json({error: 'required field(s) missing'})
        res.json({
          _id: data._id,
          issue_title: data.issue_title,
          issue_text: data.issue_text,
          created_on: data.created_on,
          updated_on: data.updated_on,
          created_by: data.created_by,
          assigned_to: data.assigned_to,
          open: data.open,
          status_text: data.status_text
        })
      })
    })

    .get(function (req, res){
      let project = req.params.project;
      const Tracker = mongoose.model(project, issueSchema)
      const { issue_title, issue_text, created_by, assigned_to, status_text, open, created_on, updated_on, _id } = req.query

      let filterObj = {}
      const queries = [
        ['_id', _id],
        ['issue_title', issue_title],
        ['issue_text', issue_text],
        ['created_on', created_on],
        ['updated_on', updated_on],
        ['created_by', created_by],
        ['assigned_to', assigned_to],
        ['open', open],
        ['status_text', status_text]
      ]

      filterer(queries, filterObj)

      Tracker.find(filterObj, (err, data) => {
        if(err) return console.log(err)
        res.json(data)
      })
    })
    
    .put(async function (req, res){
      let project = req.params.project;
      const Tracker = mongoose.model(project, issueSchema)
      let { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body

      let updateObj = {}
      const updates = [
        ['issue_title', issue_title],
        ['issue_text', issue_text],
        ['created_by', created_by],
        ['assigned_to', assigned_to],
        ['open', open],
        ['status_text', status_text],
        ['updated_on', new Date()]
      ]

      filterer(updates, updateObj)
      
      if(!_id) {
        res.json({
          error: 'missing _id'
        })
      } else if(Object.keys(updateObj).length == 1) {
        res.json({
          error: 'no update field(s) sent', _id: _id
        })
      } else if(!ObjectId.isValid(_id)) {
        res.json({
          error: 'could not update', _id: _id
        })
      } else {
        await Tracker.findByIdAndUpdate(_id, updateObj, (err, data) => {
          if(err || !data) return res.json({
            error: 'could not update', _id: _id
          })

          res.json({
            result: 'successfully updated',
            _id: data._id
          })
        })
      }
      
    })
    
    .delete(async function (req, res) {
      let project = req.params.project;
      const Tracker = mongoose.model(project, issueSchema)
      let { _id } = req.body
      
      if(!_id) {
        res.json({
          error: 'missing _id'
        })
      } else if(!ObjectId.isValid(_id)) {
          res.json({
            error: 'could not delete', _id: _id
          })
      } else {
        await Tracker.findByIdAndDelete(_id, (err, data) => {
          if(err || !data) return res.json({
            error: 'could not delete', _id: _id
          })

          res.json({
            result: 'successfully deleted',
            _id: data._id
          })
        })
      }
    });

};
