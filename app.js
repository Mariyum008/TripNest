const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const multer = require("multer");
const upload = multer({dest: 'uploads/'});
if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}
console.log(process.env.SECRET);
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");

app.use(express.urlencoded({extended : true}));

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const  MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const sessionOptions = {
    secret : "mysupersecretcode",
    resave: false,
    saveUnitialized: true,
    cookie: {
        expires : Date.now() + 1000 * 60 * 60 *24* 7,
        maxAge: 1000 * 60 * 60 *24*7,
        httpOnly: true,
    }
};

main()
.then(()=>{
    console.log("connect to DB");
})
.catch((err) => {
    console.log(err)
})
async function main() {
    await mongoose.connect(MONGO_URL);
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
});
// app.get("/demouser" , async(req,res) => {
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });

//     let registeredUser = await User.register(fakeUser , "helloworld");
//     res.send(registeredUser);
// })

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);


app.all("*" , (req,res,next) => {
    next(new ExpressError(404, "Page Not Found"));
})
app.use((err,req,res,next) => {
    let {statusCode=500, message = "something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs" , {message});
    // res.send("something went wrong");
})
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
