$(document).ready(function() {
    let currentSlide = 0;
    const slides = ['#slide1', '#slide2', '#slide3', '#slide4', '#slide5'];
    
    function fetchAndDisplayData(url, slideIndex) {
        $.getJSON(url, function(data) {
            let htmlContent = '';
            
            if (url.includes('google-books-book.json')) {
                htmlContent += '<h2>' + data.volumeInfo.title + '</h2>';
                htmlContent += '<p><strong>Author:</strong> ' + data.volumeInfo.authors.join(', ') + '</p>';
                htmlContent += '<p><strong>Published Date:</strong> ' + data.volumeInfo.publishedDate + '</p>';
                htmlContent += '<p><strong>Description:</strong> ' + data.volumeInfo.description + '</p>';
                htmlContent += '<img src="' + data.volumeInfo.imageLinks.thumbnail + '" alt="Book Cover">';
            } else if (url.includes('google-books-search.json')) {
                data.items.forEach(item => {
                    htmlContent += '<h2>' + item.volumeInfo.title + '</h2>';
                    htmlContent += '<p><strong>Author:</strong> ' + item.volumeInfo.authors.join(', ') + '</p>';
                    htmlContent += '<p><strong>Published Date:</strong> ' + item.volumeInfo.publishedDate + '</p>';
                    htmlContent += '<p><strong>Description:</strong> ' + item.volumeInfo.description + '</p>';
                    htmlContent += '<img src="' + item.volumeInfo.imageLinks.thumbnail + '" alt="Book Cover">';
                });
            } else if (url.includes('it-ebooks-search.json')) {
                data.books.forEach(book => {
                    htmlContent += '<h2>' + book.title + '</h2>';
                    htmlContent += '<p><strong>Author:</strong> ' + book.author + '</p>';
                    htmlContent += '<p><strong>Publisher:</strong> ' + book.publisher + '</p>';
                    htmlContent += '<p><strong>Description:</strong> ' + book.description + '</p>';
                    htmlContent += '<img src="' + book.image + '" alt="Book Cover">';
                });
            } else if (url.includes('openlibrary-book.json')) {
                htmlContent += '<h2>' + data.title + '</h2>';
                htmlContent += '<p><strong>Author:</strong> ' + data.authors.map(author => author.name).join(', ') + '</p>';
                htmlContent += '<p><strong>Published Date:</strong> ' + data.publish_date + '</p>';
                htmlContent += '<p><strong>Description:</strong> ' + data.excerpts[0].text + '</p>';
                htmlContent += '<img src="' + data.cover.medium + '" alt="Book Cover">';
            } else if (url.includes('openlibrary-search.json')) {
                data.docs.forEach(doc => {
                    htmlContent += '<h2>' + doc.title + '</h2>';
                    htmlContent += '<p><strong>Author:</strong> ' + doc.author_name.join(', ') + '</p>';
                    htmlContent += '<p><strong>Published Date:</strong> ' + doc.first_publish_year + '</p>';
                    htmlContent += '<p><strong>Description:</strong> ' + (doc.first_sentence ? doc.first_sentence[0] : 'No description available') + '</p>';
                    htmlContent += '<img src="https://covers.openlibrary.org/b/id/' + doc.cover_i + '-M.jpg" alt="Book Cover">';
                });
            }

            $(slides[slideIndex]).html(htmlContent);
            showSlide(currentSlide);
        }).fail(function() {
            console.log('Failed to load data from:', url);
        });
    }

    function showSlide(index) {
        $('.slide').hide();
        $(slides[index]).show();
    }

    function plusSlides(n) {
        currentSlide += n;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        } else if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }
        showSlide(currentSlide);
    }

    // Fetch data for each slide
    fetchAndDisplayData('https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/google-books-book.json', 0);
    fetchAndDisplayData('https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/google-books-search.json', 1);
    fetchAndDisplayData('https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/it-ebooks-search.json', 2);
    fetchAndDisplayData('https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/openlibrary-book.json', 3);
    fetchAndDisplayData('https://raw.githubusercontent.com/Thahatchi/thahatchi.github.io/main/openlibrary-search.json', 4);

    // Initialize the slideshow
    showSlide(currentSlide);

    // Attach event handlers to navigation arrows
    wind
