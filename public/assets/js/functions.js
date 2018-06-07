var QueryString = function() {
    var query_string = {};
    var query = window.location;
    query = query.toString();
    query = query.split('?');
    if (query[1]) {
        query = query[1];
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
    } else {
        return false;
    }
}();
var form_group_html = '';
var invite_url = '';
var room_name = '0';
var mode = '0';
if (QueryString.room) {
    room_name = QueryString.room;
}
if (QueryString.mode) {
    mode = QueryString.mode;
}

$(window).on('resize', function() {
    var screenHeight = $(window).outerHeight();
    var screenWidth = $(window).outerWidth();
    $('.containment-wrapper').css({
        height: screenHeight,
        width: screenWidth
    })
    $('.overlay-bg').css({
        height: screenHeight,
        width: screenWidth,
        overflow: 'hidden'
    })
    $(".video-container").draggable({
        appendTo: "body",
        containment: ".containment-wrapper",
        scroll: false
    });

    $("#resizeable").resizable({
        aspectRatio: 4 / 3,
        handles: "n, e, s, w",
        containment: ".containment-wrapper"
    });
});
var minimize = false;
var fullscreen = false;
var theater = false;
// start of minimize button function
$('.video-tool').on("click", '.minimize', function(e) {
    $('.overlay-bg').hide();
    if (minimize) {
        minimize = false;
        //e.preventDefault();
        //alert('0');
        $('.video-container').animate({
            height: '340px',
            width: '540px',
            bottom: '0px',
            left: 'auto',
            right: '0px',
            top: 'auto'
        });
        $('.video-options').css({
            cursor: 'move'
        });
        $(".video-container").draggable({
            disabled: false
        });
        $('.video-container').css({
            top: 'auto',
            left: 'auto',
            right: 0,
            bottom: 0
        });
    } else {
        //alert('1');
        minimize = true;
        e.preventDefault();
        $(this).parents('.video-container').animate({
            height: '40px',
            width: '540px',
            right: '0px',
            left: 'auto',
            top: $(window).height() - 40
        }, 200);
        $(".video-container").draggable({
            disabled: true
        });
        $('.video-options').css({
            cursor: 'auto'
        });
        $('.video-container').css({
            top: 'auto',
            left: 'auto',
            right: 0,
            bottom: 0
        });
        $('.tooltip').find('span').removeClass('tooltiptext').addClass('tooltiptext-down');
    }

}); // end of minimize button function




// start of full screen button function
$('.full-screen').click(function() {
    $('.overlay-bg').fadeOut(200);
    if (fullscreen) {
        fullscreen = false;
        //alert('fullscreen off');
        $('.full-screen').find('img').remove();
        $('.full-screen').append('<img src="assets/img/fullscreen.svg" width="20">');
        $('.video-container').animate({
            height: '340px',
            width: '540px',
            bottom: '0px',
            top: 'auto',
            left: 'auto',
            right: '0px',
        });
        $('.video-options').css({
            cursor: 'move'
        });
        $(".video-container").draggable({
            disabled: false
        });
        $('.video-container').css({
            top: 'auto',
            left: 'auto',
            right: '0px',
            bottom: 0
        });
    } else {
        fullscreen = true;
        minimize = true;
        //alert('fullscreen on');
        //e.preventDefault();
        $('.full-screen').find('img').remove();
        $('.full-screen').append('<img src="assets/img/fullscreen-exit.svg" width="20">');
        $('.video-container').animate({
            height: $(window).height(),
            width: $(window).width(),
            top: '0px',
            left: '0px',
            right: '0px',
            bottom: '0px'
        }, 200);
        $('.tooltip').find('span').removeClass('tooltiptext-down').addClass('tooltiptext');
    }
}); // end of full screen button function

// start of theater screen button function
$('.video-tool').on("click", '.theater', function(e) {
    if (theater) {
        theater = false;
        //alert('0');
        //$( ".video-container" ).draggable({disabled: false});
        $('.video-options').css({
            cursor: 'move'
        });
        $('.video-container').animate({
            height: '340px',
            width: '540px',
            bottom: '0px',
            left: 'auto',
            right: '0px',
            top: 'auto'

        });
        $('.video-container').css({
            top: 'auto',
            left: 'auto',
            right: 0,
            bottom: 0
        });
        $('.overlay-bg').css({
            display: 'none'
        });
    } else {
        theater = true;
        e.preventDefault();
        //alert('1');
        //$( ".video-container" ).draggable({disabled: true});
       /* $('.video-options').css({
            cursor: 'auto'
        });*/
        //$('.overlay-bg').css({background:'rgba(0, 0, 0, 0.70)',display:'block'});
        $('.video-container').animate({
            height: '70%',
            width: '60%',
            background: '#000',
            top: '15%',
            left: '20%',
            right: '0px',
            position: 'absolute'
        }, 200);
    }

}); // end of theater screen button function       



// start of close button function
$('.video-tool').on("click", '.close-video', function(e) {
    //alert('hi');
    $('.overlay-bg').css({
        display: 'none'
    });
    $('.video-container').fadeOut(200);
}); // end of close button function     



