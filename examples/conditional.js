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