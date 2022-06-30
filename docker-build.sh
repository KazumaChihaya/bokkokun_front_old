#!/bin/sh

docker build . -t docker.arrow-payment.com/manage-vite:latest
docker push docker.arrow-payment.com/manage-vite:latest