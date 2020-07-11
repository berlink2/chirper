import React, { useEffect, useCallback } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useParams } from "react-router-dom";
///mui
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import ChatBubbleOutlineRoundedIcon from "@material-ui/icons/ChatBubbleOutlineRounded";
import AutorenewOutlinedIcon from "@material-ui/icons/AutorenewOutlined";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
//redux
import { connect } from "react-redux";
import { getComments } from "../../actions/dataActions";

const MainChirp = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-bottom: 2rem;
  min-width: 80rem;

  max-width: 40%;
  border-radius: 2rem;
  box-shadow: 0px 3px 18px 1px rgba(158, 158, 158, 1);
  .mui-card {
    border-radius: 2rem;
  }
  .top {
    display: flex;
    align-items: center;
    margin-top: 2rem;
  }
  .main-card {
    justify-content: center;
    width: 95%;
    margin: 0 0 2rem 3rem;
  }

  .profilePic {
    border-radius: 50%;
    margin-right: 1rem;
  }
  .handle-reply {
    display: flex;
    flex-direction: column;
  }
  .reply {
    color: rgb(136, 153, 166);
    font-size: 1rem;
    font-weight: 600;
  }
  .handle {
    font-weight: bold;
    font-size: 1.5rem;
  }

  .middle {
    width: 95%;
    margin-left: 7.25rem;
    margin-top: 1rem;
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 1.3;
  }

  .bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .timestamp {
    color: rgb(136, 153, 166);
    font-size: 1rem;

    font-weight: 600;
    position: relative;
    left: 45%;
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

  #count {
    color: #666666;
    margin-left: 1rem;
    font-size: 1rem;
    font-weight: bold;
  }
`;

const Comment = (props) => {
  dayjs.extend(relativeTime);
  const { chirpId } = useParams();
  const { comments } = props;
  const fetchComments = () => {
    props.getComments(chirpId);
  };
  useCallback(fetchComments, [props.comments]);

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <>
      {comments ? (
        comments.map((comment) => {
          return (
            <MainChirp key={comment.createdAt}>
              <Card className="mui-card">
                <div className="main-card">
                  <div className="top">
                    <img
                      className="profilePic"
                      alt="Chirper Profile"
                      src={comment.userImage}
                      width="50"
                      height="50"
                    />
                    <div className="handle-reply">
                      <span className="handle">@{comment.userHandle}</span>
                      <span className="reply">
                        Replying to Chirp {comment.chirpId}
                      </span>
                    </div>

                    <div className="timestamp">
                      {dayjs(comment.createdAt).fromNow()}
                    </div>
                  </div>
                  <div className="middle">{comment.body}</div>

                  <div className="bottom">
                    <div className="buttons">
                      <IconButton>
                        <ChatBubbleOutlineRoundedIcon
                          style={{ color: "#1b95e0" }}
                          fontSize="large"
                        />
                        <span id="count"></span>
                      </IconButton>
                      <IconButton>
                        <AutorenewOutlinedIcon
                          style={{ color: "green" }}
                          fontSize="large"
                        />
                      </IconButton>
                      <IconButton>
                        <FavoriteBorderOutlinedIcon
                          style={{ color: "#f7347a" }}
                          fontSize="large"
                        />
                        <span id="count"></span>
                      </IconButton>
                    </div>
                  </div>
                </div>
              </Card>
            </MainChirp>
          );
        })
      ) : (
        <CircularProgress color="primary" />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  comments: state.data.comments,
  UI: state.UI,
});

const mapActionToProps = {
  getComments,
};

export default connect(mapStateToProps, mapActionToProps)(Comment);
