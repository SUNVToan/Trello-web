import { deepOrange, orange, teal, cyan, grey, blueGrey } from '@mui/material/colors';
import { experimental_extendTheme as extendTheme} from '@mui/material/styles'

// Create a theme instance.
const theme = extendTheme({
  trello: {
    appBarHeight: '58px',
    boardBarHeight: '60px',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange,
        background: {
          default: grey[300],
          paper: grey[100],
        },
        text: {
          primary: grey[900],
          secondary: grey[700],
        },
      },
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange,
        background: {
          default: blueGrey[900],
          paper: blueGrey[800],
        },
        text: {
          primary: grey[100],
          secondary: grey[300],
        },
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({theme}) => ({
          color: theme.palette.primary.main,
          fontSize: '0.875rem',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.light,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
        }),
      },
    },
  },
})

export default theme;