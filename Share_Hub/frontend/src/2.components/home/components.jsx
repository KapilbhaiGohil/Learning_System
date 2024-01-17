import demo from '../../5.assets/demo.jpg'

export function Topic() {
    return (
        <>
            <div className="topic-outer">
                <div className="topic-background">
                    <div className="topic-options"></div>
                </div>
                <div className="topic-info">
                    <div className="topic-detail">
                        <div className="photo">
                            <img src={demo} alt="photo" />
                            {/* <div>Teacher</div> */}
                        </div>
                        <div className="desc">
                            <h3>Material</h3>
                            <div><p>Material is a demo material created for the demo purpose</p></div>
                        </div>
                    </div>
                    <div className="topic-footer">
                        <div>No of joined : 90</div>
                    </div>
                </div>

            </div>
        </>
    )
}
export function SubTopic() {
    return (
        <>
        </>
    )
}