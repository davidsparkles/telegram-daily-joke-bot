set -e
set -u

git pull

NAME=raspi-server

docker build -t "$NAME:$(git rev-parse HEAD)" .
docker service update --image $NAME:$(git rev-parse HEAD) $NAME