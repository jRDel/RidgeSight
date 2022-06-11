import React, { useState, useEffect } from "react";
import { useAppContext } from "../lib/contextLib";
import { onError } from "../lib/errorLib";
import { API, nav } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import Button from "react-bootstrap/Button";
import SightingMap from "../components/SightingMap";
import Scoreboard from "../components/Scoreboard";
import NewSightingPopup from "../components/NewSightingPopup";
import "./Home.css";
import NewSighting from "./NewSighting";
import { useNavigate } from "react-router-dom";

export default function Home(){
    const nav = useNavigate();
    
    function renderNewSighting(){
        nav("/sighting/new");
    }

    return (
        <div className="row">
            <div className="col-4">
                <div className="scoreboard">
                    <Scoreboard />
                </div>
                
                <div className="operations">
                    <h2>Operations</h2>
                    <Button variant="success" size= "lg" onClick={renderNewSighting}>New Sighting</Button>
                    
                </div>
            </div>
            <div className="col-8">
                <div className="map">
                    <SightingMap />
                </div>
            </div>
        </div>
    )
}