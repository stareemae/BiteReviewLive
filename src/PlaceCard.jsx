import { useState } from "react";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import ReviewsModal from "./ReviewsModal";

const StyledCard = styled(Card)({
  width: "100%",
  maxWidth: "300px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
  },
});

const StyledCardContent = styled(CardContent)({
  padding: "1rem",
});

const ImageWrapper = styled(CardMedia)({
  height: "200px",
  objectFit: "cover",
});

const CardTitle = styled(Typography)({
  "& a": {
    textDecoration: "none",
    color: "#693800",
    "&:hover": {
      color: "#0097c1",
    },
  },
});

const InfoList = styled("ul")({
  listStyleType: "none",
  padding: 0,
  textAlign: "left",
  margin: "0.5rem 0",
});

const ListItem = styled("li")({
  marginBottom: "0.5rem",
});

const ReadReviewsButton = styled(Button)({
  backgroundColor: "#698474",
  borderColor: "#ffffff",
  color: "#ffffff",
  "&:hover, &:focus, &:active": {
    backgroundColor: "#ddc08e",
    borderColor: "#ddc08e",
    color: "#ffffff",
  },
  "& a": {
    color: "#ffffff",
    textDecoration: "none",
  },
});

const PlaceCard = ({ info }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [placeName, setPlaceName] = useState("");

  const {
    address,
    walkingDuration,
    name,
    openNow,
    photoUrl,
    priceLevel,
    rating,
    userRatingsTotal,
    place_id,
    website,
    openingHours,
  } = info;

  const price = "$".repeat(priceLevel);

  const handleButtonClick = () => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    service.getDetails({ placeId: place_id }, (placeDetails) => {
      console.log(placeDetails.reviews); // Log the reviews to check for photos
      setPlaceName(name);
      setReviews(placeDetails.reviews || []);
      setModalOpen(true);
    });
  };

  return (
    <StyledCard>
      <ImageWrapper component="img" src={photoUrl} alt="place" />
      <StyledCardContent>
        <CardTitle variant="h6">
          <a href={website || "#"} target="_blank" rel="noopener noreferrer">
            {name}
          </a>
        </CardTitle>
        <Typography variant="body2" color="textSecondary" component="p">
          {address}
        </Typography>
        <InfoList>
          <ListItem>
            <strong>Rating:</strong> {rating} ({userRatingsTotal} reviews)
          </ListItem>
          <ListItem>
            <strong>Walking Distance:</strong> {walkingDuration}
          </ListItem>
          <ListItem>
            <strong>Hours:</strong> {openingHours}
          </ListItem>
          <ListItem>
            <strong>Price:</strong> {price}
          </ListItem>
        </InfoList>
        <Box textAlign="center">
          <ReadReviewsButton variant="contained" onClick={handleButtonClick}>
            Read Google Reviews
          </ReadReviewsButton>
        </Box>
      </StyledCardContent>
      <ReviewsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        placeName={placeName}
        reviews={reviews}
      />
    </StyledCard>
  );
};

export default PlaceCard;
