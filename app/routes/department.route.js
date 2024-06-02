
//# router
var router = require("express").Router()
//controller
const department = require("../controllers/department.controller")

// Create a new Tutorial
router.post("/create-department", department.createDepartment);  //create
router.post("/get-all-department", department.getAllDepartment);  //find all departmemt
router.post("department/:id", department.getSingleDepartment);   //find by id
router.post("/delete/:id", department.deleteDepartment);   //delete department
router.post("/update/:id", department.updateDepartment)  //update department


module.exports = router;

