import abortable from "./abortable";

export default (...operations) => (resolve, reject, payload) => {
  let abort = undefined;

  operations.filter(
    (operation) => typeof operation === "function"
  ).reverse().reduce(
    (next, operation) => (payload) => {
      let promise = undefined;

      [ promise, abort ] = abortable(operation, payload);

      promise.then(next).catch(reject);
    },
    resolve
  )(payload);

  let aborted = false;
  return () => {
    if(aborted)
      return;

    aborted = true;

    reject();

    if(abort !== undefined)
        abort();
  };
};