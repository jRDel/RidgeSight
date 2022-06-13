import React, { useRef, useState } from "react";
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

function NewSightingPopup() {
  const nav = useNavigate();
  const file = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [sightedName, setSightedName] = useState([]);
  const [sightedId, setSightedId] = useState([]);
  const [sighterName, setSighterName] = useState("");
  const [sighterId, setSighterId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setSighterId(attributes.sub);
    setSighterName(attributes.given_name + " " + attributes.family_name);
  
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

      let sighting = {
        title: "Jake Sighted at Bowling Alley!",
        description: "stuff",
        pictureArn: "stuff",
        latitude: 39.247229,
        logitude: -119.948557,
        sighterId: 0,
        sightedId: [1,2],
        sightedName: ["Jake"],
        sighterName: "Jared",
        //thumbsUp: 4,
        //thumbsDown: 1,
        //createdAt: "2022-06-09",
      }
  
      //await createSighting({ title, description, pictureArn, longitude, latitude, sighterId, sightedId, sighterName, sightedName });
      await createSighting(sighting);
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

  function getUsers() {
    //Here should get users from API endpoint
  }


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
                  value={sightedName}
                  onChange={(e) => setSightedName(e.target.value)}
                  >
                    <option>Choose a Ridgeliner!</option>
                    <option>User 1</option>
                    <option>User 2</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="file">
                  <Form.Label>Attachment</Form.Label>
                  <Form.Control onChange={handleFileChange} type="file" />
                </Form.Group>
                <FormLabel>Choose where you saw this Ridgeliner</FormLabel>
                <br />
                <div className="map">
                  <CreateSightingMap />
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