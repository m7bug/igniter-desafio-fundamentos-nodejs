const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ message: "User not found" });
  }

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  users.push({
    id: uuidv4(),
    name: name,
    username: username,
    todos: [],
  });

  return response.status(201).send();
});

app.use(checksExistsUserAccount);

app.get("/todos", (request, response) => {
  const { user } = request;
  return response.status(200).send(user.todos);
});

app.post("/todos", (request, response) => {
  // Complete aqui
});

app.put("/todos/:id", (request, response) => {
  // Complete aqui
});

app.patch("/todos/:id/done", (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", (request, response) => {
  // Complete aqui
});

module.exports = app;
