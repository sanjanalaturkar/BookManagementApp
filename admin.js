// Central array to store all book objects
let bookData = [];

// Image URL provided in the instructions
const DEFAULT_IMAGE_URL = "https://m.media-amazon.com/images/I/71ZB18P3inl._SY522_.jpg";

// DOM Elements
const addBookForm = document.getElementById('addBookForm');
const bookGrid = document.getElementById('bookGrid');
const sortButton = document.getElementById('sortButton');
const filterCategory = document.getElementById('filterCategory');

// --- Helper Functions ---

/**
 * Renders the books in the bookData array to the UI.
 * @param {Array} books - The array of book objects to render.
 */
function renderBooks(books) {
    bookGrid.innerHTML = ''; // Clear existing content

    books.forEach((book, index) => {
        // Create the card element
        const card = document.createElement('div');
        card.classList.add('book-card');
        
        // Use the index as a unique ID for deletion (simulating a database ID)
        card.setAttribute('data-index', index); 

        card.innerHTML = `
            <img src="${book.imageUrl}" alt="${book.title} cover">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Category:</strong> ${book.category}</p>
            <button class="button delete-button" data-index="${index}">Delete</button>
        `;

        // Add event listener to the Delete Button
        card.querySelector('.delete-button').addEventListener('click', handleDelete);

        bookGrid.appendChild(card);
    });
}

/**
 * Gets the filtered and/or sorted books based on current UI state.
 * @returns {Array} - The books array after applying current filters/sort.
 */
function getProcessedBooks() {
    let books = [...bookData]; // Create a copy to manipulate

    // 1. Filtering
    const selectedCategory = filterCategory.value;
    if (selectedCategory !== 'All') {
        books = books.filter(book => book.category === selectedCategory);
    }

    // 2. Sorting
    const sortOrder = sortButton.getAttribute('data-sort-order');
    if (sortOrder) {
        books.sort((a, b) => {
            const titleA = a.title.toUpperCase();
            const titleB = b.title.toUpperCase();

            if (titleA < titleB) {
                return sortOrder === 'asc' ? -1 : 1;
            }
            if (titleA > titleB) {
                return sortOrder === 'asc' ? 1 : -1;
            }
            return 0; // Titles must be equal
        });
    }

    return books;
}

/**
 * Main function to update the display based on filters/sort.
 */
function updateDisplay() {
    const booksToRender = getProcessedBooks();
    renderBooks(booksToRender);
}


// --- Event Handlers ---

/**
 * Handles the submission of the Add Book form.
 * @param {Event} event - The form submission event.
 */
function handleAddBook(event) {
    event.preventDefault();

    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const categorySelect = document.getElementById('category');

    const newBook = {
        title: titleInput.value.trim(),
        author: authorInput.value.trim(),
        category: categorySelect.value,
        imageUrl: DEFAULT_IMAGE_URL 
    };

    // 1. Add book object to the array
    bookData.push(newBook);

    // 2. Clear the form
    addBookForm.reset();
    
    // 3. Update the display (renders the whole list, including the new book)
    updateDisplay();
}

/**
 * Handles the click on the Sort Button.
 */
function handleSort() {
    const currentOrder = sortButton.getAttribute('data-sort-order');
    let newOrder;
    let newText;

    if (currentOrder === 'asc') {
        newOrder = 'desc';
        newText = 'Sort by Title Z → A';
    } else {
        newOrder = 'asc';
        newText = 'Sort by Title A → Z';
    }

    // Update button state
    sortButton.setAttribute('data-sort-order', newOrder);
    sortButton.textContent = newText;

    // Update display with sorted data
    updateDisplay();
}

/**
 * Handles the change event on the Delete Button.
 * Uses the index stored on the button to find and delete the book.
 * @param {Event} event - The click event.
 */
function handleDelete(event) {
    // The index to delete is stored in the data-index attribute of the button
    const indexToDelete = parseInt(event.target.getAttribute('data-index'));

    // This is the index of the book in the currently displayed (filtered/sorted) array.
    // To delete from the main bookData array, we must find the actual object first.

    const bookCard = event.target.closest('.book-card');
    const bookTitle = bookCard.querySelector('h3').textContent;
    const bookAuthor = bookCard.querySelector('p:nth-child(3)').textContent.replace('Author: ', '');

    // Find the index of the matching book in the MAIN array (bookData)
    const mainIndex = bookData.findIndex(book => 
        book.title === bookTitle && book.author === bookAuthor
    );

    if (mainIndex !== -1) {
        // 1. Remove the book from the main array
        bookData.splice(mainIndex, 1);
        
        // 2. Re-render the UI
        updateDisplay(); 
        console.log(`Deleted book: ${bookTitle}`);
    }
}


// --- Event Listeners Initialization ---

addBookForm.addEventListener('submit', handleAddBook);
sortButton.addEventListener('click', handleSort);
filterCategory.addEventListener('change', updateDisplay);

// Initial call to render any pre-loaded data (if we had any)
// For now, it will just show an empty grid.
// **Tip:** You can populate bookData here for testing.
// bookData = [
//     { title: "Example Tech Book", author: "A. Author", category: "Technical", imageUrl: DEFAULT_IMAGE_URL },
//     { title: "Funny Stories", author: "B. Author", category: "Comedy", imageUrl: DEFAULT_IMAGE_URL }
// ];
// updateDisplay();
