import SideNav from "../../../components/SideNav"
import React from "react"
import axios from "axios"
import {useRouter} from "next/router"
import ProfileModule from "../../../components/subcomponents/ProfileModule"

export default function ChallengeSubmit() {
    const [showError, changeShowError] = React.useState(false)
    const [profileModuleState, profileModuleShow] = React.useState(false)
    const [codeCookie, changeCodeCookie] = React.useState()
    const [previewImage, changePreviewImage] = React.useState()
    const [formElements, changeFormElements] = React.useState({
        repo: "",
        site: "",
        preview: ""
    })
    const [dropdownState, changeDropdownState] = React.useState(false)

    function changeDropdownStateFunction() {
        changeDropdownState(!dropdownState)
    }

    const router = useRouter()

    React.useEffect(() => {
        if (document.cookie.match(new RegExp('(^| )' + "code" + '=([^;]+)'))) {
            var match = document.cookie.match(new RegExp('(^| )' + "code" + '=([^;]+)'));
            changeCodeCookie(match[2])
        }
        profileModuleShow(true)
    })

    function updateImageDisplay(input) {
        const reader = new FileReader();
        const file = input.target.files[0];
        reader.readAsDataURL(file);
        reader.addEventListener('load', (event) => {
            // Get the file size
            fetch(event.target.result)
                .then(result => result.blob())
                .then(fileData => {
                    if (fileData.size > 500000) {
                        // If the file size is bigger 500 000 bytes then show error
                        changeShowError(true)
                    } else {
                        // If bytes is not bigger than 500 000 bytes than add it to settings and get rid of error
                        changeFormElements(prevState => ({
                            ...prevState,
                            preview: event.target.result
                        }))
                        changePreviewImage(event.target.result)
                        changeShowError(false)
                    }
                    
                })
        });
    }

    function solutionSubmitted(e) {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;

        axios.post("https://uijam.herokuapp.com/authentication/parse-jwt", {
            jwt: codeCookie
        })
            .then(jwtPayload => {
                axios.post("https://uijam.herokuapp.com/profiles/profile", {
                    githubName: jwtPayload.data.username
                })
                .then(profileData => {
                    axios.get("https://uijam.herokuapp.com/challenges/all")
                        .then(challengeData => {
                            var config = {
                                method: 'post',
                                url: 'https://uijam.herokuapp.com/solutions/new',
                                headers: { 
                                  'Authorization': `Bearer ${codeCookie}`, 
                                  'Content-Type': 'application/json'
                                },
                                data: {
                                    site: formElements.site,
                                    repository: formElements.repo,
                                    thumbnail: formElements.preview,
                                    author: profileData.data[0].name,
                                    title: challengeData.data[router.query.challengeIndex].header,
                                    date: today,
                                    likes: 1,
                                    authorPoints: profileData.data[0].points,
                                    authorImage: profileData.data[0].avatar,
                                    authorGithub: profileData.data[0].githubName,
                                    peopleWhoLiked: profileData.data[0].name
                                }
                              };
                              window.location.href="https://uijam.herokuapp.com/solutions"
                              axios(config)
                        })
                })
            })

        e.preventDefault()
    }

    function formElementChange(event) {
        changeFormElements(prevState => {
            return {
                ...prevState,
                [event.target.name]: event.target.value
            }
        })
    }

    return (
        <>
            { profileModuleState &&
            <SideNav 
                codeCookie={codeCookie}
                dropdownState={dropdownState}
                changeDropdownStateFunction={changeDropdownStateFunction}
            />
            }
            <main onClick={dropdownState ? changeDropdownStateFunction : undefined}>
                { profileModuleState ?
                <ProfileModule 
                    codeCookie={codeCookie}
                    dropdownState={dropdownState}
                    changeDropdownStateFunction={changeDropdownStateFunction}
                />
                : 
                <div className="profileModulePlaceholderContainer"></div>
                }
                { profileModuleState &&
                <>
                    { codeCookie ?
                    <div className="submitChallenge">
                        <h1>Submit Solution</h1>
                        <form className="submitChallengeForm" onSubmit={solutionSubmitted} id="create-solution-form">
                            <input type="url" placeholder="Github Repository" onChange={formElementChange} name="repo" required/>
                            <input type="url" placeholder="Live Site" onChange={formElementChange} name="site" required/>
                            <div className="submitChallengeFormThumbnailAlign">
                                <label htmlFor="challengeFileSubmit">
                                    {
                                        previewImage ?
                                        <img src={previewImage} className="solutionPreviewImage"/> 
                                        :
                                        <p>Screenshot</p>
                                    }
                                    <input type="file" accept=".jpg, .png, .webp" id="challengeFileSubmit" onChange={updateImageDisplay} required/>
                                </label>
                                { showError &&
                                <div className="settingsImageErrorMessage">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    <p>Error: File must be less than 500 KB</p>
                                </div>
                                }
                            </div>
                            <button className="submitChallenegButton">
                                <a>
                                    <div>
                                        Submit
                                    </div>
                                </a>
                            </button>
                        </form>
                    </div>
                    : 
                    <div className="submitChallengeErrorAlign">
                        <h1>Oooops!</h1>
                        <p className="submitChallengeErrorDescription">It seems like you need to be logged in to be able to participate</p>
                        <a href="https://github.com/login/oauth/authorize?client_id=cae64f03f1ded6b7c2f8">
                            <p>Login</p>
                        </a>
                    </div>
                    }
                </>}
            </main>
        </>
    )
}
