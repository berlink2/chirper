import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

//MUI
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import MuiLink from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import LanguageIcon from "@material-ui/icons/Language";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";

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
    bio,
    createdAt,
    imageUrl,
    location,
    userHandle,
    website,
  } = props.user;
  console.log(props);
  // useEffect(() => {

  // }, [props]);

  // const handleImageChange = (e) => {
  //   const image = e.target.files[0];
  //   const formData = new FormData();
  //   formData.append("image", image, image.name);
  //   props.uploadProfilePic(formData);
  // };

  // const handleEditPicture = () => {
  //   const fileInput = document.getElementById("imageInput");
  //   fileInput.click();
  // };
  return (
    <Container>
      <>
        <Paper className="profileCard" elevation={3}>
          <div className="card-header">
            <Avatar className="card-avatar" alt={userHandle} src={imageUrl} />
          </div>
          <div className="card-content">
            <div className="card-content-item">
              <MuiLink
                style={{ fontSize: 25 }}
                color="primary"
                variant="h4"
                component={Link}
                to={`/users/${userHandle}`}
              >
                @{userHandle}
              </MuiLink>
            </div>
            <div className="card-content-item">
              {bio && <Typography variant="h6">{bio}</Typography>}
            </div>
            <div className="card-content-item">
              {location && (
                <>
                  <LocationOnOutlinedIcon
                    id="icon"
                    fontSize="large"
                    variant="h6"
                  />
                  <span>{location}</span>
                </>
              )}
            </div>
            <div className="card-content-item">
              {website && (
                <>
                  <LanguageIcon id="icon" fontSize="large" variant="h6" />
                  <a href={website} target="_blank" rel="noopener noreferrer">
                    {" "}
                    {website}
                  </a>
                </>
              )}
            </div>
            <div className="card-content-item">
              {createdAt && (
                <>
                  <CalendarTodayOutlinedIcon
                    id="icon"
                    fontSize="large"
                    variant="h6"
                  />
                  <span>Joined {dayjs(createdAt).format("MMM YYYY")}</span>
                </>
              )}
            </div>
          </div>
        </Paper>
      </>
    </Container>
  );
};

// const mapStateToProps = (state) => ({
//   user: state.user,
// });

// const mapActionToProps = { uploadProfilePic };

//export default connect(mapStateToProps, mapActionToProps)(ProfileCard);
export default ProfileCard;
