import abortable, { all } from "../src";

test("check inputs and outputs", async() => {
  const returnFn1 = jest.fn();
  const fn1 = jest.fn();
  fn1.mockReturnValue(returnFn1);
  const returnFn2 = jest.fn();
  const fn2 = jest.fn();
  fn2.mockReturnValue(returnFn2);
  const returnFn3 = jest.fn();
  const fn3 = jest.fn();
  fn3.mockReturnValue(returnFn3);
  const resolveFn = jest.fn();
  const rejectFn = jest.fn();

  const [ promise, abort ] = abortable(all(fn1, fn2, fn3), "yay");
  const awaiter = promise.then(resolveFn).catch(rejectFn);
  abort();

  await awaiter;

  expect(returnFn1.mock.calls.length).toBe(1);
  expect(fn1.mock.calls.length).toBe(1);
  expect(fn1.mock.calls[0].length).toBe(3);
  expect(fn1.mock.calls[0][0]).toEqual(expect.any(Function));
  expect(fn1.mock.calls[0][1]).toEqual(expect.any(Function));
  expect(fn1.mock.calls[0][2]).toBe("yay");
  expect(returnFn2.mock.calls.length).toBe(1);
  expect(fn2.mock.calls.length).toBe(1);
  expect(fn2.mock.calls[0].length).toBe(3);
  expect(fn2.mock.calls[0][0]).toEqual(expect.any(Function));
  expect(fn2.mock.calls[0][1]).toEqual(expect.any(Function));
  expect(fn2.mock.calls[0][2]).toBe("yay");
  expect(returnFn3.mock.calls.length).toBe(1);
  expect(fn3.mock.calls.length).toBe(1);
  expect(fn3.mock.calls[0].length).toBe(3);
  expect(fn3.mock.calls[0][0]).toEqual(expect.any(Function));
  expect(fn3.mock.calls[0][1]).toEqual(expect.any(Function));
  expect(fn3.mock.calls[0][2]).toBe("yay");
  expect(resolveFn.mock.calls.length).toBe(0);
  expect(rejectFn.mock.calls.length).toBe(1);
});
test("no arguments -> should return function", async() => {
  expect(() => all()).toEqual(expect.any(Function));
});
test("resolve -> abort -> should reject", async() => {
  const resolveFn = jest.fn();
  const rejectFn = jest.fn();

  const [ promise, abort ] = abortable(all((resolve, reject, payload) => {
    resolve();
  }, (resolve, reject, payload) => {
    resolve();
  }), "yay");
  const awaiter = promise.then(resolveFn).catch(rejectFn);
  abort();

  await awaiter;

  expect(resolveFn.mock.calls.length).toBe(0);
  expect(rejectFn.mock.calls.length).toBe(1);
});
test("100ms, resolve -> 50ms, resolve -> 200ms, resolve -> 250ms, abort -> should resolve with payload", async() => {
  const resolveFn = jest.fn();
  const rejectFn = jest.fn();

  const [ promise, abort ] = abortable(all(
    (resolve, reject) => {
      setTimeout(() => resolve("a"), 100);
    },
    (resolve, reject) => {
      setTimeout(() => resolve("b"), 50);
    },
    (resolve, reject) => {
      setTimeout(() => resolve("c"), 200);
    }
  ));
  const awaiter = promise.then(resolveFn).catch(rejectFn);

  setTimeout(abort, 250);

  await awaiter;

  expect(resolveFn.mock.calls.length).toBe(1);
  expect(rejectFn.mock.calls.length).toBe(0);
  expect(resolveFn.mock.calls[0][0]).toEqual([ "a", "b", "c" ]);
});