exports.promisify = (method, args, context) => {
  return new Promise((resolve, reject) => {
    const argsWithCallback = args.slice();
    argsWithCallback.push((error, result) => (
      error ? reject(error) : resolve(result)
    ));
    method.call(context || this, argsWithCallback);
  });
};
