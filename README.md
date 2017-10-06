# resin.io IPFS pubsub controlled Blinkt

For quite a while I wanted to try out [IPFS PubSub](https://ipfs.io/blog/25-pubsub/), which enables distributed messaging between computing nodes. Then I've read [Using IPFS for IoT Communications](https://medium.com/@chrismatthieu/using-ipfs-for-iot-communications-b49c2139783a), and wanted to implement something like that on a resin.io device. The result is this example project: using IPFS pubsub messages to turn LEDs to different colours on a Raspberry Pi device!

## Setup

Hardware requirements:

*   Raspberry Pi 3 (though other Pi versions should work too but untested)
*   A [Blinkt!](https://shop.pimoroni.com/products/blinkt) LED strip that goes on the Pi
*   the regular power, networking, storage requirements

Software requrements:

This project is using [resin.io](https://resin.io), so either: have an account there, so you can deploy a device; or: with a few modifications this should all run on a [resinOS](https://resinos.io)-powered Raspberry Pi (not tested).

You can check the [resin.io getting started guide](https://docs.resin.io/raspberrypi3/nodejs/getting-started/) for the initial setup. Once that is done, deploy this code (`git push resin master`), and wait until it is built, then downloaded on your device.

What happens is that the device subscribes on IPFS to a pubsub topic equal to its UUID (which you can get from the resin dashbard, or the code displays it in the logs). If the device is not running on resin, it will subscribe to general topic (see code, because then you are an expert!).

On that topic it will listen to a message consisting of "red" or "green" or "blue" or "off". If it receives a message like that, then it will set the lights to the apropriate setting (colour, or off).

To control the lights, check [ipfs.io](https://ipfs.io/) how to install IPFS. Once you start up your daemon (make sure you pass the `--enable-pubsub-experiment` flag!), you can send messages to the topic mentioned above, something like:

``` bash
$ ipfs pubsub pub <UUID> red|green|blue|off
```

The device should react to the message and the logs should show the data it received.

## Details

This code pulls in the precompiled IPFS binary for ARM devices. Could compile from scratch, but for this proof of concept this is good enough.

The ipfs daemon is started by systemd, and using variables to create its data directory on `/data`, which is a persistent storage for applications on resin.io, thus the node identity will be the same between restarts. The IPFS control and communication is done through [js-ipfs-api](https://github.com/ipfs/js-ipfs-api). This was done like this, so if there's another similar project but which does not want to use Javascript, it would be easier to switch out `js-ipfs-api` to another API client (e.g. [py-ipfs-api](https://github.com/ipfs/py-ipfs-api), though that does not support pubsub just yet).

The API client is responsible for subscription and message handling, as well as the light control. The Javascript library for Blinkt! is pretty simple, so not doing much at the moment, just demoing.

## ToDo

*   add options to set what topic to listen to
*   enable "application-wide" topic, so you can have a fleet of devices to control with a single message
*   add message verification (e.g. gpg-signed/encrypted messages, or some other way)
*   add ipfs compilation from scratch
*   redo this in an "all-js" version using [js-ipfs](https://github.com/ipfs/js-ipfs), possibly
*   ...?

## License

Copyright 2017 `Gergely Imreh <imrehg@gmail.com>`

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
