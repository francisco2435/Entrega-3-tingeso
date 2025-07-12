FROM openjdk:17
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} demo.jar
EXPOSE 8090
ENTRYPOINT ["java", "-jar", "./demo.jar"]


