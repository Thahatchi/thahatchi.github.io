$(document).ready(function() {
    let currentPage = 1;
    const resultsPerPage = 10;
    const apiKey = 'AIzaSyC2lPVELazlhLT8Nr66xG_HLruUBHP-CLo'; // Your API Key

    // Display the initial bookshelf data
    displayBookshelf(bookshelf);

    // Function to search for books
    function searchBooks(query, page = 1) {
        const startIndex = (page - 1) * resultsPerPage;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${resultsPerPage}&key=${apiKey}`;

        $.getJSON(url, function(data) {
            displayBooks(data.items);
            setupPagination(data.totalItems, query);
        });
    }

    // Function to display books using Mustache.js templates
    function displayBooks(books) {
        $('#results').empty();
        if (books) {
            const template = $('#book-template').html(); // Get the Mustache template for books
            const bookData = books.map(book => {
                const title = book.volumeInfo.title || 'No Title';
                const cover = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'images/no-image.jpg';
                return {
                    id: book.id,
                    title: title,
                    thumbnail: cover
                };
            });

            // Render books with Mustache
            $('#results').html(Mustache.render(template, bookData));

            // Add click event to display book details
            $('.result-item').click(function() {
                const bookId = $(this).data('id');
                const title = $(this).data('title');
                const thumbnail = $(this).data('thumbnail');
                displayBookDetails(bookId, title, thumbnail);
            });
        } else {
            $('#results').append('<p>No results found.</p>');
        }
    }

    // Function to set up pagination using Mustache.js templates
    function setupPagination(totalItems, query) {
        const totalPages = Math.ceil(totalItems / resultsPerPage);
        const maxPageButtons = 5; // Maximum number of pagination buttons
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            pages.push({
                page: i,
                active: i === currentPage // Mark current page as active
            });
        }

        const template = $('#pagination-template').html(); // Get the Mustache template for pagination
        $('#pagination').html(Mustache.render(template, { pages: pages }));

        // Click event for pagination
        $('.page-number').click(function() {
            currentPage = parseInt($(this).data('page'), 10); // Get the page number from the clicked link
            searchBooks(query, currentPage); // Perform the search for the selected page
        });
    }

    // Display detailed information about the selected book
    function displayBookDetails(bookId, title, thumbnail) {
        const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;
        $.getJSON(apiUrl, function(data) {
            $('#book-details').empty();
            const authors = data.volumeInfo.authors ? data.volumeInfo.authors.join(', ') : 'Unknown Author';
            const description = data.volumeInfo.description ? data.volumeInfo.description : 'No description available.';
            $('#book-details').append(`
                <h3>${title}</h3>
                <img src="${thumbnail}" alt="${title}" />
                <p><strong>Authors:</strong> ${authors}</p>
                <p><strong>Description:</strong> ${description}</p>
            `);
            $('#book-details-section').show();
        });
    }

    // Search button click event
    $('#search-button').click(function() {
        const query = $('#search-input').val();
        if (query) {
            currentPage = 1; // Reset to first page
            searchBooks(query);
        }
    });
});
