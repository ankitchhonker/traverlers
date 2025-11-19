const Listings = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index = async (req, res) => {
    const alllistings = await Listings.find({});
    res.render("listing/index", { alllistings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listing/new");
}

module.exports.CreateListing=async (req, res, next) => {

    // let response = await geocodingClient
    // .forwardGeocode({
    //     query: `${req.body.listing.location},${req.body.listing.country}`,
    //     limit: 1,
    // })
    // .send();
     
    const { title, description, price, location, country, category } = req.body.listing;

  const lat = parseFloat(req.body.listing.geometry.lat);
  const lng = parseFloat(req.body.listing.geometry.lng);

  const newListing = new Listings({
    title,
    description,
    price,
    location,
    country,
    category,
    image: {
      url: req.file.path,
      filename: req.file.filename
    },
    geometry: {
      type: "Point",
      coordinates: [lng, lat] // GeoJSON format [lng, lat]
    },
    owner: req.user._id
  });

  await newListing.save();
    // newlisting.geometry = response.body.features[0].geometry;
    // console.log(response.body.features[0].geometry);
    req.flash("success", "Your listing has been added");
    res.redirect("/listings");
}
module.exports.showListing=async (req, res) => {
    const { id } = req.params;
    const listing = await Listings.findById(id).populate({path:"reviews",populate:{
   path:"author"
    }}).populate("owner");
    res.render("listing/show", { listing });
}

module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
   
    const listing = await Listings.findById(id);
    res.render("listing/edit", { listing });
}

// module.exports.UpdateListing = async (req, res) => {
//     const { id } = req.params;
//     console.log(req.body.listing);
//     const updateListing = await Listings.findByIdAndUpdate(id, { ...req.body.listing });
//     if (req.file) {
//         const url = req.file.path;
//         const filename = req.file.filename;
//         updateListing.image = {url,filename};

//         await updateListing.save();
//     }   
//     req.flash("success", "Edit Finished");
//     res.redirect("/listings");
// }

module.exports.UpdateListing = async (req, res) => {
  const { id } = req.params;

  const { title, description, price, location, country, category } = req.body.listing;
  const lat = parseFloat(req.body.listing.geometry?.lat);
  const lng = parseFloat(req.body.listing.geometry?.lng);

  const updateData = {
    title,
    description,
    price,
    location,
    country,
    category,
  };

  // If geometry is provided, update it too
  if (!isNaN(lat) && !isNaN(lng)) {
    updateData.geometry = {
      type: "Point",
      coordinates: [lng, lat],
    };
  }

  const updateListing = await Listings.findByIdAndUpdate(id, updateData, { new: true });

  // Handle new image if uploaded
  if (req.file) {
    updateListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await updateListing.save();
  }

  req.flash("success", "Edit Finished");
  res.redirect(`/listings/${id}`);
};

module.exports.DeleteListing =async (req, res) => {
    const { id } = req.params;
    await Listings.findByIdAndDelete(id);
    req.flash("success", "Your listing has been deleted!");
    res.redirect("/listings");
} 