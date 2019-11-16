import abortable, { sequence, timeout } from "../src";

test("check inputs and outputs", async() => {
  const fn = jest.fn();
  fn.mockImplementation((resolve, reject, payload) => {
    resolve(payload + 1);
  });
  const resolveFn = jest.fn();
  const rejectFn = jest.fn();

  const [ promise, abort ] = abortable(sequence(timeout(100), fn), 0);
  const awaiter = promise.then(resolveFn).catch(rejectFn);
  setTimeout(abort, 150);

  await awaiter;

  expect(fn.mock.calls.length).toBe(1);
  expect(fn.mock.calls[0].length).toBe(3);
  expect(fn.mock.calls[0][0]).toEqual(expect.any(Function));
  expect(fn.mock.calls[0][1]).toEqual(expect.any(Function));
  expect(fn.mock.calls[0][2]).toBe(0);
  expect(resolveFn.mock.calls.length).toBe(1);
  expect(rejectFn.mock.calls.length).toBe(0);
  expect(resolveFn.mock.calls[0][0]).toBe(1);
});
test("no arguments -> should return function", async() => {
  expect(() => timeout()).toEqual(expect.any(Function));
});