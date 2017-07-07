## Cloud Computing Workshop

Chat API-Server, default Port: 3000

### REST API:

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

### Websocket API:

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

returns the message posted and broadcasts the message to users via websocket in this format:

```javascript
{
  "action": "postMessage",
  "roomId": "roomId_for_postMessage",
  "message": {
    "user": "userthatpostedthemessage",
    "message": "foo bar",
    "timestamp": "milliseconds since 1.1.1970"
    "meta": "some meta data"
  }
}
```

* List all chat rooms:

```javascript
{
  "action": "getChatRooms"
}
```
* returns an object of this format:

```javascript
{
  "action": "getChatRooms",
  "chatRooms": [array of rooms]
}
```
* List all Users in Room:

```javascript
{
  "action": "getUsersInRoom",
  "roomId": "roomId"
}
```
* in this format

```javascript
{
  "action": "getUsersInRoom",
  "roomId": "roomId",
  "users": [array of users]
}
```
* List all Messages in Room:

```javascript
{
  "action": "getMessagesInRoom",
  "roomId": "roomId"
}
```
* in this format (messages are oredered by timestamp)

```javascript
{
  "action": "getMessagesInRoom",
  "roomId": "roomId"
  "messages": [array of messages]
}
```

* Join a room, by posting a message to it as a client e.g.
```javascript
{
  "action": "postMessage",
  "roomId": "Lobby",
  "user": "user",
  "message": "I'm joining the room"
}
```

### Authentication

The APIs are protected with Basic-Auth. Default credentials are 'dhbw'/'dhbw-pw', but can be overridden with env-variables: DHBW_USER, DHBW_PASSWORD.
