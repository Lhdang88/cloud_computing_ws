/**
 * @description Provides the business logic for chats
 */
const env = require('../environment');
const MongoClient = require('mongodb').MongoClient;

const dbString = env.mongodb.url;


let dbConn;
let chatColl;

function init() {
  initConnection()
  .then(function () {
    return loadRooms().then(function (rooms) {
      if (!rooms.includes('Lobby')) {
        return storeMessage('Lobby', false, {user: 'the System', message: 'Welcome to the Lobby', timestamp: Date.now()});
      }
    })
  })
  .catch(function (err) {
    console.error(`could not establish MongoDB Connection with ${dbString}`);
    console.error(err);
  });
}

function initConnection() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbString, (err, demoDB) => {
      if (err) {
        return reject(err);
      }
      console.log('MongoDB Connection established');
      dbConn = demoDB;
      chatColl = dbConn.collection('chat');
      return resolve(dbConn);
    });
  });
}

function close() {
  if (dbConn) {
    console.log('Closing existing db connection...');
    return dbConn.close();
  }
  return Promise.resolve('OK');
}

function loadRooms() {
  console.log('loading chat rooms');
  //todo implement mongodb query
  return chatColl.distinct('roomId');
}

function loadMessages(roomId) {
  console.log(`loading messages for room: ${roomId}`);
  //todo implement mongodb query
  let result = [];
  return new Promise(function (resolve, reject) {
    chatColl.find({roomId}).toArray(function(err, docs) {
      if(err) {
        return reject(err);
      }

      docs.forEach(function (element) {
        result.push(element.data);
      });
      return resolve(result);
    });
  });

}

function storeMessage(roomId, isPrivate, data) {
  console.log(`storing message in room: ${roomId}`);
  // todo implement mongodb query
  return chatColl.insert({roomId, data})
    .then(function (doc) {
      // return the message list
      return loadMessages(roomId);
    });
}

function loadUsers(roomId) {
  console.log(`loading users in room: ${roomId}`);
  // todo implement mongodb query
  return chatColl.distinct('data.user', {roomId});
}

module.exports = {
  init,
  close,
  loadRooms,
  loadMessages,
  storeMessage,
  loadUsers
}
