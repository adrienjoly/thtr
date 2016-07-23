# thtr

cool weekend project with olivier desmoulin &amp; jerome gangneux about theatre

# setup

```bash
git clone https://github.com/adrienjoly/thtr.git
cd thtr
npm i
npm start
npm test # (to be run in another terminal)
```

# api endpoints

- `GET /` says hello
- `GET /api/play/:play/act/:act` returns a play's act in JSON format, e.g. [fourberies-acte1](https://github.com/adrienjoly/thtr/blob/master/plays/fourberies/acte1.json)
- `GET /api/play/:play` returns a play's metadata in JSON format (`title` and `characters`, as read from the act 1 of that play)
