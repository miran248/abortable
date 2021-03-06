# abortable
Provides abortable asynchronous primitives, based on promises, such as `all`, `interval`, `race`, `sequence` and `timeout`.

## Installation
using yarn
```
yarn add @miran248/abortable
```
using npm
```
npm i @miran248/abortable
```

## Usage
### abortable
```javascript
import abortable from "@miran248/abortable";

const [ promise, abort ] = abortable((resolve, reject, payload) => {
  // do something
  resolve(payload);

  return () => {
    // cleanup
  };
}, "data");

promise.then(console.log) // returns "data"
.catch(console.error);

// abort();
```

### all
```javascript
import abortable, { all } from "@miran248/abortable";

const [ promise, abort ] = abortable(all(
  (resolve, reject, payload) => {
    // do something
    resolve("a");

    return () => {
      // cleanup
    };
  },
  (resolve, reject, payload) => {
    // do something
    resolve("b");

    return () => {
      // cleanup
    };
  },
  (resolve, reject, payload) => {
    // do something
    resolve("c");

    return () => {
      // cleanup
    };
  }
), "data");

promise.then(console.log) // returns [ "a", "b", "c" ]
.catch(console.error);

// abort();
```

### conditional
```javascript
import abortable, { conditional } from "@miran248/abortable";

const [ promise, abort ] = abortable(conditional(
  (resolve, reject, payload) => {
    resolve(payload < 3);
  },
  (resolve, reject, payload) => {
    resolve(payload + 1);
  },
), 0);

promise.then(console.log) // returns [ true, 1 ]
.catch(console.error);

// abort();
```

### race
```javascript
import abortable, { race, sequence, timeout } from "@miran248/abortable";

const [ promise, abort ] = abortable(race(
  sequence(
    timeout(100),
    (resolve, reject, payload) => {
    // do something
    resolve("a");

    return () => {
      // cleanup
    };
  }),
  sequence(
    timeout(50),
    (resolve, reject, payload) => {
    // do something
    resolve("b");

    return () => {
      // cleanup
    };
  }),
  sequence(
    timeout(150),
    (resolve, reject, payload) => {
    // do something
    resolve("c");

    return () => {
      // cleanup
    };
  })
), "data");

promise.then(console.log) // returns "b", aborts others
.catch(console.error);

// abort();
```

### repeat
```javascript
import abortable, { repeat } from "@miran248/abortable";

const [ promise, abort ] = abortable(repeat(
  (resolve, reject, payload) => {
    resolve(payload < 3);
  },
  (resolve, reject, payload) => {
    resolve(payload + 1);
  },
), 0);

promise.then(console.log) // returns 3
.catch(console.error);

// abort();
```

### sequence
```javascript
import abortable, { sequence } from "@miran248/abortable";

const [ promise, abort ] = abortable(sequence(
  (resolve, reject, payload) => {
    // do something
    resolve(payload + 1);

    return () => {
      // cleanup
    };
  },
  (resolve, reject, payload) => {
    // do something
    resolve(payload + 1);

    return () => {
      // cleanup
    };
  },
  (resolve, reject, payload) => {
    // do something
    resolve(payload + 1);

    return () => {
      // cleanup
    };
  }
), 0);

promise.then(console.log) // returns 3
.catch(console.error);

// abort();
```

### timeout
```javascript
import abortable, { sequence, timeout } from "@miran248/abortable";

const [ promise, abort ] = abortable(sequence(
  timeout(1000),
  (resolve, reject, payload) => {
    // do something
    resolve(payload);

    return () => {
      // cleanup
    };
  }
), "data");

promise.then(console.log) // returns "data"
.catch(console.error);

// abort();
```

## License
abortable is licensed under the [MIT license.](https://github.com/miran248/abortable/blob/master/LICENSE)