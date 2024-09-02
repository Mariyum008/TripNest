const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const{isLoggedIn, isOwner ,validateListing} = require("../middleware.js");
const listingsController = require("../controllers/listings.js");
const multer = require("multer");
const userController = require("../controllers/users.js");

const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
router.route("/")
    .get(wrapAsync(listingsController.index))
    .post(isLoggedIn, upload.single('listing[image]')  ,wrapAsync(listingsController.createListing)
    );

// new route
router.get("/new",isLoggedIn , listingsController.renderNewForm);

// show route
router
    .route("/:id")
    .get(wrapAsync(listingsController.showListing))
    .put(isLoggedIn, isOwner,  upload.single('listing[image]') ,  validateListing, wrapAsync(listingsController.updateListing))
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

