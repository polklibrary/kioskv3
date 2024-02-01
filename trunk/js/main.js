/**************************************************
   ANALYTICS
***************************************************/
function _SA(u,a,d){
    var i = new Image();
    if (typeof window._SA_PAGE_URL_FN !== 'undefined')
        u = window._SA_PAGE_URL_FN(u,a,d);
    if (typeof window._SA_PAGE_ACTION_FN !== 'undefined')
        a = window._SA_PAGE_ACTION_FN(u,a,d);
    if (typeof window._SA_PAGE_ACTION_DATA_FN !== 'undefined')
        d = window._SA_PAGE_ACTION_DATA_FN(u,a,d);
    i.src = 'https://polk.uwosh.edu/analytics/sa.php?page_url=' + u + '&page_action=' + a + '&page_action_data=' + d;
}


/**************************************************
   CLASH
***************************************************/
var ClashCrashReady = true;
function ClashCrashInitialization(){
    $('div.buttons > div').on('oanimationend animationend webkitAnimationEnd', function() { 
       $(this).removeClass('animation-flip');
    });
    $('#wordmark').on('oanimationend animationend webkitAnimationEnd', function() { 
       $(this).removeClass('animation-glow');
    });
}
function ClashCrash(callback){
    if (ClashCrashReady){
        ClashCrashReady = false;
        var Buttons = [];
        $('div.buttons > div').each(function(){
            Buttons.push($(this));
        });


        $('#clash').animate(
            {
                left: '+=2000'
            }, 
            {
                duration: 2000,
                easing: 'linear',
                progress: function(a, p, ms) {
                    var cl = $('#clash').position().left + $('#clash').width();
                    for (var i in Buttons){
                        if (cl > Buttons[i].position().left){
                            Buttons[i].addClass('animation-flip');
                            Buttons.splice(i, 1);
                            if (Buttons.length == 0)
                                $('#wordmark').addClass('animation-glow');
                        }
                    }
                },
                complete: function() {
                    $('#clash').css('left', '-250px');
                    $('#clash').animate(
                        {
                            left: '0px'
                        },
                        {
                            duration: 1000,
                            easing: 'linear',
                            complete: function() {
                                ClashCrashReady = true;
                                callback();
                            }
                        }
                    );
                }
            }

        );
    }
}





/**************************************************
   USER INTERACTIONS 
***************************************************/
var UserInteractionThread = null;
var UserInteractionWaitSeconds = 30;
var UserInteractionTimer = 0;
var UserInteraction = false;
function UserTouchInitialization(){

    $(document).click(function(e) {
        UserInteractionTimer = UserInteractionWaitSeconds; // reset timer
        UserInteraction = true; // mark as interacting
    });

    UserInteractionThread = setInterval(function(){
        if (UserInteractionTimer == 0){ // no user interaction
            UserInteractionTimer = 0;
            UserInteraction = false;
        }
        else { // yes,user interaction start counting down
            UserInteractionTimer -= 1;
            UserInteraction = true;
        }
        //console.log("UserInteractionTimer: " + UserInteractionTimer + ' UserInteraction:' + UserInteraction);
    },1000);
}


/**************************************************
   ADS 
***************************************************/

var AdsCloseAfterSeconds = 10;
var AdsAppearsEverySeconds = 60;
var AdsThread = null;
var AdsCloseThread = null;
function AdsInitialization(){

    StartAdTimer(); // START TIMER
    $(document).on('click', function(){
        CloseAds();
    });
}

function StartAdTimer(){

    AdsThread = setTimeout(function(){
        clearTimeout(AdsCloseThread);

        //ClashCrash(function(){
            $('#ads').css('display','flex').hide().fadeIn(500);
            $('#ads .background').addClass('animation-zoom');
            GetRandomAd(function(s){
                $('#ads .ad').css('background-image', 'url(' + s + ')');
            });

            // Close opened ad
            AdsCloseThread = setTimeout(function(){
                
                ButtonWalker();
                CloseAds();
            }, AdsCloseAfterSeconds*1000);
        //});

    },AdsAppearsEverySeconds*1000);
}

function CloseAds(){
    $('#ads').fadeOut(250);
    $('#ads .background').removeClass('animation-zoom');
    clearTimeout(AdsCloseThread);
    clearTimeout(AdsThread);
    StartAdTimer();
}

function GetRandomAd(callback) {
    var ads = [
        'https://library.uwosh.edu/features/uw-oshkosh-polk-library-features/@@images/image_one',
        'https://library.uwosh.edu/features/uw-oshkosh-polk-library-features/@@images/image_two',
        'https://library.uwosh.edu/features/uw-oshkosh-polk-library-features/@@images/image_three',
        'https://library.uwosh.edu/features/uw-oshkosh-polk-library-features/@@images/image_four',
        'https://library.uwosh.edu/features/uw-oshkosh-polk-library-features/@@images/image_five'
    ];
    var r = Math.floor(Math.random() * ads.length) + 0;

    var img = new Image();
    img.onerror = function(){
        return GetRandomAd(callback);
    };
    img.onload = function(){
        callback(ads[r]);
    }
    img.src = ads[r];
}



/**************************************************
   BUTTONS
***************************************************/

function ButtonsInitialization(){

    $('#navigation div.buttons > div').on('click', function(){
        var target = $(this).attr('data-content');
        $('#header .heading').html($(this).attr('data-heading'));
        $('#content > div').css('display', 'none');
        $(target).css('display', 'flex');
        ClashCrash(function(){});
        _SA(document.location.href, 'VIEW', $(this).text());
    });
}

function ButtonWalker(){

    // FIXED BUTTON ALWAYS 
    //$('#navigation .buttons div[data-content="#directions"]').trigger('click');
    
    // ROTATING BUTTONS
    if (!$('#hours').is(':hidden')){
        $('#hours').fadeOut(500, function(){
            $('#map').css('display', 'flex');
            $('#header .heading').html($('[data-content="#map"]').attr('data-heading'));
        });
    }
    else if (!$('#map').is(':hidden')){
        $('#map').fadeOut(500, function(){
            $('#directions').css('display', 'flex');
            $('#header .heading').html($('[data-content="#directions"]').attr('data-heading'));
        });
    }
    else if (!$('#directions').is(':hidden')){
        $('#directions').fadeOut(500, function(){
            $('#studyrooms').css('display', 'flex');
            $('#header .heading').html($('[data-content="#studyrooms"]').attr('data-heading'));
        });
    }
    else if (!$('#studyrooms').is(':hidden')){
        $('#studyrooms').fadeOut(500, function(){
            $('#hours').css('display', 'flex');
            $('#header .heading').html($('[data-content="#hours"]').attr('data-heading'));
        });
    }
    else {
        $('#header .heading').html($('[data-content="#hours"]').attr('data-heading'));
        $('#hours').css('display', 'flex'); // nothing is visible, show hours
    }
}

/**************************************************
   INITIALIZATIONS
***************************************************/
$(document).ready(function(){
    ClashCrashInitialization();
    UserTouchInitialization();
    AdsInitialization();
    ButtonsInitialization();

    // Which loads first
    ButtonWalker();
});