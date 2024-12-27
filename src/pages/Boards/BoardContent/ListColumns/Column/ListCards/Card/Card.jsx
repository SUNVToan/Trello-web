import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
// card
import { Card as MuiCard } from '@mui/material/'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
// 
import GroupIcon from '@mui/icons-material/Group'
import ModeCommentIcon from '@mui/icons-material/ModeComment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import PropTypes from 'prop-types'

function Card({ temporaryHideMedia }) {
  if (temporaryHideMedia) {
    return (
      <MuiCard sx={{ 
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        overflow: 'unset',
      }}>
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Typography>Card Test 01</Typography>
        </CardContent>
      </MuiCard>
    )
  }
  return (
    <MuiCard sx={{ 
      cursor: 'pointer',
      boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
      overflow: 'unset',
    }}>
      <CardMedia
        sx={{ height: 140 }}
        image="https://trungquandev.com/wp-content/uploads/2024/04/mern-stack-reactjs-nodejs-expressjs-mongodb-trello-dnd-kit-trungquandev-codetq-8-Large-1170x658.jpeg"
        title="green iguana"
      />
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>Luna Levi Dev</Typography>
      </CardContent>
      <CardActions sx={{ p: '0 4px 8px 4px' }}>
        <Button size="small" startIcon={<GroupIcon />}>20</Button>
        <Button size="small" startIcon={<ModeCommentIcon />}>15</Button>
        <Button size="small" startIcon={<AttachmentIcon />}>10</Button>
      </CardActions>
    </MuiCard>
  )
}

Card.propTypes = {
  temporaryHideMedia: PropTypes.bool.isRequired,
}

export default Card