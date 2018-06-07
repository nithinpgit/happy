var QueryString = function() {
    var query_string = {};
    var query = window.location;
    query = query.toString();
    query = query.split('?');
  if(query[1]){
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
   }else{
    return false;
   }
}();
/* configuraiton */
var base_url = 'https://webrtc.happi.online/';
var mode      = '0';
/*configuration end */
var room_name  =   '0';
if (QueryString.room) {
room_name   = QueryString.room;
}
if (QueryString.mode) {
mode   = QueryString.mode;
}
var webrtc     =   null;
var screenshare_support = true;
var my_image = "assets/img/profile-pic.png";
var name     = 'User';
var token    = 0;
var browser_name = '';
var peerobj = null;
screen_chrome_install = false;
$('document').ready(function(){
domClick();
initLayout();
token = generateUUID();
if(room_name != '0'){
    $('.invite-container').show();
    $('#enter_room_id').html('Enter your name and click join button');
    $('#enter-butn').html('Join');
    $('#room_input').val(room_name);
    $('#room_input').attr('disabled','disabled');
}else{
   $('.invite-container').show();
   if(getLocalStorage('room') != ''){
      $('#room_input').val(getLocalStorage('room'));
   }
   
}
});
function setLocalStorage(key,value){
if (typeof(Storage) !== "undefined") {
localStorage.setItem(key, value);                         
}
}
function getLocalStorage(key){
if (typeof(Storage) !== "undefined") {
return localStorage.getItem(key);
}
}
function domClick(){
$('#enter-butn').click(function(){
room_name = $('#room_input').val();
name      = $('#name_input').val();
var room_error = '';
if(room_name.replace(/\s/g, '') == '' && name.replace(/\s/g, '') == ''){
   room_error = 'room name and user name required';
}else if(room_name.replace(/\s/g, '') == ''){
   room_error = 'room name required';
}else if(name.replace(/\s/g, '') == ''){
   room_error = 'user name required';
}

if(room_error == ''){
    $('.invite-container').fadeOut();
    $('.webcam-toolbox').fadeIn();
    joinConference();
    setLocalStorage('room',room_name);
    $('#enter-butn').attr('disabled','disabled');
}else{
    showNotifiction(room_error);
}
        
});
$('.webcam-exit-room').click(function(){
   reset();
  alertify.set({ labels: { ok: "Leave room", cancel: "Cancel" } });
  alertify.confirm("Are you sure to leave from current session", function (e) {
    if (e) {
       location.reload();
    } else {
      //alertify.error("You've clicked Cancel");
    }
  });
});

$('.webcam-stop-microphone').on('click',function(e){
e.preventDefault();
if (!$(this).hasClass('active-tool')) {
$(this).find('a').find('img').attr('src', 'assets/img/camera-tools/mic.svg');
$(this).addClass('active-tool')
unMuteMyAudio();
} else  {
$(this).find('a').find('img').attr('src', 'assets/img/camera-tools/mic-off.svg');
$(this).removeClass('active-tool')
muteMyAudio();
}    

}) 


$('.webcam-stop-audio').on('click',function(e){
e.preventDefault();
if (!$(this).hasClass('active-tool')) {
$(this).find('a').find('img').attr('src', 'assets/img/camera-tools/volume.svg');
$(this).addClass('active-tool')
unmuteVolume();

} else  {
$(this).find('a').find('img').attr('src', 'assets/img/camera-tools/volume-off.svg');
$(this).removeClass('active-tool')
muteVolume();
}    

}) 


$('.webcam-stop-videocam').on('click',function(e){
e.preventDefault();
if (!$(this).hasClass('active-tool')) {
$(this).find('a').find('img').attr('src', 'assets/img/camera-tools/video.svg');
$(this).addClass('active-tool')
resumeMyVideo();
} else  {
$(this).find('a').find('img').attr('src', 'assets/img/camera-tools/video-off.svg');
$(this).removeClass('active-tool')
pauseMyVideo();
}    

}) 

$('.webcam-menu').on('click','a',function(e){
e.preventDefault();
if($('.webcam-active-menu').hasClass('hide-menu')){
$('.webcam-active-menu, .chat-right').hide();
$('.webcam-menu').find('a').find('img').css({backgroundColor:'#333'});    
$('.webcam-toolbox').addClass('hidebg'); 
$('.chat-box').css({height:'100%',bottom:'0'});
$('.webcam-video').css({height:'100%',bottom:'0'});    
$('.webcam-active-menu').removeClass('hide-menu');
}else{
$('.webcam-toolbox').removeClass('hidebg'); 
$('.webcam-menu').find('a').find('img').css({backgroundColor:''});    
$('.webcam-active-menu').addClass('hide-menu'); 
$('.chat-box').css({height:'calc(100% - 45px)',bottom:'45px'});
$('.webcam-video').css({height:'calc(100% - 45px)',bottom:'45px'});
$('.webcam-active-menu, .chat-right').fadeIn();         
}



})

}

