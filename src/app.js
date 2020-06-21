const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

/**
 * GET /repositories
 *
 * @returns repositories []
 *
 */
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

/**
 * POST /repositories
 *
 * @returns repository {id, title, url, techs, likes}
 */
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

/**
 * PUT /repositories/:id
 *
 * @returns repository {id, title, url, techs, likes}
 */
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { likes, ...onlyValidProperties } = request.body;

  let repository = repositories.find((repo) => repo.id === id);

  if (!repository) {
    return response.status(400).send();
  }

  repository = { ...repository, ...onlyValidProperties };

  repositories.forEach((repo) => {
    if (repo.id === id) {
      repositories[repo.id] = repository;
    }
  });

  return response.json(repository);
});

/**
 * DELETE /repositories/:id
 *
 * @returns repositories []
 */
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!repositories.find((repo) => repo.id === id)) {
    return response.status(400).send();
  }

  repositories = repositories.filter((repo) => repo.id !== id);

  return response.status(204).json(repositories);
});

/**
 * POST /repositories/:id/like
 *
 * @returns object {like}
 */
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((repo) => repo.id === id);

  if (!repository) {
    return response.status(400).send();
  }

  repository.likes++;

  repositries = repositories.map((repo) =>
    repo.id === id ? { ...repo, likes: repo.likes + 1 } : repo
  );

  return response.json({ likes: repository.likes });
});

module.exports = app;
