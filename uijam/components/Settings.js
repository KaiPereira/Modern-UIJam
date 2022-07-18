import ProfileModule from "./subcomponents/ProfileModule"
import React from "react"
import axios from "axios"

export default function Settings(props) {
    const [showError, changeShowError] = React.useState(false)
    const [settings, changeSettings] = React.useState({
        name: "",
        location: "",
        bio: "",
        website: "",
        github: "",
        codewars: "",
        codepen: "",
        dev: "",
        linkedin: "",
        hashnode: "",
        avatar: ""
    })

    function settingChange(event) {
        changeSettings(prevState => {
            return {
                ...prevState,
                [event.target.name]: event.target.value
            }
        })
    }

    function changeSettingsPermanently() {
        axios.patch("http://localhost:5000/profiles/update", {
            avatar: settings.avatar,
            name: settings.name,
            location: settings.location,
            bio: settings.bio,
            socials: {
                website: settings.website,
                github: settings.github,
                hashnode: settings.hashnode,
                codewars: settings.codewars,
                codepen: settings.codepen,
                devto: settings.dev,
                linkedin: settings.linkedin
            }
        }, {
            headers: {
                Authorization: `Bearer ${props.codeCookie}`
            }
        })
    }

    React.useEffect(() => {
        axios.post("http://localhost:5000/authentication/parse-jwt", {
            jwt: props.codeCookie
        })
        .then(jwtPayload => {
            axios.post("http://localhost:5000/profiles/profile", {
                githubName: jwtPayload.data.username
            })
            .then(profile => {

                changeSettings(prevState => {
                    return {
                        ...prevState,
                        name: profile.data[0].name,
                        location: profile.data[0].location,
                        bio: profile.data[0].bio,
                        avatar: profile.data[0].avatar,
                        github: profile.data[0].socials.github,
                        website: profile.data[0].socials.website,
                        codewars: profile.data[0].socials.codewars,
                        dev: profile.data[0].socials.devto,
                        linkedin: profile.data[0].socials.linkedin,
                        codepen: profile.data[0].socials.codepen,
                        hashnode: profile.data[0].socials.hashnode
                    }
                })
            })
        })
    }, [])

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
                        changeSettings(prevState => ({
                            ...prevState,
                            avatar: event.target.result
                        }))
                        changeShowError(false)
                    }
                    
                })
        });
    }

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
            <div className="settingsMainAlign">
                <div className="settingsMain">
                    <div className="settingsProfileAlign">
                        <div className="settingsProfileRing">
                            <label htmlFor="challengeFileSubmit">
                                <img src={settings.avatar} style={{display: settings.avatar.length > 1 ? "block" : "none"}}/>
                                <p>Change Image</p> 
                                <input type="file" accept=".jpg, .png, .webp" id="challengeFileSubmit" onChange={updateImageDisplay} required/>
                            </label>
                        </div>
                    </div>
                    { showError &&
                    <div className="settingsImageErrorMessage">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <p>Error: File must be less than 500 KB</p>
                    </div>
                    }
                    <form className="settingsAll" onSubmit={changeSettingsPermanently}>
                        <div className="setting">
                            <p>Name</p>
                            <input type="text" placeholder="Ex. John Doe" name="name" onChange={settingChange} value={settings.name} maxLength="25" required/>
                        </div>
                        <div className="setting">
                            <p>Location</p>
                            <input type="text" placeholder="Ex. Paris, France" name="location" onChange={settingChange} value={settings.location} maxLength="30"/>
                        </div>
                        <div className="setting">
                            <p>Bio</p>
                            <textarea name="bio" onChange={settingChange} value={settings.bio} maxLength="250"></textarea>
                        </div>
                        <p className="settingsAllSocialsHeader">Socials</p>
                        <div className="setting">
                            <p>Website</p>
                            <input type="url" placeholder="Ex. https://yoursite.com" name="website" onChange={settingChange} value={settings.website}/>
                        </div>
                        <div className="setting">
                            <p>Github</p>
                            <input type="url" placeholder="Ex. https://github.com/username" name="github" onChange={settingChange} value={settings.github}/>
                        </div>
                        <div className="setting">
                            <p>Hashnode</p>
                            <input type="url" placeholder="Ex. https://dev.to/username" name="hashnode" onChange={settingChange} value={settings.hashnode}/>
                        </div>
                        <div className="setting">
                            <p>CodeWars</p>
                            <input type="url" placeholder="Ex. https://www.codewars.com/users/username" name="codewars" onChange={settingChange} value={settings.codewars}/>
                        </div>
                        <div className="setting">
                            <p>CodePen</p>
                            <input type="url" placeholder="Ex. https://codepen.io/username" name="codepen" onChange={settingChange} value={settings.codepen}/>
                        </div>
                        <div className="setting">
                            <p>Dev.to</p>
                            <input type="url" placeholder="Ex. https://dev.to/username" name="dev" onChange={settingChange} value={settings.dev}/>
                        </div>
                        <div className="setting">
                            <p>LinkedIn</p>
                            <input type="url" placeholder="Ex. https://www.linkedin.com/in/usernameid" name="linkedin" onChange={settingChange} value={settings.linkedin}/>
                        </div>
                        <button className="updateSettingsButton">
                            <p>Update</p>
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}