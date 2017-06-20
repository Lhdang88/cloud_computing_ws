/**
 * @description Provides the business logic for chats
 */

// dependencies

const db = require('./db/inmemory');
// initialize the db
db.init();

function getChatRooms() {
  return db.loadRooms();
}

function getMessagesInRoom(roomId) {
  if(!roomId) {
    return Promise.reject(new Error('Room must be defined'));
  }
  
  return db.loadMessages(roomId);
}

function postMessage(roomId, {user, message, meta}) {
  if(!roomId || !user || !message) {
    return Promise.reject(new Error('Room, User, Message must be defined'));
  }

  return db.storeMessage(roomId, false, {user, message, meta, timestamp: Date.now()});
}

function getUsersInRoom(roomId) {
  if(!roomId) {
    return Promise.reject(new Error('Room must be defined'));
  }
  
  return db.loadUsers(roomId);
}

function postPrivateMessage(userId, {user, message, meta}) {
  if(!userId || !user || !message) {
    return Promise.reject(new Error('Recipient, User, Message must be defined'));
  }
  
  // create private conversation as new chat-room
  const roomId = getPrivateChatRoomName(userId, user);
  return db.storeMessage(roomId, true, {user, message, meta, timestamp: Date.now()});
}

function getPrivateChatRoomName(userA, userB) {
  return userA < userB ? `${userA}_x_${userB}`: `${userB}_x_${userA}`;
}

module.exports = {
  getChatRooms,
  getMessagesInRoom,
  postMessage,
  getUsersInRoom,
  postPrivateMessage,
  getPrivateChatRoomName
}
