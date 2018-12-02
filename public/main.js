import Game from "./game.js"
import Chat from "./chat.js"

var socket = io();

var chat = new Chat(socket)
var game = new Game(socket, $(".game"))