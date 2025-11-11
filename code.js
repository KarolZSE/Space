const Building = document.getElementById('Building');
Building.addEventListener('click', () => {
    Building.style.width = '240px';
});

const OreType = document.getElementById('OreType');
const OreFull = document.getElementById('OreFull');
const OreIcon = document.getElementById('OreIcon');
let OreAmout = 0;

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
        if (OreTypeValue == 'Coal') {
            OreAmout
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
        console.log(r, g, b);
        if (r > 130 && b < 200) {
            
        } else if (r < 20) {
            if (OreTypeValue) return;
            OreTypeValue = 'Coal';
            OreType.textContent = 'Coal';
            OreFull.textContent = ++OreAmout;
            OreIcon.style.backgroundPosition = `-${25}px 0px`;
            if (OreAmout >= 100) {
                OreAmout = 100;
                OreFull.textContent = 'Full!';
            }
        }
    }

    context.putImageData(imageData, x, y);

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