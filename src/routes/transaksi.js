const express = require("express");
const router = express.Router();
const transakasiController = require("../controller/transaksi");
const { protect } = require('../middlewares/auth')



router.get("/",protect, transakasiController.allTransaksi);
router.get("/:id",protect, transakasiController.getTransaksi);
router.post("/",protect, transakasiController.insert);
router.put("/:id",protect, transakasiController.update);
router.delete("/:id",protect, transakasiController.delete);


module.exports = router;