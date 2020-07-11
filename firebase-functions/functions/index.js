const functions = require("firebase-functions");
const express = require("express");
const { db } = require("./utilities/admin");
const cors = require("cors");
//middlewares
const requireAuth = require("./middlewares/requireAuth");

//controllers for routes
const {
  getAllChirps,
  createChirp,
  getChirp,
  createComment,
  likeChirp,
  unlikeChirp,
  deleteChirp,
  getComments,
} = require("./controllers/chirps");

const {
  Signin,
  Signup,
  uploadImage,
  addUserInfo,
  getAuthenticatedUser,
  getUser,
  markNotificationsRead,
} = require("./controllers/users");

const app = express();
app.use(cors({ origin: "*" }));

//routes for chirps

app.get("/chirp/:chirpId", getChirp);
app.get("/chirp/:chirpId/like", requireAuth, likeChirp);
app.get("/chirp/:chirpId/unlike", requireAuth, unlikeChirp);
app.get("/chirps", getAllChirps);
app.get("/chirp/:chirpId/comment", getComments);
app.post("/chirp", requireAuth, createChirp);
app.post("/chirp/:chirpId/comment", requireAuth, createComment);
app.delete("/chirp/:chirpId", requireAuth, deleteChirp);

//Authentication routes
app.post("/signin", Signin);
app.post("/signup", Signup);
app.post("/user/image", requireAuth, uploadImage);
app.post("/user", requireAuth, addUserInfo);
app.get("/user/:userHandle", getUser);
app.get("/user", requireAuth, getAuthenticatedUser);
app.patch("/notifications", requireAuth, markNotificationsRead);

exports.api = functions.region("asia-northeast1").https.onRequest(app);

//signal that creates notification when likes are made
exports.createLikeNotification = functions
  .region("asia-northeast1")
  .firestore.document("likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/chirps/${snapshot.data().chirpId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            read: false,
            type: "like",
            chirpId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

//signal that creates notification when unlikes are made and deletes like notification
exports.deleteLikeNotificationOnUnLike = functions
  .region("asia-northeast1")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });

//signal that creates notification when comments are made
exports.createCommentNotification = functions
  .region("asia-northeast1")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/chirps/${snapshot.data().chirpId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            chirpId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

//updates profile pictures when user selects new profile pic
exports.triggerOnProfilePicChangeCascade = functions
  .region("asia-northeast1")
  .firestore.document("/users/{userId}")
  .onUpdate((change) => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      const batch = db.batch();
      return db
        .collection("chirps")
        .where("userHandle", "==", change.before.data().userHandle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const chirp = db.doc(`/chirps/${doc.id}`);
            batch.update(chirp, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

//trigger that deletes all likes, comments, and notifications linked to a deleted chirp
exports.triggerOnChirpDeleteCascade = functions
  .region("asia-northeast1")
  .firestore.document(`/chirps/{chirpId}`)
  .onDelete((snapshot, context) => {
    const chirpId = context.params.chirpId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("chirpId", "==", chirpId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("chirpId", "==", chirpId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("chirpId", "==", chirpId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => {
        console.error(err);
      });
  });

/*
<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/7.15.5/firebase-app.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->
<script src="https://www.gstatic.com/firebasejs/7.15.5/firebase-analytics.js"></script>

<script>
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyC8ZeOlgyqTt7HmNprEWLkLE1xI-Ssvo8g",
    authDomain: "chirper-aa4a4.firebaseapp.com",
    databaseURL: "https://chirper-aa4a4.firebaseio.com",
    projectId: "chirper-aa4a4",
    storageBucket: "chirper-aa4a4.appspot.com",
    messagingSenderId: "749052462281",
    appId: "1:749052462281:web:da7e0b5479389ba0a77918",
    measurementId: "G-7QG51FGBFG"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
</script>
*/
