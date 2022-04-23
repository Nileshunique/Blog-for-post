const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongose = require("mongoose");
const { default: mongoose } = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://nileshunique:21021998@cluster0.a6801.mongodb.net/blogpostDB?retryWrites=true&w=majority",
  (err) => {
    if (err) throw err;
  }
);
const postSchema = { postTitle: String, postContent: String };
const posts = new mongoose.model("post", postSchema);

const homeStartingContent = `This Daily Journal web site gives you an ability to create your new post and save it for future. This web site is connected with mongodb online using mongoose. It stores your post in that database. Each new created post comes on home page but for complete reading you have to go to speacific route or page of the post. The new post page fetched the post useing post id that is stored in mongodb.`;
const aboutContent = `This Web Site has only 1 app.js File for server. It have 5 file for frontend view and 2 file for common in each file (header.ejs & footer.ejs). This website is created by using express.Js and EJS and mongodb database using mongoose. App.js has 6 different route in which one for post at compose.ejs and other 5 are for get request for each diffrent route. If someone starts to fill the form and submit the form but one field is empty then it not gonna insert in mongodb database.`;
const contactContent = `I am a fresher Full Stack Web Developer of MERN. If you want to know more about me you may visit my github Page.`;

var composedPostsTitle = "";
var composedPostsPost = "";

app.get("/", (req, res) => {
  posts.find((err, data) => {
    if (err) throw err;
    res.render("home", {
      startingContent: homeStartingContent,
      posts: data,
    });
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    startingContent: aboutContent,
  });
});

app.get("/contactUs", (req, res) => {
  res.render("contact", {
    startingContent: contactContent,
  });
});

app
  .route("/compose")
  .get((req, res) => {
    res.render("compose", {
      title: composedPostsTitle,
      post: composedPostsPost,
    });
  })
  .post((req, res) => {
    composedPostsPost = req.body.post;
    composedPostsTitle = req.body.title;
    if (req.body.title != "" && req.body.post != "") {
      const post = new posts({
        postTitle: req.body.title,
        postContent: req.body.post,
      });
      post.save((err) => {
        if (err) throw err;
        composedPostsPost = "";
        composedPostsTitle = "";
        res.redirect("/");
      });
    } else res.redirect("/compose");
  });
app.get("/posts/:title", (req, res) => {
  posts.findById(req.params.title, (err, data) => {
    if (err) throw err;
    res.render("post", { post: data });
  });
});
app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
