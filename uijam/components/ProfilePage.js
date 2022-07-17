import ProfileModule from "./subcomponents/ProfileModule"
import React from "react"
import axios from "axios"
import SolutionCard from "./subcomponents/SolutionCard"
import CommentCard from "./CommentCard"

export default function Profile(props) {
    const [profileData, changeProfileData] = React.useState()
    const [profileSolutions, changeProfileSolutions] = React.useState()
    const [profileComments, changeProfileComments] = React.useState()
    const [buttonStates, changeButtonStates] = React.useState(true)
    const [profileSocials, changeProfileSocials] = React.useState()
    
    React.useEffect(() => {
        // Getting the url profile and putting it in profileData
        axios.post("http://localhost:5000/profiles/profile", {
            githubName: props.profileName
        })
        .then(profileData => {
            changeProfileData(profileData.data[0])

            changeProfileSocials(Object.keys(profileData.data[0].socials).map(social => {
                let url = profileData.data[0].socials[social]

                if (url.length > 0)
                return (
                    <div className="profileCardInfoSocial">
                        <a href={url} target="_blank" rel="noreferrer">
                            <button>
                                <i className={social == "github" ? "fa-brands fa-github" : social == "hashnode" ? "fa-brands fa-hashnode" : social == "codewars" ? "fa-solid fa-bomb" : social == "codepen" ? "fa-brands fa-codepen" : social == "devto" ? "fa-brands fa-dev" : social == "linkedin" ? "fa-brands fa-linkedin-in" : "fa-solid fa-globe"}></i>
                            </button>
                        </a>
                    </div>
                    
                )
            }))
            // Get url second level domain and render the socials
        })

        axios.get("http://localhost:5000/solutions/all")
            .then(allSolutions => {
                // Get all your solutions and render them as cards
                changeProfileSolutions(allSolutions.data.map((solution, index) => {
                    
                    if (solution.authorGithub == props.profileName)
                    return (
                        <SolutionCard 
                            index={index}
                            header={solution.title}
                            accountImage={solution.authorImage}
                            author={solution.author}
                            points={solution.authorPoints}
                            date={solution.date}
                            image={solution.thumbnail}
                            likes={solution.likes}
                            peopleWhoLiked={solution.peopleWhoLiked}
                            key={index}
                            codeCookie={props.codeCookie}
                            id={solution._id}
                            authorGithub={solution.authorGithub}
                        />
                    )
                }))

                // Gets all your comments and renders them as commentCards
                allSolutions.data.map((solution, index) => {
                    axios.get("http://localhost:5000/challenges/specific", {
                        title: "Landing Page"
                    })
                    .then(challenge => {
                        if (solution.authorGithub == props.profileName)
                        changeProfileComments(solution.comments.map((comment, commentIndex) => {
                            return (
                                <CommentCard 
                                    solutionId={solution._id}
                                    id={comment._id}
                                    authorAvatar={comment.authorAvatar}
                                    authorPoints={comment.authorPoints}
                                    commentDate={comment.commentDate}
                                    authorGithub={comment.authorGithub}
                                    commentBody={comment.commentBody}
                                    authorName={comment.authorName}
                                    key={commentIndex}
                                    solutionThumbnail={solution.thumbnail}
                                    difficulty={challenge.data.difficulty}
                                    title={solution.title}
                                    link={index}
                                />
                            )
                        }))
                    })
                })
            })
    }, [props.codeCookie])

    return (
        <main onClick={props.dropdownState ? props.changeDropdownStateFunction : undefined}>
            { props.profileModuleState ?
            <ProfileModule 
                codeCookie={props.codeCookie}
                dropdownState={props.dropdownState}
                changeDropdownStateFunction={props.changeDropdownStateFunction}
            />
            : 
            <div className="profileModulePlaceholderContainer"></div>
            }
            { profileData &&
            <div className="profileMainAlign">
                <div className="profileMain">
                    <div className="profileMainCard">
                        <div className="profileMainCardAvatarAlign">
                            <div className="profileMainCardAvatar">
                                <div className="profileMainCardAvatarOverflowControl">
                                    <img src={profileData.avatar} alt="Profile Avatar"/>
                                </div>
                            </div>
                        </div>
                        <div className="profileMainCardInformation">
                            <div className="profileCardInfoHeaderPoints">
                                <h1>{profileData.name}</h1>
                                <p><span>•</span> {profileData.points}</p>
                            </div>
                            <p className="profileCardInfoLocation">{profileData.location ? profileData.location : "Location Not Set"}</p>
                            <p className="profileCardInfoBio">{profileData.bio ? profileData.bio : "An unknow user with no bio to display yet! But something’s for sure, this user loves frontend code and design!"}</p>
                            <div className="profileCardInfoSocialsAlign">
                                <div className="profileCardInfoSocials">
                                    {profileSocials}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="profileChallengeButtons">
                        <button className="profileChallengeInProgress" onClick={() => changeButtonStates(true)}>
                            <a>
                                <button>In-Progress</button>
                            </a>
                        </button>
                        <button className="profileChallengeCompleted" onClick={() => changeButtonStates(false)}>
                            <button>Comments</button>
                        </button>
                    </div>
                </div>
                { buttonStates ?
                    <div className="profileSolutionsAlign">
                        {profileSolutions}
                    </div>
                    : 
                    <div className="profileCommentsAlign">
                        {profileComments}
                    </div>
                }
            </div>
            }
        </main>
    )
}