# Firstly build docker image
docker build --rm -t bravo/api:latest .


# Push docker image to registry
docker tag bravo/api gcr.io/bravodevelopmentnew/bravo-api-image
docker push gcr.io/bravodevelopmentnew/bravo-api-image


# Deploy docker image as a service of app-engine 
gcloud app deploy --image-url gcr.io/bravodevelopmentnew/bravo-api-image