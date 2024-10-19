import React, { useEffect, useRef, useState, useMemo} from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Point, Polygon } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Fill, Stroke, Text, Circle as CircleStyle } from 'ol/style';
import XYZ from 'ol/source/XYZ';
import FloorSelector from './FloorSelector';
import { getDistance } from 'ol/sphere';
import { toLonLat } from 'ol/proj';

const MapComponent = ({ onBuildingClick }) => {
    const mapRef = useRef();
    const [floorSelectorVisible, setFloorSelectorVisible] = useState(false);
    const [currentFloors, setCurrentFloors] = useState([]);
    const zoomThreshold = 14; // Set this to the zoom level at which layers should be hidden

    const buildingsData = [
        {
            id: 1,
            name: 'Learning Resource Center',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            imageUrl : '/img/LRC.png',
            coordinates: [[-0.775642, 50.845093], [-0.775679, 50.845204], [-0.775749, 50.845198], [-0.775770, 50.845242], [-0.775695,50.845252], [-0.775727,50.845333], [-0.775545,50.845360], [-0.775566,50.845401], [-0.775432,50.845421], [-0.775411,50.845377], [-0.775234,50.845401], [-0.775202,50.845319], [-0.775143,50.845333], [-0.775121,50.845286], [-0.775186,50.845272], [-0.775148,50.845167], [-0.775325,50.845137], [-0.775314,50.845120], [-0.775459,50.845103], [-0.775464,50.845120]],
            labelCoordinates: [-0.775443, 50.845245],
            labelZoom: 13
        },
        // ... more buildings
    ];

    // Function to be called when a building is clicked
    const handleBuildingSelection = (buildingId) => {
        // Find the building data by ID
        const buildingInfo = buildingsData.find(building => building.id === buildingId);

        if (buildingInfo) {
            // Call the callback function with the building data
            onBuildingClick(buildingInfo);
        }
    };

    const floorNames = {
        '-1': 'basement',
        '0': 'ground',
        '1': 'first',
        '2': 'second',
        '3': 'third',
        '4': 'fourth'
    };

    const createFloorLayer = (floor) => {
        const layer = new TileLayer({
            source: new XYZ({
                url: `https://a.maps.chi.ac.uk/${floorNames[floor]}/{z}/{x}/{y}.png`
            }),
            visible: false
        });
        console.log(`Layer created for floor ${floor}`, layer);
        return layer;
    };

    const floorLayers = useMemo(() => {
        const layerMappings = Object.keys(floorNames).reduce((layers, floor) => {
            layers[floor] = createFloorLayer(floor);
            return layers;
        }, {});
        return layerMappings;
    }, []);

    

    const [selectedFloor, setSelectedFloor] = useState(null);

    const onFloorSelect = (floor) => {
        console.log(`Floor selected: ${floor}`);
        setSelectedFloor(floor);
    
        // Hide all floor layers
        Object.values(floorLayers).forEach(layer => layer.setVisible(false));
    
        // Show the selected floor layer
        if (floorLayers[floor]) {
            floorLayers[floor].setVisible(true);
        }
    };

    useEffect(() => {
        const campuses = [
            { name: 'Chichester', coordinates: [-0.773969, 50.844932] },
            { name: 'Bognor Regis', coordinates: [-0.664316, 50.788580] },
        ];

        

        const campusVectorSource = new VectorSource();
        const buildingVectorSource = new VectorSource();

        campuses.forEach(campus => {
            const campusFeature = new Feature({
                geometry: new Point(fromLonLat(campus.coordinates)),
                name: campus.name,
                type: 'campus', // Identifier for campus features
            });

            campusFeature.setStyle(new Style({
                image: new CircleStyle({
                    radius: 10,
                    fill: new Fill({ color: 'blue' }),
                    stroke: new Stroke({ color: 'white', width: 2 }),
                }),
                text: new Text({
                    text: campus.name,
                    font: '16px Arial, sans-serif',
                    offsetY: -20,
                    backgroundFill: new Fill({ color: 'rgba(255, 255, 255, 0.7)' }),
                    padding: [2, 2, 2, 2],
                    fill: new Fill({ color: '#000' }),
                    stroke: new Stroke({ color: '#fff', width: 2 }),
                })
            }));

            campusVectorSource.addFeature(campusFeature);
        });

        buildingsData.forEach(building => {
            const buildingFeature = new Feature({
                geometry: new Polygon([building.coordinates.map(coord => fromLonLat(coord))]),
                name: building.name,
            });

            buildingFeature.setStyle(new Style({
                fill: new Fill({ color: 'rgba(100, 100, 100, 0.3)' }),
                stroke: new Stroke({ color: 'gray', width: 1 }),
                // Text style will be added based on zoom level
            }));

            buildingVectorSource.addFeature(buildingFeature);
        });

        const allLayers = [
            new TileLayer({ source: new OSM() }),
            new TileLayer({
                source: new XYZ({
                    url: 'https://a.maps.chi.ac.uk/outline/{z}/{x}/{y}.png'
                })
            }),
            ...Object.values(floorLayers), // Use pre-created floor layers
            new VectorLayer({ source: campusVectorSource }),
            new VectorLayer({ source: buildingVectorSource })
        ];

        const map = new Map({
            target: mapRef.current,
            layers: allLayers,
            view: new View({
                center: fromLonLat([-0.723766, 50.809886]),
                zoom: 11,
            }),
        });

        // Add a click listener to the map for buildings
        map.on('singleclick', function(event) {
            map.forEachFeatureAtPixel(event.pixel, function(feature) {
                if (feature.get('type') === 'building') {
                    // Retrieve the ID of the clicked building
                    const buildingId = feature.get('id');
                    handleBuildingSelection(buildingId);
                }
            });
        });

        buildingsData.forEach(building => {
            const buildingFeature = new Feature({
                geometry: new Polygon([building.coordinates.map(coord => fromLonLat(coord))]),
                id: building.id, // Make sure each feature has an ID
                type: 'building' // Add this property to identify building features
                // ... other properties if needed ...
            });

            // ... set style for buildingFeature ...

            buildingVectorSource.addFeature(buildingFeature);
        });
        
        // Floor Selector
        map.getView().on('change:resolution', () => {
            const zoom = map.getView().getZoom();
            const center = map.getView().getCenter();
            const centerLonLat = toLonLat(center);
            const campusProximity = checkCampusProximity(centerLonLat);
          
            if (zoom > 17.9 && campusProximity) {
              setFloorSelectorVisible(true);
              setCurrentFloors(campusProximity.floors);
            } else {
              setFloorSelectorVisible(false);
            }
          });

        // Hover interaction for buildings
        let hoveredBuildingFeature = null;
        map.on('pointermove', (event) => {
            if (hoveredBuildingFeature) {
                hoveredBuildingFeature.setStyle(null); // Reset previous hovered building style
                hoveredBuildingFeature = null;
            }

            map.forEachFeatureAtPixel(event.pixel, (feature) => {
                if (feature.getGeometry() instanceof Polygon) {
                    hoveredBuildingFeature = feature;
                    feature.setStyle(new Style({
                        fill: new Fill({ color: 'rgba(0, 255, 0, 0.3)' }),
                        stroke: new Stroke({ color: 'green', width: 2 }),
                        text: new Text({
                            text: feature.get('name'),
                            font: '14px Arial, sans-serif',
                            fill: new Fill({ color: '#000' }),
                            // Additional text styling as needed
                        }),
                    }));
                    return true;
                }
            });
        });

        // Click event for campuses
        map.on('singleclick', function (event) {
            map.forEachFeatureAtPixel(event.pixel, function (feature) {
                if (feature.get('type') === 'campus') {
                    const coordinates = feature.getGeometry().getCoordinates();
                    map.getView().animate({
                        center: coordinates,
                        zoom: 18,
                        duration: 1000,
                    });
                }
            });
        });

        // Update feature visibility based on zoom level
        map.getView().on('change:resolution', () => {
            const zoom = map.getView().getZoom();

            campusVectorSource.getFeatures().forEach(feature => {
                if (feature.get('type') === 'campus') {
                    const isVisible = zoom <= 16; // Adjust the zoom level threshold as needed
                    const style = feature.getStyle();
                    if (style) {
                        style.getImage().setScale(isVisible ? 1 : 0);
                        style.getText().setScale(isVisible ? 1 : 0);
                    }
                }
            });

            buildingVectorSource.getFeatures().forEach(feature => {
                const labelStyle = zoom >= feature.get('labelZoom') ? new Text({
                    text: feature.get('name'),
                    font: '14px Arial, sans-serif',
                    fill: new Fill({ color: '#000' }),
                    // Additional text styling as needed
                }) : null;

                feature.setStyle(new Style({
                    fill: new Fill({ color: 'rgba(100, 100, 100, 0.3)' }),
                    stroke: new Stroke({ color: 'gray', width: 1 }),
                    text: labelStyle,
                }));
            });
        });

        return () => {
            map.setTarget(null);
        };
    }, []);

    // Define a function to check proximity
    const checkCampusProximity = (center, threshold = 300) => {
        const campuses = [
            { name: 'Chichester', coordinates: [-0.773969, 50.844932,], floors: [-1, 0, 1, 2] },
            { name: 'Bognor Regis', coordinates: [-0.664316, 50.788580], floors: [-1, 0, 1, 2, 3, 4] }
        ];
    
        let closestCampus = null;
        let minDistance = Infinity;
    
    
        campuses.forEach(campus => {
            // Ensure campus coordinates are in geographic format
            const campusLonLat = campus.coordinates;
            const distance = getDistance(center, campusLonLat);
            
            // console.log(`Distance to ${campus.name}: ${distance} meters`);
    
            if (distance < minDistance) {
                minDistance = distance;
                closestCampus = campus;
            }
        });
    
        if (closestCampus && minDistance <= threshold) {
            return closestCampus;
        }
        return null;
    };

      return (
        <div>
          <div ref={mapRef} className="map-container"></div>
          <FloorSelector floors={currentFloors} visible={floorSelectorVisible} onSelectFloor={onFloorSelect} />
        </div>
      );
    };
    
export default MapComponent;
