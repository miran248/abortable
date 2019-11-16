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