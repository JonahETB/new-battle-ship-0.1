"use strict";
const sizeOfTable = 10; // Constants
let guessCount = 0;

(function () {
  const battleShip = {
    ships: { toSpawn: { small: { count: 4, size: 2 }, med: { count: 2, size: 3 } }, spawnedShips: [] },
    tableGenerator: function () {
      // Function to generate the game table
      const table = root.appendChild(document.createElement("table"));

      for (let y = 0; y < sizeOfTable; y++) {
        const tr = table.appendChild(document.createElement("tr"));

        for (let x = 0; x < sizeOfTable; x++) {
          const td = tr.appendChild(document.createElement("td"));
          td.id = `${y}${x}`;
          td.addEventListener('click', () => fire(y, x));
        }
      }
    },
    canPlaceShip: function (y, x, rotation, size) {
      // Function to check if a ship can be placed at a specific position
      const location = (rotation === 0) ?
        Array.from({ length: size }, (_, i) => `[${y}-${x + i}]`) : Array.from({ length: size }, (_, i) => `[${y + i}-${x}]`);
      if (this.ships.spawnedShips.some(ship => ship.location.some(coord => coord === `[${y}-${x}]`)))
        return false;
      //makes it so the ship shouldn't spawn next to eachother
      for (const ship of this.ships.spawnedShips)
        for (const coord of ship.location)
          for (let j = 0; j < location.length; j++) {
            const [shipY, shipX] = coord.slice(1, -1).split('-').map(Number);
            const [newY, newX] = location[j].slice(1, -1).split('-').map(Number);
    
            if (Math.abs(shipY - newY) <= 1 && Math.abs(shipX - newX) <= 1)
              return false;
          }
      return true;
    },
    toSpawn: function (ship) {
      // Function to spawn ships
      for (let j = 0; j < ship.count; j++) {
        let shipPlaced = false;
    
        while (!shipPlaced) {
          let y = Math.floor(Math.random() * (sizeOfTable - ship.size)), x = Math.floor(Math.random() * (sizeOfTable - ship.size)),
            rotation = Math.round(Math.random());
    
          if (!this.canPlaceShip(y, x, rotation, ship.size)) continue;
            const location = (rotation === 0) ?
            Array.from({ length: ship.size }, (_, i) => `[${y}-${x + i}]`) : Array.from({ length: ship.size }, (_, i) => `[${y + i}-${x}]`);
    
            this.ships.spawnedShips.push({ location, hits: Array(ship.size).fill(''), sunk: false });
            shipPlaced = true;
        }
      }
    },
    userList: function () {
      const existingList = document.getElementById("remove");
      if (existingList)
        existingList.remove();
    
        const ul = root.appendChild(document.createElement("ul"));
        ul.id = "remove";
      
        for (let y = 0; y < this.ships.spawnedShips.length; y++) {
          const li = ul.appendChild(document.createElement("li"));
          const ship = this.ships.spawnedShips[y];
      
          let text = document.createTextNode(`Ship Length: ${ship.location.length}, Status: ${ship.sunk ? "Sunk" : "Not Sunk"}`);
          li.appendChild(text);
        }
      }
    }
  // Function to handle firing
  function fire (y, x) {
    guessCount++;
    document.getElementById("guessCount").textContent = `Guess Count: ${guessCount}`;
    const hitShip = battleShip.ships.spawnedShips.find(ship => ship.location.some(coord => coord === `[${y}-${x}]`));
    const td = document.getElementById(`${y}${x}`);

    if (hitShip) {
      hitShip.hits[hitShip.location.indexOf(`[${y}-${x}]`)] = 'X';
      td.style.backgroundColor = 'red';

      if (hitShip.hits.every(hit => hit === 'X')) {
        hitShip.sunk = true;
      }
    } else
      td.style.backgroundColor = 'gray';
    battleShip.userList();
  }

  // Generate the game table
  battleShip.tableGenerator();
  battleShip.toSpawn(battleShip.ships.toSpawn.med);
  battleShip.toSpawn(battleShip.ships.toSpawn.small);
  battleShip.userList()

  window.fire = fire;
})();

function clickAll () { // just to quickly evaluate the board
  for(let y = 0; y < sizeOfTable; y++)
    for(let x = 0; x < sizeOfTable; x++)
      document.getElementById(`${y}${x}`).click();
 }