import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  // MARK_NOTIFICATIONS_READ,
} from "../reducers/types";
import connectFirebase from "../api/connectFirebase";

export const signinUser = (userInfo, history) => async (dispatch) => {
  dispatch({ type: LOADING_UI });

  try {
    const res = await connectFirebase.post("/signin", userInfo);

    setAuthorizationHeader(res.data.token);

    dispatch(getUserData());

    dispatch({ type: CLEAR_ERRORS });

    history.push("/");
  } catch (e) {
    dispatch({ type: SET_ERRORS, payload: e.response.data });
  }
};

export const signupUser = (userInfo, history) => async (dispatch) => {
  dispatch({ type: LOADING_UI });

  try {
    const res = await connectFirebase.post("/signup", userInfo);
    connectFirebase.defaults.headers.common[
      "Authorization"
    ] = `${localStorage.firebaseIdToken}`;
    setAuthorizationHeader(res.data.userToken);

    dispatch(getUserData());

    dispatch({ type: CLEAR_ERRORS });

    history.push("/");
  } catch (e) {
    dispatch({ type: SET_ERRORS, payload: e.response.data });
  }
};

export const signoutUser = () => (dispatch) => {
  localStorage.removeItem("firebaseIdToken");

  //delete axios.defaults.headers.common["Authorization"];
  delete connectFirebase.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const getUserData = () => async (dispatch) => {
  dispatch({
    type: LOADING_USER,
  });
  try {
    const res = await connectFirebase.get("/user");

    dispatch({
      type: SET_USER,
      payload: res.data,
    });
  } catch (e) {
    console.log(e.response);
    dispatch({ type: SET_ERRORS, payload: e.response });
  }
};

export const uploadProfilePic = (formData) => async (dispatch) => {
  dispatch({
    type: LOADING_USER,
  });
  try {
    await connectFirebase.post("/user/image", formData);
    dispatch(getUserData());
  } catch (e) {
    console.log(e);
  }
};

export const editUserInfo = (userInfo) => async (dispatch) => {
  dispatch({
    type: LOADING_USER,
  });
  try {
    await connectFirebase.post("/user", userInfo);
    dispatch(getUserData());
  } catch (e) {
    console.log(e.response.data);
  }
};

const setAuthorizationHeader = (token) => {
  const firebaseIdToken = `Bearer ${token}`;

  localStorage.setItem("firebaseIdToken", firebaseIdToken);

  //axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  connectFirebase.defaults.headers.common[
    "Authorization"
  ] = `${firebaseIdToken}`;
};
