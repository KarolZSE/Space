const canvas = document.getElementById("GameCanvas");
const context = canvas.getContext('2d');
const GameDiv = document.getElementById('GameDiv').getBoundingClientRect();

    context.imageSmoothingEnabled = false;
    const noise = new Noise(Math.random());

    const stoneColor = '#888888';
    const waterColor = '#6AACD5';
    const coalColor = '#000000';
    const AluminiumColor = '#ffffff';
    const OilColor = '#694705';

function generateTerrain() {
    const imageData = context.createImageData(canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const base = noise.perlin2(x * 0.05, y * 0.05);

            let color = stoneColor;

            const coalNoise = noise.perlin2(x * 0.05, y * 0.05);
            if (coalNoise > 0.6) color = coalColor;


            const waterNoise = noise.perlin2(x * 0.01, y * 0.01);
            if (waterNoise > 0.3) color = waterColor;

            const AluminiumNoise = noise.perlin2(x * 0.03, y * 0.03);
            if (AluminiumNoise > 0.7) color = AluminiumColor;

            const OilNoise = noise.perlin2(x * 0.02, y * 0.02);
            if (OilNoise > 0.7) color = OilColor;

            const index = (y * canvas.width + x) * 4;
            const rgb = hexToRgb(color);
            imageData.data[index] = rgb.r;
            imageData.data[index + 1] = rgb.g;
            imageData.data[index + 2] = rgb.b;
            imageData.data[index + 3] = 255;
        }
    }

    context.putImageData(imageData, 0, 100);
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
        Building.style.width = '360px';
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

/*
                    <div draggable="true" id="Coal">1</div>
                    <div draggable="true" id="Wind">2</div>
                    <div draggable="true" id="Solar">3</div>
                    <div draggable="true" id="Oil">4</div>
                    <div draggable="true" id="Raf">5</div>
*/
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

    const Events = document.getElementById('Events');
    canvas.addEventListener('drop', (ev) => {
        ev.preventDefault();

        const id = ev.dataTransfer.getData('text/plain');
        let YAlign = 0;

        if (id == "Coal") {
            const templi = document.createElement('li');
            Events.appendChild(templi);
            setInterval(() => {
                const temp = document.getElementById(`${id}N`);
                if (Number(temp.textContent) <= 0) {
                    templi.textContent = '1x Coal Power Plant - No coal to process';
                    return;
                };
                temp.textContent = Number(temp.textContent) - 1;
                templi.textContent = '1x Coal Power Plant - Generates 1 Energy/s, Costs 1 Coal/s';              
                const temp2 = document.getElementById('EnergyN');
                temp2.textContent = Number(temp2.textContent) + 1;
            }, 1000);
        } else if (id == "Wind") {
            const temp = document.getElementById('AluminumN');
            if (Number(temp.textContent) < 30) return;
            const templi = document.createElement('li');
            templi.textContent = '1x Wind Turbine - Generates 2 Energy/s'
            Events.appendChild(templi);
            temp.textContent = Number(temp.textContent) - 30;
            YAlign = 7;
            setInterval(() => {
                const temp2 = document.getElementById('EnergyN');
                temp2.textContent = Number(temp2.textContent) + 2;
            }, 1000);
        } else if (id == "Solar") {
            const temp = document.getElementById('AluminumN');
            if (Number(temp.textContent) < 30) return;
            temp.textContent = Number(temp.textContent) - 30;
            YAlign = -5;
            setInterval(() => {
                const temp2 = document.getElementById('EnergyN');
                temp2.textContent = Number(temp2.textContent) + 2;
            }, 1000);
        } else if (id == "Raf") {
            YAlign = -15;
            const templi = document.createElement('li');
            Events.appendChild(templi);
            setInterval(() => {
                const temp = document.getElementById(`BauxiteN`);
                const temp2 = document.getElementById('EnergyN');
                if (Number(temp.textContent) < 2 || Number(temp2.textContent) < 5) {
                    templi.textContent = '1x Rafinery - No Bauxite to process';
                    return;
                };
                const temp3 = document.getElementById('AluminumN');
                templi.textContent = '1x Rafinery - Generates 1 Aluminum/s, Costs 2 Bauxite/s and 5 Energy/s';
                temp.textContent = Number(temp.textContent) - 2;
                temp2.textContent = Number(temp2.textContent) - 5;
                temp3.textContent = Number(temp3.textContent) + 1;
            }, 1000);
        }
        const draggedElement = document.getElementById(id);

        const rect = canvas.getBoundingClientRect();
        const dropX = ev.clientX - rect.left;

        const style = getComputedStyle(draggedElement);

        const build = new Image();
        build.crossOrigin = 'anonymous';
        build.src = style.backgroundImage && style.backgroundImage.match(/url\((?:'|")?(.*?)(?:'|")?\)/)[1];
        build.onload = () => {
            context.drawImage(build, 0, YAlign, 60, 60, dropX, 60, 60, 60);
        };
    });

const OreType = document.getElementById('OreType');
const OreFull = document.getElementById('OreFull');
const OreIcon = document.getElementById('OreIcon');
let OreAmout = 0;
let OreTypeValue = false;

let OldX, OldY, MultiWarpProtection;
const Player = document.getElementById('Player');
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
        if (Number(water.textContent) <= 0) return;
        
        water.textContent = Number(water.textContent) - 1;   
    }

    OldX = Player.offsetLeft;
    OldY = Player.offsetTop;

    if (e.key == 'w') {
        Player.style.top = Player.offsetTop - 3 + 'px';
    } else if (e.key == 's') {
        Player.style.top = Player.offsetTop + 3 + 'px';
    } else if (e.key == 'a') {
        Player.style.left = Player.offsetLeft - 3 + 'px';
    } else if (e.key == 'd') {
        Player.style.left = Player.offsetLeft + 3 + 'px';
    }

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
    };
    CheckForOres();
});

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
        console.log('ok1');
        Player.style.left = canvas.offsetLeft + PlayerRect.width + 'px';
        canvas.style.left = (canvas.offsetLeft - 900) + 'px';
        setTimeout(() => {
            MultiWarpProtection = false;    
        }, 3000);
    };

    if (PlayerRect.left <= GameDiv.left) {
        if (MultiWarpProtection) return;
        MultiWarpProtection = true;
        console.log('ok2');
        Player.style.left = canvas.offsetLeft + canvas.offsetWidth - PlayerRect.width + 'px';
        canvas.style.left = (canvas.offsetLeft + 900) + 'px';
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