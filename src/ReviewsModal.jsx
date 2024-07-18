import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/system";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  maxHeight: "80vh",
  bgcolor: "#FCF8F3",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
  display: "flex",
  flexDirection: "column",
  fontFamily: "'Lato', sans-serif",
};

const ReviewList = styled(Box)({
  flex: 1,
  overflowY: "auto",
  marginBottom: "1rem",
});

const ReviewItem = styled(Box)({
  marginBottom: "1rem",
});

const ReviewPhoto = styled("img")({
  width: "100px",
  height: "100px",
  objectFit: "cover",
  marginRight: "0.5rem",
  borderRadius: "5px",
});

const ReviewPhotoContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  marginTop: "0.5rem",
});

const PaginationContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  marginTop: "1rem",
});

const ReviewsModal = ({ open, onClose, placeName, reviews }) => {
  const [page, setPage] = useState(1);
  const reviewsPerPage = 10;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const indexOfLastReview = page * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Latest reviews for {placeName}
        </Typography>
        <ReviewList>
          {currentReviews && currentReviews.length > 0 ? (
            currentReviews.map((review, index) => (
              <ReviewItem key={index}>
                <Typography variant="body1">
                  <strong>{review.author_name}</strong>
                </Typography>
                <Typography variant="body2">{review.text}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Rating: {review.rating}
                </Typography>
                {review.photos && review.photos.length > 0 && (
                  <ReviewPhotoContainer>
                    {review.photos.map((photo, photoIndex) => (
                      <ReviewPhoto
                        key={photoIndex}
                        src={photo.getUrl()}
                        alt={`Review photo ${photoIndex + 1}`}
                      />
                    ))}
                  </ReviewPhotoContainer>
                )}
              </ReviewItem>
            ))
          ) : (
            <Typography variant="body2">No reviews available.</Typography>
          )}
        </ReviewList>
        {reviews.length > reviewsPerPage && (
          <PaginationContainer>
            <Pagination
              count={Math.ceil(reviews.length / reviewsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </PaginationContainer>
        )}
        <Box textAlign="center" mt={2}>
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              backgroundColor: "#698474",
              "&:hover": { backgroundColor: "#698474" },
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReviewsModal;
