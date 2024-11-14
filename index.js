const express = require("express");
const fs = require("fs");
let users = require('./MOCK_DATA.json');
const app = express();
const port = 5001;

app.use(express.urlencoded({ extends: false }));

app.get("/users", (req, res) => {
  const html = `
  <ul>
    ${users.map(user => `<li>${user.first_name}</li>`).join("")}

  </ul>
`;
  res.send(html);
});

app.route("/users/:id")
  .get((req, res) => {
    //taking the id given by client
    const id = Number(req.params.id);

    const user = users.find((user) => user.id === id);
    return res.json(user);
  })

  .delete((req, res) => {
    const id = Number(req.params.id);

    //adding only ramainig users, other than which needed to be delete
    const newUsers = users.filter(user => user.id !== id);

    // checking if user present or not
    if (newUsers.length === users.length) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }


    //assigning the new array "newUsers" to old array "users"
    users = newUsers;

    // main code which delets the user
    fs.writeFileSync('MOCK_DATA.json', JSON.stringify(newUsers, null, 2));

    return res.json({ status: "success", message: "User deleted successfully" });
  });

app.get('/users/:firstName?/:lastName?', (req, res) => {
  const { firstName, lastName } = req.params;
  console.log(`Received parameters: firstName=${firstName}, lastName=${lastName}`);
  console.log('Users array:', users);
  const user = users.find((user) =>
    (!firstName || user.first_name.toLowerCase() === firstName.toLowerCase()) &&
    (!lastName || user.last_name.toLowerCase() === lastName.toLowerCase())
  );

  if (user) {
    return res.json(user);
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
});




app.post("/users", (req, res) => {
  //taking user details in var "body"
  const body = req.body;
  //adding to main users array by increasing id manually
  users.push({ ...body, id: users.length + 1 });
  // main code which adding the user
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
    return res.json({ status: "sucess" });

  })



})


app.listen(port, () => {
  console.log('server running')
});