function joinConference(){
webrtc = new SimpleWebRTC({
// the id/element dom element that will hold "our" video
localVideoEl: 'localVideo',
// the id/element dom element that will hold remote videos
remoteVideosEl: '',
nick:token,
// immediately ask for camera access
autoRequestMedia: true,
debug:false,
url: base_url
});

// we have to wait until it's ready
webrtc.on('readyToCall', function () {
// you can name it anything
webrtc.joinRoom(room_name);
$('video').attr('poster','assets/img/no-video.svg');       
});
webrtc.on('videoAdded', function (video, peer) {
  /*if(webrtc.getDomId(peer).indexOf("_screen_") >= 0){
      $('.'+peer.nick).hide();
  }  */
  var video_parent = '<div id="' + webrtc.getDomId(peer)+'" class="'+peer.nick+'"><img src="assets/img/fullscreen.svg" id="' + webrtc.getDomId(peer)+'_fullscrn"  width="20" class="fullscrnbut"></div>';
  $('#layout').append(video_parent);
  var remotes = document.getElementById(webrtc.getDomId(peer));
  remotes.appendChild(video);
  //$('video').attr('controls','true');
  $('video').attr('poster','assets/img/no-video.svg');   
  $('#'+webrtc.getDomId(peer)+'_fullscrn').click(function(){

       fullscreen(video);
  });

  
  setTimeout(layout,500);
});
webrtc.on('videoRemoved', function (video, peer) {
  
  if (video.id == "localScreen") {
        $('#myscreen').remove();
        $('#localVideo').show();
        setButton(true);
        webrtc.resumeVideo();
        layout();
    } else {

        $('#'+webrtc.getDomId(peer)).remove();
        if ( $('.'+peer.nick).length ) {
            $('.'+peer.nick).show();              
        }
        layout();
    }
   
});

if (!webrtc.capabilities.screenSharing) {
screenshare_support = false;
}
webrtc.on('channelMessage', function(peer, label, data) {

    if (label == "onReceiveSendToAll") {
        var res = JSON.parse(data.payload.data);
        var method = res.method
        if (res.token == token) {
            return;
        }
        if(method == 'chat'){
            loadChat(res.name, res.message, false, res.image, res.time);
            showNotifiction('Chat received from '+res.name);
        }
        
    } 
});
 
webrtc.on('createdPeer', function(peer) {
      //showNotifiction('New user joined');
      if (peer && peer.pc) {
        peer.pc.on('iceConnectionStateChange', function(event) {
            switch (peer.pc.iceConnectionState) {
                case 'checking':
                    
                    break;
                case 'connected':
                case 'completed': // on caller side
                   
                    break;
                case 'disconnected':
                    
                    break;
                case 'failed':
                    showNotifiction("Unable to connect remote peer.Please check your firewall settings");
                    break;
                case 'closed':
                    //console.log('created peer--Connection closed.');
                    break;
            }
        });
    
    }
    
});
}
function fullscreen(elem) {

    
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
}

