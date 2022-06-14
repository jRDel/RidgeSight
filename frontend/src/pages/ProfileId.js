import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import SightingMap from '../components/SightingMap';
import "./Profile.css";
import { API } from 'aws-amplify';
import { onError } from '../lib/errorLib';
import { Auth } from "aws-amplify";

function ProfileId() {
    const { id } = useParams();
    const [userDetails, setuserDetails] = useState({});
    
   async function loadProfilePicture(id){
        return API.get("ridgesight", "/profile", {
            queryStringParameters: {
                userId: id
            }
        })
    }

    async function loadUsers(){
        return API.get("ridgesight", "/profile");
    }

    useEffect(() => {
        async function onLoad(){
            try{
                let userList = await loadUsers();
                console.log(userList)

                const details = userList.find(element => element.id == id);

                console.log(details);
                let picture = await loadProfilePicture(id);
                let userDetail = {
                    firstname: details.attributes.given_name,
                    lastname: details.attributes.family_name,
                    id: details.attributes.sub,
                    awards: ["Best Fit", "Most Liked"],
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

export default ProfileId;