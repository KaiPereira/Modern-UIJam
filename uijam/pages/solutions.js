import axios from "axios"
import SideNav from "../components/SideNav"
import React from "react"
import Solutions from "../components/Solutions"


export default function Solution({ solutionsData }) {
    const [codeCookie, changeCodeCookie] = React.useState()
    const [profileModuleState, profileModuleShow] = React.useState(false)
    const [dropdownState, changeDropdownState] = React.useState(false)

    function changeDropdownStateFunction() {
        changeDropdownState(!dropdownState)
    }

    React.useEffect(() => {
        if (document.cookie.match(new RegExp('(^| )' + "code" + '=([^;]+)'))) {
            var match = document.cookie.match(new RegExp('(^| )' + "code" + '=([^;]+)'));
            changeCodeCookie(match[2])
        }
        profileModuleShow(true)
    })

    return (
        <>
            { profileModuleState &&
            <SideNav 
                codeCookie={codeCookie}
                dropdownState={dropdownState}
                changeDropdownStateFunction={changeDropdownStateFunction}
            />
            }
            <Solutions 
                codeCookie={codeCookie}
                solutionsData={solutionsData}
                profileModuleState={profileModuleState}
                dropdownState={dropdownState}
                changeDropdownStateFunction={changeDropdownStateFunction}
            />
        </>
    )
}

export async function getStaticProps() {
    const res = await fetch('http://localhost:5000/solutions/all')
    const solutionsData = await res.json()
    
    return {
        props: {
            solutionsData
        }
    }
}