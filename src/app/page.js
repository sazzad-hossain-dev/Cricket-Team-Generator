"use client";
import { motion } from "framer-motion";
import {
    addPlayerToCategory,
    addTeam,
    generateTeams,
} from "@/lib/reducer/teamSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
    const dispatch = useDispatch();
    const { currentStep, teams, categories, currentCategoryIndex } =
        useSelector((state) => state.team);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");

    const validateInput = (input) => {
        const trimmedInput = input.trim();
        if (!trimmedInput) return "Input cannot be empty.";
        if (trimmedInput.length > 30)
            return "Input is too long (max 30 characters).";
        if (!/^[a-zA-Z0-9 ]+$/.test(trimmedInput))
            return "Input contains invalid characters.";
        return null;
    };

    const handleInputSubmit = () => {
        const validationError = validateInput(inputValue);
        if (validationError) {
            setError(validationError);
            return;
        }
        setError("");

        if (currentStep === "teams") {
            if (teams.length >= 6) {
                setError("All team slots are filled.");
                return;
            }
            if (teams.includes(inputValue.trim())) {
                setError("Team name already exists.");
                return;
            }
            dispatch(addTeam(inputValue.trim()));
        } else if (currentStep === "categories") {
            const currentCategory = categories[currentCategoryIndex];
            if (currentCategory.players.length >= 6) {
                setError("All player slots for this category are filled.");
                return;
            }
            if (currentCategory.players.includes(inputValue.trim())) {
                setError("Player name already exists in this category.");
                return;
            }
            dispatch(
                addPlayerToCategory({
                    categoryIndex: currentCategoryIndex,
                    player: inputValue.trim(),
                })
            );
        }
        setInputValue("");
    };

    const handleGenerateTeams = () => {
        if (
            teams.length !== 6 ||
            categories.some((cat) => cat.players.length !== 6)
        ) {
            setError(
                "All teams and players must be added before generating teams."
            );
            return;
        }
        setError("");
        dispatch(generateTeams());
    };

    return (
        <div className="relative min-h-screen bg-gradient-animation overflow-x-hidden">
            {/* Background Image with Blur */}
            <div className="bg-hero z-[-1]"></div>

            <motion.h1
                className="text-4xl font-bold text-center text-white mb-6 pt-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                KPL Team Generator
            </motion.h1>

            {currentStep === "teams" && (
                <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        Enter Team Name {teams.length + 1}/6
                    </h2>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter team name"
                        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    />
                    {error && <p className="text-red-600 mb-2">{error}</p>}
                    <button
                        onClick={handleInputSubmit}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </motion.div>
            )}

            {currentStep === "categories" && (
                <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        Enter Player Name for{" "}
                        {categories[currentCategoryIndex].name} (
                        {categories[currentCategoryIndex].players.length + 1}/6)
                    </h2>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={`Enter player for ${categories[currentCategoryIndex].name}`}
                        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
                    />
                    {error && <p className="text-red-600 mb-2">{error}</p>}
                    <button
                        onClick={handleInputSubmit}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                    >
                        Submit
                    </button>
                </motion.div>
            )}

            {currentStep === "done" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto z-10"
                >
                    <h2 className="text-2xl font-semibold text-green-600 mb-6">
                        All inputs completed!
                    </h2>
                    <button
                        onClick={handleGenerateTeams}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                    >
                        Generate Teams
                    </button>

                    <div className="mt-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Generated Teams
                        </h2>
                        {teams.map((team, index) => (
                            <div
                                key={index}
                                className="mb-6 border rounded-lg p-4 bg-gray-100"
                            >
                                <h3 className="text-xl font-bold text-blue-700 mb-2">
                                    {team.teamName}
                                </h3>
                                <ul className="list-disc list-inside">
                                    {Array.isArray(team.players) ? (
                                        team.players.map((player, idx) => (
                                            <li
                                                key={idx}
                                                className="text-gray-700"
                                            >
                                                {player}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-700">
                                            No players available
                                        </li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Home;
