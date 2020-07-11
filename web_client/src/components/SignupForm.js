import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useHistory } from "react-router-dom";

import { connect } from "react-redux";
import { signupUser } from "../actions/userActions";

const Form = styled.div`
  form {
    width: 35rem;
  }

  .input {
    width: 100%;
    font-size: 3rem;
  }

  .field {
    height: 7rem;
    margin-top: 1rem;
  }

  .button-submit {
    font-size: 1.5rem;
    margin-top: 1rem;
    background-color: #1da1f2;
    color: white;
    width: 25rem;
    transform: translateX(20%);
  }

  .button-back {
    font-size: 1.5rem;
    margin-top: 1.5rem;
    color: #1da1f2;
    width: 25rem;
    transform: translateX(20%);
  }
`;
const SignUpForm = (props) => {
  const { onBack, UI, signupUser } = props;
  const history = useHistory();
  const [userHandle, setUserHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userInfo = {
      userHandle,
      email,
      password,
      confirmPassword,
    };
    try {
      await signupUser(userInfo, history);
    } catch (e) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (UI.errors) {
      setErrors(UI.errors);
    }
    return () => {};
  }, [UI.errors]);

  // useEffect(() => {
  //   if (UI.errors) {
  //     setErrors(UI.errors);
  //   }
  //   return () => {};
  // }, [props.UI]);

  return (
    <Form>
      <h1>Sign Up for Chirper!</h1>
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <div className="field">
          <TextField
            inputProps={{ style: { fontSize: 20 } }}
            InputLabelProps={{ style: { fontSize: 20 } }}
            className="input"
            helperText={errors.email}
            error={errors.email ? true : false}
            value={userHandle}
            label="User Handle"
            type="text"
            onChange={(e) => setUserHandle(e.target.value)}
          />
        </div>
        <div className="field">
          <TextField
            inputProps={{ style: { fontSize: 20 } }}
            InputLabelProps={{ style: { fontSize: 20 } }}
            className="input"
            helperText={errors.email}
            error={errors.email ? true : false}
            value={email}
            type="email"
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <TextField
            inputProps={{ style: { fontSize: 20 } }}
            InputLabelProps={{ style: { fontSize: 20 } }}
            className="input"
            helperText={errors.email}
            error={errors.email ? true : false}
            value={password}
            type="password"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="field">
          <TextField
            inputProps={{ style: { fontSize: 20 } }}
            InputLabelProps={{ style: { fontSize: 20 } }}
            className="input"
            type="password"
            helperText={errors.email}
            error={errors.email ? true : false}
            value={confirmPassword}
            label="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="button-submit"
          variant="contained"
          size="large"
        >
          {loading ? (
            <CircularProgress style={{ color: "white" }} size={25} />
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>

      <Button
        className="button-back"
        size="large"
        color="primary"
        onClick={onBack}
      >
        Go Back
      </Button>
    </Form>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

const mapActionsToProps = {
  signupUser,
};

export default connect(mapStateToProps, mapActionsToProps)(SignUpForm);
