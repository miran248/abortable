import abortable, { interval } from "../src";

test("check inputs and outputs", async() => {
  const fn = jest.fn();
  fn.mockImplementation((resolve, reject, payload) => {
    resolve(payload + 1);
  });
  const resolveFn = jest.fn();
  const rejectFn = jest.fn();

  const [ promise, abort ] = abortable(interval(fn, 100), 0);
  const awaiter = promise.then(resolveFn).catch(rejectFn);
  setTimeout(abort, 350);

  await awaiter;

  expect(fn.mock.calls.length).toBe(3);
  expect(fn.mock.calls[0].length).toBe(3);
  expect(fn.mock.calls[0][0]).toEqual(expect.any(Function));
  expect(fn.mock.calls[0][1]).toEqual(expect.any(Function));
  expect(fn.mock.calls[0][2]).toBe(0);
  expect(fn.mock.calls[1][2]).toBe(1);
  expect(fn.mock.calls[2][2]).toBe(2);
  expect(resolveFn.mock.calls.length).toBe(0);
  expect(rejectFn.mock.calls.length).toBe(1);
});
test("no arguments -> should return function", async() => {
  expect(() => interval()).toEqual(expect.any(Function));
});