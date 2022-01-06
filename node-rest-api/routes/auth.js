const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGİSTER
router.post("/register", (req, res) => {
  try {
    const salt = bcrypt.genSalt(10);

    bcrypt.hash(req.body.password, 10, (error, result) => {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: result,
        desc:req.body.desc,
        city:req.body.city,
        from:req.body.from,
        relationship:req.body.relationship
      });

      const user = newUser.save();
      res.status(200).json(newUser);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGİN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
      console.log(user.password);
      console.log(req.body.password)
    const pass = await bcrypt
      .compare(req.body.password, user.password)
      .then((bool) => {
        if (bool) {
          res.status(200).json(user);
        } else {
          res.status(404).json("Şifre hatalı");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    res.status(404).json("User not found");
  }
});

module.exports = router;
