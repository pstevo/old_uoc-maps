// SearchBar.js
import React, { useState } from 'react';
import { TextField, List, ListItem, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ buildingsData, onBuildingSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  // Handle search query change
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      const filtered = buildingsData.filter(building =>
        building.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults([]);
    }
  };
  return (
    <div style={{ 
      position: 'absolute', 
      top: '20px', 
      left: '50%', 
      transform: 'translateX(-150%)', 
      zIndex: 1000, 
      backgroundColor: '#fff', 
      padding: '5px', 
      borderRadius: '5px', 
      boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
      width: '400px'
    }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search Chichester Maps"
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: <SearchIcon position="start" />,
        }}
      />
      {filteredResults.length > 0 && (
        <List style={{ position: 'absolute', top: '100%', width: '100%', backgroundColor: 'white' }}>
          {filteredResults.map(building => (
            <ListItem button key={building.id} onClick={() => onBuildingSelect(building)}>
              <ListItemText primary={building.name} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default SearchBar;
