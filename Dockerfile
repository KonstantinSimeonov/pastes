FROM node:16

WORKDIR /test

RUN echo hello >> /test/msg
