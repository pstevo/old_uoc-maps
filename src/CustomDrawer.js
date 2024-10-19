import React from 'react';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import LRC from './img/LRC.png'


const CustomDrawer = ({ open, onClose, buildingData,  onShowBuilding}) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 350,
          boxSizing: 'border-box',
          left: '60px',
        },
      }}
    >
      {buildingData ? (
        <>
          <Typography variant="h6" sx={{ padding: 2 }}>
            {buildingData.name}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => alert("Directions feature coming soon!")}
          >
            Get Directions
          </Button>
          <Button 
        variant="contained" 
        color="secondary" 
        onClick={() => buildingData && onShowBuilding(buildingData.coordinates)}
      >
        Show Building
      </Button>
          {buildingData.imageUrl && (
            <img src={LRC} alt={buildingData.name} style={{ maxWidth: '100%', height: 'auto' }} />
          )}
          <List>
            <ListItem>
              <ListItemText primary="Description" secondary={buildingData.description} />
            </ListItem>
            {/* Add more ListItem components here for other building data */}
          </List>
        </>
      ) : (
        <Typography variant="subtitle1" sx={{ padding: 2 }}>
          No building selected
        </Typography>
      )}
    </Drawer>
  );
};

export default CustomDrawer;
