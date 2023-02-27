const adminModel = require('../models/admin.model')
const bcrypt = require('bcryptjs')
const jwt=require("jsonwebtoken")
class AdminController {
  constructor() {}

  /**
   * @Method userAuth
   * @Description To check authentic user
   */
  async userAuth(req,res,next){
    try {
      if(req.user){
        next()
      }else{
        res.redirect('/')

      }
    } catch (err) {
      throw err
    }
  }

  /**
   * @Method showIndex
   * @Description To Show The Index Page / Login Page
   */
  async showIndex(req, res) {
    try {
      res.render("admin/index", {
        title: "Admin || Login",
      });
    } catch (err) {
      throw err;
    }
  }
   /**
   * @Method getRegister
   * @Description To show register page
   */

   async getRegister(req,res){
    try{
      res.render("admin/register", {
        title: "Admin || Register",
      });
    }catch(err){
      throw err
    }
   }

    /**
   * @Method register
   * @Description To register student
   */

    async register(req, res) {
      try {
        console.log(req.file);
        req.body.image = req.file.filename;
  
        let isEmailExist = await adminModel.findOne({ email: req.body.email });
        if (!isEmailExist) {
          if (req.body.password === req.body.confirmPassword) {
            req.body.password = bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10)
            );
            let saveData = await adminModel.create(req.body);
            if (saveData && saveData._id) {
              console.log(saveData);
              console.log("Register...");
              res.redirect("/");
            } else {
              console.log("Not registered");
              res.redirect("/getRegister");
            }
          } else {
            console.log("Password and confirm password does not match");
            res.redirect("/getRegister");
          }
        } else {
          console.log("Email already exists");
          res.redirect("/register");
        }
      } catch (error) {
        throw error;
      }
    }

    /**
     * @Method login
     * @Description To login student
     */
    async login(req, res) {
      try {
        let isUserExists = await adminModel.findOne({
          email: req.body.email,
        });
        if (isUserExists) {
          const hashPassword = isUserExists.password;
          if (bcrypt.compareSync(req.body.password, hashPassword)) {
            // token creation
  
            const token= jwt.sign(
              {
                id: isUserExists._id,
                email: isUserExists.email,
                name: `${isUserExists.firstName} ${isUserExists.lastName}`,
                image: isUserExists.image,
              },
              "xE3DS8TY2N",
              { expiresIn: "5m" }
            );
            console.log("Logged In..");
  
            //set your cookie
  
            res.cookie("adminToken", token);
            res.redirect("Admin/dashboard");
          } else {
            console.log("Wrong Password..");
          }
        } else {
          console.log("Email Does not exists");
        }
      } catch (error) {
        throw error;
      }
    }
  

  /**
   * @Method dashboard
   * @Description To Show The Dashboard
   */
  async dashboard(req, res) {
    try {
      res.render("admin/dashboard", {
        title: "Admin || Dashboard" ,
        user: req.user

      })
    } catch (err) {
      throw err;
    }
  }

  /**
   * @Method template
   * @Description Basic Template
   */
   async template(req, res) {
    try {
      res.render("admin/template", {
        title: "Admin || Template"
      })
    } catch (err) {
      throw err;
    }
  }

  async logout(req,res){
    try {
        res.clearCookie('adminToken')
        console.log('Cookie Cleared!')
        res.redirect('/')
      
    } catch (err) {
      throw err
    }
   }

}

module.exports = new AdminController();
