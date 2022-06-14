import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import "./SightingMap.css";
import { onError } from '../lib/errorLib';
import { API } from 'aws-amplify';
import { useAppContext } from "../lib/contextLib";

function SightingMap() {

  const [selected, setSelected] = useState({});
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [sightings, setSightings] = useState([]);
  const { isAuthenticated } = useAppContext();

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

  // const testSightings = [
  //   {
  //     title: "Title",
  //     description: "Description goes here.",
  //     image: "https://global-uploads.webflow.com/6126ab68c73f925bdc355c97/61b2cd92e6d4720544484d31_ridgeline-icon.svg",
  //     location: {
  //       lat: 39.249357, 
  //       lng: -119.963448
  //     },
  //     sighter: "sighter",
  //     sightee: "sightee",
  //   },
  //   {
  //       title: "Title2",
  //       description: "Description goes here.",
  //       image: "https://global-uploads.webflow.com/6126ab68c73f925bdc355c97/61b2cd92e6d4720544484d31_ridgeline-icon.svg",
  //       location: {
  //         lat: 39.251895, 
  //         lng: -119.944330
  //       },
  //       sighter: "sighter",
  //       sightee: "sightee",
  //   },
  //   {
  //     title: "Title3",
  //     description: "Description goes here.",
  //     image: "https://global-uploads.webflow.com/6126ab68c73f925bdc355c97/61b2cd92e6d4720544484d31_ridgeline-icon.svg",
  //     location: {
  //       lat: 39.252993, 
  //       lng: -119.951344
  //     },
  //     sighter: "sighter",
  //     sightee: "sightee",
  //   }
  // ]


  useEffect(() => {
    async function onLoad(){
      try{
        const sightingsArray = await loadSightings();
        setSightings(sightingsArray);
      } catch(e){
        onError(e);
      }
    }

    onLoad();
  }, [isAuthenticated])

  async function loadSightings(){
    return await API.get("ridgesight", "/sighting");
  }


  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_MAP_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapStyle}
        zoom={15}
        center={mapCenter}
        mapTypeId='satellite'
        key={sightings.length}
      >
        { sightings &&
          sightings.map(item => {
            return (<MarkerF key={item.title} position={{lat: item.latitude, lng: item.longitude}} onClick={() => onSelect(item)}/>)
          })
        }
          
        {
          selected.latitude && 
          (
            <InfoWindowF
              position={{lat: selected.latitude, lng: selected.longitude}}
              clickable={true}
              onCloseClick={() => setSelected({})}
            >
                <div>
                    <h5>{selected.title}</h5>
                    <p>{selected.description}</p>
                    <img src={selected.image} width="100px" height="100px" alt={selected.sightee}></img>
                    <div className="mt-3">
                        Seen here: <a href={`/users/${selected.sightee}`}>{selected.sightee}</a>
                    </div>
                    <div className="mt-2 mb-3">
                      Seen by: <a href={`/users/${selected.sighter}`}>{selected.sighter}</a>
                    </div>

                    {!upvoted && !downvoted && 
                      <div>
                        <button className="vote-button" onClick={() => {
                          setUpvoted(true);
                          console.log("upvoted");
                        }}>
                          <FontAwesomeIcon icon={faThumbsUp} />
                        </button>
                        <button className="vote-button" onClick={() => {
                          setDownvoted(true);
                          console.log("downvoted");
                          }}>
                          <FontAwesomeIcon className="mx-3" icon={faThumbsDown} />
                        </button>
                      </div>
                    }

                    { upvoted && 
                      <div>
                        <button className="upvoted" onClick={() => setUpvoted(false)}>
                          <FontAwesomeIcon icon={faThumbsUp} />
                        </button>
                        <button className="vote-button" onClick={() => {
                            setDownvoted(true);
                            setUpvoted(false);
                            console.log("downvoted");
                          }}>
                            <FontAwesomeIcon className="mx-3" icon={faThumbsDown} />
                        </button>
                      </div>
                    }

                    { downvoted && 
                      <div>
                        <button className="vote-button" onClick={() => {
                            setUpvoted(true);
                            setDownvoted(false);
                            console.log("upvoted");
                          }}>
                            <FontAwesomeIcon icon={faThumbsUp} />
                        </button>
                        <button className="downvoted" onClick={() => setDownvoted(false)}><FontAwesomeIcon className="mx-3" icon={faThumbsDown} /></button>
                      </div>
                    }
                </div>
          </InfoWindowF>
          )
        }
      </GoogleMap>
    </LoadScript>
  )
}

export default SightingMap;