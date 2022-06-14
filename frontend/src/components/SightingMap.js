import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import "./SightingMap.css";
import { onError } from '../lib/errorLib';
import { API, Auth, Storage} from 'aws-amplify';
import { useAppContext } from "../lib/contextLib";
import { useNavigate } from "react-router-dom";

function SightingMap() {

  const [selected, setSelected] = useState({});
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [sightings, setSightings] = useState([]);
  const { isAuthenticated } = useAppContext();
  const nav = useNavigate();

  const onSelect = async (item) => {
    if (item.pictureArn) {
      try {
      item.photo = await Storage.vault.get(item.pictureArn);
      } catch (error) {
        console.log("fetching the pictuer didn't work ", error)
      }
    }

    setSelected(item);

    let userProfile = (await API.get("ridgesight", "/profile", {
      queryStringParameters: {
        userId: (await Auth.currentAuthenticatedUser()).attributes.sub
      }
    }))[0];

    setUpvoted(userProfile.thumbsUp != null && userProfile.thumbsUp.includes(item.id))
    setDownvoted(userProfile.thumbsDown != null && userProfile.thumbsDown.includes(item.id))
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


   async function castVote(localUp, localDown) {
      console.log('booo', selected,  (await Auth.currentAuthenticatedUser()), localDown, localUp)
      let result = await API.post("ridgesight", "/vote", {
        body: {
          sightingId: selected.id,
          userId: (await Auth.currentAuthenticatedUser()).attributes.sub,
          vote: localUp ? 1: (localDown ? -1: 0)
        },
      });

      setSelected(result)
    }


  async function handleUpvoteClick() {
    if(upvoted === true) {
      setUpvoted(false);
      castVote(false, downvoted);
    } else if (upvoted === false) {
      setUpvoted(true);
      setDownvoted(false);
      castVote(true, false);
    }
  }

  async function handleDownvoteClick() {
    if(downvoted === true) {
      setDownvoted(false);
      castVote(upvoted, false)
    } else if (downvoted === false) {
      setDownvoted(true);
      setUpvoted(false);
      castVote(false, true);
    }
  }

  function renderOtherProfile(value){
    let nameArray = value.split(" ");
    nav('/otherprofile', {state: {firstname: nameArray[0], lastname: nameArray[1]}});
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
            return (<MarkerF key={item.id} position={{lat: item.latitude, lng: item.longitude}} onClick={() => onSelect(item)}/>)
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
                    <img src={selected.photo} width="100px" height="100px" alt={selected.sightedName[0]}></img>
                    <div className="mt-3">
                        Seen here: <a class="link" onClick={() => renderOtherProfile(selected.sightedName[0])}>{selected.sightedName[0]}</a>
                    </div>
                    <div className="mt-2 mb-3">
                      Seen by: <a class="link" onClick={() => renderOtherProfile(selected.sighterName)}>{selected.sighterName}</a>
                    </div>

                    <div>
                        <button className={upvoted === true ? "upvoted": "vote-button"} onClick={handleUpvoteClick}>
                        {selected.thumbsUp} <FontAwesomeIcon icon={faThumbsUp} />
                        </button>
                        <button className={downvoted === true ? "downvoted": "vote-button"} onClick={handleDownvoteClick}>
                        {selected.thumbsDown} <FontAwesomeIcon className="mx-3" icon={faThumbsDown} />
                        </button>
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