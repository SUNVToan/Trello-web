import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const chipStyle = { 
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  px: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root, .MuiChip-label': {
    color: 'white',
  },
  '&:hover': {
    bgcolor: 'primary.100',
  },
}

function BoadBar() {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      padding: '0 16px',
      overflowX: 'auto',
      bgcolor: (theme) => theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <LeftSection />
      <RightSection />
    </Box>
  )
}

function LeftSection() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Chip
        sx={chipStyle}
        icon={<DashboardIcon />}
        label="Levi DashBoard"
        clickable
      />
      <Chip
        sx={chipStyle}
        icon={<VpnLockIcon />}
        label="Public/Private Workspace" 
        clickable
      />
      <Chip
        sx={chipStyle}
        icon={<AddToDriveIcon />}
        label="Add to Google Drive" 
        clickable
      />
      <Chip
        sx={chipStyle}
        icon={<BoltIcon />}
        label="Automations" 
        clickable
      />
      <Chip
        sx={chipStyle}
        icon={<FilterListIcon />}
        label="Filter Cards" 
        clickable
      />
    </Box>
  );
}

function RightSection() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Button
        variant="outlined"
        startIcon={<PersonAddIcon />}
        sx={{ color: 'white', border: 'none', '&:hover': { border: 'none' } }}
      >Invite</Button>
      <AvatarGroup
        max={5}
        sx={{
          gap: '10px',
          '& .MuiAvatar-root': {
            width: 34,
            height: 34,
            fontSize: 16,
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            '&:first-of-type': {bgcolor: '#a4b0be'},
          }
        }}
      >
        <Tooltip title="Levi Dev">
          <Avatar alt="Levi Dev" src="https://avatars.githubusercontent.com/u/86720210?s=40&v=4" />
        </Tooltip>
        <Tooltip title="Levi Dev">
          <Avatar alt="Levi Dev" src="https://avatars.githubusercontent.com/u/86720210?s=40&v=4" />
        </Tooltip>
        <Tooltip title="Levi Dev">
          <Avatar alt="Levi Dev" src="https://avatars.githubusercontent.com/u/86720210?s=40&v=4" />
        </Tooltip>
        <Tooltip title="Levi Dev">
          <Avatar alt="Levi Dev" src="https://avatars.githubusercontent.com/u/86720210?s=40&v=4" />
        </Tooltip>
        <Tooltip title="Levi Dev">
          <Avatar alt="Levi Dev" src="https://avatars.githubusercontent.com/u/86720210?s=40&v=4" />
        </Tooltip>
        <Tooltip title="Levi Dev">
          <Avatar alt="Levi Dev" src="https://avatars.githubusercontent.com/u/86720210?s=40&v=4" />
        </Tooltip>
      </AvatarGroup>
    </Box>
  );
}

export default BoadBar
