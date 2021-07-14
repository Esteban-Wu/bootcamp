import React from "react";
import "./CardEditor.css"

/**
 * The CardEditor component allows users to add cards to the flashcard set,
 * as well as edit or delete existing cards.
 */
class CardEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { front: '', back: '' };
    }

    /**
     * Adds a new card to the "cards" prop passed by the 
     * parent App component.
     */
    addCard = () => {
        const front = this.state.front.trim();
        const back = this.state.back.trim();
        if (front && back) {
            this.props.addCard(this.state);
            this.setState({ front: '', back: '' });
        }
    };

    /**
     * Deletes a new card from the "cards" prop passed by the 
     * parent App component.
     */
    deleteCard = index => this.props.deleteCard(index);

    /**
     * Handles changes to the input fields when users add a new
     * card.
     */
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    /**
     * Handles edits to previously added cards and updates the 
     * "cards" prop from parent App component.
     */
    handleEdit = (event, index) => this.props.handleEdit(event, index);

    render() {
        // Maps each card to an HTML table row
        const cards = this.props.cards.map((card, index) => {
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
                <button
                    // Disable CardViewer when there are no cards
                    disabled={!this.props.cards.length}
                    onClick={this.props.switchMode}
                >
                    Go to card viewer</button>
            </div>
        );
    }
}

export default CardEditor;