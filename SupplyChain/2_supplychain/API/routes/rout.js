const control = require('../controller/control');
const express = require('express');
const router = express.Router();
router.get('/',control.login);
router.post('/supplier',control.supplier)
router.get('/manufacturer',control.manufacturer);
router.get('/makeorder',control.makeorder)
router.post('/sendorder',control.manufacturer_make_order);
router.get('/supplierorder',control.get_orderlist);
router.post('/orderdetail',control.supplier_getorder);
router.post('/supplierbuild',control.supplier_build_part);
router.get('/getrecepit',control.part_Recepit);
router.post('/payment',control.payment)
router.post('/sell',control.change_ownership);
router.get('/recepitpage',control.recepit_manufacturer);
router.post('/recepit',control.recepit_manufacturer2)
router.get('/current',control.x);
router.post('/inprocess',control.manufacturer_make_product);
module.exports = router;
