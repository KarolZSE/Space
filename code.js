const canvas = document.getElementById("GameCanvas");
const context = canvas.getContext('2d');
const GameDiv = document.getElementById('GameDiv').getBoundingClientRect();
const date = Date.now();
const buildings = [];
let BuildingIDCounter = 0;

    context.imageSmoothingEnabled = false;
    const noise = new Noise(Math.random());

    const stoneColor = '#888888';
    const waterColor = '#6AACD5';
    const coalColor = '#000000';
    const AluminiumColor = '#ffffff';
    const OilColor = '#694705';

function generateTerrain(chunk = 0) {
    const imageData = context.createImageData(600, 600);

    for (let y = 0; y < 600; y++) {
        for (let x = 0; x < 600; x++) {

            const wx = x + chunk * 600;
            const base = noise.perlin2(wx * 0.05, y * 0.05);

            let color = stoneColor;

            const coalNoise = noise.perlin2(wx * 0.05, y * 0.05);
            if (coalNoise > 0.6) color = coalColor;


            const waterNoise = noise.perlin2(wx * 0.01, y * 0.01);
            if (waterNoise > 0.3) color = waterColor;

            const AluminiumNoise = noise.perlin2(wx * 0.03, y * 0.03);
            if (AluminiumNoise > 0.7) color = AluminiumColor;

            const OilNoise = noise.perlin2(wx * 0.02, y * 0.02);
            if (OilNoise > 0.7) color = OilColor;

            const index = (y * 600 + x) * 4;
            const rgb = hexToRgb(color);
            imageData.data[index] = rgb.r;
            imageData.data[index + 1] = rgb.g;
            imageData.data[index + 2] = rgb.b;
            imageData.data[index + 3] = 255;
        }
    }

    context.putImageData(imageData, chunk * 600 + 10000, 100);
}

    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        return { r: parseInt(hex.substring(0, 2), 16), g: parseInt(hex.substring(2, 4), 16), b: parseInt(hex.substring(4, 6), 16)};
    }

    generateTerrain();
let StartX, StartY;
canvas.addEventListener("mousedown", (e) => {
    e.preventDefault();
    StartX = e.clientX - GameDiv.left;
    StartY = e.clientY - GameDiv.top;
});

canvas.addEventListener("mouseup", (e) => {
    context.beginPath();
    // if (Pla)
    RectWidth = e.clientX - GameDiv.left - StartX;
    RectHeight = e.clientY - GameDiv.top - StartY;
    console.log(Math.abs(RectHeight * RectWidth / 5000));
    let thisRect = [StartX, StartY, RectWidth, RectHeight];
    context.rect(...thisRect);
    context.stroke();
    setTimeout(() => {
        context.fillStyle = '#fff';
        context.fillRect(...thisRect);
    }, 1000);
    
});

const Building = document.getElementById('Building');
const BuildingChildren = document.querySelectorAll('#Building div');
let buildON = false;
Building.addEventListener('click', () => {
    if (!buildON) {
        buildON = true;
        Building.style.width = '300px';
        BuildingChildren.forEach(e => {
            e.style.display = 'inline';
        }); 
    } else {
        buildON = false;
        Building.style.width = '60px';
        BuildingChildren.forEach(e => {
            e.style.display = 'none';
        }); 
    }
});

const ReqText = document.getElementById('ReqText');
const Gains = document.getElementById('Gains');
const ReqWork = document.getElementById('ReqWork');

