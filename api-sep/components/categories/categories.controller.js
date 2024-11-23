const Category = require("./models/categories.model");
const Product = require("../products/models/product.model");

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
  ); // Remove consecutive hyphens
};

exports.getAll = async (req, res) => {
  try {
    const items = await Category.find();

    if (items.length < 1) {
      return res
        .status(404)
        .json({ message: "Nismo pronasli nijednu kategoriju" });
    }

    return res.status(200).json(items || []);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
//DONE
exports.getAllProductFromCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const pageNumber = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;
    console.log("1---->", pageNumber);
    console.log("2---->", limit);

    if (!categoryId) {
      return res.status(400).json({ message: "Bad request" });
    }

    const allProductFromCategory = await Product.find({
      category: categoryId,
    }).populate("featureImage");

    if (allProductFromCategory.length < 1) {
      return res
        .status(404)
        .json({ message: "Nismo pronasli nijedan proizvod u kategoriji" });
    }

    const paginatedData = allProductFromCategory.slice(
      (pageNumber - 1) * limit,
      pageNumber * limit
    );

    const totalCount = allProductFromCategory.length;

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({ paginatedData, totalCount, totalPages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
//Salje se samo req.body.name
exports.create = async (req, res) => {
  try {
    if (!req.body.name) {
      return res
        .status(403)
        .json({ message: "Niste dobro uneli ime kategorije" });
    }
    const categories = await Category.find();

    const allDataUrls = categories.map((cat) => cat.url);

    const baseUrl = convertToCleanUrl(`${req.body.name}`);

    let uniqueUrl;

    const similarUrls = allDataUrls.filter(
      (url) => url !== undefined && url.startsWith(baseUrl)
    );

    const urlNumbers = similarUrls.map((url) => {
      const match = url.match(new RegExp(`${baseUrl}-(\\d+)`));
      return match ? parseInt(match[1]) : 0;
    });
    urlNumbers.sort((a, b) => b - a);
    // Calculate the next unique number
    const nextNumber = urlNumbers.length > 0 ? urlNumbers[0] + 1 : 0;
    // Construct the final unique URL
    uniqueUrl = nextNumber > 0 ? `${baseUrl}-${nextNumber}` : baseUrl;

    let data = req.body;

    data.url = uniqueUrl;
    data.slug = uniqueUrl;
    data.metaTitle = req.body.name;
    data.metaDesc = req.body.name;
    data.name = req.body.name;
    console.log("data", data);
    const item = await new Category({ ...data }).save();

    console.log(item);

    return res.status(200).json({ message: "Created." } || { item: [] });
  } catch (error) {
    console.log(error);
    return res.status(500).json(`Internal server error ${error}`);
  }
};

// ovo mozda ni ne treba
exports.getAllByUrl = async (req, res) => {
  try {
    let filters = req && req.query && req.query.filter ? req.query.filter : {};
    const filterObject = JSON.parse(filters);
    let url = filterObject.url;
    let cat;

    const substring = "/";
    const count = (url.match(new RegExp(substring, "g")) || []).length;

    if (count === 0) {
      cat = await Category.find({ url });
      return res.status(200).json({ data: cat, categoryType: "rootCategory" });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
//id od kategorije i ono sto se updejtuje
exports.update = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Uspesno ste izbrisali kategoriju" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryDescription = async (req, res) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return res.status(400).json({ message: `Los zahtev` });
    }
    const category = await Category.findById(categoryId);

    if (!category.description) {
      return res
        .status(404)
        .json("Nismo pronasli deskripciju za ovu kategoriju");
    }
    console.log(category.description);
    
    let desc = category.description;

    return res.status(200).json({ desc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
