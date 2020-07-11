import React, { useState } from "react";

//mui
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
//redux
import { connect } from "react-redux";
import { deleteChirp } from "../../actions/dataActions";

import styled from "styled-components";

const Container = styled.div`
  #edit-icon {
    font-size: 2rem;
    color: #666666;
  }

  #iconWrapper {
    transform: translateY(-25%);
  }
`;

const ChirpOptionsButton = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  const handleDelete = () => {
    props.deleteChirp(props.chirpId);

    setAnchorEl(null);
  };

  return (
    <Container>
      <IconButton id="iconWrapper" onClick={handleMenu}>
        <MoreVertIcon id="edit-icon" />
      </IconButton>
      <Menu
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        keepMounted
        anchorEl={anchorEl}
        open={open}
        onClose={handleDelete}
      >
        <MenuItem onClick={handleDelete}>Delete Chirp</MenuItem>
      </Menu>
    </Container>
  );
};

export default connect(null, { deleteChirp })(ChirpOptionsButton);
