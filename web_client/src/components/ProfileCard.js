import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

//MUI
import Tooltip from "@material-ui/core/Tooltip";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import LanguageIcon from "@material-ui/icons/Language";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";

//redux
import { connect } from "react-redux";
import { uploadProfilePic, signoutUser } from "../actions/userActions";

const Container = styled.div`
  display: flex;
  transform: translateY(-35%);
  flex-direction: column;

  .spinner {
    margin: auto;
    margin-top: 15rem;
    color: #1b95e0;
  }

  .profileCard {
    margin: auto;
    min-height: 39rem;
    min-width: 25rem;
    border-radius: 1rem;
    box-shadow: 0px 3px 18px 1px #666666;
    display: flex;
    flex-direction: column;
  }

  .card-header {
    margin: 3rem auto 0 auto;
  }

  .card-header .card-avatar {
    height: 12.5rem;
    width: 12.5rem;
  }

  .card-content {
    margin: 2rem auto 0 3rem;
  }

  .card-content-item {
    margin-top: 1rem;
    transform: translateX(0);
  }
  a {
    font-weight: bold;
    color: #1b95e0;
    text-decoration: none;
    font-size: 1rem;
  }
  span {
    margin: 0 0 0 0.5rem;
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  #icon {
    transform: translateY(30%);
  }
  #edit {
    position: absolute;
    transform: translateX(200%) translateY(-50%);
  }
`;

const ProfileCard = (props) => {
  const {
    user: { loading, authenticated, info },
  } = props;

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    props.uploadProfilePic(formData);
  };

  const handleEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };
  // return <div></div>;
  return (
    <Container>
      {loading ? (
        <CircularProgress className="spinner" />
      ) : (
        <>
          <input
            type="file"
            id="imageInput"
            hidden="hidden"
            onChange={handleImageChange}
          />
          <Paper className="profileCard" elevation={3}>
            <div className="card-header">
              <Avatar
                className="card-avatar"
                alt={info.userHandle}
                src={info.imageUrl}
              />
              {authenticated && (
                <>
                  <Tooltip title="Edit profile picture" placement="top">
                    <IconButton id="edit" onClick={handleEditPicture}>
                      <EditRoundedIcon fontSize="large" color="action" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </div>
            <div className="card-content">
              <div className="card-content-item">
                <MuiLink
                  style={{ fontSize: 25 }}
                  color="primary"
                  variant="h4"
                  component={Link}
                  to={`/users/${info.userHandle}`}
                >
                  @{info.userHandle}
                </MuiLink>
              </div>
              <div className="card-content-item">
                {info.bio && <Typography variant="h6">{info.bio}</Typography>}
              </div>
              <div className="card-content-item">
                {info.location && (
                  <>
                    <LocationOnOutlinedIcon
                      id="icon"
                      fontSize="large"
                      variant="h6"
                    />
                    <span>{info.location}</span>
                  </>
                )}
              </div>
              <div className="card-content-item">
                {info.website && (
                  <>
                    <LanguageIcon id="icon" fontSize="large" variant="h6" />
                    <a
                      href={info.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {" "}
                      {info.website}
                    </a>
                  </>
                )}
              </div>
              <div className="card-content-item">
                {info.createdAt && (
                  <>
                    <CalendarTodayOutlinedIcon
                      id="icon"
                      fontSize="large"
                      variant="h6"
                    />
                    <span>
                      Joined {dayjs(info.createdAt).format("MMM YYYY")}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Paper>
        </>
      )}
    </Container>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionToProps = { uploadProfilePic, signoutUser };

export default connect(mapStateToProps, mapActionToProps)(ProfileCard);
