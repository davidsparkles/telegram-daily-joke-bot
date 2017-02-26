FROM hypriot/rpi-node:7.4.0
ADD / ./
EXPOSE 10000
CMD bash run.sh