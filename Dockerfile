# get the base node image
FROM node:14.20.0-alpine
ENV NODE_VERSION 14.20.2
# set the working dir for container
WORKDIR /frontend

# copy other project files
COPY ./ui.frontend .

# install npm dependencies
RUN npm install

#Copy adobe model manager library inside node-modle
COPY ./ui.frontend/lib/aem-spa-page-model-manager.js ./ui.frontend/node_modules/@adobe/aem-spa-page-model-manager/dist

#rebase the node-sass  
RUN npm rebuild node-sass

# build the folder
RUN npm run build

#install http server to serve build folder
RUN npm install --global serve

CMD [ "serve", "build/"]
# CMD [ "npm", "start"]


