import React from "react";
import { Link, Redirect } from "react-router-dom";
import { firebaseConnect } from "react-redux-firebase";
import { connect } from "react-redux";
import { compose } from "redux";

class PageProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            editUsername: '',
        };
    }

    /**
     * Handles changes to the input fields when users add a new
     * card.
     */
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    /**
     * Updates the user's new username in Firebase and displays it.
     */
    handleSave = async () => {
        await this.props.firebase.updateProfile({ username: this.state.editUsername });
        this.setState({ username: this.state.editUsername });
    };

    /**
     * Given the deck owner's uid, retrieves their username through the 
     * cloud function getUsername().
     */
    updateUsername = async (uid) => {
        const getUsername = this.props.firebase
            .functions()
            .httpsCallable("getUsername");
        const username = await getUsername(uid);
        this.setState({
            username: username.data,
        });
    };

    async componentDidMount() {
        this.updateUsername(this.props.isLoggedIn);
    };

    async componentDidUpdate(prevProps) {
        if (this.props.isLoggedIn !== prevProps.isLoggedIn) {
            this.updateUsername(this.props.isLoggedIn);
        }
    }

    render() {
        if (!this.props.isLoggedIn) {
            return <Redirect to="/register" />;
        }

        return (
            <div>
                <h2>Profile</h2>
                <div>
                    Email:{' '}
                    {this.props.email}
                    <br />
                    Username:{' '}
                    {this.state.username}
                </div>
                <br />
                <input
                    name="editUsername"
                    onChange={this.handleChange}
                    placeholder="Edit username"
                    value={this.state.editUsername}
                />
                <button onClick={this.handleSave}>Save changes</button>
                <hr />
                <Link to="/">Home</Link>
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
)(PageProfile);