import { useState } from 'react'
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
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

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
      bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0',
    }}>
      <LeftSection />
      <RightSection />
    </Box>
  );
}

function LeftSection() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <AppsIcon sx={{ color: 'white', cursor: 'pointer' }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <SvgIcon fontSize='small' component={TrelloIcon} inheritViewBox sx={{ color: 'white' }}/>
        <Typography variant="span" sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', cursor: 'pointer' }}>Trello</Typography>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
        <Workspaces />
        <Recent />
        <Started />
        <Templates />
        <Button
          variant="outlined"
          startIcon={<LibraryAddIcon />}
          sx={{ color: 'white', border: 'none', '&:hover': { border: 'none' } }}
        >Create</Button>
      </Box>
    </Box>
  );
}

function RightSection() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <TextField
        id="outlined-search" label="Search..."
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        size='small'
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'white' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <CloseIcon
              fontSize='small'
              sx={{color: searchValue ? 'white' : 'transparent', cursor: 'pointer' }}
              onClick={() => setSearchValue('')}
            />
          ),
        }}
        sx={{
          minWidth: '150px',
          maxWidth: '200px',
          '& label': { color: 'white' },
          '& input': { color: 'white' },
          '& label.Mui-focused': { color: 'white' },
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'white',},
            '&:hover fieldset': { borderColor: 'white',},
            '&.Mui-focused fieldset': { borderColor: 'white',},
          }
        }}
      />
      <ModeSelect
        sx={{ color: 'white' }}
      />
      <Tooltip title='Notifications'>
        <Badge color="warning" variant="dot" sx={{ cursor: 'pointer' }}>
          <NotificationsNoneIcon sx={{ color: 'white' }}/>
        </Badge>
      </Tooltip>
      <Tooltip title='Help Center'>
        <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }}/>
      </Tooltip>
      <Profiles />
    </Box>
  );
}

export default AppBar