export default (operation, payload) => {
  let resolve = undefined;
  let reject = undefined;

  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  let abort = undefined;

  if(typeof operation === "function")
    abort = operation(resolve, reject, payload);
  else
    resolve(payload);

  let aborted = false;
  return [
    promise,
    () => {
      if(aborted)
        return;

      aborted = true;

      reject();

      if(abort !== undefined)
        abort();
    },
  ];
};