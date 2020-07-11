const { admin, db } = require("../utilities/admin");

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(403).json({
      error: "You must be logged in",
    });
  }

  const token = authorization.replace("Bearer ", "");

  // let token;
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer ")
  // ) {
  //   token = req.headers.authorization.split("Bearer ")[1];
  // } else {
  //   console.error("No token found");
  //   return res.status(403).json({ error: "Unauthorized" });
  // }
  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      req.user = decodedToken;
      return db
        .collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      req.user.userHandle = data.docs[0].data().userHandle;
      req.user.imageUrl = data.docs[0].data().imageUrl;
      return next();
    })
    .catch((err) => {
      console.error("You must be signed in", err);
      return res.status(403).json(err);
    });
};

module.exports = requireAuth;
