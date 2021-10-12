import React from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import Admin from './screens/Admin.js';
import Home from './screens/Home.js';

function App() {
  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="row">
          <div>
            <Link className="brand" to="/">
              AnonDapp
            </Link>
          </div>
          <div>
            <Link className="brand" to="/admin">
              Admin
            </Link>
          </div>
        </header>

        <main>
          <Route path="/" exact component={Home}></Route>
          <Route path="/admin" component={Admin}></Route>
        </main>
        <footer className="row center">
          Olzy Innovation - All rights reserved
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
