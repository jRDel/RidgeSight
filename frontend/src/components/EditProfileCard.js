import React, { useState } from 'react';

function EditProfileCard(user) {

    const [name, setName] = useState(user.username);
    const [description, setDescription] = useState(user.description);

    const handleSubmit = (e) => {
        e.preventDefault();

        //post to db
    }

    return <div className="card mt-2">
        <img src="https://global-uploads.webflow.com/6126ab68c73f925bdc355c97/61b2cd92e6d4720544484d31_ridgeline-icon.svg" className="card-img-top profile-pic my-4" alt="profile" />
        <form onSubmit ={handleSubmit}>
            <div className="card-header">
                <input type="text" id="name" name="name" className="form-control" placeholder={user.username} value={name} onChange={(e) => {
                    setName(e.target.value)
                    console.log(name)
                }} />
            </div>
            <div className="card-body">
                <input type="text" id="description" name="description" className="form-control" placeholder={user.description} value={description} onChange={(e) => {
                    setDescription(e.target.value)
                    console.log(description)
                }} />
            </div>
            <button>Save Changes</button>
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