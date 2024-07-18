import { styled } from "@mui/system";
import "./styles.scss";
import Map from "./MapsContainer";
import logo from "./assets/food-safety.png";
import { SnackbarProvider } from "notistack";
import GlobalStyles from "@mui/material/GlobalStyles";

const Container = styled("div")({
  textAlign: "center",
  height: "100vh",
  backgroundColor: "#FCF8F3",
});

const Header = styled("header")({
  backgroundColor: "#698474",
  height: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: "0 20px",
  fontSize: "calc(10px + 2vmin)",
  color: "white",
});

// const Logo = styled("img")({
//   height: "2rem",
//   marginRight: "10px",
// });

const Title = styled("h1")({
  margin: 0,
  fontSize: "1rem",
  color: "#ffffff",
});

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <GlobalStyles
        styles={{
          body: { margin: 0, padding: 0, fontFamily: "'Lato', sans-serif" },
          html: { margin: 0, padding: 0, height: "100%", width: "100%" },
          "#root": { height: "100%", width: "100%" },
          "*": { fontFamily: "'Lato', sans-serif" }, // Apply the font to all elements
        }}
      />
      <Container>
        <Header>
          <Title>BiteReview</Title>
        </Header>
        <div className="container h-100">
          <Map />
        </div>
      </Container>
    </SnackbarProvider>
  );
}

export default App;
