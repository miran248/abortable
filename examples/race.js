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