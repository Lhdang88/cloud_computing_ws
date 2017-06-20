/**
 * @description defines the /api/chats APIs
 */

// dependencies
const cs = require('../chatservice');
const chatWebsocket = require('../chatwebsocket');

function init(app, ws) {
  app.get('/api/chats', getChats);
  console.log(`*** API [GET] /api/chats registered`);
  app.get('/api/chats/:room', getMessagesInRoom);
  console.log(`*** API [GET] /api/chats/:room registered`);
  app.post('/api/chats/:room', postMessage);
  console.log(`*** API [POST] /api/chats/:room registered`);
  app.get('/api/chats/:room/users', getChatRoomUsers);
  console.log(`*** API [GET] /api/chats/:room/users registered`);
  app.post('/api/chats/users/:user', postPrivateMessage);
  console.log(`*** API [POST] /api/chats/users/:user registered`);
  app.ws('/chat', chatWebsocket.bind(null, ws));
  console.log(`*** [WEBSOCKET] /chat registered`);
}

function getChats(req, res) {
  cs.getChatRooms()
  .then(function(rooms) {
    res.send(rooms);
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
}

function getMessagesInRoom(req, res) {
  cs.getMessagesInRoom(req.params.room)
  .then(function(messages) {
    res.send(messages);
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
}

function postMessage(req, res) {
  cs.postMessage(req.params.room, {user: req.body.user, message: req.body.message, meta: req.body.meta})
  .then(function(messages) {
    res.send(messages);
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
}

function getChatRoomUsers(req, res) {
  cs.getUsersInRoom(req.params.room)
  .then(function(users) {
    res.send(users);
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
}

function postPrivateMessage(req, res) {
  cs.postPrivateMessage(req.params.user, {user: req.body.user, message: req.body.message, meta: req.body.meta})
  .then(function(messages) {
    res.send(messages);
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
}

module.exports = {
  init
}
