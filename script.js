"use strict"
const sizeOfTable = 10;
function tableGenerator () {
    const table = document.createElement("table");
            root.appendChild(table);
    for (let y = 0; y < sizeOfTable; y++) {
        const tr = document.createElement("tr");
                table.appendChild(tr);
        for (let x = 0; x < sizeOfTable; x++) {
            const td = document.createElement("td");
                    td.id = `${y}${x}`;
                    td.setAttribute('onclick', `checkCell(${y}, ${x})`);
                    tr.appendChild(td);
        }
    }
}
tableGenerator();

const ships = {
    toSpawn: {
        small: {
            count: 3,
            size: 2
        },
        med: {
            count: 2,
            size: 3
        }
    },
    spawnedShips: []
};

toSpawn(ships.toSpawn.med);
toSpawn(ships.toSpawn.small);

function toSpawn (ship) {
    // we need to input the location and set the hits of the ship to 0
    for (let j = 0; j < ship.count; j++ ) {
        let shipPlaced = false;
        while (!shipPlaced) {
            let y = Math.floor(Math.random() * (sizeOfTable - ship.size));
            let x = Math.floor(Math.random() * (sizeOfTable - ship.size));
            let rotation = Math.round(Math.random()); // 0 - vertical, 1 - horizontal
            // Check if the ship can be placed at the randomly chosen position
            if (canPlaceShip(rotation, ship.size, y, x)) {
                shipPlaced = true;
                let data = [];
                if (rotation == 0) {
                    if (ship.size === 3) {
                        data = {"location":`[${y}-${x},${y}-${x+1},${y}-${x+2}]`,"hits":['','',''],"sunk": false};
                    } else {
                        data = {"location":`[${y}-${x},${y}-${x+1}]`,"hits":['',''],"sunk": false};
                    }
                } else {
                    if (ship.size === 3) {
                        data = {"location":`[${y}-${x},${y+1}-${x},${y+2}-${x}]`,"hits":['','',''],"sunk": false};
                    } else {
                        data = {"location":`[${y}-${x},${y+1}-${x}]`,"hits":['',''],"sunk": false};
                    }
                }
                ships.spawnedShips.push(data);
            }
        }
    }
}

// Check if the ship can be placed without overlapping with other ships
function canPlaceShip (rotation, size, y ,x) {
    
}

// will check if it hit a target
function checkCell (y, x) {
    
}

console.log(ships);