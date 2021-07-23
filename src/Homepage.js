import React from "react";
import { Link } from "react-router-dom";
import { firebaseConnect, isLoaded } from "react-redux-firebase";
import { connect } from "react-redux";
import { compose } from "redux";

class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * On mount or logout, retrieves the homepage data from a 
     * cloud function.
     */
     async componentDidMount() {
        await this.updateHomepage();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.isLoggedIn !== prevProps.isLoggedIn) {
            await this.updateHomepage();
        }
    }

    /**
     * Sets the "homepage" state with sanitized data from the
     * getHomepage() cloud function.
     */
    updateHomepage = async () => {
        const getHomepage = this.props.firebase
            .functions()
            .httpsCallable("getHomepage");

        const homepage = await getHomepage();
        this.setState({ homepage: homepage.data });
    };

    render() {
        if (!isLoaded(this.state.homepage)) {
            return <div>Loading...</div>;
        }

        // Maps each deck in the homepage object to a corresponding
        // viewer link
        const decks = Object.keys(this.state.homepage).map((deckId, index) => {
            const deck = this.state.homepage[deckId];
            return (
                <div key={index}>
                    <Link to={`/viewer/${deckId}`}>
                        {deck.name}
                    </Link>
                    {' '}
                    {deck.description}
                </div>
            );
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
                        <Link to="/profile">Profile</Link>
                        <div>{this.props.email}</div>
                        <br />
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
        email: state.firebase.auth.email,
        isLoggedIn: state.firebase.auth.uid,
    };
};

export default compose(
    firebaseConnect(),
    connect(mapStateToProps)
)(Homepage);