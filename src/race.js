import abortable from "./abortable";

export default (...operations) => (resolve, reject, payload) => {
  let items = operations.filter(
    (operation) => typeof operation === "function"
  ).map(
    (operation) => abortable(operation, payload)
  );

  for(let item of items) {
    item[0].then((payload) => {
      items = items.filter(
        (element) => element !== item
      );

      resolve(payload);

      abort();
    }).catch((error) => {
      if(aborted)
        return;

      items = items.filter(
        (element) => element !== item
      );

      abort(error);
    });
  }

  let aborted = false;
  const abort = (error) => {
    if(aborted)
      return;

    aborted = true;

    reject(error);

    for(let item of items) {
      if(item[1] !== undefined)
        item[1]();
    }

    items = undefined;
  };

  return () => abort();
};