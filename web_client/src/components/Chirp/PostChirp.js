import React, { Component } from "react";
import styled from "styled-components";

///mui
import IconButton from "@material-ui/core/Button";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";

//redux
import { connect } from "react-redux";
import { postChirp } from "../../actions/dataActions";

const Container = styled.section`
  #chirp-button {
    background-color: #1da1f2;
    border-radius: 5rem;
    width: 10rem;
    height: 4rem;
    color: white;
    font-size: 1.5rem !important;
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

export class PostChirp extends Component {
  state = {
    open: false,
    body: "",
    error: "",
  };

  handleOpen = () => {
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
    this.props.postChirp({
      body: this.state.body,
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
    } = this.props;

    return (
      <Container>
        <Button id="chirp-button" onClick={this.handleOpen} variant="contained">
          Chirp
        </Button>

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
            <DialogTitle id="form-dialog-title">Post a new Chirp!</DialogTitle>
            <DialogContent className="content">
              <form onSubmit={this.handleSubmit}>
                <TextField
                  name="body"
                  type="text"
                  label="Your Chirp"
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
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  UI: state.UI,
});

export default connect(mapStateToProps, { postChirp })(PostChirp);
