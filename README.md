<img src='./assets/berealapilogo.png' width='100%'>

# BeReal restAPI (not official)

-   You can read API docs [here](https://berealapi.fly.dev/api) (some routes are not working on swagger but only in it, yes in fetch, axios, postman...)
-   Is done by my [BeReal client](https://github.com/chemokita13/NodeBeFakeClient) (but with some changes)
-   Only I want if you use it, is one star ⭐
-   Contact me for errors or explanation (my email is in my [gh profile](https://github.com/chemokita13)) or also in repo's discussions or iusses

---

## How to use it

-   Just check the [API docs](https://berealapi.fly.dev/api) made by swagger (but dont try to execute the examples, try it in postman or something similar)
-   API url is [https://berealapi.fly.dev](https://berealapi.fly.dev)
-   The API is deployed in [fly.io](https://fly.io) (thanks to them for the free hosting)

---

## Local instalation

-   Download the repo:

```bash
git clone https://github.com/chemokita13/beReal-api
cd beReal-api
```

### Docker

-   Build the image

```bash
docker build -t bereal-api .
```

-   Run it

```bash
docker run -p 3000:3000 bereal-api
```

### Node (without docker)

-   Install packages and build

```bash
npm install
npm run build
```

-   Run it

```bash
npm run start:prod
```

And you will have it deployed in http://localhost:3000

---

---

Thanks for view!
