import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';

function App() {
  return (
    <>
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
