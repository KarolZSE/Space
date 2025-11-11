const Building = document.getElementById('Building');
Building.addEventListener('click', () => {
    Building.style.width = '240px';
    Building.style.left = '130px';
});

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
    } else if (e.key == 'e') {
        
    }

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

        console.log(r, g, b);
        if (r > 130 && b < 200) {
            pixel[i] = 200;
            pixel[i + 1] = 200;
            pixel[i + 2] = 200;
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
        Player.style.left = canvas.offsetLeft - PlayerRect.width + 'px';
        canvas.style.left = (canvas.offsetLeft + canvas.offsetWidth - 300) + 'px';
        setTimeout(() => {
            MultiWarpProtection = false;    
        }, 3000);
    };
}