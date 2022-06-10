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

function NewSightingPopup() {
  const nav = useNavigate();
  const file = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagged, setTagged] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function renderChoosePage(){
    nav("/sighting/new");
  }
  function validateForm(){
    return title.length > 0 &&
    description.length > 0 &&
    tagged
  }
  
  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();
  
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
      const attachment = file.current ? await s3Upload(file.current) : null;
  
      await createSighting({ title, description, tagged, attachment });
      nav("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function createSighting(note) {
    return API.post("ridgesight", "/sighting", {
      body: note,
    });
  }

  function getUsers() {
    //Here should get users from API endpoint
  }


  return (
    <div>
          <Card style={{ width: '48rem' }}>
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
                <Form.Group controlId="tagged">
                  <Form.Label>Who is it?</Form.Label>
                  <Form.Select
                  value={tagged}
                  onChange={(e) => setTagged(e.target.value)}
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
                <CreateSightingMap />
                
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