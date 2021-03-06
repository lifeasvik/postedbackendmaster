const express = require("express");
const PostcardsService = require("./postcards-service");
const { requireAuth } = require("../middleware/jwt-auth");
const jsonBodyParser = express.json();

const postcardsRouter = express.Router();

postcardsRouter
  .route("/")
  .get((req, res, next) => {
    PostcardsService.getAllPostcards(req.app.get("db"))
      .then((postcards) => {
        res.json(postcards.map(PostcardsService.serializePostcard));
      })
      .catch(next);
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    ["title", "content"].forEach((field) => {
      if (!req.body.hasOwnProperty(field)) {
        res.status(400).json({ error: `Missing '${field}' in request body` });
      }
    });
    PostcardsService.insertPostcard(req.app.get("db"), req.body)
      .then((data) => res.json(PostcardsService.serializePostcard(data)))
      .catch(next);
  });

postcardsRouter
  .route("/:postcard_id")
  .all(requireAuth)
  .all(checkPostcardExists)
  .get((req, res) => {
    res.json(PostcardsService.serializePostcard(res.postcard));
  });

//do i need this if i don'thave any comments?

// postcardsRouter
//   .route("/:postcard_id/comments/")
//   .all(requireAuth)
//   .all(checkPostcardExists)
//   .get((req, res, next) => {
//     PostcardsService.getCommentsForPostcard(
//       req.app.get("db"),
//       req.params.postcard_id
//     )
//       .then((comments) => {
//         res.json(comments.map(PostcardsService.serializePostcardComment));
//       })
//       .catch(next);
//   });

/* async/await syntax for promises */
async function checkPostcardExists(req, res, next) {
  try {
    const postcard = await PostcardsService.getById(
      req.app.get("db"),
      req.params.postcard_id
    );

    if (!postcard)
      return res.status(404).json({
        error: `Postcard doesn't exist`,
      });

    res.postcard = postcard;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = postcardsRouter;
