const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
require("dotenv").config();

const bucketName = process.env.AWS_S3_BUCKET_NAME;
const reqion = process.env.AWS_S3_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
  reqion,
  accessKeyId,
  secretAccessKey,
});

// uploads a file to s3
exports.uploadFile = async (filePath, fileName) => {
  try {
    const fileStream = fs.createReadStream(filePath);

    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: fileName,
    };
    const uploadToS3 = await s3.upload(uploadParams).promise();
    return uploadToS3;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};

exports.renameObject = async (oldName, newName) => {
  const uploadParams = {
    Bucket: bucketName,
    CopySource: `${bucketName}/${oldName}`,
    Key: newName,
  };
  await s3.copyObject(uploadParams).promise();
  await this.deleteObject(oldName);
  return true;
};

exports.generateNewUrl = async (filename) => {
  return `https://${bucketName}.s3.amazonaws.com/${filename}`;
};

exports.deleteObject = async (fileName) => {
  console.log(fileName);
  const uploadParams = {
    Bucket: bucketName,
    Key: fileName,
  };
  return s3.deleteObject(uploadParams).promise();
};

exports.removeLocalImages = async (images) => {
  try {
    images.forEach((image) => fs.unlinkSync(image.localPath));
    return { deleted: true, message: "Images deleted" };
  } catch (error) {
    return new Error({ deleted: false, message: error.message });
  }
};
