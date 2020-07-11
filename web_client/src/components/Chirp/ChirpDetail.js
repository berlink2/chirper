import React, { useState, useEffect } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import LikeButton from "./LikeButton";

///mui
import Card from "@material-ui/core/Card";

import IconButton from "@material-ui/core/Button";

import CircularProgress from "@material-ui/core/CircularProgress";

import ChatBubbleOutlineRoundedIcon from "@material-ui/icons/ChatBubbleOutlineRounded";
import AutorenewOutlinedIcon from "@material-ui/icons/AutorenewOutlined";

//redux
import { connect } from "react-redux";
import { getChirp } from "../../actions/dataActions";

//const Comment = React.lazy(() => import("./Comment"));
const MainChirp = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  margin-bottom: 2rem;
  min-width: 80rem;
  min-height: 25rem;
  max-width: 40%;
  border-radius: 2rem;
  box-shadow: 0px 3px 18px 1px rgba(158, 158, 158, 1);
  .mui-card {
    border-radius: 2rem;
    min-height: 25rem;
  }
  .top {
    display: flex;
    align-items: center;
    margin-top: 2rem;
  }

  /* .options-button {
    position: relative;
    left: 60%;
  } */
  .main-card {
    justify-content: center;
    width: 100%;
    margin: 0 0 2rem 3rem;
  }

  .profilePic {
    border-radius: 50%;
    margin-right: 1rem;
  }
  .handle {
    font-weight: bold;
    font-size: 2rem;
  }

  .middle {
    width: 95%;
    margin-top: 1rem;
    font-weight: 500;
    font-size: 2rem;
    line-height: 1.3;
  }

  .bottom {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .timestamp {
    align-self: flex-start;
    color: rgb(136, 153, 166);
    font-size: 1.5rem;

    font-weight: 600;
  }

  .commentsAndLikes {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    margin-top: 0.5rem;
    font-size: 1.5rem;
    color: rgb(136, 153, 166);
    font-weight: 600;
  }

  .buttons {
    display: flex;
    margin-top: 1rem;
    width: 100%;
    justify-content: flex-start;
  }

  #numbers {
    color: black;
  }
`;

const ChirpDetail = (props) => {
  const { chirpId } = useParams();
  const [chirp, setChirp] = useState(null);

  let {
    body,
    createdAt,
    likeCount,
    commentCount,
    userImage,
    userHandle,
  } = props.chirp;
  useEffect(() => {
    const fetchChirp = () => {
      props.getChirp(chirpId);
    };
    fetchChirp();
  }, []);

  return (
    <>
      {!props.loading ? (
        <MainChirp>
          <Card className="mui-card">
            <div className="main-card">
              <div className="top">
                <img
                  className="profilePic"
                  alt="Chirper Profile"
                  src={userImage}
                  width="50"
                  height="50"
                />
                <span className="handle">@{userHandle}</span>
                {/* <div className="options-button">
                <ChirpOptionsButton />
              </div> */}
              </div>
              <div className="middle">{body}</div>

              <div className="bottom">
                <div className="timestamp">
                  {" "}
                  {chirp &&
                    dayjs(createdAt).format("h:mm A · MMM D, YYYY")}{" "}
                </div>
                <div className="commentsAndLikes">
                  <div>
                    <span id="numbers">{commentCount}</span>
                    &nbsp; Rechirps and Comments
                  </div>
                  &nbsp; &nbsp;
                  <div>
                    <span id="numbers">{likeCount}</span> &nbsp; Likes
                  </div>
                </div>
                <div className="buttons">
                  <IconButton>
                    <ChatBubbleOutlineRoundedIcon
                      style={{ color: "#1b95e0" }}
                      fontSize="large"
                    />
                  </IconButton>
                  <IconButton>
                    <AutorenewOutlinedIcon
                      style={{ color: "green" }}
                      fontSize="large"
                    />
                  </IconButton>

                  <LikeButton size="large" chirpId={chirpId} />
                </div>
              </div>
            </div>
          </Card>
        </MainChirp>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  chirp: state.data.chirp,
  UI: state.UI,
});

const mapActionToProps = {
  getChirp,
};

export default connect(mapStateToProps, mapActionToProps)(ChirpDetail);
