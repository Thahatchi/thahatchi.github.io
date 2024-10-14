$(document).ready(function() {
    // Fetch data from local JSON file using AJAX
    $.getJSON('https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/google-books-book.json', function(data) {
        var htmlContent = '<h2>' + data.volumeInfo.title + '</h2>';
        htmlContent += '<p><strong>Author:</strong> ' + (data.volumeInfo.authors || []).join(', ') + '</p>';
        htmlContent += '<p><strong>Published Date:</strong> ' + data.volumeInfo.publishedDate + '</p>';
        htmlContent += '<p><strong>Description:</strong> ' + data.volumeInfo.description + '</p>';
        htmlContent += '<img src="' + data.volumeInfo.imageLinks.thumbnail + '" alt="Book Cover">';
        
        $('#google-books-book-content').html(htmlContent);
    }).fail(function() {
        $('#google-books-book-content').html('<p>Failed to load data. Please try again later.</p>');
    });

    // Existing book search functionality
    $('#search-button').click(function() {
        const query = $('#search-input').val();
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=50`;
        
        $.getJSON(apiUrl, function(data) {
            $('#results').empty(); // Clear previous results
            totalItems = data.items ? data.items.length : 0;
            if (totalItems > 0) {
                const pages = Math.ceil(totalItems / itemsPerPage);
                $('#pagination').empty();
                for (let i = 0; i < pages; i++) {
                    $('#pagination').append(`<button class="page-button" data-page="${i}">${i + 1}</button>`);
                }
                displayPage(0, data.items);
            } else {
                $('#results').append('<p>No results found.</p>');
            }
        });
    });

    // Display a specific page of results
    $(document).on('click', '.page-button', function() {
        const pageIndex = $(this).data('page');
        $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=${$('#search-input').val()}&maxResults=50`, function(data) {
            displayPage(pageIndex, data.items);
        });
    });

    // Function to display the specified page of results
    function displayPage(pageIndex, items) {
        $('#results').empty(); // Clear previous results
        const start = pageIndex * itemsPerPage;
        const end = start + itemsPerPage;
        const currentItems = items.slice(start, end);
        
        currentItems.forEach(item => {
            const title = item.volumeInfo.title;
            const thumbnail = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'placeholder-image-url'; // Use a placeholder if no image
            $('#results').append(`
                <div class="result-item" data-id="${item.id}" data-title="${title}" data-thumbnail="${thumbnail}">
                    <h3>${title}</h3>
                    <img src="${thumbnail}" alt="${title}" />
                </div>
            `);
        });

        // Add click event to display book details
        $('.result-item').click(function() {
            const bookId = $(this).data('id');
            const title = $(this).data('title');
            const thumbnail = $(this).data('thumbnail');
            displayBookDetails(bookId, title, thumbnail);
        });

        $('#pagination').show();
    }

    // Display detailed information about the selected book
    function displayBookDetails(bookId, title, thumbnail) {
        const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
        $.getJSON(apiUrl, function(data) {
            $('#book-details').empty();
            const authors = data.volumeInfo.authors ? data.volumeInfo.authors.join(', ') : 'Unknown Author';
            const description = data.volumeInfo.description ? data.volumeInfo.description : 'No description available.';
            $('#book-details').append(`
                <h3>${title}</h3>
                <p><strong>Author(s):</strong> ${authors}</p>
                <p><strong>Description:</strong> ${description}</p>
            `);
            $('#book-details-section').show();
            $('#results-section').hide();

            // Show the save button when displaying book details
            $('#save-to-bookshelf').data('book-info', { title, authors: data.volumeInfo.authors, thumbnail }); // Store book info in button data
            $('#save-to-bookshelf').show();
        });
    }

    // Save book to bookshelf
    $('#save-to-bookshelf').click(function() {
        const bookInfo = $(this).data('book-info');
        const savedBooks = JSON.parse(localStorage.getItem('bookshelf')) || [];

        // Check if the book is already saved
        const isAlreadySaved = savedBooks.some(book => book.title === bookInfo.title);
        if (isAlreadySaved) {
            alert('This book is already in your bookshelf.');
        } else {
            savedBooks.push(bookInfo); // Add the book to saved books
            localStorage.setItem('bookshelf', JSON.stringify(savedBooks)); // Save to local storage
            alert('Book saved to your bookshelf!');
        }
    });
});
