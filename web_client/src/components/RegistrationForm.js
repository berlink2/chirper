import React, { useState } from "react";
import SignInForm from "./SigninForm";
import SignUpForm from "./SignupForm";
import BirdSvg from "./BirdSvg";
import styled from "styled-components";
import Button from "@material-ui/core/Button";

const Container = styled.div`
  max-width: 35rem;

  h1 {
    color: rgba(0, 0, 0, 0.85);
    font-size: 2rem;
    font-weight: bold;
    line-height: 2rem;
  }
  h2 {
    margin-top: 2rem;
    color: rgba(0, 0, 0, 0.85);
    font-size: 1.5rem;
    font-weight: bold;
  }

  Button {
    margin: 1.6rem 1rem auto auto;
    background-color: #1da1f2;
    color: white;

    width: 15rem;
  }

  .bird {
    width: 4.5rem;
  }
`;

const RegistrationForm = () => {
  const [Form, setForm] = useState("");

  const handleSignUpClick = () => {
    setForm("SignUp");
  };

  const handleSignInClick = () => {
    setForm("SignIn");
  };

  const handleReturnCLick = () => {
    setForm("");
  };

  if (Form === "SignIn") {
    return <SignInForm onBack={handleReturnCLick} />;
  }

  if (Form === "SignUp") {
    return <SignUpForm onBack={handleReturnCLick} />;
  }

  return (
    <Container>
      <BirdSvg className="bird" />
      <h1>See what’s happening in the world right now</h1>
      <h2>Join Chirper today.</h2>
      <Button
        style={{ fontSize: "1.5rem" }}
        variant="contained"
        size="large"
        onClick={handleSignInClick}
      >
        Sign In
      </Button>
      <Button
        style={{ fontSize: "1.5rem" }}
        variant="contained"
        size="large"
        onClick={handleSignUpClick}
      >
        Sign Up
      </Button>
    </Container>
  );
};

export default RegistrationForm;
