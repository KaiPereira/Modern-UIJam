import ResourceCard from "./subcomponents/ResourceCard"
import ProfileModule from "./subcomponents/ProfileModule"


export default function ResourcesMain(props) {

    let resources = props.resourceData.map((resource, index) => {
        return (
            <ResourceCard 
                key={index}
                thumbnail={resource.thumbnail}
                header={resource.header}
                description={resource.description}
                skills={resource.skills}
                link={resource.link}
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
            <div className="resourcesMain">
                <h1>Resources</h1>
                <div className="resourceCardsAlign">
                    {resources}
                </div>
            </div>
        </main>
    )
}