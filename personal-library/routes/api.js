/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const ObjectId = require('mongoose').Types.ObjectId

module.exports = function (app, Book) {

  app.route('/api/books')
    .get(async function (req, res){
      await Book.find({}, (err, data) => {
        if(err) return console.error(data)
        res.json(data)
      })
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      let book = new Book({title: title})

      await book.save((err, data) => {
        if(err) return res.json("missing required field title")
        res.json({
          _id: data._id,
          title: data.title
        })
      })
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      Book.deleteMany({}, (err, data) => {
        if(err) return console.error(err)

        res.json("complete delete successful")
      })
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      
      if(!ObjectId.isValid(bookid)) return res.json("no book exists")
      
      await Book.findById(bookid, (err, data) => {
        if(err || !data) return res.json("no book exists")

        res.json(data)
      })
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      if(!comment) {
        res.json("missing required field comment")
      } else if(!ObjectId.isValid(bookid)) {
        res.json("no book exists")
      } else {
        let book = await Book.findById(bookid)
        if(!book) return res.json("no book exists")

        await Book.findByIdAndUpdate(bookid, {
          $push: {comments: comment},
          $inc: {commentcount: 1}
        })

        await Book.findById(bookid, (err, data) => {
          res.json(data)
        })
      }
      //json res format same as .get
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;

      if(!ObjectId.isValid(bookid)) return res.json("no book exists")

      await Book.findByIdAndDelete(bookid, (err, data) => {
        if(err || !data) return res.json("no book exists")
        res.json("delete successful")
      })
      //if successful response will be 'delete successful'
    });
  
};
