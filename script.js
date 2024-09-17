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

            if (page === 'google-books-book') {
                var book = data;
                htmlContent += '<h2>' + book.volumeInfo.title + '</h2>';
                htmlContent += '<p><strong>Author:</strong> ' + (book.volumeInfo.authors || []).join(', ') + '</p>';
                htmlContent += '<p><strong>Publisher:</strong> ' + book.volumeInfo.publisher + '</p>';
                htmlContent += '<p><strong>Published Date:</strong> ' + book.volumeInfo.publishedDate + '</p>';
                htmlContent += '<p><strong>Description:</strong> ' + (book.volumeInfo.description || 'No description available') + '</p>';
                htmlContent += '<img src="' + (book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'default-cover.jpg') + '" alt="Book Cover">';
                $('#google-books-book-content').html(htmlContent);
            } else if (page === 'google-books-search') {
                var books = data.items;
                htmlContent += '<ul>';
                $.each(books, function(index, book) {
                    htmlContent += '<li><h2>' + book.volumeInfo.title + '</h2>';
                    htmlContent += '<p><strong>Author:</strong> ' + (book.volumeInfo.authors || []).join(', ') + '</p>';
                    htmlContent += '<p><strong>Publisher:</strong> ' + book.volumeInfo.publisher + '</p>';
                    htmlContent += '<p><strong>Published Date:</strong> ' + book.volumeInfo.publishedDate + '</p>';
                    htmlContent += '<img src="' + (book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'default-cover.jpg') + '" alt="Book Image"></li>';
                });
                htmlContent += '</ul>';
                $('#search-results').html(htmlContent);
            } else if (page === 'it-ebooks-search') {
                var books = data.books;
                htmlContent += '<ul>';
                $.each(books, function(index, book) {
                    htmlContent += '<li><h2>' + book.title + '</h2>';
                    htmlContent += '<p><strong>Author:</strong> ' + book.author + '</p>';
                    htmlContent += '<p><strong>Publisher:</strong> ' + book.publisher + '</p>';
                    htmlContent += '<p><strong>Year:</strong> ' + book.year + '</p>';
                    htmlContent += '<img src="' + (book.cover || 'default-cover.jpg') + '" alt="Book Cover"></li>';
                });
                htmlContent += '</ul>';
                $('#ebooks-results').html(htmlContent);
            } else if (page === 'openlibrary-book') {
                var book = data;
                htmlContent += '<h2>' + book.title + '</h2>';
                htmlContent += '<p><strong>Author:</strong> ' + (book.authors || []).map(author => author.name || author).join(', ') + '</p>';
                htmlContent += '<p><strong>Publisher:</strong> ' + (book.publishers || []).map(publisher => publisher.name || publisher).join(', ') + '</p>';
                htmlContent += '<p><strong>Published Date:</strong> ' + book.publish_date + '</p>';
                htmlContent += '<p><strong>Description:</strong> ' + (book.description || 'No description available') + '</p>';
                htmlContent += '<img src="' + (book.cover ? book.cover.medium : 'default-cover.jpg') + '" alt="Book Cover">';
                $('#openlibrary-book-data').html(htmlContent);
            } else if (page === 'openlibrary-search') {
                var books = data.docs;
                htmlContent += '<ul>';
                $.each(books, function(index, book) {
                    htmlContent += '<li><h2>' + (book.title || 'No Title') + '</h2>';
                    htmlContent += '<p><strong>Author:</strong> ' + (book.author_name || []).join(', ') + '</p>';
                    htmlContent += '<p><strong>Publisher:</strong> ' + (book.publisher || []).join(', ') + '</p>';
                    htmlContent += '<p><strong>Published Date:</strong> ' + (book.publish_year ? book.publish_year[0] : 'N/A') + '</p>';
                    htmlContent += '<img src="' + (book.cover_i ? 'https://covers.openlibrary.org/b/id/' + book.cover_i + '-M.jpg' : 'default-cover.jpg') + '" alt="Book Cover"></li>';
                });
                htmlContent += '</ul>';
                $('#openlibrary-search-results').html(htmlContent);
            }
        }).fail(function() {
            $('#google-books-book-content, #search-results, #ebooks-results, #openlibrary-book-data, #openlibrary-search-results').html('<p>Failed to load data. Please try again later.</p>');
        });
    } else {
        $('#google-books-book-content, #search-results, #ebooks-results, #openlibrary-book-data, #openlibrary-search-results').html('<p>Invalid page or data not available.</p>');
    }
});
