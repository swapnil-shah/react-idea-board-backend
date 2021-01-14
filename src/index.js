const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3001;
// instantiate express and add handlers
const app = express();
app.use(cors());
app.use(express.json());
// ******  add sudo database and two models *******
// seed data
const mars = {
  _id: 1,
  title: "Fly to Mars",
  description: "Earth isn't Red enough.  Let's move to a new planet",
  date: new Date()
};
const tesla = {
  _id: 2,
  title: "Build a Car",
  description:
    "Gas is too expensive.  I'm gonna build a car that doesn't need gas",
  date: new Date()
};
const elon = {
  _id: 1,
  userName: "elon_musk",
  password: "spaceiscool",
  ideas: [mars, tesla]
};
// ** default username and idea object **
const User = {
  _id: null,
  userName: "New User",
  password: "New Password",
  ideas: []
};
const Idea = {
  _id: null,
  title: "New Title",
  description: "New Description",
  created: ""
};
//  database models, pre seeded with data
const Users = [elon];
// ** helper utils **
// sudo primary id
let idUserCount = 1;
let idIdeaCount = 2;
// util methods
const createNewUser = (data) => {
  // increase id count and create new instance of user
  idUserCount++;
  // create deep copy
  const newUser = Object.assign({}, User);
  newUser._id = idUserCount;
  newUser.ideas = [];
  newUser.userName = data.userName;
  newUser.password = data.password;
  // add to database model
  Users.push(newUser);
  return Users;
};
const findUserById = (id) => {
  const currentUser = Users.find((ele) => ele._id === parseInt(id, 10));
  return currentUser;
};
const addNewIdea = (id, newIdea) => {
  // increase idea count
  idIdeaCount++;
  const currentUser = findUserById(id);
  const ideas = currentUser.ideas;
  // copy of Idea object
  const updatedIdea = Object.assign({}, Idea);
  updatedIdea._id = idIdeaCount;
  updatedIdea.title = newIdea.title;
  updatedIdea.description = newIdea.description;
  updatedIdea.created = new Date();
  ideas.push(updatedIdea);
  // retun user updated idea
  return currentUser;
};
const dataWrapper = (response) => {
  const data = {
    data: response
  };
  return data;
};
// ** setup api here **
app.get("/api/users", (req, res) => {
  res.json(dataWrapper(Users));
});
app.post("/api/users", (req, res) => {
  // add to users data model
  const users = createNewUser(req.body);
  res.json(dataWrapper(users));
});
app.get("/api/users/:id", (req, res) => {
  const user = findUserById(req.params.id);
  res.json(dataWrapper(user));
});
app.post("/api/users/:id/ideas", (req, res) => {
  const newIdeaAdded = addNewIdea(req.params.id, req.body);
  res.json(dataWrapper(newIdeaAdded));
});
app.delete("/api/users/:id/ideas/:ideaId", (req, res) => {
  const user = findUserById(req.params.id);
  const updatedIdeas = user.ideas.filter(
    (ele) => ele._id !== parseInt(req.params.ideaId, 10)
  );
  // updated ideas with current deleted one
  user.ideas = updatedIdeas;
  res.json(dataWrapper(user));
});
app.patch("/api/users/:id/ideas/:ideaId", (req, res) => {
  const user = findUserById(req.params.id);
  const updatedIdea = req.body;
  // find idea using id and update the user idea array
  const updatedIdeas = user.ideas.map((ele) => {
    if (ele._id === parseInt(req.params.ideaId, 10)) {
      // update idea and save to user
      if (updatedIdea.title) {
        ele.title = updatedIdea.title;
      }
      if (updatedIdea.description) {
        ele.description = updatedIdea.description;
      }
      // update idea
      return ele;
    } else {
      return ele;
    }
  });
  // save ideas
  user.ideas = updatedIdeas;
  res.json(dataWrapper(user));
});
// start server
app.listen(port, () => console.log(`Listening on port ${port}`));
module.exports = app;
