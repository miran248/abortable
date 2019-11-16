import abortable from "../src";

test("check inputs and outputs", async() => {
  const returnFn = jest.fn();
  const fn = jest.fn();
  fn.mockReturnValue(returnFn);
  const resolveFn = jest.fn();
  const rejectFn = jest.fn();

  const response = abortable(fn, "yay");

  expect(response.length).toBe(2);
  expect(response[0]).toEqual(expect.any(Promise));
  expect(response[1]).toEqual(expect.any(Function));

  const [ promise, abort ] = response;
  const awaiter = promise.then(resolveFn).catch(rejectFn);
  abort();

  await awaiter;

  expect(returnFn.mock.calls.length).toBe(1);
  expect(fn.mock.calls.length).toBe(1);
  expect(fn.mock.calls[0].length).toBe(3);
  expect(fn.mock.calls[0][0]).toEqual(expect.any(Function));
  expect(fn.mock.calls[0][1]).toEqual(expect.any(Function));
  expect(fn.mock.calls[0][2]).toBe("yay");
  expect(resolveFn.mock.calls.length).toBe(0);
  expect(rejectFn.mock.calls.length).toBe(1);
});
test("no arguments -> should throw", async() => {
  expect(() => abortable()).toThrow();
});
test("payload -> resolve with payload -> abort -> should resolve with payload", async() => {
  const resolveFn = jest.fn();
  const rejectFn = jest.fn();

  const [ promise, abort ] = abortable((resolve, reject, payload) => {
    resolve(payload);
  }, "yay");
  const awaiter = promise.then(resolveFn).catch(rejectFn);
  abort();

  await awaiter;

  expect(resolveFn.mock.calls.length).toBe(1);
  expect(rejectFn.mock.calls.length).toBe(0);
  expect(resolveFn.mock.calls[0][0]).toBe("yay");
});
test("0ms, resolve -> abort -> should reject", async() => {
  const resolveFn = jest.fn();
  const rejectFn = jest.fn();

  const [ promise, abort ] = abortable((resolve, reject) => {
    setTimeout(resolve, 0);
  }, "yay");
  const awaiter = promise.then(resolveFn).catch(rejectFn);
  abort();

  await awaiter;

  expect(resolveFn.mock.calls.length).toBe(0);
  expect(rejectFn.mock.calls.length).toBe(1);
});
test("payload -> reject with payload -> abort -> should reject with payload", async() => {
  const resolveFn = jest.fn();
  const rejectFn = jest.fn();

  const [ promise, abort ] = abortable((resolve, reject, payload) => {
    reject(payload);
  }, "yay");
  const awaiter = promise.then(resolveFn).catch(rejectFn);
  abort();

  await awaiter;

  expect(resolveFn.mock.calls.length).toBe(0);
  expect(rejectFn.mock.calls.length).toBe(1);
  expect(rejectFn.mock.calls[0][0]).toBe("yay");
});