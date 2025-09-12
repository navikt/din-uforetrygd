FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/jre:openjdk-21
COPY ./uforetrygd-backend/target/uforetrygd-backend.jar app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]