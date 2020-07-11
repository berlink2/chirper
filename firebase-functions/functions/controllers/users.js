const { db, admin } = require("../utilities/admin");
const firebaseConfig = require("../utilities/firebaseConfig");
const firebase = require("firebase");

firebase.initializeApp(firebaseConfig);

const isEmpty = (string) => {
  return string.trim() === "" ? true : false;
};

const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(regEx);
};

//signup new user
exports.Signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userHandle: req.body.userHandle,
  };

  if (isEmpty(newUser.email) || !isEmail(newUser.email)) {
    res.status(400).json({ email: "Invalid email." });
  }

  if (
    isEmpty(newUser.password) ||
    newUser.password !== newUser.confirmPassword
  ) {
    return res.status(400).json({ password: "Error involving passwords." });
  }

  const defaultImage = "blankProfilePic.png";
  const defaultHeaderImage = "blankHead.jpeg";

  //validate user data
  let userToken;
  db.doc(`/users/${newUser.userHandle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ userHandle: "User handle already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      const userId = data.user.uid;

      return { userId, token: data.user.getIdToken() };
    })
    .then(({ userId, token }) => {
      userToken = token;
      const user = {
        userHandle: newUser.userHandle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${defaultImage}?alt=media`,
        headerImageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${defaultHeaderImage}?alt=media`,
      };
      db.doc(`/users/${newUser.userHandle}`).set(user);
      return userToken;
    })
    .then((userToken) => {
      return res.status(201).json({ userToken });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err });
    });
};

//signin existing user
exports.Signin = (req, res) => {
  const { email, password } = req.body;

  if (isEmpty(email) || isEmpty(password)) {
    res.status(400).json({ email: "Invalid email/password." });
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err });
    });
};

//upload profile picture
exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");
  const busboy = new BusBoy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res
        .status(400)
        .json({ error: "You can only upload .jpeg and .png files" });
    }

    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    console.log(imageFileName);
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        // Append token to url
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
        console.log(imageUrl);
        return db.doc(`/users/${req.user.userHandle}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "image uploaded successfully" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: "something went wrong" });
      });
  });
  busboy.end(req.rawBody);
};

//method that checks that user info
const checkUserInfo = (data) => {
  let userDetails = {};

  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;

  if (data.website.trim().substring(0, 4) !== "http") {
    userDetails.website = `http://${data.website.trim()}`;
  } else {
    userDetails.website = data.website;
  }

  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};

exports.addUserInfo = (req, res) => {
  let userInfo = checkUserInfo(req.body);
  db.doc(`/users/${req.user.userHandle}`)
    .update(userInfo)
    .then(() => {
      return res.json({ message: "User Info updated successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

//get user info for a signed in user
exports.getAuthenticatedUser = (req, res) => {
  const userData = {};
  db.doc(`/users/${req.user.userHandle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.info = doc.data();
        return db
          .collection("likes")
          .where("userHandle", "==", req.user.userHandle)
          .get();
      }
    })
    .then((data) => {
      userData.likes = [];
      data.forEach((doc) => {
        userData.likes.push(doc.data());
      });
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.userHandle)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then((data) => {
      userData.notifications = [];
      data.forEach((doc) => {
        userData.notifications.push({
          // createdAt: doc.data.createdAt,
          // recipient: doc.data().recipient,
          // sender: doc.data().sender,
          // read: doc.data().read,
          // type: doc.data().type,
          ...doc.data(),
          notificationId: doc.id,
        });
      });
      return res.status(200).json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err });
    });
};

//get a user
exports.getUser = (req, res) => {
  const userData = {};
  db.doc(`/users/${req.params.userHandle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.user = doc.data();
        return db
          .collection("chirps")
          .where("userHandle", "==", req.params.userHandle)
          .orderBy("createdAt", "desc")
          .get();
      } else {
        return res.status(404).json({
          error: "User not found.",
        });
      }
    })
    .then((data) => {
      userData.chirps = [];
      data.forEach((doc) => {
        userData.chirps.push({
          ...doc.data(),
          chirpId: doc.id,
        });
      });
      return res.status(200).json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err });
    });
};

exports.markNotificationsRead = (req, res) => {
  const batch = db.batch();
  req.body.forEach((notificationId) => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return res.status(200).json({ message: "Notification marked as read" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err });
    });
};
