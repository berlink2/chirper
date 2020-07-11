import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import EditUserInfo from "../EditUserInfo";
import PostChirp from "./PostChirp";

//mui components
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TwitterIcon from "@material-ui/icons/Twitter";
import NotificationsOutlinedIcon from "@material-ui/icons/NotificationsOutlined";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import GitHubIcon from "@material-ui/icons/GitHub";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import CircularProgress from "@material-ui/core/CircularProgress";

//redux
import { connect } from "react-redux";
import { signoutUser } from "../../actions/userActions";

const ButtonContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;

  .signup-button {
    background-color: #1da1f2;
    border-radius: 5rem;
    font-size: 1.3rem;
    width: 10rem;
    height: 4.5rem;
    color: white;
    font-weight: 1000;
  }

  .signin-button {
    border-radius: 5rem;
    font-size: 1.3rem;
    width: 10rem;
    height: 4.5rem;
    margin-right: 1.5rem;
    font-weight: 1000;
  }

  .twitter-bird {
    color: #1b95e0;
    font-size: 4rem !important;
    margin-right: 1rem;
  }
  #button {
    font-size: 1.5rem;
    color: black;
  }

  #icon {
    font-size: 3rem !important;
    margin-right: 1rem;
  }

  .profile-pic-button {
    border-radius: 50%;
    align-self: flex-start;
    margin-right: 2rem;
  }

  .profile-pic {
    border-radius: 50%;
  }
  .left-buttons {
    margin-left: 2.5rem;
  }

  .right-buttons {
    display: flex !important;
    align-items: center;
    margin-right: 5rem;
  }

  .spinner {
    margin-right: 5rem;
    color: #1b95e0;
  }
`;
class ChirpNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: null,
      anchorEl: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.user.loading !== prevProps.user.loading) {
      this.setState({ ...prevState, imageUrl: this.props.user.info.imageUrl });
    }
  }

  handleSignout = () => {
    this.props.signoutUser();
  };

  handleMenu = (e) => {
    this.setState({
      anchorEl: e.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  render() {
    const { authenticated } = this.props.user;

    const open = Boolean(this.state.anchorEl);

    return (
      <AppBar position="static" color="transparent">
        <Toolbar>
          <ButtonContainer>
            <div className="left-buttons">
              <Button id="button" component={Link} to={`/`}>
                <TwitterIcon className="twitter-bird" />
                <span>Home</span>
              </Button>

              <Button id="button">
                <NotificationsOutlinedIcon id="icon" />
                <span>Notifications</span>
              </Button>

              <Button id="button">
                <EmailOutlinedIcon id="icon" />
                <span>Messages</span>
              </Button>
              <Button id="button">
                <GitHubIcon id="icon" />
                <span>Source Code</span>
              </Button>
            </div>

            <div className="right-buttons">
              {authenticated ? (
                <>
                  {this.state.imageUrl ? (
                    <div>
                      <IconButton
                        onClick={this.handleMenu}
                        size="small"
                        className="profile-pic-button"
                      >
                        <img
                          width="40"
                          height="40"
                          className="profile-pic"
                          src={this.state.imageUrl}
                          alt="Chirper Profile"
                        />
                      </IconButton>

                      <Menu
                        // anchorOrigin={{
                        //   vertical: "bottom",
                        //   horizontal: "center",
                        // }}
                        transformOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        keepMounted
                        anchorEl={this.state.anchorEl}
                        open={open}
                        onClose={this.handleClose}
                      >
                        <MenuItem onClick={this.handleClose}>
                          My Profile
                        </MenuItem>
                        <MenuItem onClick={this.handleClose}>
                          <EditUserInfo />
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to={`/register`}
                          onClick={this.handleSignout}
                        >
                          Sign Out
                        </MenuItem>
                      </Menu>
                    </div>
                  ) : (
                    <CircularProgress size="3rem" className="spinner" />
                  )}

                  <PostChirp />
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    className="signin-button"
                    component={Link}
                    to={"/register"}
                  >
                    Log in
                  </Button>
                  <Button
                    variant="contained"
                    className="signup-button"
                    component={Link}
                    to={"/register"}
                  >
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </ButtonContainer>
        </Toolbar>
      </AppBar>
    );
  }
}

const mapActionToProps = {
  signoutUser,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, mapActionToProps)(ChirpNavBar);
