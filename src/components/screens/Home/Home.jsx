import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';

const Home = () => {
    const [ideasList, setIdeasList] = useState(JSON.parse(localStorage.getItem('ideasList')) || []);
    const [completedList, setCompletedList] = useState(JSON.parse(localStorage.getItem('completedList')) || []);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        localStorage.setItem('ideasList', JSON.stringify(ideasList));
        localStorage.setItem('completedList', JSON.stringify(completedList));
    }, [ideasList, completedList]);

    const addIdeaToList = (idea) => {
        setIdeasList([...ideasList, idea]);
    };

    const resolveIdea = (idea, index) => {
        setIdeasList(ideasList.filter((_, i) => i !== index));
        setCompletedList([...completedList, { ...idea, when: new Date().toLocaleString() }]);
    };

    const countAchievements = (type) => {
        return completedList.filter(item => item.type.toLowerCase() === type.toLowerCase()).length;
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % ideasList.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + ideasList.length) % ideasList.length);
    };

    const saveToBackend = async () => {
        await axios.post('http://localhost:5000/ideas', {
            ideas: ideasList,
            completedIdeas: completedList
        });
        alert('Ideas and completed challenges saved to backend');
    };

    const pullFromBackend = async () => {
        const response = await axios.get('http://localhost:5000/ideas');
        setIdeasList(response.data.ideas);
        setCompletedList(response.data.completedIdeas);
        alert('Ideas and completed challenges pulled from backend');
    };

    const clearLocalStorage = () => {
        localStorage.removeItem('ideasList');
        localStorage.removeItem('completedList');
        setIdeasList([]);
        setCompletedList([]);
    };

    return (
        <div className="container mx-auto p-4 text-center min-h-screen">
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">Choose fresh ideas to do</h2>
                <div className="flex justify-center flex-wrap">
                    <Card idea={{ activity: 'Learn how to fold a paper crane', type: 'Education' }} onClick={() => addIdeaToList({ activity: 'Learn how to fold a paper crane', type: 'Education' })} />
                    <Card idea={{ activity: 'Make a bucket list', type: 'Social' }} onClick={() => addIdeaToList({ activity: 'Make a bucket list', type: 'Social' })} />
                    <Card idea={{ activity: 'Do something you used to do as a kid', type: 'Relaxation' }} onClick={() => addIdeaToList({ activity: 'Do something you used to do as a kid', type: 'Relaxation' })} />
                    <Card idea={{ activity: 'Listen to your favorite album', type: 'Recreational' }} onClick={() => addIdeaToList({ activity: 'Listen to your favorite album', type: 'Recreational' })} />
                </div>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">Ideas in my list</h2>
                <div className="flex items-center justify-center">
                    <button onClick={prevSlide} className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mr-4 transition-colors duration-300">&lt;</button>
                    <div className="w-64">
                        {ideasList.length > 0 && (
                            <Card idea={ideasList[currentSlide]} onClick={() => resolveIdea(ideasList[currentSlide], currentSlide)} />
                        )}
                    </div>
                    <button onClick={nextSlide} className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg ml-4 transition-colors duration-300">&gt;</button>
                </div>
                <p className="mt-4 text-blue-500">{currentSlide + 1} / {ideasList.length}</p>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">Achievements</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="bg-blue-200 border border-blue-300 rounded-lg shadow-md p-4">
                        Recreational: {countAchievements('Recreational')}
                    </div>
                    <div className="bg-blue-200 border border-blue-300 rounded-lg shadow-md p-4">
                        Social: {countAchievements('Social')}
                    </div>
                    <div className="bg-blue-200 border border-blue-300 rounded-lg shadow-md p-4">
                        Education: {countAchievements('Education')}
                    </div>
                    <div className="bg-blue-200 border border-blue-300 rounded-lg shadow-md p-4">
                        Sport: {countAchievements('Sport')}
                    </div>
                    <div className="bg-blue-200 border border-blue-300 rounded-lg shadow-md p-4">
                        Relaxation: {countAchievements('Relaxation')}
                    </div>
                </div>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">Completed challenges</h2>
                <table className="min-w-full bg-blue-50 border border-blue-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b bg-blue-100 text-blue-700">Title</th>
                            <th className="py-2 px-4 border-b bg-blue-100 text-blue-700">Type</th>
                            <th className="py-2 px-4 border-b bg-blue-100 text-blue-700">When</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completedList.map((item, index) => (
                            <tr key={index}>
                                <td className="py-2 px-4 border-b text-blue-700">{item.activity}</td>
                                <td className="py-2 px-4 border-b text-blue-700">{item.type}</td>
                                <td className="py-2 px-4 border-b text-blue-700">{item.when}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">Data Management</h2>
                <div className="flex justify-center space-x-4">
                    <button onClick={saveToBackend} className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300">Save to Backend</button>
                    <button onClick={pullFromBackend} className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300">Pull from Backend</button>
                    <button onClick={clearLocalStorage} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300">Clear Local Storage</button>
                </div>
            </section>
        </div>
    );
};

export default Home;