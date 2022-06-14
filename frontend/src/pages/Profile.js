import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import EditProfileCard from '../components/EditProfileCard';
import SightingMap from '../components/SightingMap';
import "./Profile.css";
import { API } from 'aws-amplify';
import { onError } from '../lib/errorLib';
import { Auth } from "aws-amplify";

function Profile() {
    //const { id } = useParams();

    const [editMode, setEditMode] = useState(false);
    const [userDetails, setuserDetails] = useState({});

    const user = {
        firstname: "Mary",
        lastname: "Rankin",
        image: "https://global-uploads.webflow.com/6126ab68c73f925bdc355c97/61b2cd92e6d4720544484d31_ridgeline-icon.svg",
        awards: ["Most Disliked", "Best Fit"],
    }
    
   async function loadProfilePicture(id){
        return API.get("ridgesight", "/profile", {
            queryStringParameters: {
                userId: id
            }
        })
    }

    useEffect(() => {
        async function onLoad(){
            try{
                let details = await Auth.currentAuthenticatedUser({
                    bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
                })
                console.log(details);
                let picture = await loadProfilePicture(details.attributes.sub);
                let userDetail = {
                    firstname: details.attributes.given_name,
                    lastname: details.attributes.family_name,
                    id: details.attributes.sub,
                    awards: ["Best Fit", "Most liked"],
                    pictureArn: picture[0].pictureArn,
                    //Will eventually need pfp and awards here as well
                }
                //console.log(picture[0].pictureArn);
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
                    {editMode && 
                        <div>
                            <EditProfileCard { ...userDetails } />
                            <button className="mt-3 btn btn-primary" onClick={() => setEditMode(false)}>Cancel</button>
                        </div>
                    }

                    {!editMode &&
                        <div>
                            <ProfileCard { ...userDetails } />
                            <button className="mt-3 btn btn-primary" onClick={() => setEditMode(true)}>Edit Profile Picture</button>
                        </div>
                    }
                
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

export default Profile;