/// test23323

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const cookieParser = require("cookie-parser");
const session = require("express-session");

const { response } = require("express");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:19007"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());

app.set("trust proxy", 1);

app.use(
  session({
    key: "userId",
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 86400000, // in ms
    },
  })
);

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "group_proj_yr2",
});

// const db = mysql.createConnection({
//   user: "bb226c87aee8d4",
//   host: "eu-cdbr-west-01.cleardb.com",
//   password: "d4caacc0",
//   database: "heroku_7accb2240b414d1",
// });

// user attempting to signup
app.post("/signup", function (req, res) {
  res.send("Sign up post request");
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "INSERT INTO student (First_name, Last_name, Email, Username, Password) VALUES (?,?,?,?,?)",
    [firstname, lastname, email, username, password],
    (err, result) => {
      if (err) {
        console.log(err);
      }
    }
  );
});

// Checking if user exists
app.get("/checkUsers", function (req, res) {
  db.query(
    "SELECT Username FROM student",
    (err, result) => {
      if (err) {
        res.send({ err: err});
      } else {
        res.send(result);
      }
    }
  );
});

// User login
app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  db.query(
    "SELECT Username, Password FROM student WHERE Username = ?",
    [username],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length > 0) {
        bcrypt.compare(password, result[0].Password, (error, response) => {
          if (response) {
            req.session.user = result[0].Username;
            res.send(result);
          } else {
            res.send({ message: "Wrong username/password, please try again" });
          }
        });
      } else {
        res.send({ message: "User doesn't exist" });
      }
    }
  );
});

// Checking for user login
app.get("/login", function (req, res) {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

// Logout
// app.get("/logout", function (req, res) {
//   res.cookie('token', 'none', {
//     expires: new Date(Date.now() + 5 * 1000),
//     httpOnly: true,
//   });
// });

// fetching from
app.post("/fetch", function (req, res) {
  const username = req.body.username;
  db.query(
    "SELECT Password FROM student WHERE Username = ? ",
    [username],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
      console.log(result);
    }
  );
});

// app.post("/create", function (req, res) {
//   res.send("post request to the homepage");
//   const username = req.body.username;
//   const password = req.body.password;

//   db.query(
//     "INSERT INTO student (name,age) VALUES (?,?)",
//     [username, password],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       }
//     }
//   );
// });

// user creating a post
app.post("/submit", function (req, res) {
  res.send("Submit post request");
  const title = req.body.title;
  const content = req.body.content;

  db.query(
    "INSERT INTO post (Post_title, Post_content) VALUES (?,?)",
    [title, content],
    (err, result) => {
      if (err) {
        console.log(err);
      }
    }
  );
});

// user creating subforum
app.post("/subforum/create", function (req, res) {
  res.send("Subforum created successfully request");
  const title = req.body.title;
  const description = req.body.description;
  const isPrivate = req.body.isPrivate;
  const userID = req.body.userID

  db.query(
    "INSERT INTO subforum (Sub_title, Sub_description, Sub_private) VALUES (?,?,?)",
    [title, description, isPrivate],
    (err, result) => {
      if (err) {
        console.log(err);
      }
    }
  );
});


app.post("/subforum/user", function (req, res) {
  const userID = req.body.userID

  db.query(
    "INSERT INTO subforum (Sub_title, Sub_description, Sub_private) VALUES (?,?,?)",
    [title, description, isPrivate],
    (err, result) => {
      if (err) {
        console.log(err);
      }
    }
  );
});


app.post("/subforum/getsubID", function (req, res) {
  const title = req.body.title

  db.query(
    "Select Sub_ID from subforum where Sub_title = ?",
    [title],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});


app.post("/getRole", function (req, res) {
  const subforumID = req.body.subforumID;
  const userID = req.body.userID;

  db.query(
    "SELECT Role FROM subforum_members Where Sub_ID = ? and Student_ID = ?", 
    [subforumID, userID],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
  console.log(subforumID);
  console.log(userID);
});


app.post("/subforum/subPresident", function (req, res) {
  const userID = req.body.userID
  const subforum_id = req.body.subforum_id
  console.log(subforum_id)

  db.query(
    "INSERT INTO subforum_members (Sub_ID, Student_ID, Role) VALUES (?,?,?)",
    [subforum_id, userID, "President"],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});




// get all subforum
app.get("/subforums", function (req, res) {
  db.query(
    "SELECT Sub_ID, Sub_title, Sub_description FROM subforum",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

// get info from subforum
app.post("/posts", function (req, res) {
  const subforumID = req.body.subforumID;

  db.query(
    "SELECT Post_ID, Post_title, Post_content, Post_date FROM post WHERE Sub_id = ?",
    [subforumID],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.post("/join", function (req, res) {
  const userID = req.body.userID;
  const subforumID = req.body.subforumID;
  const role = "member";
  db.query(
    "INSERT INTO subforum_members (Sub_ID, Student_ID, Role) VALUES (?,?,?)",
    [subforumID, userID, role],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
      console.log(result);
    }
  );
  db.query(
    "UPDATE subforum SET No_members = No_members + 1 WHERE Sub_ID = ?",
    [subforumID],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
      console.log(result);
    }
  );
});

// get user id
app.post("/getUserID", function (req, res) {
  const cookieUsername = req.body.cookieUsername;
  db.query(
    "SELECT Student_ID from student WHERE Username = ?",
    [cookieUsername],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.post("/post/create", function (req, res) {
  const title = req.body.title;
  const content = req.body.content;
  const currentDateTime = req.body.currentDateTime;
  const userID = req.body.userID;
  const subforumID = req.body.subforumID;
  db.query(
    "INSERT INTO post (Post_title, Post_content, Post_date, Student_ID, Sub_ID) VALUES (?,?,?,?,?)",
    [title, content, currentDateTime, userID, subforumID],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.post("/getComments", function (req, res) {
  const postID = req.body.postID;

  db.query(
    "SELECT Comment_content, Comment_date, Student_ID FROM comment WHERE Post_ID = ?",
    [postID],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.post("/comments/add", function (req, res) {
  const commentInput = req.body.commentInput;
  const currentDateTime = req.body.currentDateTime;
  const userID = req.body.userID;
  const postID = req.body.postID;
  db.query(
    "INSERT into comment (Comment_content, Comment_date, Student_ID, Post_ID) VALUES (?,?,?,?)",
    [commentInput, currentDateTime, userID, postID],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.post("/comments/username", function (req, res) {
  const id = req.body.id;
  db.query(
    "SELECT Username from student WHERE Student_ID = ?",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

app.listen(19007, () => {
  console.log("Server running");
});

// app.listen(process.env.PORT || 880, () => {
//   console.log("Server running");
// });

//login details
//mysql://bb226c87aee8d4:d4caacc0@eu-cdbr-west-01.cleardb.com/heroku_7accb2240b414d1?reconnect=true
