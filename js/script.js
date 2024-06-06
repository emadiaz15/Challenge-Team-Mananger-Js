class Player {
    constructor(name, age, position, status = 'substitute') {
        this.name = name;
        this.age = age;
        this.position = position;
        this.status = status;
    }
}

const getPlayersFromLocalStorage = () => {
    const playersString = localStorage.getItem('players');
    return playersString ? JSON.parse(playersString) : [];
};

const savePlayersToLocalStorage = (players) => {
    localStorage.setItem('players', JSON.stringify(players));
};

const showAddPlayerForm = () => {
    $('#addPlayerModal').modal('show');
};

document.getElementById('addPlayerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    try {
        const name = document.getElementById('playerName').value;
        const age = parseInt(document.getElementById('playerAge').value);
        const position = document.getElementById('playerPosition').value;

        let players = getPlayersFromLocalStorage();
        if (players.some(player => player.name === name)) {
            throw new Error('The player is already in the team.');
        }

        players.push(new Player(name, age, position));
        savePlayersToLocalStorage(players);
        alert('Player added successfully.');
        $('#addPlayerModal').modal('hide');
        e.target.reset();
    } catch (error) {
        console.error('Error:', error.message);
    }
});

const listPlayers = async () => {
    try {
        const players = getPlayersFromLocalStorage();
        const playersListDiv = document.getElementById('playerList');
        playersListDiv.innerHTML = '';
        players.forEach((player, index) => {
            const playerInfo = document.createElement('div');
            playerInfo.innerHTML = `
                <p>Name: ${player.name}, Age: ${player.age}, Position: ${player.position}, Status: ${player.status}</p>
                <button class="btn btn-danger" onclick="deletePlayer(${index})">Delete</button>
            `;
            playersListDiv.appendChild(playerInfo);
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
        console.error('Error:', error.message);
    }
};

const deletePlayer = async (index) => {
    try {
        const players = getPlayersFromLocalStorage();
        players.splice(index, 1);
        savePlayersToLocalStorage(players);
        await listPlayers();
    } catch (error) {
        console.error('Error:', error.message);
    }
};

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

        player.position = selectedPosition;
        savePlayersToLocalStorage(players);
        alert('Position assigned successfully.');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

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

        incomingPlayer.status = 'starter';
        outgoingPlayer.status = 'substitute';
        savePlayersToLocalStorage(players);
        alert('Substitution made successfully.');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

const startGame = async () => {
    try {
        const players = getPlayersFromLocalStorage();
        let selectedPlayers = [];

        const playerNames = prompt("Enter the names of the players to start the game, separated by commas:");
        const namesArray = playerNames.split(',').map(name => name.trim());

        namesArray.forEach(playerName => {
            const player = players.find(player => player.name === playerName);
            if (!player) {
                throw new Error(`Player ${playerName} not found.`);
            }
            player.status = 'playing';
            selectedPlayers.push(playerName);
        });

        savePlayersToLocalStorage(players);
        alert('Game started successfully.');
    } catch (error) {
        console.error('Error:', error.message);
    }
};
