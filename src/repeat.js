import abortable from "./abortable";
import conditional from "./conditional";

export default (predicate, operation) => (resolve, reject, payload) => {
  let abort = undefined;

  const loop = (payload) => {
    let promise = undefined;
    [ promise, abort ] = abortable(conditional(predicate, operation), payload);
    promise.then(([ proceed, response ]) => {
      if(proceed)
        loop(response);
      else
        resolve(response);
    }).catch(reject);
  };

  loop(payload);

  return () => abort();
};