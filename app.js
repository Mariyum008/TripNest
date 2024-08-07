const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../project-1/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

app.use(express.urlencoded({extended : true}))
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const  MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
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

const validateListing = (req,res,next) => {
    let { error } = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) =>  el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};
app.get("/" , (req, res) => {
    res.send("working")
})
app.get("/listings" , wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs" , {allListing})
})
);
// show route
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
})
// create route
app.post("/listings",validateListing,  wrapAsync (async (req,res , next)=>{

    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
    })
);
// edit route

app.get("/listings/:id",  wrapAsync(async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs" , {listing});
})
);

app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    // console.log(listing)
    res.render("listings/edit.ejs",{listing});
})
);

app.put("/listings/:id" ,validateListing,  wrapAsync(async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect("/listings");
})
);
app.delete("/listings/:id", wrapAsync( async(req,res)=> {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
})
);

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
})
