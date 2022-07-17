import Link from "next/link"

export default function LeaderboardSlot(props) {
    return (
        <div className="leaderboardSlot">
            <div className="leaderboardSlotAlign">
                <div className="leaderboardSlotInfo">
                    <div className="leaderboardSlotPlacement">
                        {props.placement <= 3 && <i className="fa-solid fa-trophy" style={{color: props.placement == 1 ? "#F6E868" : props.placement == 2 ? "#C3C3C3" : "#C58710"}}></i>}
                        <p style={{color: props.placement == 1 ? "#F6E868" : props.placement == 2 ? "#C3C3C3" : props.placement == 3 ? "#C58710" : "#575757"}}>{props.placement}.</p>
                    </div>
                    <div className="leaderboardSlotProfileInfo">
                        <div className="leaderboardSlotProfileDecorationalCircle">
                            <img src={props.userAvatar} alt="leaderboard user avatar" />
                        </div>
                        <div className="leaderboardSlotProfileInfo2">
                            <p className="leaderboardSlotProfileHeader">{props.name}</p>
                            <p className="leaderboardSlotProfilePoints">{props.points}</p>
                        </div>
                    </div>
                </div>
                <Link href={`/profile/${props.link}`}>
                <div className="leaderboardSlotProfileLink">
                        <i className="fa-solid fa-angle-right"></i>
                    </div> 
                </Link>
            </div>
        </div>
    )
}