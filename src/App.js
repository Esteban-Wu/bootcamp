import React from "react";
import CardEditor from "./CardEditor";
import CardViewer from "./CardViewer";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * The "cards" state stores the flash cards currently stored
       * in the flashcards app. The "editors" state stores whether
       * the CardEditor or CardViewer is currently being displayed.
       */
      cards: [
        // Added cards for testing
        { front: "front1", back: "back1" },
        { front: "front2", back: "back2" },
      ],
      editor: true,
    };
  }

  /**
   * Adds a card to the "cards" state.
   */
  addCard = card => {
    const cards = this.state.cards.slice().concat(card);
    this.setState({ cards });
  };

  /**
   * Deletes a card at the specified index from the "cards" index.
   */
  deleteCard = index => {
    const cards = this.state.cards.slice();
    cards.splice(index, 1);
    this.setState({ cards });
  };

  switchMode = () => this.setState({ editor: !this.state.editor });

  /**
   * Updates the saved "cards" state when a pre-existing card is 
   * edited.
   */
  handleEdit = (event, index) => {
    const cards = this.state.cards.slice();
    cards[index][event.target.name] = event.target.value;
    this.setState({ cards });
  };

  render() {
    if (this.state.editor) {
      return (
        <CardEditor
          addCard={this.addCard}
          cards={this.state.cards}
          deleteCard={this.deleteCard}
          switchMode={this.switchMode}
          handleEdit={this.handleEdit}
        />
      );
    } else {
      return (
        < CardViewer
          switchMode={this.switchMode}
          cards={this.state.cards}
        />
      )
    }
  }
}

export default App;
