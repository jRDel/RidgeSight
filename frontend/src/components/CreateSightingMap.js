import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';

function CreateSightingMap() {

  const [currentPosition, setCurrentPosition] = useState({lat: 39.2497, 
    lng: -119.9527});
  
    const mapStyle = {        
      height: "40rem",
      width: "40rem"
    }
  
  const mapCenter = {
    lat: 39.2497, 
    lng: -119.9527
  }

const onMarkerDragEnd = (e) => {
  const lat = e.latLng.lat();
  const lng = e.latLng.lng();
  setCurrentPosition({ lat, lng})
};

useEffect(() => {
  console.log(currentPosition)
}, [currentPosition])

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_MAP_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapStyle}
        zoom={15}
        center={mapCenter}
      >

        {
            currentPosition.lat ? 
            <MarkerF
            position={currentPosition}
            onDragEnd={(e) => onMarkerDragEnd(e)}
            draggable={true} /> :
            null
          }
      </GoogleMap>
    </LoadScript>
  )
}

export default CreateSightingMap;