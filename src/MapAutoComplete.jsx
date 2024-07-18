import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/system";

const AutoCompleteStyled = styled(Autocomplete)({
  width: "45%",
});

const MapAutoComplete = ({
  torontoLatLng,
  autoCompleteService,
  geoCoderService,
  addMarker,
  markerName,
}) => {
  const [options, setOptions] = useState([]);

  const handleSearch = (value) => {
    if (value.length > 0) {
      const searchQuery = {
        input: value,
        location: torontoLatLng,
        radius: 30000,
      };

      autoCompleteService.getQueryPredictions(searchQuery, (response) => {
        if (response) {
          console.log("Autocomplete Predictions:", response);
          const newOptions = response.map((item) => ({
            value: item.description,
            placeId: item.place_id,
          }));
          setOptions(newOptions);
        } else {
          console.log("No predictions found");
        }
      });
    }
  };

  const onSelect = (value) => {
    console.log("Selected value:", value);
    geoCoderService.geocode({ address: value }, (response) => {
      if (response && response.length > 0) {
        const location = response[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        console.log("Geocoded location:", { lat, lng });
        addMarker(lat, lng, markerName);
      } else {
        console.log("Geocode failed");
      }
    });
  };

  return (
    <AutoCompleteStyled
      freeSolo
      options={options.map((option) => option.value)}
      onInputChange={(event, value) => handleSearch(value)}
      onChange={(event, value) => onSelect(value)}
      renderInput={(params) => (
        <TextField {...params} label="Address" variant="outlined" />
      )}
    />
  );
};

export default MapAutoComplete;
