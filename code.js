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

BuildingChildren.forEach(e => {
    e.addEventListener('dragstart', (f) => {
        f.dataTransfer.setData('text/plain', 'object');
    });

    e.addEventListener("click", () => {
        console.log('ok');
    });
});

const OreType = document.getElementById('OreType');
const OreFull = document.getElementById('OreFull');
const OreIcon = document.getElementById('OreIcon');
let OreAmout = 0;
let OreTypeValue = false;

let OldX, OldY, MultiWarpProtection;
const Player = document.getElementById('Player');
window.addEventListener("keydown", (e) => {

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
        } else if (r == 100 && g == 149 && b == 237) {
            console.log('bruh');
            if (OreTypeValue && OreTypeValue != 'Aluminum') continue;
            OreTypeValue = 'Aluminum';
            OreType.textContent = 'Aluminum';
            OreFull.textContent = ++OreAmout;
            OreIcon.style.backgroundPosition = `0px 0px`;
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