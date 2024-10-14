$(document).ready(function() {
    // Search for books
    $('#search-button').click(function() {
        const query = $('#search-input').val();
        console.log('Search Query:', query); // Log the query to the console
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5`;

        $.getJSON(apiUrl, function(data) {
            console.log('Search Results:', data); // Log the returned data
            $('#results').empty(); // Clear previous results

            if (data.items) {
                data.items.forEach(item => {
                    const title = item.volumeInfo.title;
                    const thumbnail = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'placeholder-image-url';
                    $('#results').append(`
                        <div class="result-item">
                            <h3>${title}</h3>
                            <img src="${thumbnail}" alt="${title}" />
                        </div>
                    `);
                });
            } else {
                $('#results').append('<p>No results found.</p>');
            }
        }).fail(function() {
            $('#results').append('<p>Error fetching data. Please try again.</p>');
        });
    });
});
