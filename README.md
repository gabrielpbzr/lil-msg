# LilMsg

A simple REST service to store simple messages. Built for those moments when all you need is a simple backend service to test that REST client you are developing, but don't want to bother writing one.

## Endpoints

Endpoint | HTTP Method | Description | Parameters
------------ | ------------------| --------------- | ------------
/ | GET | Welcome message and instructions | None
/messages | GET | Get all messages | None
/messages | POST | Send a new message  |`{"subject":string,"body":string,"sender":string}`
/messages/{id} | GET | Read a message by its id| None 
/messages/{id} | DELETE | Delete a message | None


