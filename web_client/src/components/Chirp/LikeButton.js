import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

//mui
import FavoriteOutlinedIcon from "@material-ui/icons/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import IconButton from "@material-ui/core/IconButton";

//redux
import { connect } from "react-redux";
import { likeChirp, unlikeChirp } from "../../actions/dataActions";

const LikeButton = (props) => {
  const { likes, authenticated } = props.user;
  const likeCount = props.likeTally;
  const { chirpId, size } = props;
  const [isLiked, setIsLiked] = useState(false);

  //method that checks if post has been liked by user
  const likedChirp = () => {
    if (likes && likes.find((like) => like.chirpId === chirpId)) {
      setIsLiked(true);
      return true;
    } else {
      setIsLiked(false);
      return false;
    }
  };

  //when props have loaded, check if chirp has already been liked
  useEffect(() => {
    likedChirp();
  }, [props.user.loading]);

  //method for liking a chirp
  const likeChirp = () => {
    props.likeChirp(chirpId);

    setIsLiked(true);
  };

  //method for unliking  chirp
  const unlikeChirp = () => {
    props.unlikeChirp(chirpId);
    setIsLiked(false);
  };
  const likeButton = !authenticated ? (
    <Link to="/">
      <IconButton>
        <FavoriteBorderOutlinedIcon
          fontSize={size}
          style={{ color: "#f7347a" }}
        />
      </IconButton>
    </Link>
  ) : isLiked ? (
    <IconButton onClick={unlikeChirp}>
      <FavoriteOutlinedIcon fontSize={size} style={{ color: "#f7347a" }} />

      {likeCount > 0 ? <div id="count"> {likeCount}</div> : null}
    </IconButton>
  ) : (
    <IconButton onClick={likeChirp}>
      <FavoriteBorderOutlinedIcon
        fontSize={size}
        style={{ color: "#f7347a" }}
      />

      {likeCount > 0 ? <div id="count"> {likeCount}</div> : null}
    </IconButton>
  );

  return likeButton;
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionToProps = {
  likeChirp,
  unlikeChirp,
};

export default connect(mapStateToProps, mapActionToProps)(LikeButton);
