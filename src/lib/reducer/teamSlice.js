import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentStep: "teams", // 'teams', 'categories', or 'done'
    teams: [],
    categories: [
        { name: "Batsman", players: [] },
        { name: "Bowler", players: [] },
        { name: "All-Rounder", players: [] },
        { name: "Wicketkeeper", players: [] },
        { name: "Fielder", players: [] },
        { name: "Coach", players: [] },
    ],
    currentCategoryIndex: 0,
};

const teamSlice = createSlice({
    name: "team",
    initialState,
    reducers: {
        addTeam: (state, action) => {
            const teamName = action.payload.trim();
            if (state.teams.length >= 6) return; // Prevent more than 6 teams
            if (state.teams.includes(teamName)) return; // Prevent duplicates
            state.teams.push(teamName);
            if (state.teams.length === 6) {
                state.currentStep = "categories";
            }
        },
        addPlayerToCategory: (state, action) => {
            const { categoryIndex, player } = action.payload;
            const trimmedPlayer = player.trim();
            const category = state.categories[categoryIndex];
            if (!category || category.players.includes(trimmedPlayer)) return; // Prevent duplicates
            if (category.players.length >= 6) return; // Prevent more than 6 players per category
            category.players.push(trimmedPlayer);
            if (category.players.length === 6) {
                if (categoryIndex < state.categories.length - 1) {
                    state.currentCategoryIndex += 1;
                } else {
                    state.currentStep = "done";
                }
            }
        },
        generateTeams: (state) => {
            if (
                state.teams.length !== 6 ||
                state.categories.some((cat) => cat.players.length !== 6)
            ) {
                return; // Prevent generation if conditions aren't met
            }
            const shuffledPlayers = state.categories.map((cat) =>
                [...cat.players].sort(() => Math.random() - 0.5)
            );
            state.teams = state.teams.map((team, index) => ({
                teamName: team,
                players: shuffledPlayers.map((players) => players[index]),
            }));
        },
    },
});

export const { addTeam, addPlayerToCategory, generateTeams } =
    teamSlice.actions;
export default teamSlice.reducer;