function sendToAll(data) {

webrtc.sendDirectlyToAll('onReceiveSendToAll', 'onReceiveSendToAll', {
data: data
});
}
var chrome_ext_avail = false;
function checkChromeExt(callbck){
if (!webrtc.capabilities.supportScreenSharing) {
chrome_ext_avail = false;
}else{
chrome_ext_avail = true;
}
//return callbck(chrome_ext_avail);
return callbck(false);
}

function muteMyAudio(){
webrtc.mute()
showNotifiction('Your audio has been muted');
}
function unMuteMyAudio(){
webrtc.unmute()
showNotifiction('Your audio has been unmuted');
}
function pauseMyVideo(){
webrtc.pauseVideo();
showNotifiction('Your video has been disabled');
}
function resumeMyVideo(){
webrtc.resumeVideo();
showNotifiction('Your video has been enabled');
}
function muteVolume(){
$('video').prop('muted', true);
showNotifiction('Volume is muted');
}
function unmuteVolume(){
$('video').prop('muted', false);
$('#localVideo').prop('muted', true);
showNotifiction('Volume is unmuted');
}
function initLayout(){
var layoutEl = document.getElementById("layout");
    layout = initLayoutContainer(layoutEl, {
        animate: {
            duration: 500,
            easing: "swing"
        },
        fixedRatio:"3/4"
    }).layout;
    var resizeTimeout;
    window.onresize = function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            layout();
        }, 20);
    };
}
function reset() {
$("#toggleCSS").attr("href", "assets/css/alertify.default.css");
alertify.set({
 labels: {
     ok: "OK",
     cancel: "Cancel"
 },
 delay: 5000,
 buttonReverse: false,
 buttonFocus: "ok"
});
}
function showNotifiction(txt) {
$.notify(txt, {
clickToHide: true,
hideAnimation: 'slideUp',
className:"info",
autoHide: true,
autoHideDelay: 2000
});
}     
function getCurrentTime() {
var date = new Date();
var hour = date.getHours() - (date.getHours() >= 12 ? 12 : 0);
var period = date.getHours() >= 12 ? 'PM' : 'AM';
var min = date.getMinutes();
if (parseInt(min) < 10) {
 min = '0' + min;
}
if (parseInt(hour) < 10) {
 hour = '0' + hour;
}
return hour + ':' + min + ' ' + period;
}
function generateUUID(){
var d = new Date().getTime();
var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
var r = (d + Math.random()*16)%16 | 0;
d = Math.floor(d/16);
var out = (c=='x' ? r : (r&0x3|0x8)).toString(16);
var ret = out.substr(out.length - 3);
return ret;
});
var ret = uuid.substr(uuid.length - 6);
return ret;
}
var isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
function getBrowserInfo() 
{
var nVer = navigator.appVersion;
var nAgt = navigator.userAgent;
var browserName = navigator.appName;
var fullVersion = '' + parseFloat(navigator.appVersion);
var majorVersion = parseInt(navigator.appVersion, 10);
var nameOffset, verOffset, ix;
var screenshareok = 0;
// In Opera, the true version is after 'Opera' or after 'Version'
if ((verOffset = nAgt.indexOf('OPR')) !== -1) {
browserName = 'Opera';
fullVersion = nAgt.substring(verOffset + 6);

if ((verOffset = nAgt.indexOf('Version')) !== -1) {
    fullVersion = nAgt.substring(verOffset + 8);
}
}
// In MSIE, the true version is after 'MSIE' in userAgent
else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) {
browserName = 'IE';
fullVersion = nAgt.substring(verOffset + 5);
}
// In Chrome, the true version is after 'Chrome' 
else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) {
browserName = 'Chrome';
fullVersion = nAgt.substring(verOffset + 7);
screenshareok = 1;
}
// In Safari, the true version is after 'Safari' or after 'Version' 
else if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
browserName = 'Safari';
fullVersion = nAgt.substring(verOffset + 7);

