import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwtDecode from "jwt-decode";
import AuthRoute from "./utils/AuthRoute";

import connectFirebase from "./api/connectFirebase";
//redux
import { SET_AUTHENTICATED } from "./reducers/types";
import { signoutUser, getUserData } from "./actions/userActions";
import store from "./reducers/store";
//pages
import { home, register, chirpPage, userPage } from "./pages";

//get token if available
const token = localStorage.firebaseIdToken;

// if browser has token in local storage, then user is logged in

if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(signoutUser());
    window.location.href = "/register";
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    connectFirebase.defaults.headers.common["Authorization"] = token;

    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={home} />
          <Route exact path="/chirp/:chirpId" component={chirpPage} />
          <Route exact path="/users/:userHandle" component={userPage} />
          <Route
            exact
            path="/users/:userHandle/chirp/:chirpId"
            component={userPage}
          />
          <AuthRoute exact path="/register" component={register} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
