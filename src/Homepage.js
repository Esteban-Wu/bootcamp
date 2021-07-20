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
        // viewer link if the deck is public or is owned by the user.
        const decks = Object.keys(this.props.decks).map((deckId, index) => {
            const deck = this.props.decks[deckId];
            if (deck.visibility || // isLoggedIn === state.firebase.auth.uid
                (!deck.visibility && deck.owner === this.props.isLoggedIn)) {
                return (
                    <div key={index}>
                        <Link to={`/viewer/${deckId}`}>
                            {deck.name}
                        </Link>
                    </div>
                );
            } else {
                return null;
            }
        });

        return (
            <div>
                <h2>Homepage</h2>
                <Link to="/editor">Create a new deck</Link>
                <br />
                <h3>Flashcards</h3>
                <div>{decks}</div>
                <h3>Account</h3>
                {this.props.isLoggedIn ? (
                    <div>
                        <div>{this.props.email}</div>
                        <button
                            onClick={() => this.props.firebase.logout()}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div>
                        <Link to="/register">Register</Link>
                        <br />
                        <Link to="/login">Login</Link>
                    </div>
                )}
            </div>
        );
    }
}

/**
 * Maps the homepage object from redux global state to props
 * for the homepage component.
 */
const mapStateToProps = (state) => {
    return {
        decks: state.firebase.data.homepage,
        email: state.firebase.auth.email,
        isLoggedIn: state.firebase.auth.uid,
    };
};

export default compose(
    firebaseConnect(["/homepage"]),
    connect(mapStateToProps)
)(Homepage);