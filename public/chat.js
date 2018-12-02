var socket = io();

let members = [];

var username = "haxxor"+(Math.floor(Math.random()*100));

const DOM = {
    membersCount: document.querySelector('.members-count'),
    membersList: document.querySelector('.members-list'),
    messages: document.querySelector('.messages'),
    input: document.querySelector('.message-form__input'),
    form: document.querySelector('.message-form'),
};

function createMemberElement(message) {
    const user = message.user;
    const el = document.createElement('div');
    el.appendChild(document.createTextNode(user));
    el.className = 'member';
    return el;
}

function updateMembersDOM() {
    DOM.membersCount.innerText = `${members.length} users connected`;
    DOM.membersList.innerHTML = '';
    members.forEach(member =>
        DOM.membersList.appendChild(createMemberElement(member))
    );
}

function createMessageElement(message) {
    const el = document.createElement('div');
    el.appendChild(createMemberElement(message));
    el.appendChild(document.createTextNode(message.message));
    el.className = 'message';
    return el;
}

function addMessageToListDOM(message) {
    const el = DOM.messages;
    const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
    el.appendChild(createMessageElement(message));
    if (wasTop) {
        el.scrollTop = el.scrollHeight - el.clientHeight;
    }
}
    

$('form').submit(function(){
    const msg = DOM.input.value;
    if (msg === '') {
        return;
      }
    DOM.input.value = '';
    socket.emit('chat_msg', {"user": username, "message": msg});
    return false;
  });

function register(){
    socket.emit('user_conn', {"user": username})
}

function leave(){
    socket.emit('user_disc', {"user": username})
}

$(window).unload( () => {
    leave();
})

socket.on('connect', error => {
    if(error){
        return console.error(error);
    }
    register();
    console.log("CONNECTED")
})
  
socket.on('chat_msg', function(msg){
    addMessageToListDOM(msg)
    //msgSound()
});

socket.on('user_list', function(msg){
    console.log(msg.users)
    members = msg.users
    updateMembersDOM();
});

function msgSound() {
    soundEffect(
      2000,           //frequency
      0,                //attack
      0.05,              //decay
      "sine",       //waveform
      0.1,                //Volume
      0,             //pan
      0,                //wait before playing
      1200,             //pitch bend amount
      false,            //reverse bend
      0,                //random pitch range
      0,               //dissonance
      [0,0,0],         //echo array: [delay, feedback, filter]
      undefined         //reverb array: [duration, decay, reverse?]
    );
  }