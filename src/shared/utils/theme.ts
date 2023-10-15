import { createTheme, responsiveFontSizes } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteColor {
    25?: string;
    50?: string;
    200?: string;
    400?: string;
    500?: string;
    600?: string;
  }

  interface SimplePaletteColorOptions {
    25?: string;
    50?: string;
    200?: string;
    400?: string;
    500?: string;
    600?: string;
  }

  interface TypeText {
    25?: string;
    50?: string;
    200?: string;
    500?: string;
    400?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
    w9: string;
  }
}

// Update the Typography's variant prop options

const theme = responsiveFontSizes(
  createTheme({
    typography: {
      htmlFontSize: 10,
      fontSize: 13,
    },
    palette: {
      primary: { main: "#0072b1" },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            height: 44,
            minWidth: 120,
            borderRadius: 30, //in pixel
            fontSize: 16,
            fontWeight: 500,
            textTransform: "none",
            boxShadow: "none",
          },
          outlined: {
            background: "#fff",
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltipArrow: {
            fontSize: 15,
          },
        },
      },
    },
  })
);

export default theme;
