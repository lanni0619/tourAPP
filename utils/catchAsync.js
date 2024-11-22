// Get rid of try-catch block
// use a anonymous function to wrap async function

module.exports = (fn) => {
  // 1) Express pass (req, res, next) to wrapper function automatically
  return (req, res, next) => {
    // 2) Pass (req, res, next) to fn
    fn(req, res, next).catch(next);
  };
};
