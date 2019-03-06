#!/usr/bin/env bash
openssl genrsa -out private.key 2048
openssl req -sha256 -new -key private.key -out sharing.csr