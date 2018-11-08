// ==UserScript==
// @name 	     TW beeper
// @description TW script for beeping when your nick was typed in chat
// @author 	Originally beeper script by Macabre2077, modified by jarograv
// @version 	1.00
// @include 	https://*.the-west.*/game.php*
// @exclude         https://classic.the-west.net/game.php*
// ==/UserScript==


function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
}

exec(function() {

var beepSound = new Audio('https://raw.githubusercontent.com/jarograv/cotcot/master/cotcot.mp3');

Sounds = {
	roomsListening:[],
	addListeners: function() {
		var roomChanged = function (room, type, data) {
			switch (type) {
				case "NewMessage":
					var div = $(data[0]);
					var text = div.find(".chat_text").html();
					var nickInText = text.toLowerCase().indexOf("jaro") > -1;
					if(nickInText) {

                        beepSound.play();
					}
				break;
			}
		};
		var r, room, rooms = Chat.Resource.Manager.getRooms();
		for(r in rooms) {
			room = Chat.Resource.Manager.getRoom(r);
			if(!Sounds.roomsListening.hasOwnProperty(room.id)){
				Sounds.roomsListening.push(room.id);
				room.addListener(roomChanged);
			}
		}
	}
};

$(document).ready(function() {
	try {
		if(EventHandler.hasOwnProperty("add")) {
			EventHandler.add("chat_room_added",function(room){
				Sounds.addListeners();
			});
		} else {
			EventHandler.listen("chat_room_added",function(room){
				Sounds.addListeners();
			});
		}
	} catch(e) {
		console.log(e.stack);
		alert("TW Beeper error: " + e);
	}
});
});

