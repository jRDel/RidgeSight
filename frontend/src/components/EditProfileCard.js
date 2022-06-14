import React, { useState, useRef, useEffect } from 'react';
import "./EditProfileCard.css";
import config from "../config.js";
import { s3Upload } from "../lib/awsLib";
import { onError } from "../lib/errorLib";
import { API, Storage } from 'aws-amplify';

function EditProfileCard(user) {

    const [firstname, setFirstname] = useState(user.firstname);
    const [lastname, setLastname] = useState(user.lastname);
    const file = useRef(null);
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

    async function handleFileSubmit(e){
        e.preventDefault();
        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            alert(
              `Please pick a file smaller than ${
                config.MAX_ATTACHMENT_SIZE / 1000000
              } MB.`
            );
            return;
          }
        //post to db
        try {
            const pictureArn = file.current ? await s3Upload(file.current) : null; 
            console.log(pictureArn);    
            //await createSighting({ title, description, pictureArn, longitude, latitude, sighterId, sightedId, sighterName, sightedName });
            await uploadPicture(pictureArn);    
          } catch (e) {
            onError(e);
          }
     }


    function handleFileChange(event) {
        console.log("file changing");
        file.current = event.target.files[0];
    }

    function uploadPicture(pictureArn){
        console.log("api call");
        let obj = {
            attachment: pictureArn
        }
        return API.post("ridgesight", "/profilePicture", {
            body: obj,
            queryStringParameters: {
                userId: user.id
            }
        })
    }


    return <div className="card mt-2">
        <img src={photo} className="card-img-top profile-pic my-4" alt="profile" />
        
        <form onSubmit ={handleFileSubmit}>
            <div class="mb-3 mx-3">
                    <label for="profile-pic" class="form-label profile-upload">Choose New Profile Picture</label>
                    <input id="profile-pic" type="file" onClick={handleFileChange}></input>
            </div>
            <div class="mb-3 mx-3">
                <button className="btn btn-primary">Upload</button>
            </div>
        </form>
        
    </div>
}

export default EditProfileCard;