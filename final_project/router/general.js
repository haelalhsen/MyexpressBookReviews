const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const axios = require('axios');

const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  return res.status(200).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const result = Object.values(books).filter(book => book.author === author);

  if (result.length === 0) {
    return res.status(404).json({ message: "No books found for the given author." });
  }

  return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const result = Object.values(books).filter(book => book.title === title);

  if (result.length === 0) {
    return res.status(404).json({ message: "No books found with the given title." });
  }

  return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  return res.status(200).json(book.reviews);
});

//use Promise callbacks or Async-Await functions
public_users.get('/promise', (req, res) => {
    let baseUrl="https://haelalhsen-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/"
  axios.get(baseUrl) // Replace with the correct URL of your service
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(error => {
      res.status(500).json({ message: "Error fetching books.", error: error.message });
    });
});
public_users.get('/async', async (req, res) => {
    let baseUrl="https://haelalhsen-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/";
  try {
    const response = await axios.get(baseUrl); // Replace with the correct URL of your service
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books.", error: error.message });
  }
});
module.exports.general = public_users;
