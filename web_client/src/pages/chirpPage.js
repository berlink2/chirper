import React, { Suspense } from "react";
import styled from "styled-components";

//components
import ChirpNavbar from "../components/Chirp/ChirpNavBar";
//import ChirpDetail from "../components/Chirp/ChirpDetail";
import Comment from "../components/Chirp/Comment";

//mui
import CircularProgress from "@material-ui/core/CircularProgress";
//redux

const Container = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;

  margin: 3rem auto 0 auto;
  height: 100%;
`;
//
const ChirpDetail = React.lazy(() => import("../components/Chirp/ChirpDetail"));

const ChirpPage = () => {
  return (
    <>
      <ChirpNavbar />
      <Container>
        {/* {props.UI.loading ? (
          <CircularProgress />
        ) : (
          <ChirpDetail chirp={chirp} />
        )} */}
        <Suspense fallback={<CircularProgress />}>
          <ChirpDetail />
        </Suspense>

        <Comment />
      </Container>
    </>
  );
};

// const mapStateToProps = (state) => ({
//   chirp: state.data.chirp,
//   UI: state.UI,
// });

// const mapActionToProps = {
//   getChirp,
// };

//export default connect(mapStateToProps, mapActionToProps)(ChirpPage);
export default ChirpPage;
