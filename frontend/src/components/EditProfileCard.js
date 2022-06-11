import React, { useState } from 'react';
import "./EditProfileCard.css";

function EditProfileCard(user) {

    const [firstname, setFirstname] = useState(user.firstname);
    const [lastname, setLastname] = useState(user.lastname);

    const handleFileSubmit = (e) => {
        e.preventDefault();

        //post to db
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        //post to db
    }

    return <div className="card mt-2">
        <img src="https://global-uploads.webflow.com/6126ab68c73f925bdc355c97/61b2cd92e6d4720544484d31_ridgeline-icon.svg" className="card-img-top profile-pic my-4" alt="profile" />
        
        <form onSubmit ={handleFileSubmit}>
            <div class="mb-3 mx-3">
                    <label for="profile-pic" class="form-label profile-upload">Choose New Profile Picture</label>
                    <input id="profile-pic" type="file"></input>
            </div>
            <div class="mb-3 mx-3">
                <button className="btn btn-primary">Upload</button>
            </div>
        </form>
        
        <form onSubmit ={handleSubmit}>
            <div className="card-header">
                <div class="mb-3">
                    <label for="firstname" class="form-label">First Name</label>
                    <input type="text" id="firstname" name="firstname" className="form-control" placeholder={user.firstname} value={firstname} onChange={(e) => {
                        setFirstname(e.target.value)
                        console.log(firstname)
                    }} />
                </div>
                <div class="mb-3">
                    <label for="lastname" class="form-label">Last Name</label>
                    <input type="text" id="lastname" name="lastname" className="form-control" placeholder={user.lastname} value={lastname} onChange={(e) => {
                        setLastname(e.target.value)
                        console.log(lastname)
                    }} />
                </div>
                <button className="btn btn-primary">Save Changes</button>
            </div>
        </form>
        <div className="card-header">Awards</div>
        <ul className="list-group list-group-flush">
            {
                user.awards.map((award, index) => {
                    return <li key={index} className="list-group-item">{award}</li>
                })
            }
        </ul>
    </div>
}

export default EditProfileCard;