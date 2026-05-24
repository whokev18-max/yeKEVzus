const express = require("express");
const multer = require("multer");
const cloudinary = require("./cloudinary");
const { createClient } = require("@supabase/supabase-js");
const path = require("path");

const app = express();

// =======================
// LIMITES RENDER/CELULAR
// =======================
app.use(express.json({ limit: "50mb" }));

app.use(express.urlencoded({
  extended: true,
  limit: "50mb"
}));

// =======================
// PUBLIC
// =======================
app.use(express.static(path.join(__dirname, "public")));

// =======================
// SUPABASE
// =======================
const supabase = createClient(
  "https://btbiztabjtaqcvvnlipv.supabase.co",
  "sb_publishable_IZvyp36Lbx3iS8FC4Ys23w_POOQ4ycn"
);

// =======================
// MULTER
// =======================
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

// =======================
// HOME
// =======================
app.get("/", (req, res) => {

  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );

});

// =======================
// ADMIN
// =======================
app.get("/admin", (req, res) => {

  res.sendFile(
    path.join(__dirname, "public", "admin.html")
  );

});

// =======================
// PEGAR POSTS
// =======================
app.get("/posts", async (req, res) => {

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("id", { ascending: false });

  if (error) {

    console.log(error);

    return res.status(500).json(error);

  }

  res.json(data);

});

// =======================
// FUNÇÃO POST
// =======================
async function criarPost(req, res){

  try {

    const text = req.body.text || "";

    let imageUrl = "";

    // =======================
    // CLOUDINARY
    // =======================
    if (req.file) {

      const result = await new Promise((resolve, reject) => {

        const stream =
        cloudinary.uploader.upload_stream(

          {
            folder: "yekevzus"
          },

          (error, result) => {

            if (error) {
              reject(error);
            }

            else {
              resolve(result);
            }

          }

        );

        stream.end(req.file.buffer);

      });

      imageUrl = result.secure_url;

    }

    // =======================
    // SUPABASE
    // =======================
    const { data, error } =
    await supabase
      .from("posts")
      .insert([
        {
          text: text,
          image: imageUrl
        }
      ])
      .select();

    if (error) {

      console.log(error);

      return res.status(500).json({
        error: error.message
      });

    }

    console.log("🌙 Post criado");

    res.json({
      success: true,
      post: data
    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });

  }

}

// =======================
// ROTAS
// =======================
app.post(
  "/posts",
  upload.single("image"),
  criarPost
);

app.post(
  "/upload",
  upload.single("image"),
  criarPost
);

app.post(
  "/uploads",
  upload.single("image"),
  criarPost
);

// =======================
// START
// =======================
app.listen(3000, () => {

  console.log(
    "🌙 yeKEVzus API rodando 🚀"
  );

});