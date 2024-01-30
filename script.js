"use strict";
let guessCount = 0;
const sizeOfTable = 10, battleShip = {
  ships: { toSpawn: { small: { count: 4, size: 2 }, med: { count: 2, size: 3 } }, spawnedShips: [] },
  tableGenerator: function () { // Function to generate the game table
    const table = root.appendChild(document.createElement("table"));
    for (let y = 0; y < sizeOfTable; y++) {
      const tr = table.appendChild(document.createElement("tr"));
      for (let x = 0; x < sizeOfTable; x++) {
        const td = tr.appendChild(document.createElement("td"));
        td.id = `${y}${x}`;
        td.addEventListener('click', () => battleShip.fire(y, x));
      }
    }
  },
  canPlaceShip: function (y, x, rotation, size) { // Function to check if a ship can be placed at a specific position
    const location = (rotation === 0) ? Array.from({ length: size }, (_, i) => `[${y}-${x + i}]`) : Array.from({ length: size }, (_, i) => `[${y + i}-${x}]`);
    if (this.ships.spawnedShips.some(ship => ship.location.some(coord => coord === `[${y}-${x}]`)))
      return false;
    for (const ship of this.ships.spawnedShips) //makes it so the ship shouldn't spawn next to eachother
      for (const coord of ship.location)
        for (let j = 0; j < location.length; j++) {
          const [shipY, shipX] = coord.slice(1, -1).split('-').map(Number);
          const [newY, newX] = location[j].slice(1, -1).split('-').map(Number);
          if (Math.abs(shipY - newY) <= 1 && Math.abs(shipX - newX) <= 1)
            return false;
        }
    return true;
  },
  toSpawn: function (ship) { // Function to spawn ships
    for (let j = 0; j < ship.count; j++) {
      let shipPlaced = false;
      while (!shipPlaced) {
        let y = Math.floor(Math.random() * (sizeOfTable - ship.size)), x = Math.floor(Math.random() * (sizeOfTable - ship.size)), rotation = Math.round(Math.random());
        if (!this.canPlaceShip(y, x, rotation, ship.size)) continue;
          shipPlaced = true;
          const location = (rotation === 0) ? Array.from({ length: ship.size }, (_, i) => `[${y}-${x + i}]`) : Array.from({ length: ship.size }, (_, i) => `[${y + i}-${x}]`);
          this.ships.spawnedShips.push({ location, hits: Array(ship.size).fill(''), sunk: false });
      }
    }
  },
  userList: function () {
    if (document.getElementById("remove"))
      document.getElementById("remove").remove();
    const ul = root.appendChild(document.createElement("ul"));
        ul.id = "remove";
    for (let y = 0; y < this.ships.spawnedShips.length; y++) {
      const li = ul.appendChild(document.createElement("li"));
      const ship = this.ships.spawnedShips[y];
      let text = li.appendChild(document.createTextNode(`Ship Length: ${ship.location.length}, Status: ${ship.sunk ? "Sunk" : "Not Sunk"}`));
    }
  },
  fire: function (y, x) { // Function to handle firing
    guessCountText.textContent = `Click to fire!!    Guess Count: ${++guessCount}`;
    const hitShip = battleShip.ships.spawnedShips.find(ship => ship.location.some(coord => coord === `[${y}-${x}]`));
    const td = document.getElementById(`${y}${x}`);
    if (hitShip) {
      hitShip.hits[hitShip.location.indexOf(`[${y}-${x}]`)] = 'X';
      td.style.backgroundColor = 'red';
      if (hitShip.hits.every(hit => hit === 'X'))
        hitShip.sunk = true;
    } else
      td.style.backgroundColor = 'gray';
    this.userList();
  }
}
battleShip.tableGenerator(); // Generate the game table
battleShip.toSpawn(battleShip.ships.toSpawn.med);
battleShip.toSpawn(battleShip.ships.toSpawn.small);
battleShip.userList();