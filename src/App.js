import React from 'react';
import './App.css';
import Home from './pages/Home'
import Header from './component/Header'
import Comments from './pages/Comments'
import {Switch, Route} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Header/>
      <Switch>
        <Route exact path='/'>
          <Home/>
        </Route>
        <Route path='/comments/:id' component={Comments}/>
      </Switch>
    </div>
  );
}

export default App;
