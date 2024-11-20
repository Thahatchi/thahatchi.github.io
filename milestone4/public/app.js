$(document).ready(function() {
    let currentPage = 1;
    const resultsPerPage = 10;
    const apiKey = 'AIzaSyC2lPVELazlhLT8Nr66xG_HLruUBHP-CLo'; // Your API Key

    // Function to search for books
    function searchBooks(query, page = 1) {
        const startIndex = (page - 1) * resultsPerPage;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${resultsPerPage}&key=${apiKey}`;

        $.getJSON(url, function(data) {
            if (data.items) {
                displayBooks(data.items);
                setupPagination(data.totalItems, query); // Setup pagination with total items
            } else {
                $('#results').empty().append('<p>No results found.</p>');
                $('#pagination').empty(); // Clear pagination if no results
                $('#page-indicator').text(''); // Clear page indicator
            }
        }).fail(function() {
            $('#results').empty().append('<p>Error retrieving data. Please try again.</p>');
            $('#pagination').empty(); // Clear pagination on error
            $('#page-indicator').text(''); // Clear page indicator
        });
    }

    // Function to display books
    function displayBooks(books) {
        $('#results').empty(); // Clear previous results
        books.forEach(book => {
            const title = book.volumeInfo.title || 'No Title';
            const cover = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'images/no-image.jpg';
            $('#results').append(`<div class="result-item" data-id="${book.id}" data-title="${title}" data-thumbnail="${cover}">
                <h3>${title}</h3>
                <img src="${cover}" alt="${title}" />
            </div>`);
        });

        // Add click event to display book details
        $('.result-item').click(function() {
            const bookId = $(this).data('id');
            const title = $(this).data('title');
            const thumbnail = $(this).data('thumbnail');
            displayBookDetails(bookId, title, thumbnail);
        });
    }

    // Function to set up pagination
    function setupPagination(totalItems, query) {
        const totalPages = Math.ceil(totalItems / resultsPerPage);
        const maxPageButtons = 5; // Maximum number of pagination buttons
        $('#pagination').empty(); // Clear existing pagination
        $('#page-indicator').text(`Page ${currentPage} of ${totalPages}`); // Update page indicator

        // Calculate the range of pages to display
        const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

        // Adjust start page if endPage is less than maxPageButtons
        if (endPage - startPage < maxPageButtons - 1) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === currentPage ? 'active' : '';
            $('#pagination').append(`<span class="page-number ${isActive}" data-page="${i}">${i}</span>`);
        }
        
        // Add click event to page numbers
        $('.page-number').off('click').on('click', function() { // Unbind previous events
            currentPage = $(this).data('page'); // Get the page number from the clicked element
            searchBooks(query, currentPage); // Search with the new page
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
        }).fail(function() {
            $('#book-details').empty().append('<p>Error retrieving book details. Please try again.</p>');
            $('#book-details-section').show();
        });
    }

    // Search button click event
    $('#search-button').click(function() {
        const query = $('#search-input').val();
        if (query) {
            currentPage = 1; // Reset to first page
            searchBooks(query);
        } else {
            $('#results').empty().append('<p>Please enter a search term.</p>');
            $('#pagination').empty(); // Clear pagination if no search term
            $('#page-indicator').text(''); // Clear page indicator
        }
    });
});

