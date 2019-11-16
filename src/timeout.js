export default (ms = 0) => (resolve, reject, payload) => {
  const timeoutId = setTimeout(() => resolve(payload), ms);

  return () => clearTimeout(timeoutId);
};