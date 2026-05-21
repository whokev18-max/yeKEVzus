const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.use(
    "/uploads",
    express.static("public/uploads")
);

const storage = multer.diskStorage({

    destination:(req,file,cb)=>{

        cb(null,"public/uploads");

    },

    filename:(req,file,cb)=>{

        cb(
            null,
            Date.now() +
            path.extname(file.originalname)
        );

    }

});

const upload = multer({storage});

let posts = [];

if(fs.existsSync("data.json")){

    const data =
    fs.readFileSync("data.json");

    if(data.length > 0){

        posts = JSON.parse(data);

    }

}

function savePosts(){

    fs.writeFileSync(

        "data.json",

        JSON.stringify(
            posts,
            null,
            2
        )

    );

}

app.get("/posts",(req,res)=>{

    res.json(posts);

});

app.post(
    "/post",
    upload.single("image"),
    (req,res)=>{

        const post = {

            id:Date.now(),

            text:req.body.text,

            color:req.body.color,

            shape:req.body.shape,

            image:req.file
                ? "/uploads/" +
                  req.file.filename
                : "",

            createdAt:new Date()

        };

        posts.unshift(post);

        savePosts();

        res.json(post);

    }
);

app.listen(3000,()=>{

    console.log(
        "🌙 yeKEVzus rodando"
    );

});