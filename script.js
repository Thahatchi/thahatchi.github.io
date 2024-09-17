$(document).ready(function() {
    // Define the URL for each JSON file based on the current page
    var urlMap = {
        'google-books-book.html': 'https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/google-books-book.json',
        'google-books-search.html': 'https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/google-books-search.json',
        'it-ebooks-search.html': 'https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/it-ebooks-search.json',
        'openlibrary-book.html': 'https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/openlibrary-book.json',
        'openlibrary-search.html': 'https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/openlibrary-search.json'
    };

    // Get the current HTML file's name
    var currentPage = window.location.pathname.split('/').pop();

    // Fetch the correct JSON file based on the current page
    if (urlMap[currentPage]) {
        $.getJSON(urlMap[currentPage], function(data) {
            var htmlContent = '';

            // Process data based on the type of JSON file
            if (currentPage === 'google-books-book.html') {
                htmlContent += '<h2>' + data.volumeInfo.title + '</h2>';
                htmlContent += '<p><strong>Author:</strong> ' + (data.volumeInfo.authors || []).join(', ') + '</p>';
                htmlContent += '<p><strong>Published Date:</strong> ' + data.volumeInfo.publishedDate + '</p>';
                htmlContent += '<p><strong>Description:</strong> ' + data.volumeInfo.description + '</p>';
                htmlContent += '<img src="' + data.volumeInfo.imageLinks.thumbnail + '" alt="Book Cover">';
            } else if (currentPage === 'google-books-search.html') {
                data.items.forEach(function(book) {
                    htmlContent += '<h2>' + book.volumeInfo.title + '</h2>';
                    htmlContent += '<p><strong>Author:</strong> ' + (book.volumeInfo.authors || []).join(', ') + '</p>';
                    htmlContent += '<p><strong>Published Date:</strong> ' + book.volumeInfo.publishedDate + '</p>';
                    htmlContent += '<p><strong>Description:</strong> ' + book.volumeInfo.description + '</p>';
                    htmlContent += '<img src="' + book.volumeInfo.imageLinks.thumbnail + '" alt="Book Cover">';
                });
            } else if (currentPage === 'it-ebooks-search.html') {
                data.books.forEach(function(book) {
                    htmlContent += '<h2>' + book.title + '</h2>';
                    htmlContent += '<p><strong>Author:</strong> ' + book.author + '</p>';
                    htmlContent += '<p><strong>Published Date:</strong> ' + book.year + '</p>';
                    htmlContent += '<p><strong>Description:</strong> ' + book.description + '</p>';
                    htmlContent += '<img src="' + book.image + '" alt="Book Cover">';
                });
            } else if (currentPage === 'openlibrary-book.html') {
                htmlContent += '<h2>' + data.title + '</h2>';
                htmlContent += '<p><strong>Author:</strong> ' + (data.authors || []).map(a => a.name).join(', ') + '</p>';
                htmlContent += '<p><strong>Published Date:</strong> ' + data.publish_date + '</p>';
                htmlContent += '<p><strong>Description:</strong> ' + data.description + '</p>';
                htmlContent += '<img src="' + data.cover.medium + '" alt="Book Cover">';
            } else if (currentPage === 'openlibrary-search.html') {
                data.docs.forEach(function(book) {
                    htmlContent += '<h2>' + book.title + '</h2>';
                    htmlContent += '<p><strong>Author:</strong> ' + (book.author_name || []).join(', ') + '</p>';
                    htmlContent += '<p><strong>Published Date:</strong> ' + (book.publish_date || []).join(', ') + '</p>';
                    htmlContent += '<p><strong>Description:</strong> ' + (book.first_sentence ? book.first_sentence[0] : 'No description available') + '</p>';
                    htmlContent += '<img src="' + (book.cover_i ? 'https://covers.openlibrary.org/b/id/' + book.cover_i + '-M.jpg' : '') + '" alt="Book Cover">';
                });
            }

            $('#google-books-book-content').html(htmlContent);
        }).fail(function() {
            $('#google-books-book-content').html('<p>Failed to load data. Please try again later.</p>');
        });
    } else {
        $('#google-books-book-content').html('<p>Invalid page or no data available.</p>');
    }
});
