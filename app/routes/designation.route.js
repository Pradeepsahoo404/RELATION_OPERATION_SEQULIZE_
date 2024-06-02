
//# router
var router = require("express").Router()
//controller
const designation = require("../controllers/designation.controlller")

// Create a new Tutorial
router.post("/create-designation", designation.createDesignation);  //create
router.post("/get-all", designation.getAllDesignations);  //find all departmemt
router.post("/designation/:id", designation.getSingleDesignation);   //find by id
router.post("/delete/:id", designation.deleteDesignation);   //delete department
router.post("/update/:id", designation.updateDesignation)  //update department


module.exports = router;

