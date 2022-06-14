import React, { useRef, useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { onError } from "../lib/errorLib";
import { API } from "aws-amplify";
import { s3Upload } from "../lib/awsLib";
import { useNavigate } from "react-router-dom";
import config from "../config";
import Popup from 'reactjs-popup';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import LoaderButton from "./LoaderButton";
import CreateSightingMap from "./CreateSightingMap";
import { useAppContext } from "../lib/contextLib";
import FormLabel from "react-bootstrap/esm/FormLabel";
import { Auth } from 'aws-amplify';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';

function NewSightingPopup() {
  const nav = useNavigate();
  const file = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(39.2497);
  const [longitude, setLongitude] = useState(-119.9527);
  const [sightedName, setSightedName] = useState([]);
  const [sightedId, setSightedId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let sightedData = [];

  function renderChoosePage(){
    nav("/sighting/new");
  }

  function validateForm(){
    return title.length > 0 &&
    description.length > 0 &&
    sightedName
  }
  
  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const { attributes } = await Auth.currentAuthenticatedUser();
    let sighterId = attributes.sub;
    let sighterName = attributes.given_name + " " + attributes.family_name;
  
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
  
    setIsLoading(true);
  
    try {
      const pictureArn = file.current ? await s3Upload(file.current) : null;

      // let sighting = {
      //   title: "Jake Sighted at Bowling Alley!",
      //   description: "Saw Jake last night",
      //   pictureArn: "https://global-uploads.webflow.com/6126ab68c73f925bdc355c97/61b2cd92e6d4720544484d31_ridgeline-icon.svg",
      //   latitude: 39.246664,
      //   longitude: -119.948911,
      //   sighterId: 0,
      //   sightedId: [1,2],
      //   sightedName: ["Jake"],
      //   sighterName: "Jared",
      //   //thumbsUp: 4,
      //   //thumbsDown: 1,
      //   //createdAt: "2022-06-09",
      // }

      let sighting = {
        title, 
        description, 
        latitude, 
        longitude, 
        sighterId, 
        sightedName: sightedName, 
        sightedId: sightedId, 
        sighterName
      }
  
      await createSighting({...sighting, pictureArn});
      //await createSighting(sighting);
      nav("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function createSighting(sighting) {
    return API.post("ridgesight", "/sighting", {
      body: sighting,
    });
  }

  const [users, setUsers] = useState([]);
    
    useEffect(() => {
        async function onLoad(){
            const userList = await loadUsers();
            setUsers(userList);
        }
        onLoad();
    }, [])

    async function loadUsers(){
        return API.get("ridgesight", "/profile");
    }

//MAP
  const [currentPosition, setCurrentPosition] = useState({
    lat: 39.2497, 
    lng: -119.9527
  });

  const mapStyle = {        
    height: "40rem",
    width: "64rem"
  }

  const Loading = <div>Loading. Refresh if it takes too long!</div>
  
  const mapCenter = {
    lat: 39.2497, 
    lng: -119.9527
  }

const onMarkerDragEnd = (e) => {
  const lat =  e.latLng.lat();
  const lng = e.latLng.lng()
  setLatitude(lat);
  setLongitude(lng);
  setCurrentPosition({ lat, lng })
};

  return (
    <div className = "card">
          <Card style={{ width: '100%', margin: 'auto'}}>
          <Card.Body>
            <Card.Header as="h3">New Sighting</Card.Header>
            <div className="NewSighting">
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    value={title}
                    as="textarea"
                    rows={1}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    value={description}
                    as="textarea"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="sightedName">
                  <Form.Label>Who is it?</Form.Label>
                  <Form.Select
                  value={sightedData[1]}
                  onChange={(e) => {
                    sightedData = e.target.value.split(",");
                    setSightedName([sightedData[1]]);
                    setSightedId([sightedData[0]]);
                  }}
                  >
                   <option>Who did you see?</option>   
                      { users && 
                        users.map((user, index) => {
                          const test = [
                            user.id,
                            user.firstname + " " + user.lastname
                          ]
                          return (<option key={index} value={test}>
                              {user.firstname} {user.lastname}
                              </option>)
                        })
                      }
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="file">
                  <Form.Label>Attachment</Form.Label>
                  <Form.Control onChange={handleFileChange} type="file" />
                </Form.Group>
                <FormLabel>Choose where you saw this Ridgeliner</FormLabel>
                <br />
                <div className="map">
                  <LoadScript googleMapsApiKey={process.env.REACT_APP_MAP_API_KEY} loadingElement={Loading}>
                    <GoogleMap
                      mapContainerStyle={mapStyle}
                      zoom={15}
                      center={mapCenter}
                      mapTypeId='satellite'
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
                </div>
                
                <LoaderButton
                  block
                  type="submit"
                  size="lg"
                  variant="primary"
                  isLoading={isLoading}
                  disabled={!validateForm()}
                >
                  Submit
                </LoaderButton>
                
              </Form>
            </div>
          </Card.Body>
        </Card>
      </div>
      
    );
}

export default NewSightingPopup;