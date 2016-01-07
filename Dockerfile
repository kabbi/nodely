FROM mhart/alpine-node:5

COPY . .

RUN apk add --update make gcc g++ python

RUN npm install --production

# RUN apk del make gcc g++ python && \
#   rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

EXPOSE 3000
CMD ["node", "index.js", "agent"]
