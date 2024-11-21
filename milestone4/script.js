$(document).ready(function() {
    let currentPage = 1;
    const resultsPerPage = 10;
    const apiKey = 'AIzaSyC2lPVELazlhLT8Nr66xG_HLruUBHP-CLo'; // Your API Key
    let userId = '';  // Variable to store user ID after login

    // Initialize Google API client for sign-in
    function initGoogleSignIn() {
        gapi.load('auth2', function() {
            gapi.auth2.init({
                client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'  // Replace with your client ID
            }).then(function(auth2) {
                // Attach sign-in button
                auth2.attachClickHandler('google-signin-button', {}, function(googleUser) {
                    const profile = googleUser.getBasicProfile();
                    userId = profile.getId();  // Get user ID
                    const userName = profile.getName();
                    $('#google-signin-button').hide();
                    $('#user-name').text('Welcome, ' + userName);
                    displayBookshelf(userId);  // Display the user's bookshelf once signed in
                }, function(error) {
                    console.log('Sign-in error: ', error);
                });
            });
        });
    }

    // Function to display the user's bookshelf
    function displayBookshelf(userId) {
        const url = `https://www.googleapis.com/books/v1/mylibrary/bookshelves?key=${apiKey}`;
        $.getJSON(url, function(data) {
            if (data.items) {
                $('#bookshelf').empty();  // Clear previous bookshelf items
                data.items.forEach(function(shelf) {
                    const template = $('#bookshelf-item-template').html();
                    const rendered = Mustache.render(template, {
                        id: shelf.id,
                        title: shelf.title
                    });
                    $('#bookshelf').append(rendered); // Add rendered bookshelf item
                });

                // View shelf button click event
                $('.view-shelf-button').click(function() {
                    const shelfId = $(this).data('shelf-id');
                    displayShelfBooks(shelfId);
                });
            } else {
                $('#bookshelf').append('<p>No bookshelves found.</p>');
            }
        });
    }

    // Function to display books in a specific bookshelf
    function displayShelfBooks(shelfId) {
        const url = `https://www.googleapis.com/books/v1/mylibrary/bookshelves/${shelfId}/volumes?key=${apiKey}`;
        $.getJSON(url, function(data) {
            $('#bookshelf-details').empty();  // Clear previous bookshelf details
            if (data.items) {
                data.items.forEach(function(book) {
                    const title = book.volumeInfo.title || 'No Title';
                    const cover = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'images/no-image.jpg';
                    $('#bookshelf-details').append(`<div class="book-item">
                        <h4>${title}</h4>
                        <img src="${cover}" alt="${title}" />
                    </div>`);
                });
            } else {
                $('#bookshelf-details').append('<p>No books found in this shelf.</p>');
            }
        });
    }

    // Function to search for books
    function searchBooks(query, page = 1) {
        const startIndex = (page - 1) * resultsPerPage;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${resultsPerPage}&key=${apiKey}`;

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
                const template = $('#search-result-template').html();
                const rendered = Mustache.render(template, {
                    id: book.id,
                    title: title,
                    thumbnail: cover
                });
                $('#results').append(rendered); // Add rendered search result item
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
        const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`;
        $.getJSON(apiUrl, function(data) {
            const book = data.volumeInfo;
            const template = $('#book-detail-template').html();
            const rendered = Mustache.render(template, {
                title: book.title,
                thumbnail: thumbnail,
                authors: book.authors ? book.authors.join(', ') : 'N/A',
                description: book.description || 'No description available.'
            });

            $('#book-details-section').show().find('#book-details').html(rendered);
            $('#save-to-bookshelf').show();  // Show the Save button
        });
    }

    // Event listeners
    $('#search-button').click(function() {
        const query = $('#search-input').val();
        searchBooks(query);  // Call searchBooks function with the input query
    });

    $('#grid-view-button').click(function() {
        $('#results').removeClass('list-view').addClass('grid-view');
    });

    $('#list-view-button').click(function() {
        $('#results').removeClass('grid-view').addClass('list-view');
    });

    // Initialize Google Sign-In
    initGoogleSignIn();
});
