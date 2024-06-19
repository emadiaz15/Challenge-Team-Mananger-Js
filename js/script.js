class Player {
    constructor(name, age, position, status = 'substitute') {
        // Initialize a new player with name, age, position, and status (default is 'substitute')
        this.name = name;
        this.age = age;
        this.position = position;
        this.status = status;
    }
}

// Retrieve players from local storage, parsing JSON if exists, or return an empty array
const getPlayersFromLocalStorage = () => {
    const playersString = localStorage.getItem('players');
    return playersString ? JSON.parse(playersString) : [];
};

// Save players array to local storage as a JSON string
const savePlayersToLocalStorage = (players) => {
    localStorage.setItem('players', JSON.stringify(players));
};

// Show the modal to add a new player
const showAddPlayerForm = () => {
    $('#addPlayerModal').modal('show');
};

// Event listener for the form submission to add a new player
document.getElementById('addPlayerForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from submitting the default way
    try {
        // Retrieve input values from the form
        const name = document.getElementById('playerName').value;
        const age = parseInt(document.getElementById('playerAge').value);
        const position = document.getElementById('playerPosition').value;

        let players = getPlayersFromLocalStorage();
        // Check if the player already exists in the team
        if (players.some(player => player.name === name)) {
            throw new Error('The player is already in the team.');
        }

        // Add the new player to the players array
        players.push(new Player(name, age, position));
        savePlayersToLocalStorage(players); // Save updated players array to local storage
        alert('Player added successfully.');
        $('#addPlayerModal').modal('hide'); // Hide the modal after adding the player
        e.target.reset(); // Reset the form fields
    } catch (error) {
        console.error('Error:', error.message);
    }
});

// Function to list all players and display them in the 'playerList' div
const listPlayers = async () => {
    try {
        const players = getPlayersFromLocalStorage();
        const playersListDiv = document.getElementById('playerList');
        playersListDiv.innerHTML = ''; // Clear existing list
        // Create and append player info to the div
        players.forEach((player, index) => {
            const playerInfo = document.createElement('div');
            playerInfo.innerHTML = `
                <p>Name: ${player.name}, Age: ${player.age}, Position: ${player.position}, Status: ${player.status}</p>
                <button class="btn btn-danger" onclick="deletePlayer(${index})">Delete</button>
            `;
            playersListDiv.appendChild(playerInfo);
        });
        await new Promise(resolve => setTimeout(resolve, 1000)); // Optional delay
    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Function to delete a player by index and update the list
const deletePlayer = async (index) => {
    try {
        const players = getPlayersFromLocalStorage();
        players.splice(index, 1); // Remove player from array
        savePlayersToLocalStorage(players); // Save updated array to local storage
        await listPlayers(); // Refresh the player list
    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Function to change a player's position
const changePosition = async () => {
    try {
        const players = getPlayersFromLocalStorage();
        const playerName = prompt("Enter the player's name to change their position:");
        const player = players.find(player => player.name === playerName);

        if (!player) {
            throw new Error('Player not found in the team.');
        }

        const newPositionOptions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
        const positionSelection = prompt(`Select the new position for ${playerName}: \n${newPositionOptions.map((position, index) => `${index + 1}. ${position}`).join('\n')}`);
        const selectedPosition = newPositionOptions[parseInt(positionSelection) - 1];

        if (!selectedPosition) {
            throw new Error('Invalid position selection.');
        }

        player.position = selectedPosition; // Update player's position
        savePlayersToLocalStorage(players); // Save updated array to local storage
        alert('Position assigned successfully.');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Function to make a substitution
const makeSubstitution = async () => {
    try {
        const incomingPlayerName = prompt("Enter the name of the incoming player:");
        const outgoingPlayerName = prompt("Enter the name of the outgoing player:");
        const players = getPlayersFromLocalStorage();
        
        const incomingPlayer = players.find(player => player.name === incomingPlayerName);
        const outgoingPlayer = players.find(player => player.name === outgoingPlayerName);
        
        if (!incomingPlayer || !outgoingPlayer) {
            throw new Error('One or both players not found.');
        }

        // Update statuses for substitution
        incomingPlayer.status = 'starter';
        outgoingPlayer.status = 'substitute';
        savePlayersToLocalStorage(players); // Save updated array to local storage
        alert('Substitution made successfully.');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Function to start the game by selecting players
const startGame = async () => {
    try {
        const players = getPlayersFromLocalStorage();
        let selectedPlayers = [];

        const playerNames = prompt("Enter the names of the players to start the game, separated by commas:");
        const namesArray = playerNames.split(',').map(name => name.trim());

        // Mark selected players as 'playing'
        namesArray.forEach(playerName => {
            const player = players.find(player => player.name === playerName);
            if (!player) {
                throw new Error(`Player ${playerName} not found.`);
            }
            player.status = 'playing';
            selectedPlayers.push(playerName);
        });

        savePlayersToLocalStorage(players); // Save updated array to local storage
        alert('Game started successfully.');
    } catch (error) {
        console.error('Error:', error.message);
    }
};
