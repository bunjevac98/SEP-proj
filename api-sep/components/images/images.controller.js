const { v4: uuidv4 } = require("uuid");
const Image = require("./models/images.model");
const { deleteObject } = require("./image.services");
const uploadToS3 = require("../images/image.services");
const ObjectId = require("mongodb").ObjectID;
const { AuthActions } = require("../logs/log.controller");
const { generateLog } = require("../../helpers/log");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

const BUCKET_NAME = "stopack-staging";

AWS.config.update({
  region: process.env.AWS_S3_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

exports.productGalleryImages = async (req, res) => {
  try {
    const query = {};

    if (req.body.images && Array.isArray(req.body.images)) {
      query._id = { $in: req.body.images };
    }

    const items = await Image.find(query).lean().exec();

    const sortedItems = req.body.images
      ? req.body.images.map((imageId) =>
          items.find((item) => item._id.toString() === imageId.toString())
        )
      : [];

    res.status(200).json(sortedItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const query = {};

    if (req.query.searchTerm) {
      query.originalname = { $regex: req.query.searchTerm, $options: "i" }; // Added case-insensitive option
    }

    const items = await Image.find({ ...query, type: "admin-gallery" })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;

  if (!id || id.length !== 24) {
    return res.status(400).json({ message: "Invalid ID format." });
  }

  try {
    const item = await Image.findById(id).populate("featureImage");

    if (!item) {
      return res.status(404).json({ message: "Item does not exist." });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req) => {
  try {
    const image = await Image.findByIdAndRemove(ObjectId(req.params.id));

    if (!image) {
      return false; // No image found to delete
    }

    await deleteObject(image.originalname); // Remove from S3

    await generateLog(
      req,
      AuthActions.REMOVED_IMAGE,
      { dataBefore: image, dataAfter: undefined },
      "Images"
    );

    return true; // Successfully deleted
  } catch (error) {
    console.error("Error when removing image:", error.message); // Use console.error for error logging
    return false; // Indicate failure
  }
};
exports.deleteImageRoute = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Image not found." });
    }

    const params = {
      Bucket: BUCKET_NAME,
      Key: image.originalname, // e.g. "folder/image.jpg"
    };

    // Delete from S3
    s3.deleteObject(params, async (err, data) => {
      if (err) {
        console.error("Error deleting from S3:", err);
        return res.status(500).json({ message: "Error deleting from S3." });
      }

      console.log("Successfully deleted from S3:", data);

      // Delete image record from the database
      const removeImage = await Image.findByIdAndDelete(req.params.id);

      if (removeImage) {
        return res.status(200).json({ message: "Image removed successfully." });
      } else {
        return res
          .status(500)
          .json({ message: "Error removing image from the database." });
      }
    });
  } catch (error) {
    console.error("Error in deleteImageRoute:", error.message);
    return res.status(500).json({ message: "Something went wrong." });
  }
};
exports.deleteById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Image.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: `Image ${id} not found.` });
    }

    return res
      .status(200)
      .json({ message: `Image ${id} deleted successfully.` });
  } catch (error) {
    console.error("Error deleting image:", error.message); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the image." });
  }
};
exports.updateById = async (req, res) => {
  const { id } = req.params;
  const { title, altTitle } = req.body;

  try {
    // Prepare updated fields
    const updatedImage = { originalname: title, altTitle };

    // Find the existing image
    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({ message: "Image not found." });
    }

    // Update the image in the database
    const updatedDoc = await Image.findOneAndUpdate({ _id: id }, updatedImage, {
      new: true,
    });

    if (!updatedDoc) {
      return res.status(500).json({ message: "Failed to update the image." });
    }

    // Rename the image in S3
    await uploadToS3.renameObject(image.originalname, title);

    // Generate a new URL for the updated image
    const newUrl = await uploadToS3.generateNewUrl(title);

    // Update the image URL in the database
    await Image.updateOne({ _id: id }, { $set: { url: newUrl } });

    // Log the update action
    await generateLog(
      req,
      AuthActions.UPDATED_IMAGE,
      image,
      updatedDoc,
      "Images"
    );

    return res.status(200).json({ message: "Image updated successfully." });
  } catch (error) {
    console.error("Error updating image:", error.message); // Log the error for debugging
    return res
      .status(500)
      .json({ message: "An error occurred while updating the image." });
  }
};
exports.getExtension = async (url) => {
  if (typeof url !== "string") {
    throw new Error("Invalid input: URL must be a string.");
  }

  const lastDotIndex = url.lastIndexOf(".");

  if (lastDotIndex === -1) {
    return ""; // Return an empty string if there is no extension
  }

  return url.substring(lastDotIndex); // Use substring instead of substr for better clarity
};

exports.downloadImage = async (url) => {
  const fullPath = path.join("public/images/common");
  const fileName = uuidv4();
  const filePath = path.join(fullPath, fileName);

  return new Promise((resolve) => {
    const fileStream = fs.createWriteStream(filePath);

    const request = protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        console.error(
          `Failed to download image: ${response.statusCode} ${response.statusMessage}`
        );
        resolve(false);
        return;
      }

      const contentType = response.headers["content-type"];
      const fileExtension = getFileExtension(contentType);
      const fileFullPath = `${filePath}${fileExtension}`;

      response.pipe(fileStream);

      fileStream.on("finish", () => {
        console.log(`Image downloaded successfully to: ${fileFullPath}`);
        fileStream.close();
        resolve([fileFullPath, `${fileName}${fileExtension}`]);
      });

      fileStream.on("error", (err) => {
        console.error("Error writing file:", err);
        resolve(false);
      });
    });

    request.on("error", (err) => {
      console.error("Error downloading image:", err);
      resolve(false);
    });
  });
};

function getFileExtension(contentType) {
  const extensionMap = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    // Add more content types as needed
  };

  return extensionMap[contentType] || ""; // Default to empty string if unknown type
}
