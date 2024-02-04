"use client";

import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";

export default function KlinesChartSwitchButtons({ setInterval, interval }) {
  return (
    <FormControl>
      <RadioGroup
        row
        value={interval}
        onChange={(event) => {
          setInterval(event.target.value);
        }}
      >
        <FormControlLabel value="1m" control={<Radio />} label="1м" />
        <FormControlLabel value="3m" control={<Radio />} label="3м" />
        <FormControlLabel value="5m" control={<Radio />} label="5м" />
        <FormControlLabel value="30m" control={<Radio />} label="30м" />
        <FormControlLabel value="1h" control={<Radio />} label="1ч" />
        <FormControlLabel value="2h" control={<Radio />} label="2ч" />
        <FormControlLabel value="6h" control={<Radio />} label="6ч" />
        <FormControlLabel value="1d" control={<Radio />} label="1д" />
        <FormControlLabel value="3d" control={<Radio />} label="3д" />
        <FormControlLabel value="1w" control={<Radio />} label="1н" />
        <FormControlLabel value="1M" control={<Radio />} label="1М" />
      </RadioGroup>
    </FormControl>
  );
}
