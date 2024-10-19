import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MapComponent from './MapComponent';
import CustomDrawer from './CustomDrawer';
import './App.css';
import SearchBar from './SearchBar';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [buildingsData, setBuildingsData] = useState([]); // Add state for buildings data
  

  // Simulate fetching of buildings data
  useEffect(() => {
    // This should be replaced with your actual data fetching logic
    const fetchedBuildingsData = [
      {
        id: 1,
        name: 'Learning Resource Center',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        imageUrl : '/img/LRC.png',
        coordinates: [[-0.775642, 50.845093], [-0.775679, 50.845204], [-0.775749, 50.845198], [-0.775770, 50.845242], [-0.775695,50.845252], [-0.775727,50.845333], [-0.775545,50.845360], [-0.775566,50.845401], [-0.775432,50.845421], [-0.775411,50.845377], [-0.775234,50.845401], [-0.775202,50.845319], [-0.775143,50.845333], [-0.775121,50.845286], [-0.775186,50.845272], [-0.775148,50.845167], [-0.775325,50.845137], [-0.775314,50.845120], [-0.775459,50.845103], [-0.775464,50.845120]],
        labelCoordinates: [-0.775443, 50.845245],
        labelZoom: 13
    },
    ];
    setBuildingsData(fetchedBuildingsData);
  }, []);

  // Function to handle building click
  const handleBuildingClick = (building) => {
    setSelectedBuilding(building);
    setDrawerOpen(true);
  };

  // Function to close the drawer
  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to handle selection from search results
  const handleSearchSelect = (building) => {
    // Logic to handle what happens when a building is selected from search results
    handleBuildingClick(building);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <SearchBar buildingsData={buildingsData} onBuildingSelect={handleSearchSelect} />
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <CustomDrawer 
        open={drawerOpen} 
        onClose={closeDrawer} 
        buildingData={selectedBuilding} 
      />
      <div style={{ flexGrow: 1 }}>
        <MapComponent onBuildingClick={handleBuildingClick} />
      </div>
    </div>
  );
}

export default App;
