var ipfsAPI = require('ipfs-api')

var Blinkt = require('node-blinkt'),
leds = new Blinkt();

leds.setup();
leds.clearAll();
leds.setAllPixels(0, 0, 0, 0);
leds.sendUpdate();
leds.sendUpdate();

// connect to ipfs daemon API server
var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})

var UUID = process.env.RESIN_DEVICE_UUID
var topic
if (UUID) {
    topic = UUID
} else {
    topic = 'resin-ipfs-pub-dev'
}

console.log("Communication topic: "+topic)

const receiveMsg = (msg) => {
    console.log(msg)
    data = msg.data.toString('utf8')
    console.log("Received data: '"+data+"'")
    if (data === 'red') {
        leds.setAllPixels(255, 0, 0, 0.7);
        leds.sendUpdate();
        leds.sendUpdate();
    } else if (data === 'green') {
        leds.setAllPixels(0, 255, 0, 0.7);
        leds.sendUpdate();
        leds.sendUpdate();
    } else if (data === 'blue') {
        leds.setAllPixels(0, 0, 255, 0.7);
        leds.sendUpdate();
        leds.sendUpdate();
    }
}
ipfs.pubsub.subscribe(topic, receiveMsg)

// Periodically show peers
setInterval(function(){
ipfs.pubsub.peers(topic, (err, peerIds) => {
  if (err) {
    throw err
  }
  console.log("Peers:")
  console.log(peerIds)
})
// ipfs.pubsub.publish(topic, new Buffer('banana'), () => {})
}, 10000);
