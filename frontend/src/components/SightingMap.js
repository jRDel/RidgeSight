import React, { useState } from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';

function SightingMap() {

  const [selected, setSelected] = useState({});

  const onSelect = (item) => {
    setSelected(item);
  }
  
  const mapStyle = {        
    height: "100%",
    width: "100%"
  }
  
  const mapCenter = {
    lat: 39.2497, 
    lng: -119.9527
  }

  const sightings = [
    {
      title: "Title",
      description: "Description goes here.",
      image: "https://global-uploads.webflow.com/6126ab68c73f925bdc355c97/61b2cd92e6d4720544484d31_ridgeline-icon.svg",
      location: {
        lat: 39.249357, 
        lng: -119.963448
      },
      username: "username",
    },
    {
        title: "Title2",
        description: "Description goes here.",
        image: "https://global-uploads.webflow.com/6126ab68c73f925bdc355c97/61b2cd92e6d4720544484d31_ridgeline-icon.svg",
        location: {
          lat: 39.251895, 
          lng: -119.944330
        },
        username: "username2",
    }
]

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_MAP_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapStyle}
        zoom={15}
        center={mapCenter}
      >
        {
          sightings.map(item => {
            return (<MarkerF key={item.title} position={item.location} onClick={() => onSelect(item)}/>)
          })
        }
          
        {
          selected.location && 
          (
            <InfoWindowF
              position={selected.location}
              clickable={true}
              onCloseClick={() => setSelected({})}
            >
                <div>
                    <h5>{selected.title}</h5>
                    <p>{selected.description}</p>
                    <img src={selected.image} width="100px" height="100px"></img>
                    <div className="my-3">
                        Seen here: <a href={`/users/${selected.username}`}>{selected.username}</a>
                    </div>
                </div>
          </InfoWindowF>
          )
        }
      </GoogleMap>
    </LoadScript>
  )
}

export default SightingMap;