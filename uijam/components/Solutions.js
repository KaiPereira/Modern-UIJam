import SolutionCard from "./subcomponents/SolutionCard"
import ProfileModule from "./subcomponents/ProfileModule"

export default function Solutions(props) {
    let allSolutions = props.solutionsData.map((solutionData, index) => {
        return (
            <SolutionCard 
                key={index}
                image={solutionData.thumbnail}
                likes={solutionData.likes}
                date={solutionData.date}
                header={solutionData.title}
                index={index}
                codeCookie={props.codeCookie}
                id={solutionData._id}
                peopleWhoLiked={solutionData.peopleWhoLiked}
                authorGithub={solutionData.authorGithub}
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
            <div className="solutionsMain">
                <h1>Solutions</h1>
                <div className="allSolutions">
                   {allSolutions}
                </div>
            </div>
        </main>
    )
}