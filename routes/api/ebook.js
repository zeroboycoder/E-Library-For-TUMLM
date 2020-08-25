const route = require("express").Router();
const E_Lib_Controller = require("../../controllers/elibcontroller");

// Fetch ebooks api
route.get("/api/ebooks/fetch", E_Lib_Controller.fetchEbooks);

// Search Ebook by category
route.get("/categories/:searched_category", E_Lib_Controller.fetchEbooks);

// Search Ebook by Input Name
route.get("/api/ebooks/searched", E_Lib_Controller.fetchEbooks);

// Get Ebook detail page
route.get("/ebooks/:book_id", E_Lib_Controller.getDetailOfEbook);

// Add ebooks api
route.post("/api/ebooks/add", E_Lib_Controller.addEbooks);

module.exports = route;
