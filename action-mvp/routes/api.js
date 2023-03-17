const express = require('express');
const router = express.Router();
// --------------------

// ---------------------
router.get("/cartas", (req, res)=>{
    res.json({
        ok:true,
        msg: "Esto funciona bien!! Jhomar",
    });
});

// router.post("/users")


module.exports = router;