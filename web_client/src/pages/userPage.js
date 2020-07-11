import React, { Component } from "react";
import Navbar from "../components/Navbar";
import Grid from "@material-ui/core/Grid";
import styled from "styled-components";
import Chirp from "../components/Chirp/Chirp";
import UserPageProfile from "../components/User/UserPageProfile";
import connectFirebase from "../api/connectFirebase";

//mui
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

//redux
import { connect } from "react-redux";
import { getUserPage } from "../actions/dataActions";

const Container = styled.div`
  margin: 2.5rem auto 0 auto;
  max-width: 110rem;

  #spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    color: #1b95e0;
  }
  #spinner-2 {
    position: absolute;
    top: 30%;
    left: 15%;
    color: #1b95e0;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  .header-image {
    width: 100%;
    max-height: 30rem;
    min-height: 30rem;
  }
  .header-bar {
    background-color: #e5e5e5;
    width: 100%;
    min-height: 5rem;
    max-height: 5rem;
  }

  .header-bar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .chirp-buttons {
    margin: auto;
  }
  .follow-button {
    margin-right: 5rem;
    font-weight: 700;
  }
  #chirp-options {
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

class userPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      error: null,
    };
  }

  fetchProfile = async () => {
    try {
      const res = await connectFirebase.get(
        `/user/${this.props.match.params.userHandle}`
      );

      this.setState({
        profile: res.data.user,
      });
    } catch (e) {
      this.setState({
        error: e.response.data,
      });
    }
  };

  componentDidMount() {
    this.fetchProfile();
    this.props.getUserPage(this.props.match.params.userHandle);
  }

  render() {
    const { loading, chirps } = this.props.data;

    let headerImageUrl;
    if (this.state.profile) {
      headerImageUrl = this.state.profile.headerImageUrl;
    }

    return (
      <>
        <Navbar />
        <Header>
          {headerImageUrl && (
            <img
              className="header-image"
              alt="chirper header"
              src={headerImageUrl}
            />
          )}
          <div className="header-bar">
            <div className="chirp-buttons">
              <Button id="chirp-options">Chirps &amp; Replies</Button>
              <Button id="chirp-options">Chirps</Button>
              <Button id="chirp-options">Media</Button>
            </div>
            <div className="follow-button">
              <Button
                style={{
                  color: "white",
                  borderRadius: "2rem",
                  fontWeight: 700,
                }}
                size="large"
                variant="contained"
                color="primary"
              >
                Follow
              </Button>
            </div>
          </div>
        </Header>

        <Container>
          <Grid spacing={3} container>
            <Grid sm={3} xs={12} item>
              {this.state.profile ? (
                <UserPageProfile user={this.state.profile} />
              ) : (
                <CircularProgress id="spinner-2" />
              )}
            </Grid>
            <Grid sm={6} xs={12} item>
              {!loading ? (
                chirps.map((chirp) => {
                  return <Chirp key={chirp.chirpId} chirp={chirp} />;
                })
              ) : (
                <CircularProgress size="7.5rem" id="spinner" />
              )}
            </Grid>
            <Grid sm={3} xs={"auto"} item></Grid>
          </Grid>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { getUserPage })(userPage);
