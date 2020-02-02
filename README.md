## Mail queue based on redis sub/pub microservice communication pattern


1. API call to /api/send-mail
2. API receives data and publishes a new event with the received data
3. Mail-worker has subscribed to the publisher's event and executes whatever code with the received data


Mail worker microservice can be scaled as necessary. API just handles basic routing, no heavy work.