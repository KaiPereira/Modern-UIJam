import ProfileModule from "./subcomponents/ProfileModule"
import React from "react"

export default function indexMain(props) {

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
            <div className="homeAlign">
                <div className="homeWelcome">
                    <h1>Welcome to UIJam</h1>
                    <p className="homeWelcomeDescription">UIJam is the perfect site for coding and designing challenges! Compete against the best designers and developers around the globe for the most beautiful design!</p>
                    { (!props.codeCookie && props.profileModuleState) &&
                    <div className="homeLoginButtonAlign">
                        <div className="loginButton">
                            <a href="https://github.com/login/oauth/authorize?client_id=cae64f03f1ded6b7c2f8">
                                <button>Login</button>
                            </a>
                        </div>
                    </div>
                    }
                </div>
            </div>
            <div className="homeWorkingAlign">
                <h2>How it Works</h2>
                <div className="homeWorkingsMain">
                    <div className="homeWorking">
                        <i className="fa-solid fa-user"></i>
                        <p className="homeWorkingDescription">Connect your github Account!</p>
                    </div>
                    <div className="homeWorking">
                        <i className="fa-solid fa-code"></i>
                        <p className="homeWorkingDescription">Design and code a challenge!</p>
                    </div>
                    <div className="homeWorking">
                        <i className="fa-solid fa-share-nodes"></i>
                        <p className="homeWorkingDescription">Share it with friends!</p>
                    </div>
                    <div className="homeWorkingsDecorational"></div>
                </div>
            </div>
        </main>
    )
}