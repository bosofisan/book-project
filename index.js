document.addEventListener('DOMContentLoaded', () => {
fetch('http://localhost:3000/books')
  .then(response => response.json())
  .then(books => {
    populateBookNav(books);
    if (books.length > 0) {
      updateBookDetails(books[0]);
    }
  })
  .catch(error=> console.error('Error fetching books:', error));
});

// Function to render books in the navigation
function populateBookNav(books) {
  const booksContainer = document.querySelector('.books');
  booksContainer.innerHTML = ''; //Clear previous books

  books.forEach(book => {
    const bookItem = document.createElement('div');
    bookItem.classList.add('book-item');
    // bookItem.innerText = book.title;
    bookItem.dataset.bookId = book.id;
    
    const bookImage = document.createElement('img');
    bookImage.src = book.image;
    bookImage.alt = book.title;

    const bookTitle = document.createElement('div');
    bookTitle.classList.add('book-title');
    bookTitle.innerText = book.title;

    bookItem.appendChild(bookImage);
    bookItem.appendChild(bookTitle);

    // show book detail when clicked
    bookItem.addEventListener('click', () => updateBookDetails(book));

    // event listener for mouse events
    bookItem.addEventListener('mouseover', () => handleMouseOver(bookItem));
    bookItem.addEventListener('mouseleave', () => handleMouseLeave(bookItem));

    booksContainer.appendChild(bookItem);
  });
}

// Handle mouseover event
function handleMouseOver(element) {
  element.classList.add('hover-ring');
}

// Handle mouseleave event
function handleMouseLeave(element) {
  element.classList.remove('hover-ring');
}

// Update book details
function updateBookDetails(book) {
  const bookDetailSection = document.querySelector('.book-info');
  bookDetailSection.innerHTML = '';

  //make book details section visible
  bookDetailSection.classList.add('visible');

  //Create new book element
  const bookImage = document.createElement('img');
  bookImage.src = book.image;
  bookImage.alt = book.title;
  bookDetailSection.appendChild(bookImage);

  //Create container for title and author
  const titleAuthorContainer = document.createElement('div');
  titleAuthorContainer.className = 'title-author-container';


  const bookTitle = document.createElement('h2');
  bookTitle.className = 'book-title';
  bookTitle.textContent = book.title;
  titleAuthorContainer.appendChild(bookTitle);

  const bookAuthor = document.createElement('span');
  bookAuthor.className = 'book-author';
  bookAuthor.textContent = book.author;
  titleAuthorContainer.appendChild(bookAuthor);

  bookDetailSection.appendChild(titleAuthorContainer);

  const bookSynopsis = document.createElement('p');
  bookSynopsis.textContent = book.synopsis
  bookDetailSection.appendChild(bookSynopsis);

 // Highlight the selected book
document.querySelectorAll ('.book-item').forEach(item =>{
  item.classList.remove('selected');
  if (item.dataset.bookId === book.id.toString()) {
    item.classList.add('selected');
  }
}); 

updateReviewsSection(book.reviews);
}

// Update reviews section
function updateReviewsSection(reviews) {
  const reviewsList = document.querySelector('.existing-reviews');
  reviewsList.innerHTML = ''; // Clear previous review

  reviews.forEach(review => {
      const reviewElement = document.createElement('li');
      reviewElement.textContent = review;
      reviewsList.appendChild(reviewElement);
  });
}

// Form submit for new reviews
document.getElementById('reviewForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const reviewInput = document.getElementById('reviewInput');
  const newReview = reviewInput.value.trim();

  if (newReview) {
      const selectedBookDiv = document.querySelector('.book-item.selected');
      const bookId = selectedBookDiv ? selectedBookDiv.dataset.bookId : null;

      if (bookId) {
         addReviewToBook(bookId, newReview);
            reviewInput.value = ''; // Clear input field
      } else {
          alert('Please select a book to review.');
      }
  } else {
      alert('Please enter a review.');
  }
});

// Add a comment to a book
function addReviewToBook(bookId, review) {
  fetch(`http://localhost:3000/books/${bookId}`)
  .then(response => response.json())
  .then(book => {
    if(!Array.isArray(book.reviews)) {
      book.reviews = [];
    }
    book.reviews.push(review);
      return fetch(`http://localhost:3000/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(book),
      });
  })
  .then(response => response.json())
  .then(updatedBook => {
    updateBookDetails(updatedBook);
})
.catch(error => console.error('Error updating book review:', error));
}
