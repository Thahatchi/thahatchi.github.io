$(document).ready(function() {
    var urls = {
        'google-books-book': 'https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/google-books-book.json',
        'google-books-search': 'https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/google-books-search.json',
        'it-ebooks-search': 'https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/it-ebooks-search.json',
        'openlibrary-book': 'https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/openlibrary-book.json',
        'openlibrary-search': 'https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/openlibrary-search.json'
    };

    var page = window.location.pathname.split('/').pop().replace('.html', '');

    if (urls[page]) {
        $.getJSON(urls[page], function(data) {
            var htmlContent = '';

            if (page === 'google-books-book' || page === 'openlibrary-book') {
                var book = data;
                htmlContent += '<h2>' + book.title + '</h2>';
                htmlContent += '<p><strong>Author:</strong> ' + (book.authors || []).map(author => author.name || author).join(', ') + '</p>';
                htmlContent += '<p><strong>Publisher:</strong> ' + (book.publishers || []).map(publisher => publisher.name || publisher).join(', ') + '</p>';
                htmlContent += '<p><strong>Published Date:</strong> ' + book.publish_date + '</p>';
                htmlContent += '<p><strong>Description:</strong> ' + (book.description || 'No description available') + '</p>';
                htmlContent += '<img src="' + (book.cover ? book.cover.medium : 'default-cover.jpg') + '" alt="Book Cover">';
            } else if (page === 'google-books-search' || page === 'it-ebooks-search' || page === 'openlibrary-search') {
                var items = data.books || data.items;
                $.each(items, function(index, item) {
                    htmlContent += '<h2>' + item.title + '</h2>';
                    htmlContent += '<p><strong>Author:</strong> ' + (item.author || item.authors || 'N/A') + '</p>';
                    htmlContent += '<p><strong>Publisher:</strong> ' + (item.publisher || 'N/A') + '</p>';
                    htmlContent += '<p><strong>Published Date:</strong> ' + (item.publishedDate || item.year || 'N/A') + '</p>';
                    htmlContent += '<p><strong>Description:</strong> ' + (item.description || 'No description available') + '</p>';
                    htmlContent += '<img src="' + (item.cover || 'default-cover.jpg') + '" alt="Book Cover">';
                });
            }

            $('#google-books-book-content, #openlibrary-book-data, #ebooks-results').html(htmlContent);
        }).fail(function() {
            $('#google-books-book-content, #openlibrary-book-data, #ebooks-results').html('<p>Failed to load data. Please try again later.</p>');
        });
    } else {
        $('#google-books-book-content, #openlibrary-book-data, #ebooks-results').html('<p>Invalid page or data not available.</p>');
    }
});

