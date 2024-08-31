const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const{isLoggedIn, isOwner ,validateListing} = require("../middleware.js");
const listingsController = require("../controllers/listings.js");
const multer = require("multer");

const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
router.route("/")
    .get(wrapAsync(listingsController.index))
    // .post(isLoggedIn ,validateListing,  wrapAsync(listingsController.createListing)
    .post(upload.single('listing[image]') , (req,res) => {
        res.send(req.file)
    });

// new route
router.get("/new",isLoggedIn , listingsController.renderNewForm);

// show route
router
    .route("/:id")
    .get(wrapAsync(listingsController.showListing))
    .put(isLoggedIn, isOwner,  validateListing, wrapAsync(listingsController.updateListing))
    .delete(isLoggedIn, 
        wrapAsync(listingsController.destroyListing)
    );

// edit
router.get("/:id/edit",
    isLoggedIn,
    isOwner,  
    wrapAsync(listingsController.renderEditForm)
);


module.exports = router;

