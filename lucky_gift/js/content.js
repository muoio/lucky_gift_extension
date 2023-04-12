var loop;
let loop_check_pause;
let loop_check_score;
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function wait_for_element(selector){
    let max_wait = 10;
    while(!document.querySelector(selector) && max_wait--)
        await sleep(500);
    if (max_wait<=0) return false;
    else return true;
}

function check_score(){
    chrome.storage.local.get(['auto_start','bet_amount','score_pivots','check_time'], async function(data){
        localStorage.auto_start = data.auto_start;
        if (!data.auto_start) return;

        // let score_auto_start_json = JSON.parse(data.score_pivots);
        // let score_auto_start_value = parseInt(score_auto_start_json[data.bet_amount]);
        
        // localStorage.click_period = parseInt(data.click_period);
        localStorage.score_pivots = data.score_pivots;
        localStorage.bet_amount = data.bet_amount;

        localStorage.check_time = parseInt(data.check_time);
    })
}



function add_css(){
    let inject_css = document.createElement('style');
    //inject_css.setAttribute('rel',"stylesheet");
    //let file_url = chrome.runtime.getURL('./css/content.css');
    //inject_css.href = file_url;
    inject_css.innerHTML = `#injected_note{
        background-color:  white;
        position : absolute;
        width : 220px;
        height : 100px;
        border-style : groove;
    }
    #injected_note_header{
        color: green !important;
        text-align : center;
        cursor : move;
        background-color : SkyBlue;
    }`
    document.head.appendChild(inject_css);
}
function add_svga_player(){
    let inject_js = document.createElement('script');
    let file_url = chrome.runtime.getURL('./inject/svga-player1.js');
    inject_js.src = file_url;
    document.body.appendChild(inject_js);
}
function add_9ef4b(){
    let inject_js = document.createElement('script');
    inject_js.src = chrome.runtime.getURL("./inject/9ef4b.js");
    document.body.appendChild(inject_js);
}
function getAllCookies() {
    var cookies = {};
  
    // Split cookies string into individual cookies
    var cookiesArray = document.cookie.split(';');
  
    // Loop through all cookies
    for (var i = 0; i < cookiesArray.length; i++) {
      // Get the name and value of the current cookie
      var cookie = cookiesArray[i].trim();
      var equalsIndex = cookie.indexOf('=');
      var name = cookie.substring(0, equalsIndex);
      var value = cookie.substring(equalsIndex + 1);
  
      // Add the cookie to the cookies object
      cookies[name] = value;
    }
  
    return cookies;
}
function getAllParams(){
    let url = document.location.href;
    let queryString = url.match(/\?(.*)/)[1];
    let pairs = queryString.split("&");
    let json = pairs.reduce((acc, pair) => {
        let [key, value] = pair.split("=");
        return { ...acc, [key]: value };
    }, {});
    return json
}
function info_table(){
    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
          elmnt.firstChild.onmousedown = dragMouseDown;
      
        function dragMouseDown(e) {
          //e = e || window.event;
          //e.preventDefault();
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        }
      
        function elementDrag(e) {
          e = e || window.event;
          //e.preventDefault();
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          
          // set the element's new position:
          elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
          elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      
          localStorage['top_position'] = elmnt.style.top;
          localStorage['left_position'] = elmnt.style.left;
        }
      
        function closeDragElement() {
          // stop moving when mouse button is released:
          document.onmouseup = null;
          document.onmousemove = null;
        }
    }

    if (!localStorage.hasOwnProperty('top_position')) localStorage['top_position'] = "10%";
    if (!localStorage.hasOwnProperty('left_position')) localStorage['left_position'] = "90%";
    localStorage['send_success_num'] = 0;
    
    let note = document.createElement("div");
    note.id = 'injected_note';
    note.style.backgroundColor = "white";
    note.style.position = "absolute";
    note.style.width = "400px";
    note.style.height = "600px";
    note.style.borderStyle = 'groove';
    note.style.top = localStorage['top_position'];
    note.style.left = localStorage['left_position'];

    let note_header = document.createElement('div');
    note_header.id = 'injected_note_header'
    note_header.textContent = 'Thông tin tool';
    note_header.style.setProperty('color', 'green', 'important');
    note_header.style.textAlign = 'center';
    note_header.style.cursor = 'move';
    note_header.style.backgroundColor = 'SkyBlue'
    note.appendChild(note_header);


    let inject_frame = document.createElement('iframe');
    inject_frame.id = 'inject_frame';
    inject_frame.src = 'https://muoio.github.io/luckgift2/';
    inject_frame.allowFullscreen = true;
    inject_frame.style.width = '100%';
    inject_frame.style.height = '80%';

    inject_frame.addEventListener('load', function() {
        let params = getAllParams();
        let cookies = getAllCookies();
        let message = {greeting:'load_variables', params:params, cookies:cookies}
        inject_frame.contentWindow.postMessage(JSON.stringify(message), '*');
    });
    note.appendChild(inject_frame);



    note.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    dragElement(note);
    return note;
}

window.onload = async function(){
    document.body.appendChild(info_table());
}