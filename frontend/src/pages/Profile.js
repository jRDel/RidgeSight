import React, { useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import EditProfileCard from '../components/EditProfileCard';
import SightingMap from '../components/SightingMap';
import "./Profile.css";

function Profile() {
    const [editMode, setEditMode] = useState(false);

    const user = {
        username: "Name",
        description: "This is info about me.",
        image: "https://global-uploads.webflow.com/6126ab68c73f925bdc355c97/61b2cd92e6d4720544484d31_ridgeline-icon.svg",
        awards: ["Most Disliked", "Best Fit"],
    }

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
                    <h1>Sightings of {user.username}</h1>
                    <SightingMap />
                </div>
            </div>
        </div>
    </>
}

export default Profile;