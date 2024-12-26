import ModeSelect from '~/components/ModeSelect'
import Box from '@mui/material/Box'
import AppsIcon from '@mui/icons-material/Apps'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import Typography from '@mui/material/Typography'
import Workspaces from './Menus/Workspaces'
import Started from './Menus/Started'
import Templates from './Menus/Templates'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Recent from './Menus/Recent'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'

function AppBar() {
  return (
    <Box px={2} sx={{
      backgroundColor: 'background.paper',
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
    }}>
      <LeftSection />
      <RightSection />
    </Box>
  );
}

function LeftSection() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <AppsIcon sx={{ color: 'primary.main', cursor: 'pointer' }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <SvgIcon fontSize='small' component={TrelloIcon} inheritViewBox sx={{ color: 'primary.main' }}/>
        <Typography variant="span" sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'primary.main', cursor: 'pointer' }}>Trello</Typography>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
        <Workspaces />
        <Recent />
        <Started />
        <Templates />
        <Button variant="outlined" startIcon={<LibraryAddIcon />}>Create</Button>
      </Box>
    </Box>
  );
}

function RightSection() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <TextField id="outlined-search" label="Search..." type="search" size='small' sx={{ color: 'primary.main', minWidth: '150px' }} />
      <ModeSelect sx={{ color: 'primary.main'}}/>
      <Tooltip title='Notifications'>
        <Badge color="secondary" variant="dot" sx={{ cursor: 'pointer' }}>
          <NotificationsNoneIcon sx={{ color: 'primary.main' }}/>
        </Badge>
      </Tooltip>
      <Tooltip title='Help Center'>
        <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'primary.main' }}/>
      </Tooltip>
      <Profiles />
    </Box>
  );
}

export default AppBar