const sharp = require('sharp');
const pngToIco = require('png-to-ico');
const fs = require('fs');
const path = require('path');

async function convert() {
    try {
        const buildPath = path.join(__dirname, '../build');
        if (!fs.existsSync(buildPath)) fs.mkdirSync(buildPath, { recursive: true });

        console.log('Generating PNG...');
        await sharp(path.join(buildPath, 'icon.svg'))
            .resize(256, 256)
            .png()
            .toFile(path.join(buildPath, 'icon.png'));

        console.log('Generating ICO...');
        const buf = await pngToIco(path.join(buildPath, 'icon.png'));
        fs.writeFileSync(path.join(buildPath, 'icon.ico'), buf);

        console.log('Icons generated successfully.');
    } catch (err) {
        console.error('Error generating icons:', err);
    }
}

convert();