BuildingChildren.forEach(e => {
    e.addEventListener('dragstart', (ev) => {
        ev.dataTransfer.setData('text/plain', e.id);
        if (e.id == "Coal") {
            ReqText.textContent = 'None';
            ReqWork.textContent = '1 Coal/s';
            Gains.textContent = '1 Energy/s';
        } else if (e.id == "Wind") {
            ReqText.textContent = "30 Aluminum";
            ReqWork.textContent = 'Needs wind';
            Gains.textContent = '2 Energy/s';
        } else if (e.id == "Solar") {
            ReqText.textContent = "30 Aluminum";
            ReqWork.textContent = 'Works only in the day';
            Gains.textContent = '2 Energy/s';
        } else if (e.id == "Raf") {
            ReqText.textContent = 'None';
            ReqWork.textContent = '2 Bauxite/s , 5 Energy/s';
            Gains.textContent = '1 Aluminum/s';
        }
        
    });

    e.addEventListener('dragend', () => {
        ReqText.textContent = '---';
        Gains.textContent = '---';
        ReqWork.textContent = '---';
    });

    e.addEventListener("click", () => {
        console.log('ok');
    });
});

    canvas.addEventListener('dragover', (ev) => {
        ev.preventDefault();
        
    });

    let CoalCount = 0;
    let WindCount = 0;
    let SolarCount = 0;
    let RefCount = 0;
    const Aluminum = document.getElementById('AluminumN');
    const EnergyV = document.getElementById('EnergyN');

    canvas.addEventListener('drop', (ev) => {
        ev.preventDefault();

        const id = ev.dataTransfer.getData('text/plain');
        let YAlign = 0;

        const rect = canvas.getBoundingClientRect();
        const dropX = ev.clientX - rect.left;
        const buildingX = Math.floor(dropX / 60) * 60;
        const BuildingID = BuildingIDCounter++;

        let intervalID = null;

        if (id == "Coal") {
            CoalCount++;
            const tempE = document.getElementById(`${id}E`);
            intervalID = setInterval(() => {
                const temp = document.getElementById(`${id}N`);
                if (Number(temp.textContent) <= 0) {
                    tempE.textContent = `${CoalCount}x Coal Power Plant - No coal to process`;
                    return;
                };
                temp.textContent = Number(temp.textContent) - 1;
                tempE.textContent = `${CoalCount}x Coal Power Plant - Generates ${CoalCount} Energy/s, Costs ${CoalCount} Coal/s`;              
                EnergyV.textContent = Number(EnergyV.textContent) + 1;
            }, 1000);
        } else if (id == "Wind") {
            if (Number(Aluminum.textContent) < 30) return;
            WindCount++;
            document.getElementById(`${id}E`).textContent = `${WindCount}x Wind Turbine - Generates ${WindCount * 2} Energy/s`
            Aluminum.textContent = Number(Aluminum.textContent) - 30;
            YAlign = 7;
            intervalID = setInterval(() => {
                EnergyV.textContent = Number(EnergyV.textContent) + 2;
            }, 1000);
        } else if (id == "Solar") {
            if (Number(Aluminum.textContent) < 30) return;
            SolarCount++;
            document.getElementById(`${id}E`).textContent = `${SolarCount}x Solar Farm - Generates ${SolarCount * 2} Energy/s`
            Aluminum.textContent = Number(Aluminum.textContent) - 30;
            YAlign = -5;
            intervalID = setInterval(() => {
                EnergyV.textContent = Number(EnergyV.textContent) + 2;
            }, 1000);
        } else if (id == "Raf") {
            RefCount++;
            const tempE = document.getElementById(`${id}E`);
            YAlign = -15;
            intervalID = setInterval(() => {
                const temp = document.getElementById(`BauxiteN`);
                if (Number(temp.textContent) < 2 || Number(EnergyV.textContent) < 5) {
                    tempE.textContent = `${RefCount}x Rafinery - No Bauxite or Energy to process`;
                    return;
                };
                tempE.textContent = `${RefCount}x Rafinery - Generates ${RefCount} Aluminum/s, Costs ${RefCount * 2} Bauxite/s and ${RefCount * 5} Energy/s`;
                temp.textContent = Number(temp.textContent) - 2;
                EnergyV.textContent = Number(EnergyV.textContent) - 5;
                Aluminum.textContent = Number(Aluminum.textContent) + 1;
            }, 1000);
        }

        const originalTerrain = context.getImageData(buildingX, 60 + YAlign, 60, 60);

        const draggedElement = document.getElementById(id);
        const style = getComputedStyle(draggedElement);

        const build = new Image();
        build.crossOrigin = 'anonymous';
        build.src = style.backgroundImage && style.backgroundImage.match(/url\((?:'|")?(.*?)(?:'|")?\)/)[1];
        build.onload = () => {
            context.drawImage(build, 0, YAlign, 60, 60, buildingX, 60, 60, 60);

            buildings.push({
                id: BuildingID,
                type: id,
                x: buildingX,
                y: 60,
                intervalID: intervalID,
                originalTerrain: originalTerrain
            });
        };
    });

    canvas.addEventListener('contextmenu', (ev) => {
        ev.preventDefault();

        const rect = canvas.getBoundingClientRect();
        const clickX = ev.clientX - rect.left;
        const clickY = ev.clientY - rect.top;

        if (clickY >= 60 && clickY <= 120) {
            const buildingX = Math.floor(clickX / 60) * 60;

            const buildingIndex = buildings.findIndex(b => b.x === buildingX && b.y === 60);
            if (buildingIndex !== -1) {
                const building = buildings[buildingIndex];

                if (building.intervalID) {
                    clearInterval(building.intervalID);
                }

                if (building.type == "Coal") {
                    CoalCount--;
                    document.getElementById(`${building.type}E`).textContent = CoalCount > 0 
                    ? `${CoalCount}x Coal Power Plant - Generates ${CoalCount} Energy/s, Costs ${CoalCount} Coal/s`
                    : '';
                } else if (building.type == "Wind") {
                    WindCount--;
                    document.getElementById(`${building.type}E`).textContent = WindCount > 0
                    ?  `${WindCount}x Wind Turbine - Generates ${WindCount * 2} Energy/s`
                    : '';
                } else if (building.type == "Solar") {
                    SolarCount--;
                    document.getElementById(`${building.type}E`).textContent = SolarCount > 0
                    ?  `${SolarCount}x Solar Farm - Generates ${SolarCount * 2} Energy/s`
                    : '';
                } else if (building.type == "Raf") {
                    RefCount--;
                    document.getElementById(`${building.type}E`).textContent = RefCount > 0
                    ? `${RefCount}x Rafinery - Generates ${RefCount} Aluminum/s, Costs ${RefCount * 2} Bauxite/s and ${RefCount * 5} Energy/s`
                    : '';
                }

            context.putImageData(building.originalTerrain, building.x, building.y);

            buildings.splice(buildingIndex, 1)
            }
        }
    });

const OreType = document.getElementById('OreType');
const OreFull = document.getElementById('OreFull');
const OreIcon = document.getElementById('OreIcon');
let OreAmout = 0;
let OreTypeValue = false;



let OldX, OldY, MultiWarpProtection;
const Player = document.getElementById('Player');
let px = Player.offsetLeft;
let py = Player.offsetTop;
const Menu = document.getElementById("Menu");

window.addEventListener("keydown", (e) => {
    const water = document.getElementById('WaterN');
    if (OreType.textContent == 'Water') {
        if (OreAmout > 0) {
            OreFull.textContent = --OreAmout; 
        } else {
            OreTypeValue = false;
            OreType.textContent = 'Nothing';
        } 
    } else {  
        if (Number(water.textContent) <= 0) {
            const DateNow = Math.floor((Date.now() - date) / 1000);
            Menu.style.display = 'block';
            Menu.innerHTML = `<h1 style="color: #af0f0f;">The drill has burned!</h1>
            <p style="width: 80%; margin-left: auto; margin-right: auto;">Bad news! You had not mananged the water supply well enough and the drill has burned out, worse news? You don't have a backup...</p>
            <p>Your time ${Math.floor(DateNow / 60)} minutes, ${DateNow % 60} seconds!</p>`;
            return;
        };
        water.textContent = Number(water.textContent) - 1;   
    }

    OldX = Player.offsetLeft;
    OldY = Player.offsetTop;

    if (e.key.toLowerCase() == 'w') {
        py = Math.max(Player.offsetTop - 3, 98);
        Player.style.transform = 'translate(-50%) rotate(180deg)';
    } else if (e.key.toLowerCase() == 's') {
        py += 3;
        Player.style.transform = 'translate(-50%) rotate(0deg)';
    } else if (e.key.toLowerCase() == 'a') {
        px -= 3;
        Player.style.transform = 'translate(-50%) rotate(90deg)';
    } else if (e.key.toLowerCase() == 'd') {
        px += 3;
        Player.style.transform = 'translate(-50%) rotate(270deg)';
    }

    Player.style.left = px + 'px';
    Player.style.top = py + 'px';

    if (isColliding(Player, document.getElementById('SpaceShip'))) {
        OreType.textContent = 'Nothing';
        OreFull.textContent = 0;
        OreIcon.style.backgroundPosition = `0px 0px`;
        if (OreTypeValue) {
        const temp = document.getElementById(`${OreTypeValue}N`) 
            temp.textContent = Number(temp.textContent) + OreAmout;
            OreAmout = 0;
            OreTypeValue = false;
        };
        if (Number(Aluminum.textContent) >= 75 && Number(document.getElementById('OilN').textContent) >= 150 && Number(EnergyV.textContent) >= 400) {
            const DateNow = Math.floor((Date.now() - date) / 1000);
            Menu.style.display = 'block';
            Menu.innerHTML = `<h1 style="color: #0faf0f;">You had escaped!</h1>
    <p style="width: 80%; margin-left: auto; margin-right: auto;">Congratulations you had repaired the rocket and flew away to new advetures!</p>
    <p>Your time ${Math.floor(DateNow / 60)} minutes, ${DateNow % 60} seconds!</p>`;
        };
    };
    CheckForOres();
});

let chunkX = 0;
let chunkXArray = [0];
let chunkY = 0;

function CheckForOres() {
    const rect = canvas.getBoundingClientRect();
    const PlayerRect = Player.getBoundingClientRect();

    const x = Math.max(0, (PlayerRect.left - rect.left) + 2);
    const y = Math.max(0, (PlayerRect.top + PlayerRect.height - rect.top) - 15);

    const width = Math.min(15, canvas.width - Math.max(0, (PlayerRect.left - rect.left)));
    const height = Math.min(15, canvas.height - Math.max(0, (PlayerRect.top + PlayerRect.height - rect.top)));

    const imageData = context.getImageData(x, y, width, height);
    const pixel = imageData.data;
    

    for (let i = 0; i < pixel.length; i += 4) {
        const r = pixel[i];
        const g = pixel[i + 1];
        const b = pixel[i + 2];

        pixel[i] = 200;
        pixel[i + 1] = 200;
        pixel[i + 2] = 200;

        context.putImageData(imageData, x, y);
        console.log(r, g, b);
        if (r > 130 && b < 200) {
            
        } else if (r == 0 && g == 0 && b == 0) {
            if (OreTypeValue && OreTypeValue != 'Coal') continue;
            OreTypeValue = 'Coal';
            OreType.textContent = 'Coal';
            OreFull.textContent = ++OreAmout;
            OreIcon.style.backgroundPosition = `-25px 0px`;
            if (OreAmout >= 100) {
                OreAmout = 100;
                OreFull.textContent = 'Full!';
            }
        } else if (r == 106 && g == 172 && b == 213) {
            if (OreTypeValue && OreTypeValue != 'Water') continue;
            OreTypeValue = 'Water';
            OreType.textContent = 'Water';
            OreFull.textContent = ++OreAmout;
            OreIcon.style.backgroundPosition = `-50px 0px`;
            if (OreAmout >= 100) {
                OreAmout = 100;
                OreFull.textContent = 'Full!';
            }
        } else if (r == 255 && g == 255 && b == 255) {
            if (OreTypeValue && OreTypeValue != 'Bauxite') continue;
            OreTypeValue = 'Bauxite';
            OreType.textContent = 'Bauxite';
            OreFull.textContent = ++OreAmout;
            OreIcon.style.backgroundPosition = `0px 0px`;
            if (OreAmout >= 100) {
                OreAmout = 100;
                OreFull.textContent = 'Full!';
            }
        }  else if (r == 105 && g == 71 && b == 5) {
            if (OreTypeValue && OreTypeValue != 'Oil') continue;
            OreTypeValue = 'Oil';
            OreType.textContent = 'Oil';
            OreFull.textContent = ++OreAmout;
            OreIcon.style.backgroundPosition = `-150px 0px`;
            if (OreAmout >= 100) {
                OreAmout = 100;
                OreFull.textContent = 'Full!';
            }
        }
    }

    if (PlayerRect.left >= GameDiv.width + GameDiv.left) {
        if (MultiWarpProtection) return;
        MultiWarpProtection = true;
        Player.style.left = '0px';
        px = 0;
        canvas.style.left = (canvas.offsetLeft - 600) + 'px';
        chunkX++;
        if (!chunkXArray.includes(chunkX)) {
            generateTerrain(chunkX);
            chunkXArray.push(chunkX);
        }
        setTimeout(() => {
            MultiWarpProtection = false;    
        }, 3000);
    };

    if (PlayerRect.left <= GameDiv.left) {
        if (MultiWarpProtection) return;
        MultiWarpProtection = true;
        Player.style.left = GameDiv.width + 'px';
        px = GameDiv.width;
        canvas.style.left = (canvas.offsetLeft + 600) + 'px';
        chunkX--;
        console.log(chunkX);
        if (!chunkXArray.includes(chunkX)) {
            generateTerrain(chunkX);
            chunkXArray.push(chunkX);
        }
        setTimeout(() => {
            MultiWarpProtection = false;    
        }, 3000);
    };
}

function isColliding(e1, e2) {
    const rect1 = e1.getBoundingClientRect()
    const rect2 = e2.getBoundingClientRect();

        return !(
            rect1.top > rect2.bottom || 
            rect1.bottom < rect2.top || 
            rect1.left > rect2.right || 
            rect1.right < rect2.left
        );
} 