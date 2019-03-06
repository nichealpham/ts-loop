# Script to build, push bravo-api-image & start container
docker stop cassandra.payment.v1
docker rmi cassandra/payment:latest
docker build --rm -t cassandra/payment:latest .
# docker tag bravo/api gcr.io/bravodevelopmentnew/bravo-api-image
# docker push gcr.io/bravodevelopmentnew/bravo-api-image
docker run --rm -d --name cassandra.payment.v1 -p 4006:4006 cassandra/payment:latest