import React from "react";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Link, useHistory } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ChirpOptionsButton from "./ChirpOptionsButton";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
//mui
import IconButton from "@material-ui/core/IconButton";
import AutorenewOutlinedIcon from "@material-ui/icons/AutorenewOutlined";

//redux
import { connect } from "react-redux";
import { likeChirp, unlikeChirp } from "../../actions/dataActions";

const ChirpCard = styled.div`
  .ChirpGrid {
    margin-bottom: 2rem;
    display: grid;
    grid-template-columns: 1fr 7fr;
    min-height: 10rem;
    min-width: 45rem;
    border-radius: 1rem;
    box-shadow: 0px 3px 18px 1px rgba(158, 158, 158, 1);
  }

  .ChirpGrid:hover {
    background-color: #f2f2f2;
  }

  a {
    text-decoration: none;
    color: black;
    font-weight: bold;
  }

  .profilePic {
    border-radius: 50%;
    margin-top: 2rem;
    margin-left: 2rem;
    margin-right: 0;
  }
  .content {
    display: flex;
    flex-direction: column;
  }

  .top {
    display: flex;
    justify-content: space-between;

    height: 2.5rem;
  }

  .top-right {
    display: flex;
    transform: translateY(-10%);
  }

  #created-at {
    margin-right: 1rem;
    color: #666666;
    transform: translateY(20%);
    font-size: 1rem;
  }

  .middle {
    display: flex;
    flex-direction: column;
    transform: translate(1%, 10%);
    font-size: 1rem !important;
    line-height: 1.3;
    font-weight: 600;

    max-height: 2rem;

    margin-bottom: 1rem;
    max-width: 90%;
  }

  .body-button {
    opacity: 0;
    position: absolute;
    padding-bottom: 2.5rem;
    width: 100%;
    cursor: pointer;
  }

  .body-button:hover {
    opacity: 0;
  }

  .bottom {
    display: flex;

    transform: translateY(50%) translateX(-3%);
  }

  #count {
    margin-left: 1rem;
    color: #666666;
    font-size: 1rem;
    font-weight: bold;
  }
`;

const Chirp = (props) => {
  dayjs.extend(relativeTime);
  const history = useHistory();
  const {
    createdAt,
    userHandle,
    userImage,
    likeCount,
    body,
    commentCount,
    chirpId,
  } = props.chirp;

  return (
    <ChirpCard>
      <Card className="ChirpGrid">
        <div className="profile-pic">
          <img
            className="profilePic"
            alt="Chirper Profile"
            src={userImage}
            width="45"
            height="45"
          />
        </div>

        <CardContent className="content">
          <div className="top">
            <Typography
              component={Link}
              to={`/users/${userHandle}`}
              variant="h5"
            >
              @{userHandle}
            </Typography>
            <div className="top-right">
              <Typography id="created-at" variant="body2" color="textSecondary">
                {dayjs(createdAt).fromNow()}
              </Typography>
              <ChirpOptionsButton chirpId={chirpId} />
            </div>
          </div>

          <div
            className="middle"
            onClick={() => history.push(`/chirp/${chirpId}`)}
          >
            <button className="body-button"></button>
            {body}
          </div>

          <div className="bottom">
            {/* <ChatBubbleOutlineRoundedIcon style={{ color: "#1b95e0" }} />
              {commentCount > 0 ? <div id="count">{commentCount}</div> : null} */}
            <CommentButton chirpId={chirpId} commentCount={commentCount} />

            <IconButton>
              <AutorenewOutlinedIcon style={{ color: "green" }} />
            </IconButton>
            <LikeButton likeTally={likeCount} chirpId={chirpId} />
          </div>
        </CardContent>
      </Card>
    </ChirpCard>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionToProps = {
  likeChirp,
  unlikeChirp,
};

export default connect(mapStateToProps, mapActionToProps)(Chirp);
