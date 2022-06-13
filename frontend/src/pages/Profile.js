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
    
    //const [user, setUser] = useState(null);

    // useEffect(() => {
    //     function loadUser() {
    //         return API.get("ridgesight", `/profile/${id}`);
    //     }

    //     async function onLoad() {
    //         try {
    //             const user = await loadUser();

    //             setUser(user);
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     }

    //     onLoad();        
    // }, [id])

    useEffect(() => {
        async function onLoad(){
            try{
                Auth.currentAuthenticatedUser({
                    bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
                }).then(user => console.log(user))
                .catch(err => console.log(err));
                //setuserDetails(details);
                console.log("USER DETAILS:" + user.email);
                //Get user profile stuff here
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
                            <EditProfileCard { ...user } />
                            <button className="mt-3 btn btn-primary" onClick={() => setEditMode(false)}>Cancel</button>
                        </div>
                    }

                    {!editMode &&
                        <div>
                            <ProfileCard { ...user } />
                            <button className="mt-3 btn btn-primary" onClick={() => setEditMode(true)}>Edit</button>
                        </div>
                    }
                
                </div>

                <div className="col-8">
                    <h1>Sightings of {userDetails.firstname} {userDetails.lastname}</h1>
                    <SightingMap />
                </div>
            </div>
        </div>
    </>
}

export default Profile;