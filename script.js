$(document).ready(function() {
    // Function to display content for Google Books Book
    function displayGoogleBooksBook() {
        $.getJSON('https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/google-books-book.json', function(data) {
            var htmlContent = '<h2>' + data.volumeInfo.title + '</h2>';
            htmlContent += '<p><strong>Author:</strong> ' + data.volumeInfo.authors.join(', ') + '</p>';
            htmlContent += '<p><strong>Published Date:</strong> ' + data.volumeInfo.publishedDate + '</p>';
            htmlContent += '<p><strong>Description:</strong> ' + data.volumeInfo.description + '</p>';
            htmlContent += '<img src="' + data.volumeInfo.imageLinks.thumbnail + '" alt="Book Cover">';
            
            $('#slide1').html(htmlContent);
        });
    }

    // Function to display content for Google Books Search
    function displayGoogleBooksSearch() {
        $.getJSON('https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/google-books-search.json', function(data) {
            var htmlContent = '<h2>Search Results</h2>';
            data.items.forEach(function(item) {
                htmlContent += '<h3>' + item.volumeInfo.title + '</h3>';
                htmlContent += '<p><strong>Author:</strong> ' + item.volumeInfo.authors.join(', ') + '</p>';
                htmlContent += '<img src="' + item.volumeInfo.imageLinks.thumbnail + '" alt="Book Cover">';
            });

            $('#slide2').html(htmlContent);
        });
    }

    // Function to display content for IT Ebooks Search
    function displayITBooksSearch() {
        $.getJSON('https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/it-ebooks-search.json', function(data) {
            var htmlContent = '<h2>IT Ebooks Search Results</h2>';
            data.books.forEach(function(book) {
                htmlContent += '<h3>' + book.title + '</h3>';
                htmlContent += '<p><strong>Author:</strong> ' + book.author + '</p>';
                htmlContent += '<img src="' + book.cover + '" alt="Book Cover">';
            });

            $('#slide3').html(htmlContent);
        });
    }

    // Function to display content for Open Library Book
    function displayOpenLibraryBook() {
        $.getJSON('https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/openlibrary-book.json', function(data) {
            var htmlContent = '<h2>' + data.title + '</h2>';
            htmlContent += '<p><strong>Author:</strong> ' + data.authors.map(author => author.name).join(', ') + '</p>';
            htmlContent += '<p><strong>Published Date:</strong> ' + data.publish_date + '</p>';
            htmlContent += '<p><strong>Description:</strong> ' + data.description + '</p>';
            htmlContent += '<img src="' + data.cover.large + '" alt="Book Cover">';
            
            $('#slide4').html(htmlContent);
        });
    }

    // Function to display content for Open Library Search
    function displayOpenLibrarySearch() {
        $.getJSON('https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/openlibrary-search.json', function(data) {
            var htmlContent = '<h2>Open Library Search Results</h2>';
            data.docs.forEach(function(doc) {
                htmlContent += '<h3>' + doc.title + '</h3>';
                htmlContent += '<p><strong>Author:</strong> ' + doc.author_name.join(', ') + '</p>';
                htmlContent += '<p><strong>First Published:</strong> ' + doc.first_publish_year + '</p>';
            });

            $('#slide5').html(htmlContent);
        });
    }

    // Slideshow functionality
    var slideIndex = 1;
    showSlides(slideIndex);

    $('.prev').click(function() {
        showSlides(slideIndex -= 1);
    });

    $('.next').click(function() {
        showSlides(slideIndex += 1);
    });

    function showSlides(n) {
        var slides = $('.slide');
        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }
        slides.hide();
        $(slides[slideIndex-1]).show();
    }

    // Load initial content
    displayGoogleBooksBook();
    displayGoogleBooksSearch();
    displayITBooksSearch();
    displayOpenLibraryBook();
    displayOpenLibrarySearch();
});
