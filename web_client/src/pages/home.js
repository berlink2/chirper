import React, { Component } from "react";
import Navbar from "../components/Navbar";
import Grid from "@material-ui/core/Grid";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import Chirp from "../components/Chirp/Chirp";
import ProfileCard from "../components/ProfileCard";

//mui
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

//redux
import { connect } from "react-redux";
import { getChirps } from "../actions/dataActions";

const Container = styled.div`
  margin: 2.5rem auto 0 auto;
  max-width: 110rem;

  #spinner {
    position: absolute;
    top: 50%;
    left: 50%;
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

class home extends Component {
  constructor(props) {
    super(props);

    this.state = { chirps: [], headerImage: {} };
  }

  componentDidMount() {
    this.props.getChirps();

    // this.setState((prevState) => {
    //   return {
    //     chirps: [...prevState.chirps, ...this.props.data.chirps],
    //   };
    // });
  }

  render() {
    const { loading, chirps } = this.props.data;
    let headerImageUrl;
    if (this.props.user.info) {
      headerImageUrl = this.props.user.info.headerImageUrl;
    }

    if (!this.props.user.authenticated) {
      return <Redirect to="/register" />;
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
            {/* <div className="follow-button">
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
            </div> */}
          </div>
        </Header>

        <Container>
          <Grid spacing={3} container>
            <Grid sm={3} xs={12} item>
              <ProfileCard />
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
  user: state.user,
});

export default connect(mapStateToProps, { getChirps })(home);
