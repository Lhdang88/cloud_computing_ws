/**
 * @description defines the /api/chats APIs
 */

// dependencies
const cs = require('../chatservice');

function init(app) {
  app.get('/api/chats', getChats);
  console.log(`*** API [GET] /api/chats registered`)
  app.get('/api/chats/:room', getMessagesInRoom);
  console.log(`*** API [GET] /api/chats/:room registered`)
  app.post('/api/chats/:room', postMessage);
  console.log(`*** API [POST] /api/chats/:room registered`)
  app.get('/api/chats/:room/users', getChatRoomUsers);
  console.log(`*** API [GET] /api/chats/:room/users registered`)
  app.post('/api/chats/users/:user', postPrivateMessage);
  console.log(`*** API [POST] /api/chats/users/:user registered`)
}

function getChats(req, res) {
  const rooms = cs.getChatRooms();
  res.send(rooms);
}

function getMessagesInRoom(req, res) {
  const messages = cs.getMessagesInRoom(req.params.room)
  res.send(messages);
}

function postMessage(req, res) {
  const messages = cs.postMessage(req.params.room, {user: req.body.user, message: req.body.message, meta: req.body.meta})
  res.send(messages);
}

function getChatRoomUsers(req, res) {
  const users = cs.getUsersInRoom(req.params.room);
  res.send(users);
}

function postPrivateMessage(req, res) {
  const messages = cs.postPrivateMessage(req.params.user, {user: req.body.user, message: req.body.message, meta: req.body.meta});
  res.send(messages);
}

module.exports = {
  init
}
