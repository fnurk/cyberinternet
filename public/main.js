import Game from "./game.js"
var socket = io();

new Game(socket, $(".game"))