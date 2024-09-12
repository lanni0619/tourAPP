// Get rid of try-catch block
// use a anonymous function to wrap async function

module.exports = (fn) => {
  // 2) return a async function - give fn (req, res, next) to use
  return (req, res, next) => {
    // 1) catch error here so we can get rid of try-catch block
    // (err) => next(err) simplify to next
    fn(req, res, next).catch(next);
  };
};
