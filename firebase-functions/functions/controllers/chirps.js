const { db } = require("../utilities/admin");

exports.getAllChirps = (req, res) => {
  db.collection("chirps")
    .orderBy("createdAt", "desc")
    .get()
    .then(function (querySnapshot) {
      let chirps = [];
      querySnapshot.forEach(function (doc) {
        chirps.push({
          chirpId: doc.id,
          ...doc.data(),
        });
      });
      console.log(chirps);
      return res.json(chirps);
    })
    .catch((err) => console.error(err));
};

//make new chirp
exports.createChirp = (req, res) => {
  const newChirp = {
    body: req.body.body,
    userHandle: req.user.userHandle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };
  db.collection("chirps")
    .add(newChirp)
    .then((doc) => {
      const resChirp = newChirp;
      resChirp.chirpId = doc.id;
      res.status(201).json({ resChirp });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
      console.error(err);
    });
};

//get one chirp based on chirp id
exports.getChirp = (req, res) => {
  let chirp = {};
  db.doc(`/chirps/${req.params.chirpId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "This chirp does not exist." });
      }
      chirp = doc.data();
      chirp.chirpId = doc.id;
      return res.json(chirp);
      // return db
      //   .collection("comments")
      //   .orderBy("createdAt", "desc")
      //   .where("chirpId", "==", req.params.chirpId)
      //   .get();
    })
    // .then((data) => {
    //   chirp.comments = [];
    //   data.forEach((doc) => {
    //     chirp.comments.push(doc.data());
    //   });
    //   return res.json(chirp);
    // })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
};

//get comments for a particular chirp
exports.getComments = (req, res) => {
  db.collection("comments")
    .orderBy("createdAt", "desc")
    .where("chirpId", "==", req.params.chirpId)
    .get()
    .then((data) => {
      const comments = [];
      data.forEach((doc) => {
        comments.push(doc.data());
      });
      return res.json(comments);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
};

//make a comment for a chirp
exports.createComment = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ error: "Chirp must not be empty" });

  const comment = {
    body: req.body.body,
    chirpId: req.params.chirpId,
    createdAt: new Date().toISOString(),
    userHandle: req.user.userHandle,
    userImage: req.user.imageUrl,
  };

  db.doc(`/chirps/${req.params.chirpId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Chirp not found" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(comment);
    })
    .then(() => {
      res.json(comment);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
};

//like a chirp
exports.likeChirp = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.userHandle)
    .where("chirpId", "==", req.params.chirpId)
    .limit(1);

  const chirpDoc = db.doc(`/chirps/${req.params.chirpId}`);

  let chirpData = {};

  chirpDoc
    .get()
    .then((doc) => {
      if (doc.exists) {
        chirpData = doc.data();
        chirpData.chirpId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Chirp not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            chirpId: req.params.chirpId,
            userHandle: req.user.userHandle,
          })
          .then(() => {
            chirpData.likeCount = chirpData.likeCount + 1;
            return chirpDoc.update({ likeCount: chirpData.likeCount });
          })
          .then(() => {
            return res.status(201).json({ chirpData });
          });
      } else {
        return res.status(400).json({ error: "Already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
};

//unlike a chirp
exports.unlikeChirp = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.userHandle)
    .where("chirpId", "==", req.params.chirpId)
    .limit(1);

  const chirpDoc = db.doc(`/chirps/${req.params.chirpId}`);

  let chirpData = {};

  chirpDoc
    .get()
    .then((doc) => {
      if (doc.exists) {
        chirpData = doc.data();
        chirpData.chirpId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Chirp not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "Chirp not liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            chirpData.likeCount = chirpData.likeCount - 1;
            return chirpDoc.update({ likeCount: chirpData.likeCount });
          })
          .then(() => {
            return res.status(201).json({ chirpData });
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
};

//delete a chirp
exports.deleteChirp = (req, res) => {
  const chirp = db.doc(`/chirps/${req.params.chirpId}`);

  chirp
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Chirp not found" });
      }

      if (doc.data().userHandle !== req.user.userHandle) {
        return res.status(403).json({ error: "Unauthorized request" });
      } else {
        return chirp.delete();
      }
    })
    .then(() => {
      res.status(201).json({ message: "Sucessfully deleted chirp" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
};
