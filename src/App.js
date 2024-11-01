import logo from './logo.svg';
import './App.css';

import Navvybar from './components/navbar';
import Header from './components/header';
import Selector from './components/book-verse-Selection';

//https://reactbibleapp.vercel.app/

function App() {

  return (
    <div className="App">
      <Header />
      <Selector />
      <headerText>Genesis</headerText>
    </div>
  );
}

export default App;
