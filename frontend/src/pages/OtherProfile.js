import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import EditProfileCard from '../components/EditProfileCard';
import SightingMap from '../components/SightingMap';
import "./Profile.css";
import { API } from 'aws-amplify';
import { onError } from '../lib/errorLib';
import { Auth } from "aws-amplify";
import { useLocation } from "react-router-dom";

function OtherProfile() {
    const [userDetails, setuserDetails] = useState({});
    const location = useLocation();
    
    useEffect(() => {
        async function onLoad(){
            try{
                let userDetail = {
                    firstname: location.state.firstname,
                    lastname: location.state.lastname,
                    awards: ["Best Fit", "Most liked"],
                    //Will eventually need pfp and awards here as well
                }
                console.log(userDetail);
                setuserDetails(userDetail);
                //setuserDetails(details);
                //Get user profile stuff here like image and awards
            }
            catch(e){
                onError(e);
            }
        }
        onLoad();
    }, [])

    return <>
        <div className="container">
            <div className="row mt-5">
                <div className="col-4">
                <div>
                    <ProfileCard { ...userDetails } />
                </div>
                </div>
                <div className="col-1">
                    <div className="vr"></div>
                </div>
                <div className="col-7">
                    <h1>Sightings of {userDetails.firstname} {userDetails.lastname}</h1>
                    <SightingMap />
                </div>
            </div>
        </div>
    </>
}

export default OtherProfile;