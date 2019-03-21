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

## Options:

- `name`: The database name to use (if applicable)
- `storeName`: The collection to use for the data (For indexedDB)
- `maxSize`: The maximum size to allocate for Chrome file storage
