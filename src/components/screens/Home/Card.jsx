import React from 'react';

const Card = ({ idea, onClick }) => {
    return (
        <div 
            className="bg-blue-100 border border-blue-200 rounded-lg shadow-md p-4 m-2 cursor-pointer hover:scale-105 transition-transform"
            onClick={onClick}
        >
            <p className="text-lg font-semibold text-blue-800">{idea.activity}</p>
            <small className="text-blue-600">{idea.type}</small>
        </div>
    );
};

export default Card;