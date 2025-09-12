const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/bookController");

// Halaman form tambah
router.get("/add", ctrl.showAddForm);

// Create (POST)
router.post("/", ctrl.create);

// Edit form
router.get("/:id/edit", ctrl.showEditForm);

// Update (PUT via method-override)
router.put("/:id", ctrl.update);

// Delete (DELETE)
router.delete("/:id", ctrl.remove);

// Detail Buku
router.get("/:id", ctrl.getById);

module.exports = router;
