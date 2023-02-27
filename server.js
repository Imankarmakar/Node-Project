const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const cookieParser=require("cookie-parser")

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser())

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));

const adminRoute = require('./routes/admin.routes')
app.use(adminRoute)


const dbDriver =
'mongodb+srv://imanbcet2016:iman1993@cluster0.ux0joih.mongodb.net/project'

 const jwtAdmin=require("./middleware/authJwt")
  app.use(jwtAdmin.authJwt)
  
const adminRouter = require("./routes/admin.routes");
app.use("/admin", adminRouter);

const port = process.env.PORT || 2023;

mongoose
  .connect(dbDriver, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    app.listen(port, () => {
      console.log(`Db is connected`);
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
