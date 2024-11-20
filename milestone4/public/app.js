$(document).ready(function() {
    let currentPage = 1;
    const resultsPerPage = 10;

    // Function to search for books
    function searchBooks(query, page = 1) {
        const startIndex = (page - 1) * resultsPerPage;
        const url = `/search?q=${query}&startIndex=${startIndex}&maxResults=${resultsPerPage}`;

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
