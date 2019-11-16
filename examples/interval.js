import abortable, { interval } from "@miran248/abortable";

const [ promise, abort ] = abortable(interval((resolve, reject, payload) => {
  // do something
  resolve(payload);

  return () => {
    // cleanup
  };
}, 1000), "data");

promise.then(console.log) // will never resolve
.catch(console.error);

abort(); // must be aborted at some point