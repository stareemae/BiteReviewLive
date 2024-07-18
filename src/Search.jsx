import Slider from "@mui/material/Slider";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import { styled } from "@mui/system";

const Section = styled("section")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const SliderContainer = styled("div")({
  display: "flex",
  width: "50%",
  alignItems: "center",
  marginBottom: "1rem",
});

const ClockIconStyled = styled(DirectionsWalkIcon)({
  fontSize: "1.5rem",
  marginRight: "1rem",
});

const Text = styled("span")({
  textAlign: "center",
});

const Search = ({ value, onChange, text }) => {
  return (
    <Section>
      <SliderContainer>
        <ClockIconStyled />
        <Slider
          sx={{ width: "100%" }}
          value={value}
          min={0}
          max={60}
          onChange={(e, newValue) => onChange(newValue)}
          valueLabelDisplay="auto"
        />
      </SliderContainer>
      <Text>{text}</Text>
    </Section>
  );
};

export default Search;
