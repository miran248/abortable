import abortable from "./abortable";
import timeout from "./timeout";
import sequence from "./sequence";

export default (operation, ms = 0) => (resolve, reject, payload) => {
  let abort = undefined;

  const loop = (payload) => {
    let promise = undefined;

    [ promise, abort ] = abortable(sequence(
      timeout(ms),
      operation
    ), payload);

    promise.then(loop).catch(reject);
  };

  loop(payload);

  return () => abort();
};