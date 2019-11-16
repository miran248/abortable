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