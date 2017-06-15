// Toggle for side nav
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $('#wrapper').toggleClass('toggled');
    if ( $('#wrapper').attr('class') === 'toggled' ) {
        $('#toggle-icon').removeClass();
        $('#toggle-icon').addClass('glyphicon glyphicon-chevron-left');
    }
    else {
        $('#toggle-icon').removeClass();
        $('#toggle-icon').addClass('glyphicon glyphicon-chevron-right');
    }
    
});