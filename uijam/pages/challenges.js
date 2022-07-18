import React from 'react'
import SideNav from "../components/SideNav"
import Challenges from "../components/Challenges"
import axios from 'axios'

export default function Home(challengesData) {
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
  }, [])    
  
  console.log(challengesData.challengesData)
  return (
    <>
      { profileModuleState &&
      <SideNav 
          codeCookie={codeCookie}
          dropdownState={dropdownState}
          changeDropdownStateFunction={changeDropdownStateFunction}
      />
      }
      <Challenges 
        codeCookie={codeCookie}
        challengesData={challengesData.challengesData}
        profileModuleState={profileModuleState}
        dropdownState={dropdownState}
        changeDropdownStateFunction={changeDropdownStateFunction}
      />
    </>
  )
}

Home.getInitialProps = async () => {
  const res = await axios.get("http://localhost:5000/challenges/all")
  const challengesData = await res.data

  return { 
    challengesData: challengesData
  };
};