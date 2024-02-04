"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import { useState, useEffect, createContext, useContext } from "react";

const ThemeModeContext = createContext();

export default function ThemeRegistry({ children }) {
  const [mode, setMode] = useState("dark");

  useEffect(() => {
    const m = localStorage.getItem("mode");
    if (m !== null) {
      setMode(m);
      document.body.setAttribute("data-theme", m);
    }
  }, []);

  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode,
          primary: {
            main: "rgb(0, 167, 111)",
            light: mode === "dark" ? "rgb(91, 228, 155)" : "rgb(0, 167, 111)",
          },
          secondary: { main: "rgb(142, 51, 255)" },
          error: { main: "rgb(255, 86, 48)" },
          warning: { main: "rgb(255, 171, 0)" },
          info: { main: "rgb(0, 184, 217)" },
          success: { main: "rgb(34, 197, 94)" },
          text: {
            primary: mode === "dark" ? "rgb(255, 255, 255)" : "rgb(33, 43, 54)",
            secondary:
              mode === "dark" ? "rgb(145, 158, 171)" : "rgb(99, 115, 129)",
            disabled:
              mode === "dark" ? "rgb(99, 115, 129)" : "rgb(145, 158, 171)",
          },
          background: {
            paper: mode === "dark" ? "rgb(33, 43, 54)" : "rgb(255, 255, 255)",
          },
        },
        typography: {
          fontFamily: "inherit",
          h1: {
            fontWeight: 800,
            fontSize: "2.5rem",
            lineHeight: 1.25,
            "@media (min-width: 600px)": {
              fontSize: "3.25rem",
            },
            "@media (min-width: 900px)": {
              fontSize: "3.625rem",
            },
            "@media (min-width: 1200px)": {
              fontSize: "4rem",
            },
          },
          h2: {
            fontWeight: 800,
            fontSize: "2rem",
            lineHeight: 1.33333,
            "@media (min-width: 600px)": {
              fontSize: "2.5rem",
            },
            "@media (min-width: 900px)": {
              fontSize: "2.75rem",
            },
            "@media (min-width: 1200px)": {
              fontSize: "3rem",
            },
          },
          h3: {
            fontWeight: 700,
            fontSize: "1.5rem",
            lineHeight: 1.5,
            "@media (min-width: 600px)": {
              fontSize: "1.625rem",
            },
            "@media (min-width: 900px)": {
              fontSize: "1.875rem",
            },
            "@media (min-width: 1200px)": {
              fontSize: "2rem",
            },
          },
          h4: {
            fontWeight: 700,
            fontSize: "1.25rem",
            lineHeight: 1.5,
            "@media (min-width: 600px)": {
              fontSize: "1.25rem",
            },
            "@media (min-width: 900px)": {
              fontSize: "1.5rem",
            },
            "@media (min-width: 1200px)": {
              fontSize: "1.5rem",
            },
          },
          h5: {
            fontWeight: 700,
            fontSize: "1.125rem",
            lineHeight: 1.5,
            "@media (min-width: 600px)": {
              fontSize: "1.1875rem",
            },
            "@media (min-width: 900px)": {
              fontSize: "1.25rem",
            },
            "@media (min-width: 1200px)": {
              fontSize: "1.25rem",
            },
          },
          h6: {
            fontWeight: 700,
            fontSize: "1.0625rem",
            lineHeight: 1.55556,
            "@media (min-width: 600px)": {
              fontSize: "1.125rem",
            },
            "@media (min-width: 900px)": {
              fontSize: "1.125rem",
            },
            "@media (min-width: 1200px)": {
              fontSize: "1.125rem",
            },
          },
          subtitle1: {
            fontWeight: 600,
            fontSize: "1rem",
            lineHeight: 1.5,
          },
          subtitle2: {
            fontWeight: 600,
            fontSize: "0.875rem",
            lineHeight: 1.57143,
          },
          body1: {
            fontWeight: 400,
            fontSize: "1rem",
            lineHeight: 1.5,
          },
          body2: {
            fontWeight: 400,
            fontSize: "0.875rem",
            lineHeight: 1.57143,
          },
          caption: {
            fontWeight: 400,
            fontSize: "0.75rem",
            lineHeight: 1.5,
          },
          overline: {
            fontWeight: 700,
            fontSize: "0.75rem",
            lineHeight: 1.5,
          },
          button: {
            fontWeight: 700,
            fontSize: "0.875rem",
            lineHeight: 1.71429,
            textTransform: "unset",
          },
        },
        components: {
          MuiButton: {
            variants: [
              {
                props: {
                  size: "large",
                },
                style: {
                  height: "48px",
                  padding: "7px 21px",
                },
              },
              {
                props: {
                  variant: "contained",
                  color: "inherit",
                },
                style: {
                  backgroundColor:
                    mode === "dark" ? "rgb(255, 255, 255)" : "rgb(33, 43, 54)",
                  color:
                    mode === "dark" ? "rgb(33, 43, 54)" : "rgb(255, 255, 255)",
                  "&:hover": {
                    backgroundColor:
                      mode === "dark"
                        ? "rgb(196, 205, 213)"
                        : "rgb(69, 79, 91)",
                  },
                },
              },
              {
                props: {
                  variant: "outlined",
                  color: "inherit",
                  size: "medium",
                },
                style: {
                  border: "1px solid rgba(145, 158, 171, 0.32)",
                  "&:hover": {
                    borderColor: "currentcolor",
                    boxShadow: "currentcolor 0px 0px 0px 0.5px",
                  },
                },
              },
              {
                props: {
                  variant: "contained",
                  color: "primary",
                  size: "medium",
                },
                style: {
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "rgb(0, 120, 103)",
                    boxShadow: "rgba(0, 167, 111, 0.24) 0px 8px 16px 0px",
                  },
                },
              },
              {
                props: {
                  variant: "contained",
                  color: "secondary",
                  size: "medium",
                },
                style: {
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "rgb(81, 25, 183)",
                    boxShadow: "rgba(142, 51, 255, 0.24) 0px 8px 16px 0px",
                  },
                },
              },
              {
                props: {
                  variant: "contained",
                  color: "error",
                  size: "medium",
                },
                style: {
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "rgb(183, 29, 24)",
                    boxShadow: "rgba(255, 86, 48, 0.24) 0px 8px 16px 0px",
                  },
                },
              },
              {
                props: {
                  variant: "contained",
                  color: "warning",
                  size: "medium",
                },
                style: {
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "rgba(255, 171, 0, 0.24) 0px 8px 16px 0px",
                  },
                },
              },
            ],
            styleOverrides: {
              root: {
                appearance: "none",
                borderRadius: "8px",
              },
            },
          },
          MuiCard: {
            defaultProps: {
              elevation: 0,
            },
            styleOverrides: {
              root: {
                padding: "0px",
                position: "relative",
                borderRadius: "16px",
                backdropFilter: "none",
                backgroundSize: "unset",
                backgroundImage: "none",
                backgroundPosition: "unset",
                boxShadow:
                  mode === "dark"
                    ? "rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px"
                    : "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                marginBottom: "4px",
                padding: "6px 8px",
                borderRadius: "6px",
                fontSize: "0.875rem",
              },
            },
          },
          MuiPaper: {
            defaultProps: {
              elevation: 0,
            },
            styleOverrides: {
              root: {
                padding: "4px",
                borderRadius: "10px",
                backgroundSize: "50%, 50%",
                backgroundRepeat: "no-repeat, no-repeat",
                backgroundPosition: "right top, left bottom",
                backdropFilter: "blur(20px)",
                backgroundImage:
                  "url(/images/cyan-blur.png), url(/images/red-blur.png)",
                boxShadow:
                  mode === "dark"
                    ? "rgba(0, 0, 0, 0.24) 0px 0px 2px 0px, rgba(0, 0, 0, 0.24) -20px 20px 40px -4px"
                    : "rgba(145, 158, 171, 0.24) 0px 0px 2px 0px, rgba(145, 158, 171, 0.24) -20px 20px 40px -4px",
              },
            },
          },
          MuiList: {
            styleOverrides: {
              root: {
                paddingTop: "0px",
                paddingBottom: "0px",
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                borderColor: "rgba(145, 158, 171, 0.2)",
                borderStyle: "dashed",
                borderWidth: "0px 0px thin",
              },
            },
          },
          MuiAvatar: {
            styleOverrides: {
              root: {
                fontWeight: 600,
                border: "2px solid rgb(22, 28, 36)",
                backgroundColor: "rgb(255, 86, 48)",
                color:
                  mode === "dark" ? "rgb(255, 255, 255)" : "rgb(33, 43, 54)",
              },
            },
          },
          MuiAccordion: {
            styleOverrides: {
              root: {
                background: "inherit",
                boxShadow: "none",
                "&.MuiAccordion-root.Mui-expanded": {
                  backgroundColor:
                    mode === "dark" ? "rgb(33, 43, 54)" : "rgb(255, 255, 255)",
                  borderRadius: "8px !important",
                  boxShadow: "rgba(0, 0, 0, 0.16) 0px 8px 16px 0px",
                },
              },
            },
          },
          MuiAlert: {
            variants: [
              {
                props: { severity: "info" },
                style: {
                  backgroundColor:
                    mode === "dark" ? "rgb(0, 55, 104)" : "rgb(202, 253, 245)",
                  color:
                    mode === "dark" ? "rgb(202, 253, 245)" : "rgb(0, 55, 104)",
                },
              },
              {
                props: { severity: "error" },
                style: {
                  backgroundColor:
                    mode === "dark" ? "rgb(122, 9, 22)" : "rgb(255, 233, 213)",
                  color:
                    mode === "dark" ? "rgb(255, 233, 213)" : "rgb(122, 9, 22)",
                },
              },
              {
                props: { severity: "success" },
                style: {
                  backgroundColor:
                    mode === "dark" ? "rgb(6, 94, 73)" : "rgb(211, 252, 210)",
                  color:
                    mode === "dark" ? "rgb(211, 252, 210)" : "rgb(6, 94, 73)",
                },
              },
            ],
            styleOverrides: {
              root: {
                backgroundRepeat: "no-repeat, no-repeat",
                color: "rgb(255, 255, 255)",
                backgroundPosition: "none",
                backgroundRepeat: "none",
                backgroundImage: "none",
                backdropFilter: "none",
                boxShadow: "none",
                backgroundSize: 0,
                border: "none",
              },
            },
          },
          MuiSnackbar: {
            defaultProps: {
              transitionDuration: 300,
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                "&.Mui-focused": {
                  fontWeight: 800,
                },
              },
            },
          },
          MuiFormLabel: {
            styleOverrides: {
              root: {
                color: mode === "dark" ? "#5E6E7C" : "#919EAB",
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: "8px",
                "& fieldset": {
                  borderColor: "rgba(145, 158, 171, 0.2)",
                },
              },
            },
          },
          MuiDialog: {
            defaultProps: {
              BackdropProps: {
                sx: {
                  backgroundColor: "rgba(22, 28, 36, 0.8)",
                },
              },
              PaperProps: {
                sx: {
                  borderRadius: "16px",
                  boxShadow:
                    mode === "dark"
                      ? "rgba(0, 0, 0, 0.24) -40px 40px 80px -8px"
                      : "rgba(145, 158, 171, 0.24) -40px 40px 80px -8px",
                  margin: "16px",
                },
              },
            },
          },
          MuiDialogActions: {
            styleOverrides: { root: { padding: "24px", gap: "4px" } },
          },
          MuiSwitch: {
            styleOverrides: {
              root: {
                width: 28,
                height: 16,
                padding: "0px",
                display: "flex",
                "&:active": {
                  "& .MuiSwitch-thumb": {
                    width: 15,
                  },
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    transform: "translateX(9px)",
                  },
                },
                "& .MuiSwitch-switchBase": {
                  padding: 2,
                  "&.Mui-checked": {
                    transform: "translateX(12px)",
                    color: "#fff",
                    "& + .MuiSwitch-track": {
                      opacity: 1,
                      backgroundColor: "rgb(142, 51, 255)",
                    },
                  },
                },
                "& .MuiSwitch-thumb": {
                  boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  transition: "width 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                },
                "& .MuiSwitch-track": {
                  borderRadius: 16 / 2,
                  opacity: 1,
                  backgroundColor:
                    mode === "dark"
                      ? "rgba(255,255,255,.35)"
                      : "rgba(0,0,0,.25)",
                  boxSizing: "border-box",
                },
              },
            },
          },
          MuiPopover: {
            defaultProps: {
              slotProps: {
                boxShadow:
                  mode === "dark"
                    ? "rgba(0, 0, 0, 0.24) 0px 0px 2px 0px, rgba(0, 0, 0, 0.24) -20px 20px 40px -4px"
                    : "rgba(145, 158, 171, 0.24) 0px 0px 2px 0px, rgba(145, 158, 171, 0.24) -20px 20px 40px -4px",
              },
            },
          },
          MuiSkeleton: {
            styleOverrides: {
              root: {
                borderRadius: "16px",
                transform: "none",
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: "8px",
                marginBottom: "4px",
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: { fontWeight: 500, cursor: "default", borderRadius: "8px" },
            },
            variants: [
              {
                props: {
                  variant: "soft",
                  color: "warning",
                  size: "medium",
                },
                style: {
                  color:
                    mode === "dark" ? "rgb(255, 214, 102)" : "rgb(183, 110, 0)",
                  backgroundColor: "rgba(255, 171, 0, 0.16)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 171, 0, 0.32)",
                  },
                },
              },
              {
                props: {
                  variant: "soft",
                  color: "info",
                  size: "medium",
                },
                style: {
                  color:
                    mode === "dark" ? "rgb(97, 243, 243)" : "rgb(0, 108, 156)",
                  backgroundColor: "rgba(0, 184, 217, 0.16)",
                  "&:hover": {
                    backgroundColor: "rgba(0, 184, 217, 0.32)",
                  },
                  "& .MuiChip-deleteIcon": {
                    opacity: "0.5",
                    color: "inherit",
                    "&:hover": {
                      opacity: "1",
                      color: "inherit",
                    },
                  },
                },
              },
            ],
          },
        },
      })}
    >
      <ThemeModeContext.Provider value={{ mode, setMode }}>
        {children}
      </ThemeModeContext.Provider>
    </ThemeProvider>
  );
}

export function useMode() {
  return useContext(ThemeModeContext);
}
