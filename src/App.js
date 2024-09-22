import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/Landing';
import HomePage from './pages/Home';
import Login from './pages/Login'; 
import SignUp from './pages/SignUp'; 
import Profile from './pages/Profile';
import SearchRecipe from './pages/SearchRecipe';
import MyRecipe from './pages/MyRecipe';
import Recipe from './components/RecipePage';
import Favorites from './pages/Favorites';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search-recipe" element={<SearchRecipe />} />
        <Route path="/my-recipe" element={<MyRecipe />} />
        <Route path="/recipe/:id" element={<Recipe />} />
        <Route path="/favorite" element={<Favorites />} />
        
      </Routes>
    </Router>
  );
}

export default App;
