#!/usr/bin/env bash
#Website
openssl genrsa -out www-key.pem 2048
openssl ecparam -name prime256v1 -out www-key.pem -genkey
openssl req -sha256 -new -key www-key.pem -out www-csr.pem

#01 Request ec
#Software rsa
openssl genrsa -out software-key.pem 2048
#Soft ware rc
openssl ecparam -name prime256v1 -out software-key.pem -genkey
#Request sha 256
openssl req -sha256 -new -key software-key.pem -out software-csr.pem

# 02 Request genrsa
openssl genrsa -out software-key-file.txt 2048
openssl req -new -key software-key-file.txt -out software-csr-file.txt

# Create local SSL
openssl x509 -req -days 365 -in software-csr.pem -signkey software-key.pem -out software.crt




#03 For Yoogo
openssl genrsa -out private.pem 2048
openssl req -sha256 -new -key private.pem -out public.csr



For *.bravo.services
MELBOURNE
AUSTRALIA

cd /etc/nginx
rm software-key.key ssl_certificate.cer software-csr.csr
cp /srv/KeazAccessV10-Web/api/deploy/ssl_software_2017/nginx/* /etc/nginx
service nginx restart

