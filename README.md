DevOps HW3 : Infrastructure Fluency
=========================
### Requirements

#### set/get
* Implemented using two handlers. `set` will set a value `this message will self-destruct in 10 seconds` for a key with an expiry for 10s
* `get` fetches this set value. We will be able to retrieve this value uptil 10s, after which the message `Sorry. The message has expired !!` is sent as the response.

#### recent
* A Redis queue of size 5 is maintained. Upon a request to `/recent`, this queue is sent as the response.

#### upload/meow
* A GET request to `/meow` displays the most recently uploaded image and pops the same from the Redis queue.

#### Additional Service Instance Running
* An array `serverPorts` is maintained in `main.js` to indicate the all the ports on which the server instances need to be provisioned.

#### Proxy
* Implemented using an `npm` package : `http-proxy` .
* The proxy server listens at port 8000
* A simple Round Robin approach is used to route requests to servers. Redis `lpoprpush` API is used for determining the server.

### Screencast
* The screencast can be found here : https://youtu.be/CbgT5BZ3xKA

### Setup

* Clone this repo, run `npm install`.
* Install redis and run on localhost:6379
