import {
  SET_CHIRPS,
  LIKE_CHIRP,
  UNLIKE_CHIRP,
  LOADING_DATA,
  DELETE_CHIRP,
  POST_CHIRP,
  SET_CHIRP,
  CREATE_COMMENT,
  SET_COMMENTS,
} from "./types";

const initialState = {
  chirps: [],
  chirp: {},
  loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CHIRP:
      return {
        ...state,
        chirp: action.payload,
      };
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case SET_CHIRPS:
      return {
        ...state,
        chirps: action.payload,
        loading: false,
      };

    case POST_CHIRP:
      return {
        ...state,
        chirps: [action.payload, ...state.chirps],
      };
    case LIKE_CHIRP:
      // return {
      //   ...state,
      // };

      // let newLikes = {
      //   ...state,
      //   likes: [
      //     ...state.chirps,
      //     {
      //       userHandle: action.payload.chirpData.userHandle,
      //       chirpId: action.payload.chirpData.chirpId,
      //     },
      //   ],
      // };
      return { ...state };

    case UNLIKE_CHIRP:
      return {
        ...state,
        likes: state.chirps.filter(
          (chirp) => chirp.chirpId !== action.payload.chirpData.chirpId
        ),
      };

    // const index = state.chirps.findIndex(
    //   (chirp) => chirp.chirpId === action.payload.chirpId
    // );
    // state.chirps[index] = action.payload.chirpData;
    // console.log(action.payload);
    // if (state.chirp.chirpId === action.payload.chirpData.chirpId) {
    //   state.chirp = action.payload.chirpData;
    // }

    // return {
    //   ...state,
    // };
    case DELETE_CHIRP:
      const deletedChirpIndex = state.chirps.findIndex(
        (chirp) => chirp.chirpId === action.payload
      );
      state.chirps.splice(deletedChirpIndex, 1);
      return { ...state };

    case CREATE_COMMENT:
      // const index = state.chirps.findIndex(
      //   (chirp) => chirp.chirpId === action.payload.chirpId
      // );

      // state.chirps[index].comments = [{ ...action.payload }];
      return state;
    // console.log(state);
    // return {
    //   ...state,
    //   chirp: {
    //     ...state.chirp.name,
    //     comments: [action.payload, ...state.chirp.comments],
    //   },
    // };
    case SET_COMMENTS:
      const newState = { ...state, comments: [...action.payload] };

      return newState;
    default:
      return state;
  }
};
