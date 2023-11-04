import { createTheme, responsiveFontSizes } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    txt20: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {}

  interface PaletteColor {}

  interface SimplePaletteColorOptions {}

  interface TypeText {}
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {}
}

const theme = responsiveFontSizes(
  createTheme({
    typography: {},
    palette: {
      primary: {
        main: "#0077b5",
      },
    },

    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontSize: 15,
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: 18,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {},
      },
    },
  })
);

export default theme;
