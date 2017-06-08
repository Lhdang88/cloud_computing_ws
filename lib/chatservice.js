/**
 * @description Provides the business logic for chats
 */

// dependencies

const db = require('./db/mongodb');
// initialize the db
db.init();

function getChatRooms() {
  return db.loadRooms();
}

function getMessagesInRoom(roomId) {
  return db.loadMessages(roomId);
}

function postMessage(roomId, {user, message, meta}) {
  return db.storeMessage(roomId, false, {user, message, meta, timestamp: Date.now()});
}

function getUsersInRoom(roomId) {
  return db.loadUsers(roomId);
}

function postPrivateMessage(userId, {user, message, meta}) {
  // create private conversation as new chat-room
  const roomId = userId < user ? `${userId}_x_${user}`: `${user}_x_${userId}`
  return db.storeMessage(roomId, true, {user, message, meta, timestamp: Date.now()});
}

module.exports = {
  getChatRooms,
  getMessagesInRoom,
  postMessage,
  getUsersInRoom,
  postMessage,
  getUsersInRoom,
  postPrivateMessage
}
