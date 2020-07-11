import {
  SET_CHIRPS,
  LOADING_DATA,
  LIKE_CHIRP,
  UNLIKE_CHIRP,
  DELETE_CHIRP,
  SET_ERRORS,
  POST_CHIRP,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_CHIRP,
  STOP_LOADING_UI,
  CREATE_COMMENT,
  SET_COMMENTS,
} from "../reducers/types";
import connectFirebase from "../api/connectFirebase";

export const getChirp = (chirpId) => async (dispatch) => {
  try {
    dispatch({ type: LOADING_UI });

    const res = await connectFirebase.get(`/chirp/${chirpId}`);

    dispatch({
      type: SET_CHIRP,
      payload: res.data,
    });

    dispatch({
      type: STOP_LOADING_UI,
    });
  } catch (e) {
    console.log(e);
  }
};

//fetch all chirps from firebase server
export const getChirps = () => async (dispatch) => {
  dispatch({
    type: LOADING_DATA,
  });

  try {
    const res = await connectFirebase.get("/chirps");

    dispatch({
      type: SET_CHIRPS,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: SET_CHIRPS,
      payload: [],
    });
  }
};

export const likeChirp = (chirpId) => async (dispatch) => {
  try {
    const res = await connectFirebase.get(`/chirp/${chirpId}/like`);
    //const res2 = await connectFirebase.get(`/chirp/${chirpId}`);

    dispatch({
      type: LIKE_CHIRP,
      payload: res.data,
    });
  } catch (e) {
    console.log(e);
  }
};

export const unlikeChirp = (chirpId) => async (dispatch) => {
  try {
    const res = await connectFirebase.get(`/chirp/${chirpId}/unlike`);
    //const res3 = await connectFirebase.get(`/chirp/${chirpId}`);
    dispatch({
      type: UNLIKE_CHIRP,
      payload: res.data,
    });
  } catch (e) {
    console.log(e);
  }
};

export const postChirp = (chirp) => async (dispatch) => {
  try {
    dispatch({
      type: LOADING_UI,
    });
    const res = await connectFirebase.post("/chirp", chirp);
    dispatch({
      type: POST_CHIRP,
      payload: res.data,
    });
    dispatch({
      type: CLEAR_ERRORS,
    });
  } catch (e) {
    dispatch({
      type: SET_ERRORS,
      payload: e.response.data,
    });
  }
};

export const deleteChirp = (chirpId) => async (dispatch) => {
  try {
    await connectFirebase.delete(`/chirp/${chirpId}`);
    dispatch({
      type: DELETE_CHIRP,
      payload: chirpId,
    });
  } catch (e) {
    console.log(e);
  }
};

export const createComment = (chirpId, comment) => async (dispatch) => {
  try {
    const res = await connectFirebase.post(
      `/chirp/${chirpId}/comment`,
      comment
    );

    dispatch({
      type: CREATE_COMMENT,
      payload: res.data,
    });

    dispatch({
      type: CLEAR_ERRORS,
    });
  } catch (e) {
    console.log(e);
    dispatch({
      type: SET_ERRORS,
      payload: e.response,
    });
  }
};

export const getComments = (chirpId) => async (dispatch) => {
  try {
    const res = await connectFirebase.get(`/chirp/${chirpId}/comment`);

    dispatch({
      type: SET_COMMENTS,
      payload: res.data,
    });
  } catch (e) {
    console.log(e);
  }
};

export const getUserPage = (userHandle) => async (dispatch) => {
  dispatch({
    type: LOADING_DATA,
  });
  try {
    const res = await connectFirebase.get(`/user/${userHandle}`);

    dispatch({
      type: SET_CHIRPS,
      payload: res.data.chirps,
    });
  } catch (e) {
    dispatch({
      type: SET_CHIRPS,
      payload: null,
    });
  }
};
