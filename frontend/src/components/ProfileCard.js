import React from 'react';
import { Storage } from 'aws-amplify';
import { useState, useEffect } from 'react';
import { onError } from '../lib/errorLib';

function ProfileCard(user) {
    const [photo, setPhoto] = useState("");

    useEffect(() => {
        async function onLoad() {
            try {
                const p = await getProfilePicture();
                setPhoto(p);
            } catch (e) {
                onError(e);
            }
        }
        onLoad();
    }, [])

    async function getProfilePicture() {
        if(user.pictureArn){
            return await Storage.vault.get(user.pictureArn);
        }
    }

    return <div className="card mt-2">
        {user.pictureArn ? <img src={photo} /> : <img src="https://global-uploads.webflow.com/6126ab68c73f925bdc355c97/61b2cd92e6d4720544484d31_ridgeline-icon.svg" />}
        <div className="card-header"><h3>{user.firstname} {user.lastname}</h3></div>
        <div className="card-header"><h4>Awards</h4></div>
        <ul className="list-group list-group-flush">
            {
                user.awards?.map((award, index) => {
                    return <li key={index} className="list-group-item">{award}</li>
                })
            }
        </ul>
    </div>
}

export default ProfileCard;