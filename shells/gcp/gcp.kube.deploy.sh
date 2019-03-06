# Firstly build docker image
docker build --rm -t bravo/api:latest .


# Push docker image to registry
docker tag bravo/api gcr.io/bravodevelopmentnew/bravo-api-image
docker push gcr.io/bravodevelopmentnew/bravo-api-image

# Firstly delete the old cluster
gcloud container clusters delete bravo-api-cluster
# Create a new cluster
gcloud container clusters create bravo-api-cluster --num-nodes=1


# Deploy the docker image to the cluster via kubenetes.yaml
kubectl create -f kubenete.yaml
kubectl describe deployments