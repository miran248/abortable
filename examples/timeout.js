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