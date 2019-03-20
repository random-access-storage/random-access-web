# random-access-web
Chooses the fastest random access backend based on the user's browser

```shell
npm install --save random-access-web
```

```js
const RAW = require('random-access-web')

const storage = RAW('dats')

const dat = new DatJs({
  db: storage
})
```
