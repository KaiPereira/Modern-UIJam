import Link from 'next/link'
import Image from "next/image"

export default function SideNav(props) {
    return (
        <nav className={props.dropdownState ? "navigationOpen" : "navigationClosed"}>
            <div className="logoAlign">
                <Link href="/">
                    <div className="logoAlign2">
                        <Image width="100px" height="65px" src="/logo.png" />
                        <p>UIJam</p>
                    </div>
                </Link>
            </div>
            <div className="navigationElements">
                <Link href="/challenges">
                    <div className="navigationElement">
                        <i className="fa-solid fa-jet-fighter-up"></i>
                        <p>Challenges</p>
                    </div>
                </Link>
                <Link href="/solutions">
                    <div className="navigationElement">
                        <i className="fa-solid fa-code"></i>
                        <p>Solutions</p>
                    </div>
                </Link>
                <Link href="/resources">
                    <div className="navigationElement">
                        <i className="fa-solid fa-school"></i>
                        <p>Resources</p>
                    </div>
                </Link>
                <Link href="/leaderboard">
                    <div className="navigationElement">
                        <i className="fa-solid fa-medal"></i>
                        <p>Leaderboard</p>
                    </div>
                </Link>
            </div>
            { !props.codeCookie &&
            <div className="loginButtonAlign">
                <a href="https://github.com/login/oauth/authorize?client_id=cae64f03f1ded6b7c2f8">
                    <button>Login</button>
                </a>
            </div>
            }
        </nav>
    )
}