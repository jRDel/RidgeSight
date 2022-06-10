import React, { useState } from "react";
import { Auth } from "aws-amplify";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../lib/contextLib";
import { useFormFields } from "../lib/hooksLib";
import { onError } from "../lib/errorLib";

import "./Login.css";

export default function Login() {
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <div className="logo">
        <img src="/ridgelinesvg.svg"  width = "100" height = "100" alt="logo" />
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <LoaderButton
          block="true"
          size="lg"
          type="submit"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </Form>
      <div className="description">
        <h1>What is RidgeSight?</h1>
        <p>
          RidgeSight is a SST/React web application intended to be used by employees of Ridgeline to post
          sightings of each other! Like or dislike sightings, edit your profile picture, and take a look at the leaderboards. 
        </p>
      </div>
      <div className="how">
        <h2>How do I sign up?</h2>
        <p>
          RidgeSight is only available to employees of Ridgeline. The application is meant to be used in Incline Village, NV.
        </p>
      </div>
      <div className="why">
          <h3>Why?</h3>
          <p>
            For fun!
          </p>
      </div>
      <div className="bottomtext">
          This project was created for Ridgeline's Serverless Project for interns in Summer 2022.
      </div>
    </div>
  );
}