/**
 * @description Provides the business logic for chats
 */

// the db - datastructure
let db;

function init() {
  // load default dummy data
  db = {
    rooms: []
  };
  db.rooms.push({roomId: 'Lobby', created: Date.now, creator: 'the System', private: false, messages: []});
  db.rooms[0].messages.push({user: 'the System', message: 'Welcome to the Lobby', timestamp: Date.now()});
}

function loadRooms() {
  //console.log('loading chat rooms');
  const result = [];
  db.rooms.forEach(function (room) {
    result.push(room.roomId);
  });
  return Promise.resolve(result);
}

function loadMessages(roomId) {
  //console.log(`loading messages for room: ${roomId}`);
  const result = [];
  // try to find a room that matches the roomId
  const roomFound = db.rooms.find(function (room) {
    return roomId === room.roomId;
  });
  // add messages to the result list
  if(roomFound) {
    roomFound.messages.forEach(function (msg) {
      result.push(msg);
    });
  }
  // sort the messages by time
  result.sort(function (msgA, msgB) {
    if(msgA && msgB) {
      return msgA.timestamp < msgB.timestamp ? -1 : 1;
    }
    return 1;
  });

  return Promise.resolve(result);
}

function storeMessage(roomId, isPrivate, data) {
  //console.log(`storing message in room: ${roomId}`);
  const result = [];
  // try to find a room that matches the roomId
  let roomFound = db.rooms.find(function (room) {
    return roomId === room.roomId;
  });
  // add messages to the result list
  if(!roomFound) {
    // if no room is defined create a new one
    roomFound = {roomId, created: Date.now, creator: data.user, private: isPrivate, messages: []};
    db.rooms.push(roomFound);
  }
  // store the message
  roomFound.messages.push(data);
  // return the message list
  return loadMessages(roomId);
}

function loadUsers(roomId) {
  //console.log(`loading users in room: ${roomId}`);
  const result = [];
  // try to find a room that matches the roomId
  const roomFound = db.rooms.find(function (room) {
    return roomId === room.roomId;
  });
  // add users to the result list (don't add users twice)
  if(roomFound) {
    roomFound.messages.forEach(function (msg) {
      // if result doesn't contain user, add user to result list
      if(!result.includes(msg.user)) {
        result.push(msg.user);
      }
    });
  }
  // sort the users by name
  result.sort(function (userA, userB) {
      return userA < userB ? -1 : 1;
  });

  return Promise.resolve(result);
}

module.exports = {
  init,
  loadRooms,
  loadMessages,
  storeMessage,
  loadUsers
}
