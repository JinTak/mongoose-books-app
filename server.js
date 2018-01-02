// server.js
// SERVER-SIDE JAVASCRIPT


/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////

//require express in our app
var express = require('express'),
    bodyParser = require('body-parser'),
    db = require('./models');

// generate a new express app and call it 'app'
var app = express();

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

////////////////////
//  ROUTES
///////////////////

// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('views/index.html' , { root : __dirname});
});

// get all books
app.get('/api/books', function (req, res) {
  // send all books as JSON response
  db.Book.find(function(err, books){
    if (err) { return console.log("index error: " + err); }
    res.json(books);
    });
});

// get one book
app.get('/api/books/:id', function (req, res) {
  // find one book by its id
    db.Book.findById(req.params.id, function (err, Book) { res.json(Book) } );
  });


// create new book
app.post('/api/books', function (req, res) {
  // create new book with form data (`req.body`)\
  var book = new db.Book({
    title: req.body.title,
    author: req.body.author,
    image: req.body.image,
    releaseDate: req.body.releaseDate
  })

  book.save(function (err, post) {
    if (err) { console.log("ERROR"); }
  });

});

// update book
app.put('/api/books/:id', function (req, res) {
  // create new book with form data (`req.body`)
  db.Book.findById(req.params.id, function (err, bookToUpdate) { 

    var updatedBook = new db.Book({
      title: req.body.title,
      author: req.body.author,
      image: req.body.image,
      releaseDate: req.body.releaseDate
    });
    
    bookToUpdate.save(function (err, updatedBook) {
      if (err) return handleError(err);
      res.send(bookToUpdate);
    });

  });

});

// delete book
app.delete('/api/books/:id', function (req, res) {

  db.Book.findById(req.params.id, function (err, Book) {
    var bookToDelete = Book;

    db.Book.remove( {_id: req.params.id }, (err) => {
      if(err) {
        res.json("Error: Object was not removed.")
        console.log("Error: Object was not removed.")
      }
      else {
        res.json("Successfully removed " + bookToDelete + "!")
        console.log("Successfully removed " + bookToDelete + "!");}
    }); 
    
  });
  
});





app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening at http://localhost:3000/');
});
