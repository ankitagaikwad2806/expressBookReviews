const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 1 & Task 10: Get the book list available in the shop using async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books').catch(() => null);
    const bookList = (response && response.data) ? response.data : books;
    if (bookList && Object.keys(bookList).length > 0) {
      return res.status(200).send(JSON.stringify(bookList, null, 4));
    } else {
      return res.status(404).json({ message: "No books found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
});

// Task 10 Helper: Standalone function to fetch all books using Axios
const getAllBooks = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error retrieving all books:", error.message);
  }
};

// Task 2 & Task 11: Get book details based on ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/books/${isbn}`).catch(() => null);
    const book = (response && response.data) ? response.data : books[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book by ISBN", error: error.message });
  }
});

// Task 11 Helper: Standalone function to fetch book by ISBN using Axios
const getBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error retrieving book with ISBN ${isbn}:`, error.message);
  }
};
  
// Task 3 & Task 12: Get book details based on author using async/await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`).catch(() => null);
    const allBooks = (response && response.data) ? response.data : books;
    const matchingBooks = Object.values(allBooks).filter(
      (book) => book.author.toLowerCase() === author.toLowerCase()
    );

    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: `No books found by author ${author}` });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Task 12 Helper: Standalone function to fetch books by Author using Axios
const getBooksByAuthor = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error retrieving books by author ${author}:`, error.message);
  }
};

// Task 4 & Task 13: Get all books based on title using async/await with Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`).catch(() => null);
    const allBooks = (response && response.data) ? response.data : books;
    const matchingBooks = Object.values(allBooks).filter(
      (book) => book.title.toLowerCase() === title.toLowerCase()
    );

    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: `No books found with title ${title}` });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

// Task 13 Helper: Standalone function to fetch books by Title using Axios
const getBooksByTitle = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error retrieving books with title ${title}:`, error.message);
  }
};

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: `No reviews found for ISBN ${isbn}` });
  }
});

module.exports.general = public_users;

    
       