if ((verOffset = nAgt.indexOf('Version')) !== -1) {
    fullVersion = nAgt.substring(verOffset + 8);
}
}
// In Firefox, the true version is after 'Firefox' 
else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) {
browserName = 'Firefox';
fullVersion = nAgt.substring(verOffset + 8);
screenshareok = 1;
}

// In most other browsers, 'name/version' is at the end of userAgent 
else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
browserName = nAgt.substring(nameOffset, verOffset);
fullVersion = nAgt.substring(verOffset + 1);

if (browserName.toLowerCase() === browserName.toUpperCase()) {
    browserName = navigator.appName;
}
}

if (isEdge) {
browserName = 'Edge';
// fullVersion = navigator.userAgent.split('Edge/')[1];
fullVersion = parseInt(navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)[2], 10);
}

// trim the fullVersion string at semicolon/space if present
if ((ix = fullVersion.indexOf(';')) !== -1) {
fullVersion = fullVersion.substring(0, ix);
}

if ((ix = fullVersion.indexOf(' ')) !== -1) {
fullVersion = fullVersion.substring(0, ix);
}

majorVersion = parseInt('' + fullVersion, 10);

if (isNaN(majorVersion)) {
fullVersion = '' + parseFloat(navigator.appVersion);
majorVersion = parseInt(navigator.appVersion, 10);
}
if(browserName == "Netscape"){ browserName ="Internet Explorer"; }

if(screenshareok==0)
{
//$('#screen-li').html('Screen share is only supported in chrome and firefox');
}
return {
fullVersion: fullVersion,
version: majorVersion,
name: browserName
};
}
browser_name   =  getBrowserInfo();
browser_name   = browser_name.name;


var isChrome = !!navigator.webkitGetUserMedia;
// DetectRTC.js - https://github.com/muaz-khan/WebRTC-Experiment/tree/master/DetectRTC
// Below code is taken from RTCMultiConnection-v1.8.js (http://www.rtcmulticonnection.org/changes-log/#v1.8)
var DetectRTC = {};
(function () {
            
var screenCallback;
DetectRTC.screen = {
chromeMediaSource: 'screen',
getSourceId: function(callback) {
    if(!callback) throw '"callback" parameter is mandatory.';
    screenCallback = callback;
    window.postMessage('get-sourceId', '*');
},
isChromeExtensionAvailable: function(callback) {
    if(!callback) return;
    
    if(DetectRTC.screen.chromeMediaSource == 'desktop') return callback(true);
    
    // ask extension if it is available
    window.postMessage('are-you-there', '*');
    
    setTimeout(function() {
        if(DetectRTC.screen.chromeMediaSource == 'screen') {
            callback(false);
        }
        else callback(true);
    }, 2000);
},
getChromeExtensionStatus: function (callback) {
    if (!!navigator.mozGetUserMedia) return callback('not-chrome');
    
    var extensionid = 'ncgpiojdencehcbfemhkjabhceoikhik';
    var image = document.createElement('img');
    image.src = 'chrome-extension://' + extensionid + '/icon.png';
    image.onload = function () {
        DetectRTC.screen.chromeMediaSource = 'screen';
        window.postMessage('are-you-there', '*');
        setTimeout(function () {
            if (!DetectRTC.screen.notInstalled) {
                callback('installed-enabled');
            }
        }, 2000);
    };
    image.onerror = function () {
        DetectRTC.screen.notInstalled = true;
        callback('not-installed');
    };
}
};

// check if desktop-capture extension installed.
if(window.postMessage && isChrome) {
DetectRTC.screen.isChromeExtensionAvailable();
}

})();
checkScreenStat();
function checkScreenStat(){
DetectRTC.screen.getChromeExtensionStatus(function(status) {
var nAgt = navigator.userAgent;

if(status == 'installed-enabled') {
    DetectRTC.screen.chromeMediaSource = 'desktop';
    checkScreenShare();                    
} else if(nAgt.indexOf('Chrome') !== -1 && nAgt.indexOf('OPR') === -1) {
    screen_chrome_install = false;
}
});
}

function checkScreenShare(){
screen_chrome_install = true;

}