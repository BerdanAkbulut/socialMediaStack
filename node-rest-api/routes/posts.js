const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
//create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//update a post

router.put("/:kid/:pid", async (req, res) => {
  if (req.body.userId === req.params.kid) {
    try {
      await Post.findByIdAndUpdate(req.params.pid, {
        $set: req.body,
      });

      res.status(200).json("Post has been updated");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can't update another users post");
  }
});
//delete a post

router.delete("/:kid/:pid", async (req, res) => {
  if (req.body.userId === req.params.kid) {
    try {
      await Post.findByIdAndDelete(req.params.pid);

      res.status(200).json("Post has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can't delete another users post");
  }
});

//like and unlike a post
router.put("/:kid/:pid/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.pid);

    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("You have been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("You have been unliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).send(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// get timeline posts (kisinin aanasayfasına takip ettiklerine göre çıkacak postlar)

router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });

    const friendsPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
     res.status(200).json(userPosts.concat(...friendsPosts))
  } catch (err) {
     res.status(500).json(err);
  }
});

// get all post a user

router.get("/profile/:username", async (req, res) => {
  try {
    const user =  await User.findOne({username:req.params.username})
    const posts = await Post.find({userId:user._id})
     res.status(200).json(posts)
  } catch (err) {
     res.status(500).json(err);
  }
});
module.exports = router;
