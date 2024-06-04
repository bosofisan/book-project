const URL = 'http://localhost:3000/books';
const mainElement = document.getElementById('book-list');

function fetchBooks() {
  fetch(URL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      data.forEach(book => {
        const bookElement = createBookElement(book);
        mainElement.appendChild(bookElement);
        // Fetch reviews for the book
        book.reviews.forEach(review => {
          const reviewItem = document.createElement('li');
          reviewItem.textContent = review.comment;
          bookElement.querySelector('.reviews').appendChild(reviewItem);
        });
        // fetchBookReviews(book.id, bookElement);
      });
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });
}

function createBookElement(book) {
  const bookElement = document.createElement('div');
  bookElement.classList.add('book');
  bookElement.dataset.id = book.id;
  bookElement.innerHTML = `
    <h2>${book.title}</h2>
    <img src="${book.image}" alt="${book.title} cover">
    <p>Author: ${book.author}</p>
    <p>Synopsis: ${book.synopsis}</p>
    <p>Reviews:</p>
    <ul class="reviews"></ul>
    <textarea class="comment-input" placeholder="Add a comment"></textarea>
    <button class="add-comment-button">Add Comment</button>
  `;
  return bookElement;
}
function addComment(bookElement) {
  const commentInput = bookElement.querySelector('.comment-input');
  const commentText = commentInput.value.trim();
  if (commentText !== '') {
    const bookId = bookElement.dataset.id;
    const COMMENTAPIURL = `http://localhost:3000/books/${bookId}/reviews`;
    fetch(COMMENTAPIURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ comment: commentText })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(newReview => {
        const reviewsList = bookElement.querySelector('.reviews');
        const reviewItem = document.createElement('li');
        reviewItem.textContent = newReview.comment;
        reviewsList.appendChild(reviewItem);
        commentInput.value = ''; // Clear the input field
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });
  }
}

document.addEventListener('DOMContentLoaded', fetchBooks);
document.addEventListener('click', event => {
  if (event.target.classList.contains('add-comment-button')) {
    const bookElement = event.target.closest('.book');
    addComment(bookElement);
  }
});
