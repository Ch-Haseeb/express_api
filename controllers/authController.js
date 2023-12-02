const User = require("../models/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { validateSignup,validateLogin } = require("../validations/userValidation");

exports.signup = [
  validateSignup,
  async (req, res) => {
    try {
      const { username, password, email } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ error: "Error registering user" + err.message });
    }
  },
];

exports.login = [
    validateLogin,
    async (req,res) => {
        try{
            const { email,password}=req.body;
            const user = await User.findOne({email})
            if(!user){
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            const passwordMatch = await bcrypt.compare(password,user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid email or password' });
              }
              const token = jwt.sign({userid: user._id},process.env.SECRET_KEY,{
                expiresIn: '1h',
              })
              const userData = {
                _id: user._id,
                username: user.username,
                email: user.email,
              };
              res.json({ token,userData});


        }
        catch (err) {
            res.status(500).json({ error: "Error login user" + err.message });
        }

    }
];

exports.logout = (req,res)=>{
  res.status(200).json({message:'Logout successfully'})
}
