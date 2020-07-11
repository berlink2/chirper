import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
///mui
import IconButton from "@material-ui/core/Button";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";

import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import ChatBubbleOutlineRoundedIcon from "@material-ui/icons/ChatBubbleOutlineRounded";

//redux
import { connect } from "react-redux";
import { createComment } from "../../actions/dataActions";

const ButtonWrapper = styled.div`
  align-self: center;
  display: flex;

  justify-content: center;
  width: 4rem;
  .comment-btn {
    margin: auto;
  }
  .comment-btn:hover {
    cursor: pointer;
  }
  .btn-bg {
    width: 4rem;
    display: flex;
    justify-content: center;

    height: 4rem;
    border-radius: 50%;
  }

  .btn-bg:hover {
    background-color: #f2f2f2;
  }

  #comment-count {
    position: relative;
    transform: translateY(35%);
    color: #666666;
    font-size: 1rem;
    font-weight: bold;
  }
`;

const DialogWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  .close-button {
    margin-top: 2rem;
    align-self: flex-end;
  }
  .textField {
    min-height: 10rem;
    min-width: 40rem;
  }

  .submit-button {
    margin-bottom: 2rem;
    margin-top: 1rem;
    transform: translateX(200%);
    border-radius: 5rem;
    width: 10rem;
    height: 4rem;
    color: white;
    font-size: 1.5rem !important;
  }
`;

export class CommentButton extends Component {
  state = {
    open: false,
    body: "",
    error: "",
  };

  handleOpen = () => {
    if (!this.props.authenticated) {
    }
    this.setState({
      open: true,
    });
  };
  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleChange = (e) => {
    this.setState({
      body: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.body.length === 0) {
      this.setState({
        error: "Chirp must not be empty",
      });
      return;
    } else if (this.state.body.length > 280) {
      this.setState({
        error: "Chirp must be no more than 280 characters",
      });
      return;
    }
    this.props.createComment(this.props.chirpId, {
      body: this.state.body,
    });
    this.setState({
      open: false,
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.UI.loading !== prevProps.UI.loading) {
      this.setState({
        body: "",
        open: false,
      });
    }
  }

  render() {
    const {
      UI: { loading },
      authenticated,
    } = this.props;

    const commentButton = authenticated ? (
      <ButtonWrapper onClick={this.handleOpen}>
        <span className="btn-bg">
          <ChatBubbleOutlineRoundedIcon
            className="comment-btn"
            style={{ color: "#1b95e0" }}
          />
        </span>
        {this.props.commentCount > 0 && (
          <span id="comment-count">{this.props.commentCount}</span>
        )}
      </ButtonWrapper>
    ) : (
      <Link to="/">
        <ButtonWrapper>
          <span className="btn-bg">
            <ChatBubbleOutlineRoundedIcon
              className="comment-btn"
              style={{ color: "#1b95e0" }}
            />
          </span>
          {this.props.commentCount > 0 && (
            <span id="comment-count">{this.props.commentCount}</span>
          )}
        </ButtonWrapper>
      </Link>
    );

    return (
      <>
        {commentButton}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
          id="box"
        >
          <DialogWrapper>
            <IconButton className="close-button" onClick={this.handleClose}>
              <HighlightOffRoundedIcon />
            </IconButton>
            <DialogTitle id="form-dialog-title">Post a comment!</DialogTitle>
            <DialogContent className="content">
              <form onSubmit={this.handleSubmit}>
                <TextField
                  name="body"
                  type="text"
                  label="Your Comment"
                  variant="outlined"
                  multiline
                  placeholder="Must be 280 characters or less"
                  error={this.state.error ? true : false}
                  helperText={this.state.error}
                  className="textField"
                  onChange={this.handleChange}
                  fullWidth
                  autoFocus
                />

                <Button
                  type="submit"
                  className="submit-button"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  Submit
                </Button>
              </form>
            </DialogContent>
          </DialogWrapper>
        </Dialog>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  UI: state.UI,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, { createComment })(CommentButton);
