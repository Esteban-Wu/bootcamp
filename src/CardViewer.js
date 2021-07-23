import React from "react";
import "./CardViewer.css"

import { Link, withRouter, Redirect } from "react-router-dom";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";
import { connect } from "react-redux";
import { compose } from "redux";


/**
 * The CardViewer component allows users to view their flashcard set.
 * They can flip the cards to view both sides, as well as randomize
 * the card order. The arrow keys can also be used to navigate through
 * the set.
 */
class CardViewer extends React.Component {
    constructor(props) {
        super(props);
        /**
         * The "currIndex" state stores the current index of the card 
         * being displayed in the viewer. Display is the side of the 
         * card being displayed, and localCards is a copy of the "cards"
         * prop passed by the parent App component. Having a local copy
         * of the cards makes randomization much easier. "display" is 
         * initialized as null to avoid errors when props.cards has not
         * finished loading from Firebase.
         */

        this.state = {
            currIndex: 0,
            display: null,
            localCards: props.cards,
            username: '',
        }

        this.handleKeydown = this.handleKeydown.bind(this);
    }

    /**
     * Switches the currently displayed card to the previous card in the
     * card list.
     */
    prevCard = () => {
        this.setState({
            currIndex: this.state.currIndex - 1,
            display: this.state.localCards[this.state.currIndex - 1].front,
        });
    };

    /**
     * Switches the currently displayed card to the next card in the 
     * card list.
     */
    nextCard = () => {
        this.setState({
            currIndex: this.state.currIndex + 1,
            display: this.state.localCards[this.state.currIndex + 1].front,
        });
    };

    /**
     * "Flips" the currently displayed card when the card is clicked.
     */
    flipCard = () => {
        const front = this.state.localCards[this.state.currIndex].front;
        const back = this.state.localCards[this.state.currIndex].back;
        if (this.state.display === front) {
            this.setState({ display: back });
        } else {
            this.setState({ display: front });
        }
    };

    /**
     * Randomizes the local card list and then displays the first card
     * in the new list. The shuffle algorithm is based off the Durstenfeld
     * shuffle.
     */
    randomizeCards = () => {
        const cards = this.state.localCards.slice();
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        // setState with callback, as second setState relies on first
        this.setState({ localCards: cards }, function () {
            this.setState({
                currIndex: 0,
                display: this.state.localCards[0].front
            });
        });
    };

    /**
     * Handles right or left arrow keydown events to move to the next
     * or previous card.
     */
    handleKeydown = event => {
        if (event.code === "ArrowRight" &&
            this.state.currIndex < this.state.localCards.length - 1) {
            this.nextCard();
        } else if (event.code === "ArrowLeft" &&
            this.state.currIndex > 0) {
            this.prevCard();
        }
    };

    /**
     * Handles updates to the save button and updates the "save" state
     */
    handleSave = () => this.setState({ save: !this.state.save }, this.updateSave);

    /**
     * Given the deck owner's uid, retrieves their username through the 
     * cloud function getUsername().
     */
    updateUsername = async (uid) =>{
        const getUsername = this.props.firebase
            .functions()
            .httpsCallable("getUsername");
        const username = await getUsername(uid);
        console.log(username);
        this.setState({
            username: username.data,
        });
    };

    /**
     * Updates the state if anything has changed (i.e., on data load
     * from Firebase). 
     */
    async componentDidUpdate(prevProps) {
        if (this.props.cards !== prevProps.cards) {
            this.setState({
                localCards: this.props.cards,
                display: this.props.cards[0].front
            });
        }
        
        if (this.props.owner !== prevProps.owner) {
            await this.updateUsername(this.props.owner);
        }
    };

    async componentDidMount() {
        document.addEventListener("keydown", this.handleKeydown, false);
        await this.updateUsername(this.props.owner);
    };

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeydown, false);
    };

    render() {
        if (!this.props.isLoggedIn) {
            return <Redirect to="/register" />;
        }
        // Handle wait time till props loaded and invalid deckId
        if (!isLoaded(this.props.cards)) {
            return <div>Loading...</div>;
        }
        if (isEmpty(this.props.cards)) {
            return <div>Page not found!</div>;
        }

        let progress = "Progress: " + (this.state.currIndex + 1) +
            "/" + (this.props.cards.length) + " cards";

        return (
            <div>
                <h2>{this.props.name}</h2>
                <br />
                <p>{this.props.description}</p>
                <br />
                <div>Created by: {this.state.username}</div>
                <br />
                <div>{progress}</div>
                <br />
                <div id="description">
                    Click card to flip, and use left/right
                    arrow keys to navigate to previous/next card.
                </div>
                <br />
                <button onClick={this.randomizeCards}>Randomize</button>
                <div
                    id="card"
                    onClick={this.flipCard}
                >
                    {this.state.display}
                </div>
                <button
                    disabled={this.state.currIndex <= 0}
                    onClick={this.prevCard}
                >
                    Prev
                </button>
                <button
                    disabled={this.state.currIndex >= this.props.cards.length - 1}
                    onClick={this.nextCard}
                >
                    Next
                </button>
                <br />
                <hr />
                <Link to="/">Home</Link>
            </div>
        );
    }
}

/**
 * Maps the deck from redux global state to the CardViewer 
 * component props.
 */
const mapStateToProps = (state, props) => {
    const deckId = props.match.params.deckId;
    const deck = state.firebase.data[deckId];
    const name = deck && deck.name;
    const cards = deck && deck.cards;
    const description = deck && deck.description;
    const owner = deck && deck.owner;
    const isLoggedIn = state.firebase.auth.uid;
    return {
        deckId: deckId,
        cards: cards,
        name: name,
        owner: owner,
        description: description,
        isLoggedIn: isLoggedIn,
    };
};

export default compose(
    withRouter,
    firebaseConnect(props => {
        const deckId = props.match.params.deckId;
        return [{ path: `/flashcards/${deckId}`, storeAs: deckId }];
    }),
    connect(mapStateToProps),
)(CardViewer);