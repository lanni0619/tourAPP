let old = { a: 1, b: 2, c: 3, d: 4 };

const filterObj = (reqBodyObj, ...allowedFields) => {
  const newObj = {};
  Object.keys(reqBodyObj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = reqBodyObj[el];
    }
  });
  return newObj;
};

console.log(filterObj(old, 'a', 'b'));
