import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import { signinUser } from "../actions/userActions";

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
    margin-top: 1.5rem;
    background-color: #1da1f2;
    color: white;
    width: 25rem;
    transform: translateX(20%);
  }

  .button-back {
    font-size: 1.5rem;
    margin-top: 1rem;
    color: #1da1f2;
    width: 25rem;
    transform: translateX(20%);
  }
`;

const SignInForm = (props) => {
  const { onBack, UI, signinUser } = props;
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const userInfo = {
      email,
      password,
    };
    setLoading(true);
    try {
      signinUser(userInfo, history);
    } catch (e) {
      setErrors(e);
      console.log(e);
    } finally {
      setEmail("");
      setPassword("");
    }
  };

  useEffect(() => {
    if (UI.errors) {
      setErrors(UI.errors);
    }
    return () => {};
  }, [UI.errors]);

  return (
    <Form>
      <h1>Sign In to your Chirper Account!</h1>
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <div className="field">
          <TextField
            inputProps={{ style: { fontSize: 20 } }}
            InputLabelProps={{ style: { fontSize: 20 } }}
            className="input"
            label="Email"
            type="email"
            helperText={errors.email}
            error={errors.email ? true : false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <TextField
            inputProps={{ style: { fontSize: 20 } }}
            InputLabelProps={{ style: { fontSize: 20 } }}
            className="input"
            label="Password"
            helperText={errors.email}
            error={errors.email ? true : false}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="button-submit"
          variant="contained"
          size="large"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress style={{ color: "white" }} size={25} />
          ) : (
            "Sign in"
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
  signinUser,
};

export default connect(mapStateToProps, mapActionsToProps)(SignInForm);
