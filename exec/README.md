# infra

version:
Docker version 27.5.1
mysql : 8.0.22
mongo: 8.0.4

# backend

version:

JVM21
JDK21 : Amazon Corretto 21.0.5 - aarch64
springboot : 3.4.1
gradle : 8.11.1
intellij : 2023.3.1

```sh
git clone https://lab.ssafy.com/s12-webmobile1-sub1/S12P11C107.git
```

/backend/jippy/src/main/resources에 application.properties 복사

```sh
cd ./backend/jippy
```

```sh
chmod +x ./gradlew
```

```sh
./gradlew clean build -x test
```

```sh
java -jar build/libs/jippy-0.0.1-SNAPSHOT.jar
```

# frontend

node : 22.13.1
vscode : 1.97.2

## Next.js:

Next.js: 14.2.23
redux : 9.2.0
tailwindcss : 3.4.1
typescript : 5.0.0

```sh
git clone https://lab.ssafy.com/s12-webmobile1-sub1/S12P11C107.git
```

/frontend/jippy 경로에 next-env를 복사해서 .env로 이름 변경

```sh
cd ./frontend/jippy
```

```sh
chmod +x .env
```

```sh
npm install
```

```sh
npm run build
```

```sh
npm run start
```

## Svelte:

svelte : 5.0.0
svelte-kit : 2.16.0
vite : 6.0.0
tailwindcss : 4.0.1
typescript : 5.0.0

```sh
git clone https://lab.ssafy.com/s12-webmobile1-sub1/S12P11C107.git
```

/frontend/jippy 경로에 svelte-env를 복사해서 .env로 이름 변경

```sh
cd ./frontend/jippy-sveltekit
```

```sh
chmod +x .env
```

```sh
npm install
```

```sh
npm run build
```

```sh
npm run preview -- --host 0.0.0.0 --port 3000
```

# python:

python:3.11
torch 2.6.0
scikit-learn 1.6.1
pandas 2.2.3

## feedbackmodel:

```sh
docker build -t feedbackmodel:latest .
```

```sh
docker run -d --name feedbackmodel_api --env-file .env -p 8000:8000 feedbackmodel:latest
```

## stockmodel:

```sh
docker build -t feedbackmodel:latest .
```

```sh
docker run -d --name feedbackmodel_api --env-file .env -p 8000:8000 feedbackmodel:latest
```
