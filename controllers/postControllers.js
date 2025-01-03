
import { uploadPicture } from "../middleware/uploadPictureMiddleware.js"; // Added .js extension

import Post from "../models/post.js";
import Comment from "../models/Comment.js";
import { fileRemover } from "../utils/fileRemover.js";
import { v4 as uuidv4 } from "uuid";
// create a new post controller
const createPost = async (req, res, next) => {
  try {
    const post = new Post({
      title: "sample title",
      caption: "sample caption",
      slug: uuidv4(),
      body: {
        type: "doc",
        content: [],
      },
      photo: "",
      user: req.user._id,
    });
    console.log(req.body);
    const createdPost = await post.save();
    return res.json(createdPost);
  } catch (error) {
    next(error);
  }
};
// update the post controller
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      const error = new Error("Post aws not found");
      next(error);
      return;
    }
    const upload = uploadPicture.single("postPicture");
    
    const handleUpdatePostData = async (data) => {
      try {
        if (!data) {
          throw new Error("No data provided for post update.");
        }
    
        // Safely parse the JSON if it exists
        const parsedData = JSON.parse(data);
        const { title, caption, slug, body, tags, categories } = parsedData;
    
        // Update fields only if they are provided
        post.title = title || post.title;
        post.caption = caption || post.caption;
        post.slug = slug || post.slug;
        post.body = body || post.body;
        post.tags = tags || post.tags;
        post.categories = categories || post.categories;
    
        const updatedPost = await post.save();
        return res.json(updatedPost);
      } catch (error) {
        next(error); // Pass the error to the error-handling middleware
      }
    };
    
    upload(req, res, async function (err) {
      if (err) {
        const error = new Error(
          "An unknown error occured when uploading " + err.message
        );
        next(error);
      } else {
        // every thing went well
        if (req.file) {
          let filename;
          filename = post.photo;
          if (filename) {
            fileRemover(filename);
          }
          post.photo = req.file.filename;
          handleUpdatePostData(req.body.document);
        } else {
          let filename;
          filename = post.photo;
          post.photo = "";
          fileRemover(filename);
          handleUpdatePostData(req.body.document);
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
// delete post controller
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });
    if (!post) {
      const error = new Error("Post aws not found");
      return next(error);
    }
    await Comment.deleteMany({ post: post._id });
    return res.json({
      message: "Post is successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};
// get one post controller
// const getPost = async (req, res, next) => {
//   try {
//     const post = await Post.findOne({ slug: req.params.slug }).populate([
//       {
//         path: "user",
//         select: ["avatar", "name"],
//       },
//       {
//         path: "comments",
//         match: {
//           check: true,
//           parent: null,
//         },
//         populate: [
//           {
//             path: "user",
//             select: ["avatar", "name"],
//           },
//           {
//             path: "replies",
//             match: {
//               check: true,
//             },
//             populate: [
//               {
//                 path: "user",
//                 select: ["avatar", "name"],
//               },
//             ],
//           },
//         ],
//       },
//     ]);
//     if (!post) {
//       const error = new Error("Post was not found");
//       return next(error);
//     }
//     return res.json(post);
//   } catch (error) {
//     next(error);
//   }
// };
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate([
      {
        path: "user",
        select: ["avatar", "name"],
      },
      {
        path: "comments",
        match: {
          check: true,
          parent: null,
        },
        populate: [
          {
            path: "user",
            select: ["avatar", "name"],
          },
          {
            path: "replies",
            match: {
              check: true,
            },
            populate: [
              {
                path: "user",
                select: ["avatar", "name"],
              },
            ],
          },
        ],
      },
    ]);

    if (!post) {
      const error = new Error("Post was not found");
      return next(error);
    }

    return res.json(post);
  } catch (error) {
    next(error);
  }
};
const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({}).populate([
      {
        path: "user",
        select: ["avatar", "name", "verified"],
      },
    ]);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};
export { createPost, updatePost, deletePost, getPost, getAllPosts };