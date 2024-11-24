const Product = require("./models/product.model");
const User = require("../user/models/user.model");
const { v4: uuidv4 } = require("uuid");
const Image = require("../images/models/images.model");
const {
  S3Client,
  PutObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} = require("@aws-sdk/client-s3");
require("dotenv").config();

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const s3Client = new S3Client({
  region: process.env.AWS_S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const convertToCleanUrl = (input) => {
  const charMap = {
    š: "s",
    đ: "dj",
    č: "c",
    ć: "c",
    ž: "z",
    Š: "s",
    Đ: "dj",
    Č: "c",
    Ć: "c",
    Ž: "z",
  };

  return (
    input
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      // .replace(/[0-9]/g, "") // Remove numbers
      .toLowerCase()
      .replace(/[šđčćžŠĐČĆŽ]/g, (match) => charMap[match] || match)
      .replace(/[^a-z0-9-]/g, "") // Remove any remaining special characters except hyphens and numbers
      .replace(/-+/g, "-")
  );
};

exports.create = async (req, res) => {
  try {
    let data = req.body;
    console.log("data", data);
    // console.log("files", req.files);
    // if (!req.files) {
    //   return res
    //     .status(404)
    //     .json({ message: "Morate staviti sliku za proizvod" });
    // }

    // const fileEntries = Object.entries(req.files);

    // let images = [];

    // let i = 0;
    // for (const [key, file] of fileEntries) {
    //   const filesToUpload = Array.isArray(file) ? file : [file];
    //   for (const fileToUpload of filesToUpload) {
    //     let imageResponse; // Deklaracija izvan try bloka
    //     try {
    //       const imageUrl = await uploadToS3(fileToUpload); // Upload fajla na S3

    //       imageResponse = await new Image({
    //         type: req.headers.type,
    //         localPath: imageUrl.key, // S3 URL
    //         url: imageUrl.Location,
    //         type: "listing",
    //         originalname: imageUrl.key,
    //       }).save();
    //     } catch (error) {
    //       console.log(error);
    //       return res.status(500).json({
    //         message: "Došlo je do greške prilikom uploadovanja slike.",
    //       });
    //     }

    //     if (imageResponse) {
    //       images.push(imageResponse._id); // Dodaj samo ako je imageResponse definisan
    //     }
    //     i++;
    //   }
    // }

    const productsArr = await Product.find();

    const allDataUrls = productsArr.map((product) => product.url);

    // Generate the base URL
    const baseUrl = convertToCleanUrl(`${req.body.title}`);

    let uniqueUrl;
    // Filter existing URLs that start with the same base
    const similarUrls = allDataUrls.filter(
      (url) => url !== undefined && url.startsWith(baseUrl)
    );
    // Extract numbers from the end of similar URLs and sort them in descending order
    const urlNumbers = similarUrls.map((url) => {
      const match = url.match(new RegExp(`${baseUrl}-(\\d+)`));
      return match ? parseInt(match[1]) : 0;
    });
    urlNumbers.sort((a, b) => b - a);
    // Calculate the next unique number
    const nextNumber = urlNumbers.length > 0 ? urlNumbers[0] + 1 : 0;
    // Construct the final unique URL
    uniqueUrl = nextNumber > 0 ? `${baseUrl}-${nextNumber}` : baseUrl;

    const prodArr = await Product.find().sort({ createdAt: -1 }).limit(1);

    let numOfArticle;

    if (prodArr.length <= 0) {
      numOfArticle = "0000000001";
    } else {
      let originalStr = prodArr[0].numOfArticle;
      let num = parseFloat(originalStr, 10);

      num += 1;

      numOfArticle = num.toString().padStart(originalStr.length, "0");
    }

    // let featureimage = JSON.parse(JSON.stringify(images[0]));
    // let allimages = JSON.parse(JSON.stringify(images));

    // allimages.shift();

    // data.featureImage = featureimage;

    // data.images = allimages;

    data.url = uniqueUrl;

    data.numOfArticle = numOfArticle;

    console.log("data.hasSizes", data.hasSizes);
    console.log("data.sizes", data.sizes);

    if (data.hasSizes && data.sizes) {
      console.log("USAOOOO");
      data.sizes = JSON.parse(data.sizes); // Pretpostavlja se da dolazi kao JSON string
    } else {
      if (!data.price) {
        return res.status(400).json({ message: "Niste uneli cenu" });
      }
      data.sizes = []; // Prazan array ako nema veličina
    }

    if (data.format === "prodaja") {
      data.price = data.price;
    }
    // if (!data.category) {
    //   return res.status(400).json({ message: "Niste uneli kategoriju" });
    // }

    const item = await new Product({ ...data }).save();

    return res.status(200).json({ item, message: "Created." } || { item: [] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const uploadToS3 = async (file) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/heic"];
  const maxSizeInBytes = 6 * 1024 * 1024;

  console.log("file", file);

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error("Dozvoljen format je samo JPEG, PNG i HEIC.");
  }
  console.log("Prosao");
  if (file.size > maxSizeInBytes) {
    console.log("VELICINA JE BITNA", file.size);
    throw new Error("Prevelika velicina slike");
  }

  const timeStamp = uuidv4();
  const fileName = `${timeStamp}_${file.name.replace(/\s/g, "")}`;
  const params = {
    Bucket: BUCKET_NAME,
    Key: `listing-images/${fileName}`,
    Body: file.data,
    ContentType: file.mimetype,
  };
  // Proverite da li bucket postoji, ako ne, kreirajte ga
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
  } catch (err) {
    if (err.name === "NotFound") {
      // Bucket ne postoji, kreirajte ga
      await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
      console.log(`Bucket ${BUCKET_NAME} je kreiran.`);
    } else {
      throw err; // Bacite grešku ako se desi neka druga greška
    }
  }

  // Upload fajla
  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    return {
      key: params.Key,
      Location: `https://${BUCKET_NAME}.s3.amazonaws.com/${params.Key}`,
    };
  } catch (err) {
    console.error("Error uploading to S3:", err);
    throw new Error("Error uploading file to S3.");
  }
};
//TODO: TESTIRATI OVO POSLE AKO STOPAK IZABERE
const uploadToServer = async (file) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/heic"];
  const maxSizeInBytes = 6 * 1024 * 1024; // 6 MB

  console.log("file", file);

  // Check for allowed MIME types
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error("Dozvoljen format je samo JPEG, PNG i HEIC.");
  }
  console.log("Prosao");

  // Check for file size
  if (file.size > maxSizeInBytes) {
    console.log("VELICINA JE BITNA", file.size);
    throw new Error("Prevelika velicina slike");
  }

  // Generate a unique file name
  const timeStamp = uuidv4();
  const fileName = `${timeStamp}_${file.name.replace(/\s/g, "")}`;

  // Set the upload path (make sure this directory exists on your server)
  const uploadPath = path.join(__dirname, "uploads", fileName); // 'uploads' is the directory where images will be stored

  // Create the uploads directory if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, "uploads"))) {
    fs.mkdirSync(path.join(__dirname, "uploads"));
  }

  // Save the file to the server
  try {
    fs.writeFileSync(uploadPath, file.data);
    return {
      key: fileName,
      location: `${process.env.BASE_URL}/uploads/${fileName}`, // Change to your domain
    };
  } catch (err) {
    console.error("Error uploading file to server:", err);
    throw new Error("Error uploading file to server.");
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id; // Assuming the product ID is passed as a URL parameter
    const updateData = req.body; // Assuming the update data is sent in the request body
    // Provera da li proizvod ima veličine
    if (updateData.hasSizes && updateData.sizes) {
      updateData.sizes = updateData.sizes; // Pretpostavlja se da dolazi kao JSON string
      // Uklanjanje polja price ako proizvod ima veličine, jer se cena čuva u `sizes`
      delete updateData.price;
    } else {
      // Ako nema veličine, osiguravamo da je cena uključena
      if (!updateData.price) {
        return res.status(400).json({ message: "Niste uneli cenu" });
      }
      updateData.sizes = []; // Postavlja prazan array za `sizes` ako nema veličina
    }
    // Find the product by its ID and update it with the provided data
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const pageNumber = req.query.pageNumber || 1;
    const filter = req.query.filter || null;
    const searchTerm = req.query.searchTerm || null;
    const matchQuery = { status: "Available", format: "prodaja" };

    console.log(req.query);
    if (!pageNumber || !limit) {
      return res.status(400).json({ message: "Los zahtev u disciplini" });
    }
    if (searchTerm && searchTerm !== "null") {
      const regexSearchTerm = new RegExp(searchTerm, "i");
      matchQuery.title = { $regex: regexSearchTerm };
    }

    if (filter && filter !== "null") {
      matchQuery.category = filter; // Assuming 'filter' contains the category name
    }

    console.log(matchQuery);
    const allProducts = await Product.find(matchQuery).populate(
      "featureImage images createdBy category"
    );
    //Paginacija
    const paginatedData = allProducts.slice(
      (pageNumber - 1) * limit,
      pageNumber * limit
    );

    const totalItems = allProducts.length;

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({ paginatedData, totalItems, totalPages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error with geting products" });
  }
};

exports.getById = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(403).json({ message: "id nije prosledjen kako treba" });
    }
    const product = await Product.findById({ _id: productId })
      .populate("images")
      .populate("featureImage");

    if (!product) {
      return res.status(404).json({ message: "Nismo pronasli proizvod!" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .jsno({ message: "Internal server error u Get all products" });
  }
};

exports.getAllPopularProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const pageNumber = parseInt(req.query.pageNumber) || 1;

    const popularProducts = await Product.find({ isPopular: true })
      .populate("featureImage")
      .populate("images");

    if (popularProducts.length < 1) {
      return res
        .status(404)
        .json({ message: "Nismo pronasli nijedan popularni proizvod" });
    }

    console.log(popularProducts.length);

    //Paginacija
    const paginatedData = popularProducts.slice(
      (pageNumber - 1) * limit,
      pageNumber * limit
    );

    const totalItems = popularProducts.length;

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({ paginatedData, totalItems, totalPages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error update" });
  }
};

exports.searchProduct = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const pageNumber = req.pageNumber || 1;
    const filter = req.query.filter || null;
    const searchTerm = req.query.searchTerm || null;
    const matchQuery = {};
    console.log(req.query);
    if (!pageNumber || !limit) {
      return res.status(400).json({ message: "Los zahtev u disciplini" });
    }
    if (searchTerm && searchTerm !== "null") {
      const regexSearchTerm = new RegExp(searchTerm, "i");
      matchQuery.title = { $regex: regexSearchTerm };
    }

    if (filter && filter !== "null") {
      matchQuery.category = filter; // Assuming 'filter' contains the category name
    }

    const products = await Product.find(matchQuery);

    const paginatedData = products.slice(
      (pageNumber - 1) * limit,
      pageNumber * limit
    );

    const totalItems = products.length;

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({ paginatedData, totalItems, totalPages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error search" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({ message: "Los zahtev" });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Proizvod nije pronađen" });
    }

    return res
      .status(200)
      .json({ message: "Proizvod uspešno obrisan", data: deletedProduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error delete" });
  }
};
