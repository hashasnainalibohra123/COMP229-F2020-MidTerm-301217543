// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
const books = require('../models/books');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
  //create object every times when you display the add page
  let books = book({
    });
  res.render('books/details', {title: 'Add Book', books: books,messages:''})    
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {
      let newBook = book({
        "Title": req.body.title,
        "Description": req.body.description,
        "Price": req.body.price,
        "Author": req.body.author,
        "Genre": req.body.genre
      });
      book.create(newBook, (err, newBook) =>{
      if(err)
      {
          console.log(err);
          res.render('books/details', {title: 'Add Book', books: books,messages: 'Form Validation Error:'+err.message})    
      }
      else
      {
          // refresh the book list
          res.redirect('/books');
      }
  });

});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {

  let id = req.params.id;

  books.findById(id, (err, booksToEdit) => {
      if(err)
      {
          console.log(err);
          res.end(err);
      }
      else
      {
          //show the edit view
          res.render('books/details', {title: 'Edit Book Details', books: booksToEdit,messages:''})
      }
  });
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {

  let id = req.params.id
  let updatedBook = book({
    "_id": id,
    "Title": req.body.title,
    "Description": req.body.description,
    "Price": req.body.price,
    "Author": req.body.author,
    "Genre": req.body.genre
  });
  
  book.updateOne({_id: id}, updatedBook, (err) => {
      if(err)
      {
          console.log(err);
          res.render('books/details', {title: 'Edit Book Details', books: books,messages: 'Form Validation Error:'+err.message})    
      }
      else
      {
          // refresh the contact list
          res.redirect('/books');
      }
  });

});

// GET - process the delete by book id
router.get('/delete/:id', (req, res, next) => {
    let id = req.params.id;
    book.remove({_id: id}, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
             // redirect to book list page
             res.redirect('/books');
        }
    });
});


module.exports = router;
