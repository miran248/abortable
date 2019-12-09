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