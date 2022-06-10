import React from 'react';
import SightingMap from '../components/SightingMap';
import "./Profile.css";

function Profile() {

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
                    <div className="card mt-2">
                        <img src="https://global-uploads.webflow.com/6126ab68c73f925bdc355c97/61b2cd92e6d4720544484d31_ridgeline-icon.svg" className="card-img-top profile-pic my-4" alt="profile-picture" />
                        <div class="card-header">{user.username}</div>
                        <div className="card-body">
                            <p className="card-text">{user.description}</p>
                        </div>
                        <div class="card-header">Awards</div>
                        <ul className="list-group list-group-flush">
                            {
                                user.awards.map((award) => {
                                    return <li className="list-group-item">{award}</li>
                                })
                            }
                        </ul>
                    </div>
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