  1. Generate SSL certificate using command:

openssl req -newkey rsa:2048 -x509 -nodes -keyout server.key -new -out server.crt -sha256 -days 365

  2. Store it as: `Trusted Root Certification Authorities
