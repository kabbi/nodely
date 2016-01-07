FROM mhart/alpine-node:5

RUN apk add --update make gcc g++ python

COPY . .

RUN npm install --production

# It seems we may need those packages in runtime
# RUN apk del make gcc g++ python && \
#   rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

EXPOSE 3000
CMD ["node", "index.js", "agent"]
