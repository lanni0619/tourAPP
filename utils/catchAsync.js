// Get rid of try-catch block
// use a anonymous function to wrap async function

module.exports = (fn) => {
  //  anonymous function
  return (req, res, next) => {
    // async function
    fn(req, res, next).catch(next);
    // (err) => next(err) simplify to next
  };
};
