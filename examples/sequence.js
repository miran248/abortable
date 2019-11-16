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