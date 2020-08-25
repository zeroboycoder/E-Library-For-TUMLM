require("dotenv").config();
const aws = require("aws-sdk");
const multer = require("multer");
const multers3 = require("multer-s3");

const ebookDatas = require("../model/ebookModel");

// // Configrue the aws s3
const s3 = new aws.S3({
   accessKeyId: process.env.ACCESS_KEY_ID,
   secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

// Storing the data in s3 cloud
const storage = multers3({
   s3: s3,
   bucket: process.env.BUCKET_NAME,
   acl: "public-read",
   contentType: (req, file, cb) => {
      cb(null, file.mimetype);
   },
   key: (req, file, cb) => {
      const fileArr = file.originalname.split("."); // ["example", "pdf"]
      const fileName = fileArr[0]; // filename "example"
      const ext = fileArr[1]; // extension "pdf"

      const dateArr = new Date().toLocaleDateString().split("/"); // [1,1,2021]
      const date = dateArr.join("."); // "1.1.2021"

      cb(null, fileName + "-" + date + "." + ext); //example-1.1.2021.pdf
   },
});

// File filtering
const filter = (req, file, cb) => {
   const vaildFileType = /jpg|png|jpeg|pdf/;
   const mimetype = vaildFileType.test(file.mimetype);
   mimetype ? cb(null, true) : cb(null, false);
};

// Upload the files
const uploadFile = multer({
   storage,
   fileFilter: filter,
}).array("files", 2);

// =======================================================
// Fetch Ebooks (Get all ebooks, searchs ebook by category, search ebooks by input name)
// =======================================================
exports.fetchEbooks = (req, res) => {
   let totalEbooks;
   const ebooksPerPage = 5;
   let page = +req.query._page || 1;
   const searchedCategory = req.params.searched_category;
   /* Search Ebook by input name, /ebooks/search?_q='string' */
   const _q = req.query._q;

   if (searchedCategory) {
      ebookDatas
         .find({ tags: { $in: [searchedCategory] } })
         .countDocuments()
         .then((numberOfEbooks) => {
            totalEbooks = numberOfEbooks;
            return ebookDatas
               .find({ tags: { $in: [searchedCategory] } })
               .sort({ _id: -1 })
               .skip((page - 1) * ebooksPerPage)
               .limit(ebooksPerPage);
         })
         .then((ebooks) => {
            const pagination = {
               hasNextPage: totalEbooks > ebooksPerPage * page,
               hasPreviousPage: page >= 2,
               nextPage: page + 1,
               previousPage: page - 1,
               currentPage: page,
               lastPage: Math.ceil(totalEbooks / ebooksPerPage),
            };
            return res.status(200).json({
               ebook_datas: ebooks,
               pagination,
            });
         })
         .catch((err) => res.staus(400).json({ errMsg: err }));
   }
   if (_q) {
      // Search Ebook By Input Name
      const splitQuery = _q.split("-");
      const query = splitQuery.join(" ");
      let searchedResult = [];
      const pattern = new RegExp(query + "+");
      ebookDatas
         .find()
         .sort({ _id: -1 })
         .then((ebooks) => {
            ebooks.map((ebook) => {
               pattern.test(ebook.bookName.toLowerCase())
                  ? searchedResult.push(ebook)
                  : null;
            });
            return res.status(200).json({ ebook_datas: searchedResult });
         })
         .catch((err) => {
            res.status(400).json({ errMsg: err });
         });
   }
   if (!searchedCategory && !_q) {
      // Get All Ebooks
      ebookDatas
         .find()
         .countDocuments()
         .then((numberOfEbooks) => {
            totalEbooks = numberOfEbooks;
            return ebookDatas
               .find()
               .sort({ _id: -1 })
               .skip((page - 1) * ebooksPerPage)
               .limit(ebooksPerPage);
         })
         .then((ebooks) => {
            const pagination = {
               hasNextPage: totalEbooks > ebooksPerPage * page,
               hasPreviousPage: page >= 2,
               nextPage: page + 1,
               previousPage: page - 1,
               currentPage: page,
               lastPage: Math.ceil(totalEbooks / ebooksPerPage),
            };
            return res.status(200).json({
               ebook_datas: ebooks,
               pagination,
            });
         })
         .catch((err) => res.staus(400).json({ errMsg: err }));
   }
};

// ============
// Add Ebooks
// ============
exports.addEbooks = (req, res) => {
   uploadFile(req, res, (err) => {
      if (err) {
         if (err.code === "NetworkingError") {
            return res.status(400).json({ errMsg: "Network is required." });
         }
         console.log("_error : ", err);
         return res.status(err.statusCode).json({ errMsg: err.message });
      }
      const reqTags = req.body.tags.split(" ");
      const tags = reqTags.map((tag) => tag.toLowerCase());
      const bookName = req.body.bookName;
      const author = req.body.author;
      const releasedYear = req.body.releasedYear;
      const pages = req.body.pages;
      const fileSize = (req.files[1].size / 1000000).toFixed(1);
      const description = req.body.description;
      const filesArr = req.files;
      let fileLocation = [];
      for (let i = 0; i < filesArr.length; i++) {
         fileLocation.push(filesArr[i].location);
      }
      const dataSummary = {
         bookName,
         author,
         tags,
         releasedYear,
         pages,
         fileSize,
         description,
         bookCoverLocation: fileLocation[0],
         pdfLocation: fileLocation[1],
      };
      new ebookDatas(dataSummary)
         .save()
         .then((ebookData) => {
            return res.status(200).json({ data: ebookData });
         })
         .catch((err) => {
            console.log("err");
            return res
               .status(500)
               .json({ msg: "Can't add data to DB", errMsg: err });
         });
   });
};

// ===================
// Get Detail Of Ebook
// ===================
exports.getDetailOfEbook = (req, res) => {
   const book_id = req.params.book_id;
   ebookDatas
      .findById(book_id)
      .then((ebook) => {
         return res.status(200).json({ ebook: ebook });
      })
      .catch((err) => {
         console.log(err);
         return res.status(404).json({ errMsg: "We can't find this book" });
      });
};
