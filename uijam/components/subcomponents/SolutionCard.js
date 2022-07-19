import Link from 'next/link'
import axios from "axios"
import React from "react"
import LoginRequiredModal from "./LoginRequiredModal"

export default function SolutionCard(props) {
    const [disabled, setDisabled] = React.useState(false);
    const [modalState, changeModalState] = React.useState(false)
    const [likes, changeLikes] = React.useState(props.likes)
    const [likeFilled, changeLikeFilled] = React.useState()
    const [peopleWhoLiked, changePeopleWhoLiked] = React.useState(props.peopleWhoLiked)
    const [solutionProfile, changeSolutionProfile] = React.useState()

    React.useEffect(() => {
        if (props.codeCookie) {
            axios.post("https://uijam.herokuapp.com/authentication/parse-jwt", {
                jwt: props.codeCookie
            })
            .then(data => {
                // Array of all people who liked
                changeLikeFilled(props.peopleWhoLiked.includes(data.data.username))
            })
        }
        axios.post("https://uijam.herokuapp.com/profiles/profile", {
            githubName: props.authorGithub
        })
        .then(profile => changeSolutionProfile(profile.data[0]))
        
    }, [props.codeCookie])

    async function modifyLikes() {
        if (props.codeCookie) {
            // Set disabled is use to stop people from spamming the button
            setDisabled(true)

            // Grab the username from your jwt and use it to check if you are in the peopleWhoLiked
            await axios.post("https://uijam.herokuapp.com/authentication/parse-jwt", {
                jwt: props.codeCookie
            })
            .then(async data => {
                // Update the likes with the updateLike route
                await axios.patch("https://uijam.herokuapp.com/solutions/updateLike", {
                    id: props.id
                }, {
                    headers: {
                        Authorization: `Bearer ${props.codeCookie}`
                    }
                })
                .then(() => {
                    // Just for decorational purpose so the user does not need to reload the page!
                    if (peopleWhoLiked.includes(data.data.username)) {
                        changeLikes(prevState => prevState - 1)
                        changeLikeFilled(!likeFilled)
                        changePeopleWhoLiked(prevState => prevState.filter(person => person !== data.data.username))
                    } else {
                        changePeopleWhoLiked(prevState => [...prevState, data.data.username])
                        changeLikes(prevState => prevState + 1)
                        changeLikeFilled(!likeFilled)
                    }
                })
                .catch(err => console.log("Error"))
            })
            setDisabled(false)
        } else {
            // If there is no user logged in turn the modal on!
            changeModalState(true)
        }
    }

    function closePopup() {
        changeModalState(false)
    }

    return (
        <>{solutionProfile &&
            <>
                <LoginRequiredModal 
                    modalState={modalState}
                    closePopup={closePopup}
                />
                <div className="solutionCard">
                    <Link href={`/solutions/${props.index.toString()}`}>
                        <div className="solutionCardImageEffect">
                            <img src={props.image} alt="solution card thumbnail" />
                        </div>  
                    </Link> 
                    <div className="solutionCardInfo">
                        <p className="solutionCardHeader">{props.header}</p>
                        <div className="solutionCardPersonalInfo">
                            <div className="solutionCardPersonalInfoImage">
                                <Link href={`/profile/${props.authorGithub}`}>
                                    <img src={solutionProfile.avatar} alt="solution person's avatar" />
                                </Link>
                            </div>
                            <div className="solutionCardPersonalInfoName">
                                <div className="solutionCardProfileInfo">
                                    <p className="solutionCardProfileName">{solutionProfile.name}</p>
                                    <p className="solutionCardProfileDetailSeperation">•</p>
                                    <p className="solutionCardProfilePoints">{solutionProfile.points}</p>
                                </div>
                                <p className="solutionCardDate">{props.date}</p>
                            </div>
                        </div>
                        <button className="solutionCardLikes" onClick={modifyLikes} disabled={disabled}>
                            {likeFilled ? <i className="fa-solid fa-heart"></i> : <i className="fa-regular fa-heart"></i>}
                            <p>{likes}</p>
                        </button>
                    </div>
                </div>
            </>}
        </>
    )
}