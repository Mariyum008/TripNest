const Listing = require("../models/listing.js");
module.exports.index = (async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs" , {allListing})
})

module.exports.renderNewForm = (req,res) => {
    // console.log(req.user);
    res.render("listings/new.ejs");
}

module.exports.showListing = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
        path: "author",
        },
      })
    .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings"); // Use return to stop further execution
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
});

module.exports.createListing =  (async (req,res , next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url , ".." , filename);

    const newlisting = new Listing(req.body.listing);
    // console.log(req.user);
    newlisting.image = {url , filename};
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success" , "New Listing Created!");
    res.redirect("/listings");
    });

module.exports.renderEditForm = (async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings"); // Use return to stop further execution
    }
    // console.log(listing)

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250");
    res.render("listings/edit.ejs",{listing , originalImageUrl});
});

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id , { ...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
    }

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = ( async(req,res)=> {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Listing Deleted.!");
    res.redirect("/listings");
})