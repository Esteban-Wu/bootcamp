import React from "react";
import { Link } from "react-router-dom";
import { firebaseConnect, isLoaded } from "react-redux-firebase";
import { connect } from "react-redux";
import { compose } from "redux";

class Homepage extends React.Component {

    render() {
        if (!isLoaded(this.props.decks)) {
            return <div>Loading...</div>;
        }

        // Maps each deck in the homepage object to a corresponding
        // viewer link
        const decks = Object.keys(this.props.decks).map((deck, index) => {
            return (
                <div key={index}>
                    <Link to={`/viewer/${deck}`}>
                        {this.props.decks[deck].name}
                    </Link>
                </div>
            );
        });

        return (
            <div>
                <h2>Homepage</h2>
                <Link to="/editor">Create a new deck</Link>
                <br />
                <br />
                <div>{decks}</div>
            </div>
        );
    }
}

/**
 * Maps the homepage object from redux global state to props
 * for the homepage component.
 */
const mapStateToProps = (state) => {
    const decks = state.firebase.data["homepage"];
    return { decks: decks };
};

export default compose(
    firebaseConnect(["/homepage"]),
    connect(mapStateToProps)
)(Homepage);