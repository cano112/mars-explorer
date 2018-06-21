# Mars explorer

App: https://mars-x.herokuapp.com/

Docs: https://cano112.github.io/mars-explorer-docs/

## Build & run

## Build
```
mvn clean install
```

## Environment variables
`DB_USERNAME`, `DB_PASSWORD`, `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`, `NASA_API_KEY`

## Run

### Dev
```
java -Dspring.profiles.active=dev -jar me-backend/target/me-backend-1.0.SNAPSHOT.jar
```
### Production
```
java -Dspring.profiles.active=prod -jar me-backend/target/me-backend-1.0.SNAPSHOT.jar
```