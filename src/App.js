import React from "react";
import CardEditor from "./CardEditor";
import CardViewer from "./CardViewer";
import Homepage from "./Homepage";

import { Route, Switch } from "react-router-dom";

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
    return (
      <Switch>
        <Route exact path="/">
          <Homepage></Homepage>
        </Route>
        <Route exact path="/editor">
          <CardEditor
            addCard={this.addCard}
            cards={this.state.cards}
            deleteCard={this.deleteCard}
            handleEdit={this.handleEdit}
          />
        </Route>
        <Route exact path="/viewer">
          <CardViewer
            cards={this.state.cards}
          />
        </Route>
      </Switch>
    );
  }
}

export default App;
