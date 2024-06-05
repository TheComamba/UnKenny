function generateRandomId() {
    const length = 16;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

let lastTimestamp = 0;
function getUniqueTimestamp() {
    let timestamp = Date.now();
    if (timestamp <= lastTimestamp) {
        timestamp = lastTimestamp + 1;
    }
    lastTimestamp = timestamp;
    return timestamp;
}

export { generateRandomId, getUniqueTimestamp };
