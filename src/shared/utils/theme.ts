import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const token = {
  primary: {
    25: "#FFFAF5",
    50: "#FFF6ED",
    100: "#FFEAD5",
    200: "#FDDCAB",
    300: "#FEB273",
    400: "#FD853A",
    500: "#FB6514",
    600: "#EC4A0A",
    700: "#C4320A",
    800: "#53389E",
    900: "#42307D",
  },
};
declare module "@mui/material/styles" {
  interface TypographyVariants {
    txt20: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    txt12?: React.CSSProperties;
  }

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
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    txt12: true;
  }
}

const theme = responsiveFontSizes(
  createTheme({
    typography: {
      htmlFontSize: 10,
      fontSize: 13,

      txt12: {
        fontSize: 12,
      },
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
    },
  })
);

export default theme;
