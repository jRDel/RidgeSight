import React, { useState, useEffect } from "react";
import { useAppContext } from "../lib/contextLib";
import { onError } from "../lib/errorLib";
import { API } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import SightingMap from "../components/SightingMap";
import "./Home.css";

export default function Home(){
    return <>
        <SightingMap />
    </>
}