// Search Form Submission
$('#search-submit').submit(function(){
    event.preventDefault();
    let searchStr = $('#search-submit input').val().trim();
    if ( searchStr !== "" ) {
        window.location = '/search/?search=' + searchStr;
    }
});