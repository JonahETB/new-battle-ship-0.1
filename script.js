"use strict";

// Constants
const sizeOfTable = 10;
const root = document.getElementById("root"); // Assuming you have an element with the id "root" in your HTML

// Function to generate the game table
function tableGenerator() {
  const table = document.createElement("table");
  root.appendChild(table);

  for (let y = 0; y < sizeOfTable; y++) {
    const tr = table.appendChild(document.createElement("tr"));

    for (let x = 0; x < sizeOfTable; x++) {
      const td = tr.appendChild(document.createElement("td"));
      td.id = `${y}${x}`;
      td.addEventListener('click', () => fire(y, x));
    }
  }
}

// Object to manage ships
const ships = {
    toSpawn: {
        small: { count: 3, size: 2 },
        med: { count: 2, size: 3 }
    },
    spawnedShips: []
};

// Function to check if a ship can be placed at a specific position
function canPlaceShip(y, x) {
    if (ships.spawnedShips.some(ship => ship.location.some(coord => coord === `[${y}-${x}]`)))
      return false;
  
    for (const ship of ships.spawnedShips)
      for (const coord of ship.location)
        if (Math.abs(coord[0] - y) <= 1 && Math.abs(coord[1] - x) <= 1)
          return false;
  
    return true;
  }

// Function to spawn ships
function toSpawn(ship) {
    for (let j = 0; j < ship.count; j++) {
      let shipPlaced = false;
  
      while (!shipPlaced) {
        let y = Math.floor(Math.random() * (sizeOfTable - ship.size)),
          x = Math.floor(Math.random() * (sizeOfTable - ship.size)),
          rotation = Math.round(Math.random());
  
        if (!canPlaceShip(y, x)) continue;
  
        const location = (rotation === 0) ?
          Array.from({ length: ship.size }, (_, i) => `[${y}-${x + i}]`) :
          Array.from({ length: ship.size }, (_, i) => `[${y + i}-${x}]`);
  
        ships.spawnedShips.push({ location, hits: Array(ship.size).fill(''), sunk: false });
        shipPlaced = true;
      }
    }
  }

// Function to handle firing
function fire(y, x) {
    const hitShip = ships.spawnedShips.find(ship => ship.location.some(coord => coord === `[${y}-${x}]`));
  
    if (hitShip) {
      console.log(`Hit at [${y}-${x}]`);
      hitShip.hits[hitShip.location.indexOf(`[${y}-${x}]`)] = 'X';
  
      const td = document.getElementById(`${y}${x}`);
      td.style.backgroundColor = 'red';
  
      if (hitShip.hits.every(hit => hit === 'X')) {
        hitShip.sunk = true;
        alert(`Ship at [${y}-${x}] sunk!`);
      }
    } else {
      console.log(`Miss at [${y}-${x}]`);
      const td = document.getElementById(`${y}${x}`);
      td.style.backgroundColor = 'gray';
    }
  }
  

// Generate the game table
tableGenerator();
toSpawn(ships.toSpawn.med);
toSpawn(ships.toSpawn.small);
