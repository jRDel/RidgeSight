import React from 'react';

function ProfileCard(user) {
    return <div className="card mt-2">
        <img src="https://global-uploads.webflow.com/6126ab68c73f925bdc355c97/61b2cd92e6d4720544484d31_ridgeline-icon.svg" className="card-img-top profile-pic my-4" alt="profile" />
        <div className="card-header">{user.firstname} {user.lastname}</div>
        <div className="card-header">Awards</div>
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