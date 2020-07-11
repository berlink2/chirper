import React from "react";
import BirdSvg from "../components/BirdSvg";
import styled from "styled-components";
import RegistrationForm from "../components/RegistrationForm";

//mui icons
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import SearchIcon from "@material-ui/icons/Search";

//styled components
const Home = styled.div`
  background-color: white;
  .home {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .home-container {
    display: flex;
    width: 100vw;
    flex: 1 1 auto;
  }

  .home-container > div {
    width: 50%;
  }

  .yellow-side {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    background-color: #1da1f2;
    overflow: hidden;
  }

  .yellow-side p {
    position: relative;
    margin: 40px 0;
    display: flex;
    font-size: 1.23em;
    font-weight: 500;
    color: #fff;
  }

  .yellow-side p {
    margin-top: -4px;
    margin-right: 16px;
  }
  .yellow-side .twitter-bird {
    position: absolute;
    height: 140vh;
    right: -80vh;
  }

  .form-container {
    padding: 20px 20px 40px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .clone-explanation {
    position: absolute;
    top: 0;
    padding: 20px 60px;
  }
  .clone-explanation h3 {
    font-size: 1.7em;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.85);
  }

  @media (max-width: 800px) {
    .home {
      height: unset;
    }
    .home-container {
      flex-direction: column;
    }
    .home-container > div {
      width: 100%;
    }
    .yellow-side {
      order: 1;
    }
    .yellow-side .twitter-bird {
      height: 150%;
      right: -10%;
      top: -30%;
    }

    .yellow-side P {
      margin-top: 5rem;
    }
  }

  @media (max-height: 630px), (max-width: 800px) {
    .clone-explanation {
      position: relative;
      margin-bottom: 10px;
    }
  }
`;

const P = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 2rem;
  p {
    transform: translateX(10%);
  }
  .icon {
    font-size: 4rem;
    margin-right: 1rem;
  }
`;

const register = () => (
  <Home>
    <div className="home">
      <div className="home-container">
        <div className="yellow-side">
          <BirdSvg className="twitter-bird" />
          <P>
            <p>
              <SearchIcon color="inherit" className="icon" />
              Find your interests.
            </p>
            <p>
              <PeopleOutlineIcon color="inherit" className="icon" />
              Hear what people are talking about.
            </p>
            <p>
              <ChatBubbleOutlineIcon color="inherit" className="icon" />
              Join the conversation.
            </p>
          </P>
        </div>

        <div className="form-container">
          <div className="clone-explanation">
            <h3>Hey there!</h3>
            <p>
              This is a clone version of Twitter created for practice. You can
              check the source code <a href="/">here</a>.
            </p>
          </div>

          <RegistrationForm />
        </div>
      </div>
    </div>
  </Home>
);

export default register;
