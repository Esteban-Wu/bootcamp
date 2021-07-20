import React from "react";
import CardEditor from "./CardEditor";
import CardViewer from "./CardViewer";
import Homepage from "./Homepage";

import { Route, Switch } from "react-router-dom";

const App = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Homepage></Homepage>
      </Route>
      <Route exact path="/editor">
        <CardEditor />
      </Route>
      <Route exact path="/viewer/:deckId">
        <CardViewer />
      </Route>
      <Route>
        <div>Page not found!</div>
      </Route>
    </Switch>
  );
}

export default App;
