import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './state/store';
import Home from './Pages/Home';
import PageLayout from './PageLayout';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PageLayout>
                <Home />
              </PageLayout>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
