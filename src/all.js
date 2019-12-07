import abortable from "./abortable";

export default (...operations) => (resolve, reject, payload) => {
  let items = operations.filter(
    (operation) => typeof operation === "function"
  ).map(
    (operation) => abortable(operation, payload)
  );
  let n = items.length;
  let response = Array.from(Array(n), () => undefined);

  for(let i in items) {
    let item = items[i];

    item[0].then((payload) => {
      response[i] = payload;

      items = items.filter(
        (element) => element !== item
      );

      if(--n === 0)
        resolve(response);
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