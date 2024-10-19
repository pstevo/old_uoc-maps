import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import NavigationIcon from '@mui/icons-material/Navigation';
import BusAlertIcon from '@mui/icons-material/DirectionsBus';
import SettingsIcon from '@mui/icons-material/Settings';
import CollapseIcon from '@mui/icons-material/ChevronLeft';
import ExpandIcon from '@mui/icons-material/ChevronRight';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <Drawer
      variant="permanent"
      open={isSidebarOpen}
      PaperProps={{
        style: {
          width: isSidebarOpen ? 240 : 60, // wider when open
          transition: 'width 0.3s',
          overflowX: 'hidden',
          whiteSpace: 'nowrap',
          zIndex: 1300,
        },
      }}
    >
      <List>
        {/* Collapse/Expand Icon */}
        <ListItem button onClick={toggleSidebar}>
          <ListItemIcon>
            {isSidebarOpen ? <CollapseIcon /> : <ExpandIcon />}
          </ListItemIcon>
        </ListItem>
        {/* Other icons */}
        <ListItem button>
          <ListItemIcon>
            <NavigationIcon />
          </ListItemIcon>
          <ListItemText primary="Navigation" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <BusAlertIcon />
          </ListItemIcon>
          <ListItemText primary="Bus Timetable" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;