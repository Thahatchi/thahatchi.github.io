$(document).ready(function() {
    let currentPage = 1;
    const resultsPerPage = 10;

    // Function to search for books
    function searchBooks(query, page = 1) {
        const startIndex = (page - 1) * resultsPerPage;
        const url = `/search?q=${query}&startIndex=${startIndex}&maxResults=${resultsPerPage}`;

        $.getJSON(url, function(data) {
            displayBooks(data.items);
            setupPagination(data.totalItems, query);
        });
    }

    // Function to display books
    function displayBooks(books) {
        $('#results').empty();
        if (books) {
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
        } else {
            $('#results').append('<p>No results found.</p>');
        }
    }

    // Function to set up pagination
    function setupPagination(totalItems, query) {
        const totalPages = Math.ceil(totalItems / resultsPerPage);
        $('#pagination').empty();
        
        for (let i = 1; i <= totalPages; i++) {
            $('#pagination').append(`<span class="page-number ${i === currentPage ? 'active' : ''}">${i}</span>`);
        }

        // Click event for pagination
        $('.page-number').click(function() {
            currentPage = parseInt($(this).text(), 10); // Get the page number from the clicked link
            searchBooks(query, currentPage); // Perform the search for the selected page
        });
    }

    // Display detailed information about the selected book
    function displayBookDetails(bookId, title, thumbnail) {
        const apiUrl = `/search/details/${bookId}`;
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