function removeActive() {
    $('.conf-title').each(function() {
        if ($(this).hasClass('active')) {
            var val = $(this).find('input').val();
            $(this).empty();
            $(this).html(val);
            $(this).removeClass('active');
        }
    });
}
$(document).on('click', function() {
    removeActive();
});
// end of inline conference name edit function       


//css for invite user modal comes here
/*$( function() {
    $( "#invite-user-modal" ).dialog({
      autoOpen: false,
      show: {
        effect: "blind",
        duration: 1000
      },
      hide: {
        effect: "explode",
        duration: 1000
      }
    });
 
    $( ".webcam-add-user" ).on( "click", function() {
      $( "#invite-user-modal" ).dialog( "open" );
    });
  } );*/
//css for invite user modal ends here


$(document).ready(function() {
    if(room_name != '0'){
        $('.conf-title').html(room_name);
    }
    $(window).trigger('resize');
    var query = window.location;
    query = query.toString();
    query = query.split('?');
    if (query[1]) {
        query = query[1];
        //alert(query);
        $('.video-div').attr('src', 'room.html?' + query);
    }
    var offset = $('.inner-content').offset();
    if (offset) {
        var left = offset.left + $('.inner-content').width() - 98;
        $('.but-container').css('left', left + 'px');
    }

    $('.theater').trigger('click');
    form_group_html = $('.form-group').html();
});

function setInviteUrl(url) {
    $('.form-group').html(form_group_html);
    $('#tokenfield').tokenfield({
    showAutocompleteOnFocus: true
});
    invite_url = url;
    $('#copyTarget').val(url);
    $('#invite-trigger').trigger('click');

}

function ClipBoard() {
    var urlField = document.querySelector('#copyTarget');
    urlField.select();
    document.execCommand('copy');
    //alert(urlField);
}

function validateEmail($email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test($email);
}
$('#invite').on('click', function() {
    var email_list = '';
    var inviteEmails = [];
    var emailError = 0;
    $('.token-label').each(function(index, item) {
        inviteEmails.push($(item).html());
        if (!validateEmail($(item).html())) {
            emailError = 1;
        } else {
            email_list = email_list + $(item).html() + ',';
        }
    });
    if (emailError == 1) {
        alert('invalid email');
        return;
    }
    email_list = email_list.slice(0, -1);
    var mailto = email_list;
    var from_mail = 'info@ofabee.com';
    var subject = 'Meeting invitation';
    var message = 'Hi,<br/> Open the following link in webrtc compactible browsers (Google chrome, Mozilla firefox etc) to join the conference <br/><a href="'+invite_url+'">' + invite_url+'</a>';

    if (mailto != '') {
        $('.close').trigger('click');
        $.ajax({
            url: "https://meet.goodgrid.com/mail/index.php",
            data: {
                to: mailto,
                from: from_mail,
                subject: subject,
                message: message
            },
            method: "POST",
            success: function(d) {

            }
        });
    } else {
        alert('Please enter a valid email address also check whether you have enter comma at the end of each email.');

    }

});

var totalpage = 2;
var currentpage = 1;
$('.prev-btn').click(function() {
    if (currentpage > 1) {
        currentpage--;
    }
    $('.slide').attr('src', 'assets/img/' + currentpage + '.png');
    $('.num').html(currentpage);
    if (currentpage < 10) {}
    $('.num').html('0' + currentpage);

    var iframe = document.getElementById("vid-frame");
    iframe.contentWindow.updateSlide(currentpage);
})
$('.next-btn').click(function() {
    if (currentpage < totalpage) {
        currentpage++;
    }
    $('.slide').attr('src', 'assets/img/' + currentpage + '.png');
    $('.num').html(currentpage);
    if (currentpage < 10) {}
    $('.num').html('0' + currentpage);
    var iframe = document.getElementById("vid-frame");
    iframe.contentWindow.updateSlide(currentpage);
})

function updateSlide(page) {
    $('.slide').attr('src', 'assets/img/' + page + '.png');
    currentpage = page;
    $('.num').html(currentpage);
    if (currentpage < 10) {}
    $('.num').html('0' + currentpage);
}
var titleval = 'conference';
// start of inline conference name edit function        
$('.conf-title').on('click', function(e) {
    return;
    e.stopPropagation();
    if (!$(this).hasClass('active')) {
        $(this).addClass('active');
        var val = $(this).html();
        $(this).html($('<input type="text" placeholder="Enter title" class="room-input" value="' + val + '"/>'));
        $('.room-input').keyup(function() {
            titleval = this.value
            var iframe = document.getElementById("vid-frame");
            iframe.contentWindow.onStatusUpdate(titleval);
            //updateTitle(dInput);
        });
    }
});

function triggerUpdate() {
    
        setTimeout(function() {
            var iframe = document.getElementById("vid-frame");
            //iframe.contentWindow.onStatusUpdate(titleval);
            iframe.contentWindow.updateSlide(currentpage);
        }, 3000);

   
}

function updateTitle(title) {

    $('.conf-title').html(title);
}

function installPlubinInline(){
  
        chrome.webstore.install('https://chrome.google.com/webstore/detail/ncgpiojdencehcbfemhkjabhceoikhik', function(d) {
        //checkScreenShare();
        },
        function(e) {
            alert(e);

        });
}