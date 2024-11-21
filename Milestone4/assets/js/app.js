
$(document).ready(function() {
    let isGridView = true;
    
    // Switch between grid and list view
    $('#switch-to-grid').click(function() {
        isGridView = true;
        renderSearchResults(); // Re-render search results to apply grid layout
    });
    
    $('#switch-to-list').click(function() {
        isGridView = false;
        renderSearchResults(); // Re-render search results to apply list layout
    });

    // Function to render search results with dynamic view switching
    function renderSearchResults() {
        $.get('/search-api-endpoint', function(data) {
            let template = $('#search-results-template').html();
            let rendered = Mustache.render(template, {
                results: data.items,
                isGrid: isGridView,
                isList: !isGridView
            });
            $('#search-results').html(rendered);
        });
    }

    // Function to render book details
    $(document).on('click', '.view-details', function() {
        let bookId = $(this).data('id');
        $.get(`/book-details-api-endpoint/${bookId}`, function(data) {
            let template = $('#book-details-template').html();
            let rendered = Mustache.render(template, data);
            $('#book-details').html(rendered);
        });
    });

    // Render public bookshelf
    $('#view-bookshelf').click(function() {
        $.get('/bookshelf-api-endpoint', function(data) {
            let template = $('#bookshelf-template').html();
            let rendered = Mustache.render(template, { bookshelf: data });
            $('#bookshelf').html(rendered);
        });
    });

    renderSearchResults(); // Initial render
});
