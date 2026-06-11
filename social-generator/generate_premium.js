const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = "/home/orhan/Documents/Projeler/tarim-dijital-ekosistem/projects/vistaseeds/doc/orjinal_resim";
const OUTPUT_DIR = "/home/orhan/Documents/Projeler/tarim-dijital-ekosistem/projects/vistaseeds/antigravity";
const LOGO_PATH = "/home/orhan/Documents/Projeler/tarim-dijital-ekosistem/projects/vistaseeds/frontend/public/assets/logo/vistaseed_logo_white.png";

const PRODUCTS = {
    "lucky-f1": {name: "LUCKY F1", type: "Çarliston Biber", desc: "Erkenci ve Yüksek Verimli"},
    "kizgin-f1": {name: "KIZGIN F1", type: "Acı Kıl Biber", desc: "Mükemmel Acılık ve Renk"},
    "prestij-f1": {name: "PRESTİJ F1", type: "Tatlı Kıl Biber", desc: "İhracata Uygun Kalite"},
    "birlik-f1": {name: "BİRLİK F1", type: "Üçburun Biber", desc: "Güçlü Bitki Yapısı"},
    "cankan-f1": {name: "CANKAN F1", type: "Kapya Biber", desc: "Kalın Etli ve Lezzetli"},
    "tirpan-f1": {name: "TIRPAN F1", type: "Kapya Biber", desc: "Yüksek Kuru Madde"},
    "saray-f1": {name: "SARAY F1", type: "Dolma Biber", desc: "Koyu Yeşil, İri Meyve"},
};

const SIZES = {
    "instagram": {width: 1080, height: 1080},
    "facebook": {width: 1200, height: 630},
    "twitter": {width: 1200, height: 675}
};

function getProductInfo(filename) {
    for (const [key, info] of Object.entries(PRODUCTS)) {
        if (filename.toLowerCase().includes(key)) {
            return info;
        }
    }
    const base = filename.split('.')[0];
    const name = base.replace(/-/g, ' ').toUpperCase();
    return {name: name, type: "Premium Tohum", desc: "Yeni Nesil Hibrit"};
}

// Helper to load image as base64
function getBase64Image(filePath) {
    if (!fs.existsSync(filePath)) return '';
    const bitmap = fs.readFileSync(filePath);
    const ext = path.extname(filePath).substring(1) || 'png';
    const mime = ext === 'jpg' ? 'jpeg' : ext;
    return `data:image/${mime};base64,${bitmap.toString('base64')}`;
}

