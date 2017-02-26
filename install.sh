set -e
set -u

LISTEN_PORT=10010
NAME=raspi-server

docker build -t "$NAME:$(git rev-parse HEAD)" .

docker service create \
--name $NAME \
--replicas=1 \
--publish $LISTEN_PORT:10000 \
$NAME:$(git rev-parse HEAD)
