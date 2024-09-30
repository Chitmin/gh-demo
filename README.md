## Run with docker

- build image `docker build . -t IMAGE_NAME`
- run container `docker run -d --name CONTAINER_NAME -p 3000:3000 IMAGE_NAME`
- verify with `docker ps`
- stop `docker stop CONTAINER_NAME`
- remove container `docker container rm CONTAINER_NAME`
- remove image `docker rmi IMAGE_NAME`
