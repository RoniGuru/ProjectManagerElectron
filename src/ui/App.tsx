import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './state/store';
import Home from './Home';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
