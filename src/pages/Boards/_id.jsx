// container
import Container from '@mui/material/Container'
import AppBar from '../../components/AppBar'
import BoadBar from './BoardBar'
import BoardContent from './BoardContent'

function Board() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh', backgroundColor: 'primary.main'}}>
      <AppBar />
      <BoadBar />
      <BoardContent />      
    </Container>
  )
}

export default Board