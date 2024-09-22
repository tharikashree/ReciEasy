
import React from 'react';
import {Link} from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden  ">
            <img className="w-full h-40 object-cover" src={recipe.image} alt={recipe.title} />
            <div className="p-4 mb-3">
                <h3 className="text-xl font-semibold mb-3">{recipe.title}</h3>
                <p className="text-gray-600 mb-3">{recipe.description}</p>
                <Link to={`/recipe/${recipe.id}`} className="mt-8 bg-blue-500 text-white px-4 py-2 rounded">View Recipe</Link>
            </div>
        </div>
    );
};

export default RecipeCard;