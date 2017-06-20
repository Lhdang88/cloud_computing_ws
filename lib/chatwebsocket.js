const cs = require('./chatservice');

function chatWebSocket(expressWS, ws, req) {

  ws.on('close', (msg) => {
    console.warn(`[WEBSOCKET]: connection close: ${msg}`);
    ws.send(JSON.stringify({ close: 'bye' }));
  });

  ws.on('message', (msg) => {
    try {
      console.log(`[WEBSOCKET]: data received: ${msg}`);
      msg = JSON.parse(msg);

      //sync - update session
      ws.chatUser = msg.user;
      if(msg.roomId) {
        if(!ws.chatRooms) {
          ws.chatRooms = [];
        }
        if(!ws.chatRooms.includes(msg.roomId)) {
          ws.chatRooms.push(msg.roomId);
        }
      }

      if (!msg.action) {
        return ws.send(JSON.stringify({ error: 'Socket Action must be specified' }));
      }

      handleSocketAction(expressWS, ws, req, msg)
      .catch((error) => {
        ws.send(JSON.stringify({ error: error.message }));
      });

    } catch (error) {
      ws.send(JSON.stringify({ error: error.message }));
    }
  });
}

function postMessage(expressWS, ws, msg) {

  return cs.postMessage(msg.roomId, { user: msg.user, message: msg.message, meta: msg.meta })
    .then(function (messages) {
      //broadcast
      expressWS.getWss().clients.forEach((client) => {
        //broad cast to users who are in the same room
        console.log(`user: ${client.chatUser} my rooms: ${client.chatRooms}`);
        if(client.chatRooms && client.chatRooms.includes(msg.roomId)) {
          console.log(`sending message to user: ${client.chatUser} for room: ${msg.roomId}`);
          client.send(JSON.stringify(msg));
        }
      });
    }).catch(function (err) {
      ws.send(JSON.stringify({ error: err.message }));
    });
}

function postPrivateMessage(expressWS, ws, msg) {
      // sender joins room
  return new Promise((res, rej) => {
      // check if sender and receiver have already joined the room
      expressWS.getWss().clients.forEach((client) => {
        //check sender
        if(client.chatUser === msg.user && !(client.chatRooms && client.chatRooms.includes(cs.getPrivateChatRoomName(msg.user, msg.userId)))) {
          //add the sender to the room
          if(!client.chatRooms) {
            client.chatRooms = [];
          }
          console.log(`Sender ${msg.user} is joining room ${cs.getPrivateChatRoomName(msg.user, msg.userId)}`);
          cs.postMessage(cs.getPrivateChatRoomName(msg.user, msg.userId), { user: msg.user, message: 'joined the room', meta: msg.meta });
          client.chatRooms.push(cs.getPrivateChatRoomName(msg.user, msg.userId));
        }

        //check receiver
        if(client.chatUser === msg.userId && !(client.chatRooms && client.chatRooms.includes(cs.getPrivateChatRoomName(msg.user, msg.userId)))) {
          //add the sender to the room
          if(!client.chatRooms) {
            client.chatRooms = [];
          }
          console.log(`Receiver ${msg.userId} is joining room ${cs.getPrivateChatRoomName(msg.user, msg.userId)}`);
          cs.postMessage(cs.getPrivateChatRoomName(msg.user, msg.userId), { user: msg.userId, message: 'joined the room', meta: msg.meta });
          client.chatRooms.push(cs.getPrivateChatRoomName(msg.user, msg.userId));
        }
      });

      res('OK');;

    })
    .then(() => {
      return cs.postPrivateMessage(msg.userId, { user: msg.user, message: msg.message, meta: msg.meta });
    })
    .then(() => {
      //broadcast
      expressWS.getWss().clients.forEach((client) => {
        //only broadcast message to receiver and sender
        console.log(`user: ${client.chatUser} my rooms: ${client.chatRooms}`);
        if(client.chatUser === msg.user || client.chatUser === msg.userId) {
          console.log(`sending message to user: ${client.chatUser}`);
          client.send(JSON.stringify(msg));
        }
      });

    })
    .catch(function (err) {
      ws.send(JSON.stringify({ error: err.message }));
    });
}

function getMessagesInRoom(expressWS, ws, msg) {

  return cs.getMessagesInRoom(msg.roomId)
    .then(function (messages) {
      return ws.send(JSON.stringify(messages));
    })
    .catch(function (err) {
      ws.send(JSON.stringify({ error: err.message }));
    });
}

function getUsersInRoom(expressWS, ws, msg) {

  return cs.getUsersInRoom(msg.roomId)
    .then(function (users) {
      return ws.send(JSON.stringify(users));
    })
    .catch(function (err) {
      ws.send(JSON.stringify({ error: err.message }));
    });
}

function getChatRooms(expressWS, ws) {

  return cs.getChatRooms()
    .then(function (rooms) {
      return ws.send(JSON.stringify(rooms));
    })
    .catch(function (err) {
      ws.send(JSON.stringify({ error: err.message }));
    });
}

function handleSocketAction(expressWS, ws, req, msg) {
  console.log(`Websocket Action received: ${msg.action}`);
  switch (msg.action) {
    case 'postPrivateMessage': return postPrivateMessage(expressWS, ws, msg);
    case 'postMessage': return postMessage(expressWS, ws, msg);
    case 'getMessagesInRoom': return getMessagesInRoom(expressWS, ws, msg);
    case 'getUsersInRoom': return getUsersInRoom(expressWS, ws, msg);
    case 'getChatRooms': return getChatRooms(expressWS, ws);
    default: ws.send(JSON.stringify({ error: 'unspecified action' }));
  }

  return Promise.resolve('Done');
}

module.exports = chatWebSocket;