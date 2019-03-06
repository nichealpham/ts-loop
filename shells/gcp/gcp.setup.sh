# ===============================================================
# STEPS TO SETUP GCP DEPLOYMENT ENVIRONMENT 
# ===============================================================
# 1. install gcp-sdk
# 2. install kubectl
# 3. install docker
# 4. Init gcp-sdk
# 5. Configure docker to use gcr
# 6. Create a cluster for this project and setup kubectl for this cluster
# 7. DONE !!!
# ===============================================================



# STEP 1 ========================================================
curl https://sdk.cloud.google.com | bash
source ~/.bashrc
gcloud --version



# STEP 2 ========================================================
gcloud components install kubectl



# STEP 3 ========================================================
sudo yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2

sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

sudo yum install docker-ce -y
sudo systemctl start docker



# STEP 4 ========================================================
gcloud init



# STEP 5 ========================================================
gcloud auth configure-docker


# STEP 6 ========================================================
gcloud container clusters create bravo-api-cluster --num-nodes=1