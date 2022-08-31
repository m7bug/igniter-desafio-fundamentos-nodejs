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
  const { user } = request;
  const { title, deadline } = request.body;

  user.todos.push({
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  });

  return response.status(201).json({ todo: user.todos[user.todos.length - 1] });
});

app.put("/todos/:id", (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { title, deadline } = request.body;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ message: "Todo not found!" });
  }

  todo.title = title;
  todo.deadline = deadline == "" ? todo.deadline : new Date(deadline);

  return response.status(201).send();
});

app.patch("/todos/:id/done", (request, response) => {
  const { user } = request;
  const { id } = request.params;
  const { done } = request.body;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ message: "Todo not found!" });
  }

  todo.done = done;

  return response.status(201).send();
});

app.delete("/todos/:id", (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ message: "Todo not found!" });
  }

  user.todos.splice(todo, id);
  return response.status(200).json(user.todos);
});

module.exports = app;
