# Use the official PHP image with Apache
FROM php:7.4-apache

# Enable required Apache modules
RUN a2enmod rewrite

# Install Node.js and npm
ENV NODE_VERSION 14.18.2

RUN ARCH= && dpkgArch="$(dpkg --print-architecture)" \
  && case "${dpkgArch##*-}" in \
    amd64) ARCH='x64';; \
    ppc64el) ARCH='ppc64le';; \
    s390x) ARCH='s390x';; \
    arm64) ARCH='arm64';; \
    armhf) ARCH='armv7l';; \
    i386) ARCH='x86';; \
    *) echo "unsupported architecture"; exit 1 ;; \
  esac \
  && curl -fsSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-$ARCH.tar.xz" \
  && tar -xJf "node-v$NODE_VERSION-linux-$ARCH.tar.xz" -C /usr/local --strip-components=1 --no-same-owner \
  && rm "node-v$NODE_VERSION-linux-$ARCH.tar.xz" \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs \
  # smoke tests
  && node --version \
  && npm --version

# Set working directory
WORKDIR /var/www/html

# Copy project files to the working directory
COPY . /var/www/html

# Install Node.js dependencies
RUN cd /var/www/html && npm install

# Expose ports for Apache and WebSocket
EXPOSE 80
EXPOSE 3000

# Start Apache and WebSocket server
CMD node server.js & apache2-foreground
