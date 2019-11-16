export default (operation, payload) => {
  let resolve = undefined;
  let reject = undefined;

  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  const abort = operation(resolve, reject, payload);

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