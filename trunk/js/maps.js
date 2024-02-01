var MAP_CLOSE_WAIT_SECONDS = 20;
var MAP_CLOSE_WAIT_THREAD = null;

function ConstructMapEvents(){


    // Close map if click/tap anywhere
     $(document).on('click', function(){
        CloseMap();
        clearTimeout(MAP_CLOSE_WAIT_THREAD);
     });

    // Flip Animation End.
    $('#map .map-button').on('oanimationend animationend webkitAnimationEnd', function() { 
       $(this).removeClass('animation-mapflip');
    });

    // Map floor butttons
    $('#map .map-button').on('click', function(){

        _SA(document.location.href, 'VIEW', 'Map - ' + $.trim($(this).html().replace('<br>',' ')));

        clearTimeout(MAP_CLOSE_WAIT_THREAD);
        $(this).addClass('animation-mapflip');

        var map_img = $(this).attr('data-map');

        setTimeout(function(){ // Prevent Race Condition
            $('#map-holder').css('background-image', 'url(' + map_img + ')').show();

            // Close Map after wait timeout
            MAP_CLOSE_WAIT_THREAD = setTimeout(function(){
                CloseMap();
            }, MAP_CLOSE_WAIT_SECONDS * 1000);
        },250);
        
    });
}

function CloseMap(){
    if (!$('#map-holder').is(':hidden'))
        $('#map-holder').hide();
}

$(document).ready(function(){
    ConstructMapEvents();
});
