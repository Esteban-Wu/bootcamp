import React from "react";
import "./CardEditor.css"

import { Link, withRouter } from "react-router-dom";
import { firebaseConnect } from "react-redux-firebase";
import { compose } from "redux";

/**
 * The CardEditor component allows users to add cards to the flashcard deck,
 * as well as edit or delete existing cards. They can then save the deck to
 * Firestore for future use.
 */
class CardEditor extends React.Component {
    constructor(props) {
        super(props);
        /**
         * The "cards" state represents the current cards in the deck.
         * "front" and "back" represent the front and back of the card
         * to be added, and name stores the deck's name.
         */
        this.state = {
            cards: [
                // Added cards for testing
                { front: "front1", back: "back1" },
                { front: "front2", back: "back2" },
            ],
            front: '',
            back: '',
            name: '',
        };
    }

    /**
     * Adds a new card to the "cards" state.
     */
    addCard = () => {
        const front = this.state.front.trim();
        const back = this.state.back.trim();
        if (front && back) {
            const card = { front: front, back: back };
            const cards = this.state.cards.slice().concat(card);
            this.setState({ cards, front: '', back: '' });
        }
    };

    /**
     * Deletes a new card from the "cards" state.
     */
    deleteCard = index => {
        const cards = this.state.cards.slice();
        cards.splice(index, 1);
        this.setState({ cards });
    };

    /**
     * Handles changes to the input fields when users add a new
     * card.
     */
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    /**
     * Handles edits to previously added cards and updates the 
     * "cards" state.
     */
    handleEdit = (event, index) => {
        const cards = this.state.cards.slice();
        cards[index][event.target.name] = event.target.value;
        this.setState({ cards });
    };

    /**
     * Adds decks to the RTD (Firestore).
     */
    createDeck = () => {
        const deckId = this.props.firebase.push("/flashcards").key;
        const updates = {};
        const newDeck = { cards: this.state.cards, name: this.state.name };
        // Stores the deck in /flashcards and the deck's name and key 
        // separately for homepage use
        updates[`/flashcards/${deckId}`] = newDeck;
        updates[`/homepage/${deckId}`] = { name: this.state.name };
        const onComplete = () => this.props.history.push(`/viewer/${deckId}`);
        this.props.firebase.update('/', updates, onComplete);
    };

    render() {
        // Maps each card to an HTML table row
        const cards = this.state.cards.map((card, index) => {
            return (
                <tr key={index}>
                    <td>{index}</td>
                    <td>
                        <input
                            name="front"
                            onChange={(event) => this.handleEdit(event, index)}
                            value={card.front}
                        >
                        </input>
                    </td>
                    <td>
                        <input
                            name="back"
                            onChange={(event) => this.handleEdit(event, index)}
                            value={card.back}
                        >
                        </input>
                    </td>
                    <td>
                        <button onClick={() => this.deleteCard(index)}>Delete Card</button>
                    </td>
                </tr>
            );
        });

        return (
            <div>
                <h2>Card Editor</h2>
                <div>
                    Deck name:{' '}
                    <input
                        name="name"
                        onChange={this.handleChange}
                        placeholder="Name of deck"
                        value={this.state.name}
                    />
                </div>
                <br />
                <table>
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Front</th>
                            <th>Back</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>{cards}</tbody>
                </table>
                <br />
                <div id="add-card">
                    <input
                        name="front"
                        onChange={this.handleChange}
                        placeholder="Front of card"
                        value={this.state.front}
                    />
                    <input
                        name="back"
                        onChange={this.handleChange}
                        placeholder="Back of card"
                        value={this.state.back}
                    />
                    <button onClick={this.addCard}>Add card</button>
                </div>
                <hr />
                <div>
                    <button
                        disabled={!this.state.name.trim() ||
                            this.state.cards.length === 0}
                        onClick={this.createDeck}
                    >
                        Create deck
                    </button>
                </div>
                <br />
                <Link to="/">Home</Link>
            </div>
        );
    }
}

// Compose order doesn't matter here
export default compose(firebaseConnect(), withRouter)(CardEditor);