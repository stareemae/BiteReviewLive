import { useState, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Autocomplete,
  Marker,
} from "@react-google-maps/api";
import PlaceCard from "./PlaceCard";
import FilterSortBar from "./FilterSortBar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/system";
import { useSnackbar } from "notistack";
import { TypeAnimation } from "react-type-animation";

const Container = styled("div")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "1rem 0",
  backgroundColor: "#FCF8F3",
});

const Title = styled("h1")({
  fontWeight: "bold",
  marginBottom: "0rem",
  color: "#698474",
});

const SubTitle = styled("h4")({
  marginBottom: "0rem",
  color: "#698474",
});

const MapContainerStyled = styled("div")({
  height: "35rem",
  width: "90%",
  borderRadius: "15px",
  overflow: "hidden",
  marginTop: "1rem",
});

const ContentContainer = styled("div")({
  width: "90%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "1rem 0",
});

const CardContainer = styled("div")({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1rem",
  width: "100%",
  justifyContent: "center",
  padding: "1rem",
});

const PaginationContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  marginTop: "1rem",
});

const libraries = ["places"];

const TORONTO_COOR = { lat: 43.65107, lng: -79.347015 };

const Map = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [ratingOption, setRatingOption] = useState("all");
  const [priceOption, setPriceOption] = useState("all");
  const [showResults, setShowResults] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyB-Xy4kYPkuNEe2ds0SlgIlYz1UvCPK4ys",
    libraries,
  });

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setMarkers([{ lat, lng, name: place.name }]);
      map.panTo({ lat, lng });
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  const handleSearch = () => {
    if (markers.length === 0) {
      enqueueSnackbar("Add a marker and try again!", {
        variant: "warning",
      });
      return;
    }

    const marker = markers[0];
    const markerLatLng = new window.google.maps.LatLng(marker.lat, marker.lng);

    const placesRequest = {
      location: markerLatLng,
      type: ["restaurant", "cafe", "bar", "meal_takeaway", "meal_delivery"],
      query: "restaurant",
      rankBy: window.google.maps.places.RankBy.DISTANCE,
    };

    const service = new window.google.maps.places.PlacesService(map);
    service.textSearch(placesRequest, (response) => {
      const results = response.map((place) => {
        const { rating, name, place_id, user_ratings_total } = place;
        const address = place.formatted_address;
        const priceLevel = place.price_level;
        let photoUrl = "";

        if (place.photos && place.photos.length > 0) {
          photoUrl = place.photos[0].getUrl();
        }

        return new Promise((resolve) => {
          service.getDetails({ placeId: place_id }, (placeDetails) => {
            const openNow = placeDetails.opening_hours
              ? placeDetails.opening_hours.isOpen()
              : false;

            const openingHours = formatOpeningHours(placeDetails.opening_hours);

            const directionService = new window.google.maps.DirectionsService();
            const directionRequest = {
              origin: markerLatLng,
              destination: address,
              travelMode: "WALKING",
            };

            directionService.route(directionRequest, (result, status) => {
              if (status !== "OK") {
                resolve(null);
                return;
              }

              const travellingRoute = result.routes[0].legs[0];
              const walkingDuration = travellingRoute.duration.text;

              resolve({
                name,
                rating,
                userRatingsTotal: user_ratings_total,
                address,
                openNow,
                priceLevel,
                photoUrl,
                walkingDuration,
                place_id,
                website: placeDetails.website || "",
                openingHours,
              });
            });
          });
        });
      });

      Promise.all(results).then((resolvedResults) => {
        const validResults = resolvedResults.filter((res) => res !== null);
        setSearchResults(validResults);
        setShowResults(true);
      });
    });
  };

  const formatOpeningHours = (openingHours) => {
    if (!openingHours || !openingHours.periods) return "No hours available";
    const today = new Date().getDay();
    const todayHours = openingHours.periods.find(
      (period) => period.open.day === today
    );
    if (!todayHours) return "No hours available";
    const openTime = formatTime(todayHours.open.time);
    const closeTime = formatTime(todayHours.close.time);
    return `${openTime} - ${closeTime}`;
  };

  const formatTime = (time) => {
    const hour = parseInt(time.slice(0, 2), 10);
    const minute = time.slice(2);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${period}`;
  };

  const sortAndFilterResults = () => {
    let sortedResults = [...searchResults];

    // Apply sorting
    if (ratingOption !== "all") {
      sortedResults = sortedResults.filter(
        (place) => Math.floor(place.rating) === parseInt(ratingOption)
      );
    }

    // Apply filtering (if needed)
    if (priceOption !== "all") {
      sortedResults = sortedResults.filter(
        (place) => place.priceLevel === parseInt(priceOption)
      );
    }

    setFilteredResults(sortedResults);
  };

  useEffect(() => {
    if (searchResults.length > 0) {
      sortAndFilterResults();
    }
  }, [ratingOption, priceOption, searchResults]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

  // Pagination logic
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResults.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container>
      <Title>Discover Your Next Favourite Bite!</Title>
      <SubTitle>
        <TypeAnimation
          sequence={[
            "Type an address below to get started:",
            1000,
            "",
            1000,
            "Type an address below to get started:",
            2000,
          ]}
          wrapper="span"
          cursor={true}
          repeat={Infinity}
        />
      </SubTitle>

      <MapContainerStyled>
        <GoogleMap
          mapContainerStyle={{ height: "100%", width: "100%" }}
          zoom={11}
          center={TORONTO_COOR}
          onLoad={(map) => setMap(map)}
        >
          {markers.map((marker, key) => (
            <Marker key={key} position={{ lat: marker.lat, lng: marker.lng }} />
          ))}
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <TextField
              variant="outlined"
              label="Enter a location"
              fullWidth
              style={{
                marginTop: "10px",
                width: "300px",
                backgroundColor: "white",
              }}
            />
          </Autocomplete>
        </GoogleMap>
      </MapContainerStyled>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        sx={{
          marginTop: "1rem",
          fontWeight: "bold",
          backgroundColor: "#698474",
          "&:hover": {
            backgroundColor: "#4b2400",
          },
        }}
      >
        Discover Now!
      </Button>

      {showResults && (
        <ContentContainer>
          <FilterSortBar
            ratingOption={ratingOption}
            setRatingOption={setRatingOption}
            priceOption={priceOption}
            setPriceOption={setPriceOption}
          />

          {filteredResults.length > 0 && (
            <>
              <Divider />
              <CardContainer>
                {currentItems.map((result, key) => (
                  <PlaceCard info={result} key={key} />
                ))}
              </CardContainer>

              <PaginationContainer>
                <Pagination
                  count={Math.ceil(filteredResults.length / itemsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  sx={{ color: "#693100" }}
                />
              </PaginationContainer>
            </>
          )}
        </ContentContainer>
      )}
    </Container>
  );
};

export default Map;
