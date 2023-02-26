const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees)
    return res.status(204).json({ message: "No employees found" });
  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  if (
    !req?.body?.username ||
    !req?.body?.firstname ||
    !req?.body?.lastname ||
    !req?.body?.position ||
    !req?.body?.email ||
    !req?.body?.age
  ) {
    return res.status(400).json({
      message:
        "Username, Firstname, Lastname, Email, Position and Age are required.",
    });
  }
  try {
    const result = await Employee.create({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      position: req.body.position,
      email: req.body.email,
      age: req.body.age,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}` });
  }
  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;
  if (req.body?.email) employee.email = req.body.email;
  if (req.body?.position) employee.position = req.body.position;
  if (req.body?.age) employee.age = req.body.age;

  const result = await employee.save();

  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "Employee ID required" });

  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}` });
  }
  const result = await employee.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Employee ID required" });

  const employee = await Employee.findOne({ _id: req.params.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.params.id}` });
  }
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
