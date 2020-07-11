import React, { useState, useEffect } from "react";

///mui
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

//redux
import { connect } from "react-redux";
import { editUserInfo } from "../actions/userActions";

const EditUserInfo = (props) => {
  const { loading } = props.user;

  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSubmit = async () => {
    const userInfo = {
      bio,
      website,
      location,
    };
    await props.editUserInfo(userInfo);
    handleClose();
  };

  const handleChange = (e) => {
    const name = e.target.name;

    switch (name) {
      case "bio":
        setBio(e.target.value);
        break;
      case "website":
        setWebsite(e.target.value);
        break;
      case "location":
        setLocation(e.target.value);
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    if (!loading) {
      const userInfo = props.user.info;
      setBio(userInfo.bio);
      setWebsite(userInfo.website);
      setLocation(userInfo.location);
    }
  }, [loading]);
  return (
    <>
      <p onClick={handleOpen}>Edit your Information</p>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit your Information</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              name="bio"
              type="text"
              label="Bio"
              multiline
              rows="3"
              placeholder="A short bio about you"
              className=""
              onChange={handleChange}
              value={bio}
              fullWidth
            />
            <TextField
              name="website"
              type="text"
              label="Website"
              multiline
              placeholder="Your website"
              className=""
              onChange={handleChange}
              value={website}
              fullWidth
            />
            <TextField
              name="location"
              type="text"
              label="Location"
              multiline
              placeholder="Where are you?"
              value={location}
              className=""
              onChange={handleChange}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { editUserInfo })(EditUserInfo);
