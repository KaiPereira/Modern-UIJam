import ChallengeCard from "./subcomponents/ChallengeCard"
import axios from "axios"
import React from "react"
import Link from "next/link"
import ProfileModule from "./subcomponents/ProfileModule"

export default function Challenges(props) {
    let challenges = props.challengesData.map((challenge, index) => {
        return (
            <ChallengeCard 
                challengeImage={challenge.image}
                header={challenge.header}
                description={challenge.description}
                difficulty={challenge.difficulty}
                link={index}
                key={index}
            />
        )
    })


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
            <div className="challengesHeaderAlign">
                <h1>Challenges</h1>
            </div>
            <div className="challenges">
                {challenges}
            </div>
        </main>
    )
}