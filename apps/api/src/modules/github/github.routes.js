const express = require("express");
const { pushToGithub } = require("./github.service");
const { authMiddleware } = require("../../middleware/auth.middleware");
const { getUserById } = require("../auth/auth.service");
const router = express.Router();

router.get("/repos", authMiddleware, async (req, res, next) => {
  const { getUserRepos } = require("./github.service");
  try {
    const fullUser = await getUserById(req.user.id);
    const repos = await getUserRepos({ user: fullUser });
    res.json(repos);
  } catch (err) {
    next(err);
  }
});

router.post("/push", authMiddleware, async (req, res, next) => {
  const { token, repo, path, content, message, branch } = req.body;

  if (!repo || !path || !content) {
    return res.status(400).json({ message: "Missing required fields (repo, path, content)" });
  }

  try {
    // Fetch full user to get githubToken (not stored in JWT)
    const fullUser = await getUserById(req.user.id);
    
    const result = await pushToGithub({ 
      token: token || fullUser?.githubToken, 
      repo, 
      path, 
      content, 
      message,
      branch,
      user: fullUser 
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = { githubRouter: router };
