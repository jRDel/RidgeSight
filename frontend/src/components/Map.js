import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

function MapContainer() {
  
  const mapStyles = {        
    height: "50vh",
    width: "50%"};
  
  const defaultCenter = {
    lat: 39.24773117180688, lng: -119.94798423558197
  }
  
  return (
     <LoadScript
       googleMapsApiKey='AIzaSyDS3kBSLk41ahDXI7bd7kJyJ7nBQCxz9Uo'>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={defaultCenter}
        />
     </LoadScript>
  )
}

export default MapContainer;