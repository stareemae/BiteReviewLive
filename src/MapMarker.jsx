import AlertIcon from "@mui/icons-material/Warning";
import { styled } from "@mui/system";

const Marker = styled("div")({
  position: "absolute",
  transform: "translate(-50%, -50%)",
  color: "red",
  fontSize: "1.5rem",
  display: "flex",
  alignItems: "center",
});

const MapMarker = ({ name, lat, lng }) => {
  return (
    <Marker lat={lat} lng={lng}>
      <span>{name}</span>
      <AlertIcon />
    </Marker>
  );
};

export default MapMarker;
