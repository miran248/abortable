import abortable, { repeat } from "../src";

test("check inputs and outputs", async() => {
  const predicateFn = jest.fn();
  predicateFn.mockImplementation((resolve, reject, payload) => {
    resolve(payload < 1);
  });
  const fn = jest.fn();
  fn.mockImplementation((resolve, reject, payload) => {
    resolve(payload + 1);
  });
  const resolveFn = jest.fn();
  const rejectFn = jest.fn();

  const [ promise, abort ] = abortable(repeat(predicateFn, fn), 0);
  const awaiter = promise.then(resolveFn).catch(rejectFn);

  await awaiter;

  expect(predicateFn.mock.calls.length).toBe(2);
  expect(predicateFn.mock.calls[0].length).toBe(3);
  expect(predicateFn.mock.calls[0][0]).toEqual(expect.any(Function));
  expect(predicateFn.mock.calls[0][1]).toEqual(expect.any(Function));
  expect(predicateFn.mock.calls[0][2]).toBe(0);
  expect(predicateFn.mock.calls[1].length).toBe(3);
  expect(predicateFn.mock.calls[1][0]).toEqual(expect.any(Function));
  expect(predicateFn.mock.calls[1][1]).toEqual(expect.any(Function));
  expect(predicateFn.mock.calls[1][2]).toBe(1);
  expect(fn.mock.calls.length).toBe(1);
  expect(fn.mock.calls[0].length).toBe(3);
  expect(fn.mock.calls[0][0]).toEqual(expect.any(Function));
  expect(fn.mock.calls[0][1]).toEqual(expect.any(Function));
  expect(fn.mock.calls[0][2]).toBe(0);
  expect(resolveFn.mock.calls.length).toBe(1);
  expect(resolveFn.mock.calls[0][0]).toEqual(1);
  expect(rejectFn.mock.calls.length).toBe(0);
});
test("no arguments -> should reject", async() => {
  const resolveFn = jest.fn();
  const rejectFn = jest.fn();

  const [ promise, abort ] = abortable(repeat(), 0);
  const awaiter = promise.then(resolveFn).catch(rejectFn);

  await awaiter;

  expect(resolveFn.mock.calls.length).toBe(0);
  expect(rejectFn.mock.calls.length).toBe(1);
  expect(rejectFn.mock.calls[0][0]).toEqual("predicate must be a function");
});
test("should handle undefined operations", async() => {
  const predicateFn = jest.fn();
  predicateFn.mockImplementation((resolve, reject, payload) => {
    resolve(payload < 1);
  });
  const resolveFn = jest.fn();
  const rejectFn = jest.fn();

  const [ promise, abort ] = abortable(repeat(predicateFn, undefined), 0);
  const awaiter = promise.then(resolveFn).catch(rejectFn);

  await awaiter;

  expect(resolveFn.mock.calls.length).toBe(1);
  expect(resolveFn.mock.calls[0][0]).toEqual(0);
  expect(rejectFn.mock.calls.length).toBe(0);
});