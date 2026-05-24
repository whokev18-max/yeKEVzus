const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dzigo5nho",
  api_key: "595786396333219",
  api_secret: "lbAyKqS0i3XqszicOPoAK1C5ZRE"
});

module.exports = cloudinary;