[
  {
    field: "symbol",
    headerName: "Тикер",
    width: 150,
    renderCell: ({ value, row }) => (
      <MenuItem
        noWrap
        onClick={() => {
          setData({
            exchange: row.exchange,
            start: row.entryTime,
            end: row.exitTime,
            symbol: value,
          });
          window.scrollTo(0, 0);
          rowId.current = row.id;
        }}
        sx={{
          mt: "auto",
          mb: "auto",
          backgroundColor:
            rowId.current === row.id
              ? "rgba(0, 167, 111, 0.16)"
              : "transparent",
          "&:hover": {
            backgroundColor:
              rowId.current === row.id
                ? "rgba(0, 167, 111, 0.32)"
                : "rgba(255, 255, 255, 0.08)",
          },
        }}
      >
        {value}
      </MenuItem>
    ),
  },
  {
    field: "tags",
    headerName: "Причины входа",
    width: 350,
    renderCell: ({ value, row }) => (
      <Autocomplete
        multiple
        fullWidth
        noOptionsText="Нет данных"
        value={value ?? []}
        options={JSON.parse(localStorage.getItem("tags")) ?? []}
        onChange={(e, n) => {
          apiRef.current.updateRows([{ id: row.id, tags: n }]);
          updateTags(row.id, n);
        }}
        renderOption={(props, option, state, ownerState) => (
          <Box
            sx={{
              borderRadius: "8px",
              marginTop: "6px",
              [`&.${autocompleteClasses.option}`]: {
                padding: "8px",
              },
            }}
            component="li"
            {...props}
          >
            {ownerState.getOptionLabel(option)}
          </Box>
        )}
        ChipProps={{ variant: "soft", color: "info", size: "medium" }}
        popupIcon={<Iconify icon="solar:alt-arrow-down-bold-duotone" />}
        renderInput={(params) => (
          <TextField {...params} variant="standard" color="secondary" />
        )}
      />
    ),
  },
  {
    field: "rating",
    headerName: "Оценка",
    width: 150,
    renderCell: ({ value, row }) => (
      <Rating
        value={value}
        icon={<StarRoundedIcon color="warning" />}
        emptyIcon={<StarRoundedIcon color="text.secondary" />}
        onChange={(e, n) => {
          apiRef.current.updateRows([{ id: row.id, rating: n }]);
          updateRating(row.id, n);
        }}
      />
    ),
  },
  {
    field: "entryTime",
    headerName: "Время входа",
    width: 140,
    renderCell: ({ value }) => (
      <Stack
        sx={{
          textAlign: "right",
        }}
      >
        {DateTime.fromMillis(value).toLocaleString({
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {DateTime.fromMillis(value).toLocaleString({
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })}
        </Typography>
      </Stack>
    ),
  },
  {
    field: "exitTime",
    headerName: "Время выхода",
    width: 140,
    renderCell: ({ value }) => (
      <Stack
        sx={{
          textAlign: "right",
        }}
      >
        {DateTime.fromMillis(value).toLocaleString({
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {DateTime.fromMillis(value).toLocaleString({
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })}
        </Typography>
      </Stack>
    ),
  },
  {
    field: "side",
    headerName: "Сторона",
    description: "Направление сделки",
    renderCell: ({ value }) =>
      value === "BUY" ? (
        <Typography
          variant="subtitle1"
          sx={{
            color: "info.main",
          }}
        >
          LONG
        </Typography>
      ) : (
        <Typography
          variant="subtitle1"
          sx={{
            color: "warning.main",
          }}
        >
          SHORT
        </Typography>
      ),
  },
  {
    field: "averageEntryPrice",
    headerName: "Цена входа",
    description: "Средняя цена входа",
    width: 120,
    renderCell: ({ value, row }) => (
      <Typography variant="subtitle2">
        ${row.side === "BUY" ? value : row.averageExitPrice}
      </Typography>
    ),
  },
  {
    field: "averageExitPrice",
    headerName: "Цена выхода",
    description: "Средняя цена выхода",
    width: 130,
    renderCell: ({ value, row }) => (
      <Typography variant="subtitle2">
        ${row.side === "BUY" ? value : row.averageEntryPrice}
      </Typography>
    ),
  },
  {
    field: "duration",
    headerName: "Длительность",
    width: 200,
    valueFormatter: ({ value }) => {
      const hours = Math.floor(value / 1000 / 3600);
      const minutes = Math.floor((value / 1000 / 60) % 60);
      const seconds = Math.floor((value / 1000) % 60);
      return `${hours > 0 ? `${hours} час. ` : ""}${
        minutes > 0 ? `${minutes} мин. ` : ""
      }${seconds > 0 ? `${seconds} сек. ` : `${value % 1000} мс. `}`.trim();
    },
  },
  {
    type: "number",
    field: "procent",
    headerName: "Процент",
    renderCell: ({ value }) =>
      value >= 0 ? (
        <Box
          component="span"
          sx={{
            p: "0px 6px",
            width: "54px",
            height: "24px",
            lineHeight: "0",
            cursor: "default",
            fontWeight: "700",
            borderRadius: "6px",
            fontSize: "0.75rem",
            alignItems: "center",
            whiteSpace: "nowrap",
            display: "inline-flex",
            justifyContent: "center",
            color: "rgb(119, 237, 139)",
            textTransform: "capitalize",
            backgroundColor: "rgba(34, 197, 94, 0.16)",
            transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          }}
        >
          {value}%
        </Box>
      ) : (
        <Box
          component="span"
          sx={{
            p: "0px 6px",
            width: "54px",
            height: "24px",
            lineHeight: "0",
            cursor: "default",
            fontWeight: "700",
            fontSize: "0.75rem",
            borderRadius: "6px",
            alignItems: "center",
            whiteSpace: "nowrap",
            display: "inline-flex",
            justifyContent: "center",
            color: "rgb(255, 172, 130)",
            textTransform: "capitalize",
            backgroundColor: "rgba(255, 86, 48, 0.16)",
            transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          }}
        >
          {value}%
        </Box>
      ),
  },
  {
    type: "number",
    field: "income",
    headerName: "Доход",
    width: 150,
    valueFormatter: ({ value }) => `${value}$`,
  },
  {
    type: "number",
    field: "profit",
    headerName: "Прибыль",
    width: 150,
    valueGetter: ({ row }) =>
      `${(parseFloat(row.income) - parseFloat(row.comission)).toFixed(2)}$`,
  },
  {
    type: "number",
    field: "turnover",
    headerName: "Оборот",
    width: 150,
    renderCell: ({ value }) => (
      <Typography variant="subtitle2">{value}</Typography>
    ),
  },
  {
    type: "number",
    field: "maxVolume",
    headerName: "Макс. объём",
    width: 150,
    renderCell: ({ value, row }) => (
      <Typography variant="subtitle2">
        {value > row.turnover ? row.turnover : value}
      </Typography>
    ),
  },
  {
    type: "number",
    field: "volume",
    headerName: "Объём ($)",
    width: 150,
  },
  {
    type: "number",
    field: "comission",
    headerName: "Комиссия",
    width: 150,
    valueFormatter: ({ value }) => `$${value}`,
  },
  {
    type: "number",
    field: "apikey",
    headerName: "API-ключ",
    width: 150,
    renderCell: ({ value }) => (
      <Typography variant="subtitle2" noWrap sx={{ color: "text.disabled" }}>
        {value}
      </Typography>
    ),
  },
];
