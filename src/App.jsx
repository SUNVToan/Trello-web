import Button from '@mui/material/Button'
import HomeIcon from '@mui/icons-material/Home'
import Typography from '@mui/material/Typography'

function App() {
  return (
    <>
      <Typography variant="h1">Hello, world!</Typography>
      <div>ToanNguyenDev</div>
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>

      <HomeIcon />
      <HomeIcon color="primary" />
      <HomeIcon color="secondary" />
      <HomeIcon color="success" />
      <HomeIcon color="action" />
      <HomeIcon color="disabled" />
    </>
  )
}

export default App
