import React, { useState, useEffect } from "react";
import { useAppContext } from "../lib/contextLib";
import { onError } from "../lib/errorLib";
import { API } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import SightingMap from "../components/SightingMap";
import Scoreboard from "../components/Scoreboard";
import "./Home.css";

export default function Home(){
    return (
        <div className="row">
            <div className="col-4">
                <div className="scoreboard">
                    <Scoreboard />
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