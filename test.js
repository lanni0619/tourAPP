let old = { a: 1, b: 2 };
let newObj = { ...old };

old = { a: 2 };
// console.log(newObj);
// console.log(old);

const err = {
  status: 'error',
  error: {
    index: 0,
    code: 11000,
    keyPattern: {
      name: 1,
    },
    keyValue: {
      name: 'The Forest Hiker',
    },
    statusCode: 500,
    status: 'error',
  },
  message:
    'E11000 duplicate key error collection: natours.tours index: name_1 dup key: { name: "The Forest Hiker" }',
  stack:
    'MongoServerError: E11000 duplicate key error collection: natours.tours index: name_1 dup key: { name: "The Forest Hiker" }\n    at InsertOneOperation.execute (C:\\Users\\lanni\\Desktop\\tourAPP\\node_modules\\mongodb\\lib\\operations\\insert.js:48:19)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async executeOperationAsync (C:\\Users\\lanni\\Desktop\\tourAPP\\node_modules\\mongodb\\lib\\operations\\execute_operation.js:106:16)',
};

console.log(Object.values(err.error));
