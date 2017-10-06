# FROM resin/raspberrypi3-golang:1.9
#
# RUN go get -u -d github.com/ipfs/go-ipfs && \
#     cd $GOPATH/src/github.com/ipfs/go-ipfs && \
#     make install

FROM resin/raspberrypi3-debian

WORKDIR /usr/src/app

ENV IPFS_VERSION=0.4.11
RUN curl -O https://ipfs.io/ipns/dist.ipfs.io/go-ipfs/v0.4.11/go-ipfs_v${IPFS_VERSION}_linux-arm.tar.gz && \
    tar xzvf go-ipfs_v${IPFS_VERSION}_linux-arm.tar.gz

CMD while : ; do echo "idling..."; sleep 600; done
