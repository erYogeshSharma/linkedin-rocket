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

    components: {},
  })
);

export default theme;
