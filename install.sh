set -e
set -u

NAME=telegram-daily-joke-bot

docker build -t "$NAME:$(git rev-parse HEAD)" .

docker service create \
--name $NAME \
--replicas=1 \
$NAME:$(git rev-parse HEAD)
