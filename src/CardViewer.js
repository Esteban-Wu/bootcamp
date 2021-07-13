import React from "react";
import CardEditor from "./CardEditor";

class CardViewer extends React.Component {
    render() {
        return (
            <div>
                <h2>Card Viewer</h2>
                <hr/>
                <button onClick={this.props.switchMode}>Go to card editor</button>
            </div>
        );
    }
}

export default CardViewer;