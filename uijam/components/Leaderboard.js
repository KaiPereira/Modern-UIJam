import ProfileModule from "./subcomponents/ProfileModule"
import LeaderboardSlot from "./subcomponents/LeaderboardSlot"
import React from "react"
import axios from "axios"

export default function Leaderboard(props) {
    const [leaderboardUsers, changeLeaderboardUsers ] = React.useState()

    React.useEffect(() => {
       // Get all profiles
        axios.get("http://uijam.herokuapp.com/profiles/all")
            .then(allProfiles => {
                // Organize the profiles in order of points
                const profilesOrganizedByPoints = allProfiles.data.sort(({points: a}, {points: b}) => b - a)
                // Turn the object of users into users as code
                changeLeaderboardUsers(profilesOrganizedByPoints.map((organizedProfile, index) => {
                    console.log(organizedProfile)
                    return (
                        <LeaderboardSlot
                            key={index}
                            name={organizedProfile.name}
                            points={organizedProfile.points}
                            userAvatar={organizedProfile.avatar}
                            placement={index + 1}
                            link={organizedProfile.githubName}
                        />
                    )
                }))
            }) 
    }, [])
    

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
            <div className="leaderboardMainAlign">
                <div className="leaderboardMain">
                    <div className="leaderboardFilterAndHeader">
                        <h1>Leaderboard</h1>
                    </div>
                    <div className="leaderboard">
                        {leaderboardUsers}
                    </div>
                </div>
            </div>
        </main>
    )
}