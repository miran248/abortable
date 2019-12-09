import abortable from "./abortable";

export default (predicate, operation) => (resolve, reject, payload) => {
  if(typeof predicate !== "function") {
    reject("predicate must be a function");

    return;
  }
  if(typeof operation !== "function") {
    resolve([ false, payload ]);

    return;
  }

  let promise = undefined;
  let abort = undefined;

  [ promise, abort ] = abortable(predicate, payload);
  promise.then((proceed) => {
    if(proceed) {
      let promise = undefined;
      [ promise, abort ] = abortable(operation, payload);
      return promise.then((response) => [ true, response ]);
    } else
      return [ false, payload ];
  }).then(resolve).catch(reject);

  return () => abort();
};