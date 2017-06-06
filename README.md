## Cloud Computing Workshop

Chat API-Server, default Port: 3000

API:

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
