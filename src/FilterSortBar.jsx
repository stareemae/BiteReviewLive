import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const FilterSortBar = ({
  ratingOption,
  setRatingOption,
  priceOption,
  setPriceOption,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      mb={2}
      mt={2}
      width="100%"
    >
      <FormControl variant="outlined" sx={{ minWidth: 120, marginRight: 2 }}>
        <InputLabel>Rating</InputLabel>
        <Select
          value={ratingOption}
          onChange={(e) => setRatingOption(e.target.value)}
          label="Rating"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="1">1 Star</MenuItem>
          <MenuItem value="2">2 Stars</MenuItem>
          <MenuItem value="3">3 Stars</MenuItem>
          <MenuItem value="4">4 Stars</MenuItem>
          <MenuItem value="5">5 Stars</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" sx={{ minWidth: 120 }}>
        <InputLabel>Price</InputLabel>
        <Select
          value={priceOption}
          onChange={(e) => setPriceOption(e.target.value)}
          label="Price"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="1">$</MenuItem>
          <MenuItem value="2">$$</MenuItem>
          <MenuItem value="3">$$$</MenuItem>
          <MenuItem value="4">$$$$</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterSortBar;
