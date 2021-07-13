import React from "react";
import "./CardViewer.css"

class CardViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currIndex: 0,
            display: this.props.cards[0].front,
        }
    }

    prevCard = () => {
        if (this.state.currIndex >= 0) {
            this.setState({
                currIndex: this.state.currIndex - 1,
                display: this.props.cards[this.state.currIndex - 1].front,
            });
        }
    }

    nextCard = () => {
        if (this.state.currIndex < this.props.cards.length - 1) {
            this.setState({
                currIndex: this.state.currIndex + 1,
                display: this.props.cards[this.state.currIndex + 1].front,
            });
        }
    }

    flipCard = () => {
        const front = this.props.cards[this.state.currIndex].front;
        const back = this.props.cards[this.state.currIndex].back;
        if (this.state.display === front) {
            this.setState({ display: back });
        } else {
            this.setState({ display: front });
        }
    }

    render() {
        let progress = "Progress: " + (this.state.currIndex + 1) +
            "/" + (this.props.cards.length) + " cards";

        return (
            <div>
                <h2>Card Viewer</h2>
                <br />
                <div>{progress}</div>
                <br />
                <div>Click to flip</div>
                <div id="card" onClick={this.flipCard}>{this.state.display}</div>
                <br />
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
                <hr />
                <button onClick={this.props.switchMode}>Go to card editor</button>
            </div>
        );
    }
}

export default CardViewer;