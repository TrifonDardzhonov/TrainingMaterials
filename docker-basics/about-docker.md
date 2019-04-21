# DOCKER

``` 
docker run -it --name custom-name -p 3000:3000 -v $(pwd):/app node bash
```

**-it** -> interactive mode

**--name custom-name** -> set container name to "custom-name"

**-p 3000:3000** -> map port 3000 inside the container to local port 3000

**-v $(pwd):/app** -> map current local folder to folder app in the container < $(pwd) return the current folder path >
 
**node** -> the image

**bash** -> the command which will be executed. In this case "open bash"

```
docker ps
```

display the currently running containers

```
docker stop containerID/containerName
```

stop the container with the following containerID or containerName

```
docker rm containerID/containerName
```

remove the container with the following containerID or containerName


Helpful links:

[What Is Docker? How Does It Work?](https://devopscube.com/what-is-docker/)

[What’s the Diff: VMs vs Containers](https://www.backblaze.com/blog/vm-vs-containers/)

# DOCKER COMPOSE

example:

```
version: "3.3"
services:
  app-api:
    container_name: app_api
    image: node:9
    volumes:
      - ./:/app
    working_dir: /app
    ports:
      - 3000:3000
    command: bash -c "npm run tsc && node build/app.js"
    depends_on:
      - db_postgres
    networks: 
      - app-net

  db_postgres:
    container_name: db_postgres
    image: "postgres:latest"
    volumes:
      - "./database:/var/lib/postgresql/data"
    restart: 'always'
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: "app_db"
      POSTGRES_PASSWORD: "password"
      POSTGRES_USER: "app_god"
    networks:
     - app-net

networks:
  app-net:

```

In the **services** section you can describe each service in the app. In the example above there are two services: **app-api** and **db_postgres**. 

You can config each service with the following options:

* **container_name** -> with that name you can invoke this service in other services. For example if you want to use **db_postgres** in **app-api** you can just write **db_postgres:5432**

* **image** -> the docker image which will be used for the service container

* **volumes** -> if you want persistence, you need to use volumes. Without them every change inside the container will be lost when you stop it. With the volumes you can set mapping between files in the container and your local files. For example you do that 
```     
    volumes:
      - ./:/app
```
to make visible the content from the current folder inside the container. It means -> "I want to map the **current local folder** to **folder named app in the container**". Or that
```
    volumes:
      - ./database:/var/lib/postgresql/data
```
because you want to persist the database changes. It means -> "I want to keep the **database files (/var/lib/postgresql/data) inside the container** in the **local (database) folder**".

* **restart** -> with this option you can choose what actions you want to take when something bad happen with the container, for example if the container goes down. With **restart: always** you wanna say -> "If something bad happen, please restart the container automatically".

* **ports** -> port mappings. If you don't do that, you won't have access outside the container. Lets imagine that you wanna create **API** with **node.js + express.js** and you use **port 3000** for that, you need to map that port to some external (from the container point of view) port.

* **environment** -> Let's say that you have code which you want to distribute to some other developers, or to use it in other projects as well. Or to have control over overwriting some main global variables. For example here:
```
    environment:
      POSTGRES_DB: "app_db"
      POSTGRES_PASSWORD: "password"
      POSTGRES_USER: "app_god"
```
you have to pass **the database name**, **the password** and **the DB user** to the container. And then you will be able to connect to this database with these configs inside your code. 

Also you can always use that option for overwriting. Let's imagine that you wanna turn some functionality **ON/OFF** from outside the code. You can set it to **OFF by default (in .env for example)**, and if you wanna **turn it on**, the only things you should do are 

1. run "docker-compose down" to down the containers
2. set that variable to ON in the docker-compose file
3. run "docker-compose up" to up the containers

* **depends_on** -> chaining the containers start up. For example you may want to start the containers in a particular order. So you can set that **container1 depends_on container2** and that will mean that **container1** will start only when **container2** is up and running. For example:
```
    depends_on:
        - db_postgres
```
inside the API config means that you wanna start the **API** only when the **database** is up and running.

* **command** -> when the container is running maybe you will want to execute some code in it (like **IIFE**). You can write your commands here and they will be executed automatically. For example that:
```
command: bash -c "npm run tsc && node build/app.js"
```
means -> "Start bash and execute the following ... **npm run tsc** to transpile the Typescript files into JS files. Then execute **node build/app.js** to run the transpiled version of **app.ts**".

* **networks** -> if two or more services wants to communicate internally, they need to be in the same network. You can have more than one network in the docker-compose file.