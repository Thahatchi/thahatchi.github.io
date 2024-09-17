$(document).ready(function() {
    $.getJSON('https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/google-books-book.json', function(data) {
        var htmlContent = '<h2>' + data.volumeInfo.title + '</h2>';
        htmlContent += '<p><strong>Author:</strong> ' + data.volumeInfo.authors.join(', ') + '</p>';
        htmlContent += '<p><strong>Published Date:</strong> ' + data.volumeInfo.publishedDate + '</p>';
        htmlContent += '<p><strong>Description:</strong> ' + data.volumeInfo.description + '</p>';
        htmlContent += '<img src="' + data.volumeInfo.imageLinks.thumbnail + '" alt="Book Cover">';
        
        $('#google-books-book-content').html(htmlContent);
    });
});
