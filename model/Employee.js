const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Employee", employeeSchema);
