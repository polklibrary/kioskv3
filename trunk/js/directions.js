var DIRECTIONS_CLOSE_WAIT_SECONDS = 20;
var DIRECTIONS_CLOSE_WAIT_THREAD = null;

function ConstructDirectionsEvents(){

    // Close map if click/tap anywhere
     $(document).on('click', function(){
        CloseDirections();
        clearTimeout(DIRECTIONS_CLOSE_WAIT_THREAD);
     });

    // Flip Animation End.
    $('#directions .direction-button').on('oanimationend animationend webkitAnimationEnd', function() { 
       $(this).removeClass('animation-mapflip');
    });

    // Map floor butttons
    $('#directions .direction-button').on('click', function(){

        
        _SA(document.location.href, 'VIEW', 'Directions - ' + $.trim($(this).html().replace('<br>',' ')));


        clearTimeout(DIRECTIONS_CLOSE_WAIT_THREAD);
        $(this).addClass('animation-mapflip');

        $('#direction-holder').empty();

        var top_img = $(this).attr('data-top');
        var bottom_img = $(this).attr('data-bottom');
        var single_img = $(this).attr('data-single');

        var heading_offset = $('#header').height();

        var start = $(this).attr('data-start').split(',');
        var sw = $('#direction-markers .direction-start').width();
        var sh = $('#direction-markers .direction-start').height();
        var start_left = parseInt(start[0]) - (sw/2);
        var start_top = parseInt(start[1]) - (sh/2) - heading_offset;

        var end = $(this).attr('data-end').split(',');
        var ew = $('#direction-markers .direction-end').width();
        var eh = $('#direction-markers .direction-end').height();
        var end_left = parseInt(end[0]) - (ew/2);
        var end_top = parseInt(end[1]) - (eh) - heading_offset;

        if (typeof top_img !== 'undefined'){
            var d = $('<div>').addClass('direction-top').css({
                'background-image': 'url(' + top_img + ')'
            });
            $('#direction-holder').append(d);
        }
        if (typeof top_img !== 'undefined'){
            var d = $('<div>').addClass('direction-bottom').css({
                'background-image': 'url(' + bottom_img + ')'
            });
            $('#direction-holder').append(d);
        }
        if (typeof single_img !== 'undefined'){
            var d = $('<div>').addClass('direction-single').css({
                'background-image': 'url(' + single_img + ')'
            });
            $('#direction-holder').append(d);
        }


        $('#direction-markers .direction-start').css({
            'left': start_left + 'px',
            'top': start_top + 'px',
        });

        $('#direction-markers .direction-end').css({
            'left': end_left + 'px',
            'top': end_top + 'px',
        });
        

        setTimeout(function(){ // Prevent Race Condition
            $('#direction-markers').show();
            $('#direction-holder').show();

            // Close Map after wait timeout
            DIRECTIONS_CLOSE_WAIT_THREAD = setTimeout(function(){
                CloseDirections();
            }, DIRECTIONS_CLOSE_WAIT_SECONDS * 1000);
        },250);
        
    });
}

function CloseDirections(){
    if (!$('#direction-holder').is(':hidden')){
        $('#direction-holder').hide();
        $('#direction-markers').hide();
    }
}

var mouseX = 0;
var mouseY = 0;
function DirectionCoordinateRetreiver(){

    $(document).on('mousemove', function(e) {        
        mouseX = e.pageX;
        mouseY = e.pageY;
    });


    $(document).on('click', function(e) {    
        alert(mouseX + ',' + mouseY);
    });

}


$(document).ready(function(){
    ConstructDirectionsEvents();
});