const htmlTemplate = (imgBase64, logoBase64, info, width, height) => `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            width: ${width}px;
            height: ${height}px;
            background: linear-gradient(135deg, #0a0f0d 0%, #1a2a22 100%);
            font-family: 'Montserrat', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            color: white;
        }
        
        .glow-1 { position: absolute; top: -20%; left: -10%; width: 60%; height: 60%; background: radial-gradient(circle, rgba(0,242,96,0.15) 0%, rgba(0,0,0,0) 70%); border-radius: 50%; z-index: 1; }
        .glow-2 { position: absolute; bottom: -20%; right: -10%; width: 60%; height: 60%; background: radial-gradient(circle, rgba(14,209,140,0.15) 0%, rgba(0,0,0,0) 70%); border-radius: 50%; z-index: 1; }
        
        .container {
            position: relative;
            z-index: 10;
            width: 90%;
            height: 85%;
            display: flex;
            ${width > height ? 'flex-direction: row;' : 'flex-direction: column;'}
            align-items: center;
            justify-content: space-between;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 30px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px);
            padding: 50px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .text-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            ${width > height ? 'padding-right: 50px;' : 'text-align: center; align-items: center; margin-bottom: 40px;'}
        }

        .badge {
            background: linear-gradient(90deg, #d4af37, #f3e5ab);
            color: #000;
            font-size: ${width > height ? '18px' : '22px'};
            font-weight: 800;
            padding: 8px 20px;
            border-radius: 50px;
            display: inline-block;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
            align-self: ${width > height ? 'flex-start' : 'center'};
        }

        h1 {
            font-size: ${width > height ? '85px' : '90px'};
            font-weight: 900;
            line-height: 1.1;
            margin-bottom: 15px;
            background: linear-gradient(to right, #ffffff, #a0d4a4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0px 10px 20px rgba(0,0,0,0.2);
        }

        h2 {
            font-size: ${width > height ? '35px' : '45px'};
            font-family: 'Inter', sans-serif;
            font-weight: 400;
            color: #b0c4b1;
            margin-bottom: 30px;
            letter-spacing: 1px;
        }

        .desc {
            font-size: ${width > height ? '22px' : '28px'};
            color: #8fa391;
            font-family: 'Inter', sans-serif;
            border-left: 4px solid #00f260;
            padding-left: 15px;
            ${width > height ? '' : 'border-left: none; border-top: 4px solid #00f260; padding-top: 15px; padding-left: 0;'}
        }

        .image-container {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            ${width > height ? 'height: 100%;' : 'width: 100%; height: 50%;'}
        }

        .img-wrapper {
            width: ${width > height ? '450px' : '550px'};
            height: ${width > height ? '450px' : '550px'};
            border-radius: 50%;
            overflow: hidden;
            border: 8px solid rgba(0, 242, 96, 0.3);
            box-shadow: 0 0 60px rgba(0, 242, 96, 0.2), inset 0 0 40px rgba(0,0,0,0.5);
            position: relative;
            background: #fff;
        }

        img.product {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transform: scale(1.05);
        }

        .footer {
            position: absolute;
            bottom: 40px;
            left: 0;
            width: 100%;
            text-align: center;
            font-family: 'Inter', sans-serif;
            font-size: 20px;
            color: rgba(255,255,255,0.5);
            letter-spacing: 3px;
            z-index: 20;
            font-weight: 600;
        }

        .logo-container {
            position: absolute;
            top: 40px;
            ${width > height ? 'right: 50px;' : 'left: 0; width: 100%; display: flex; justify-content: center;'}
            z-index: 20;
        }
        
        .logo-container img {
            height: 40px;
            object-fit: contain;
        }
    </style>
</head>
<body>
    <div class="glow-1"></div>
    <div class="glow-2"></div>
    
    <div class="logo-container">
        <img src="${logoBase64}" alt="VistaSeeds Logo" />
    </div>

    <div class="container">
        <div class="text-content">
            <h1>${info.name}</h1>
            <h2>${info.type}</h2>
            <div class="desc">${info.desc}</div>
        </div>
        <div class="image-container">
            <div class="img-wrapper">
                <img src="${imgBase64}" class="product" />
            </div>
        </div>
    </div>

    <div class="footer">WWW.VISTASEEDS.COM.TR</div>
</body>
</html>
`;

async function main() {
    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const files = fs.readdirSync(INPUT_DIR);
    const imgFiles = files.filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));
    
    const logoBase64 = getBase64Image(LOGO_PATH);

    for (const f of imgFiles) {
        const filePath = path.join(INPUT_DIR, f);
        const imgBase64 = getBase64Image(filePath);
        const info = getProductInfo(f);
        
        for (const [platform, size] of Object.entries(SIZES)) {
            const page = await browser.newPage();
            await page.setViewport({ width: size.width, height: size.height });
            
            const html = htmlTemplate(imgBase64, logoBase64, info, size.width, size.height);
            await page.setContent(html, { waitUntil: 'networkidle0' });
            
            const outName = `${f.split('.')[0]}_${platform}.png`;
            const outPath = path.join(OUTPUT_DIR, outName);
            
            await page.screenshot({ path: outPath });
            console.log(`Generated ${outPath}`);
            await page.close();
        }
    }
    
    await browser.close();
}

main().catch(console.error);
