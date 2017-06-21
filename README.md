## Cloud Computing Workshop

Chat API-Server, default Port: 3000

REST API:

* [GET] /api/chats
  * returns a list of all chat-rooms (names)
* [GET] /api/chats/:room
  * returns a list of messages for :room, sorted by time
* [POST] /api/chats/:room
  * posts a message in :room and returns all messages of that room, sorted by time
* [GET] /api/chats/:room/users
  * returns a list of users who have posted in :room, sorted by name
* [POST] /api/chats/users/:user
  * post a private message to :user and return all messages with that :user, sorted by time

Websocket API:

Connect to Websocket Endpoint /chat

Websocket are in JSON format. Declare a property named 'action' to invoke functionalities:

* Posting Message in Room or Posting private Message:

```javascript
{
  "action": ["postMessage" || "postPrivateMessage"],
  "roomId": "roomId_for_postMessage",
  //"userId": "receiverUser_for_postPrivateMessage",
  "user": "senderUser",
  "message": "message",
  "meta": { "foo": "bar"} // additional data to pass
}
```
returns the message posted and broadcasts the message to users via websocket

* List all chat rooms:

```javascript
{
  "action": "getChatRooms"
}
```
returns an array of chat room-names via websocket

* List all Messages/Users in Room:

```javascript
{
  "action": ["getMessagesInRoom" || "getUsersInRoom"],
  "roomId": "roomId"
}
```
returns messages ordered by time (users) via websocket

* Join a room, by posting a message to it as a client e.g.
```javascript
{
  "action": "postMessage",
  "roomId": "Lobby",
  "user": "user",
  "message": "I'm joining the room"
}
```
