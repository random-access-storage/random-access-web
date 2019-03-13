# random-access-web
Chooses the fastest random access backend based on the user's browser

```shell
npm install --save random-access-web
```

```js
const RandomAccessWeb = require('random-access-web')

const storage = await RandomAccessWeb.init()

const dat = new DatJs({
  db: storage
})
```
