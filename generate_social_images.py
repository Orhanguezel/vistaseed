import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math

# Paths
INPUT_DIR = "/home/orhan/Documents/Projeler/tarim-dijital-ekosistem/projects/vistaseeds/orjinal_resim"
OUTPUT_DIR = "/home/orhan/Documents/Projeler/tarim-dijital-ekosistem/projects/vistaseeds/antigravity"

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# Product Info Mapping
PRODUCTS = {
    "lucky-f1": {"name": "LUCKY F1", "type": "Çarliston Biber"},
    "kizgin-f1": {"name": "KIZGIN F1", "type": "Acı Kıl Biber"},
    "prestij-f1": {"name": "PRESTİJ F1", "type": "Tatlı Kıl Biber"},
    "birlik-f1": {"name": "BİRLİK F1", "type": "Üçburun Biber"},
    "cankan-f1": {"name": "CANKAN F1", "type": "Kapya Biber"},
    "tirpan-f1": {"name": "TIRPAN F1", "type": "Kapya Biber"},
    "saray-f1": {"name": "SARAY F1", "type": "Dolma Biber"},
}

# Target Sizes (width, height)
SIZES = {
    "instagram": (1080, 1080),
    "facebook": (1200, 630),
    "twitter": (1200, 675)
}

# Try to find a good font
def get_font(size, bold=False):
    try:
        if bold:
            return ImageFont.truetype("DejaVuSans-Bold.ttf", size)
        else:
            return ImageFont.truetype("DejaVuSans.ttf", size)
    except:
        return ImageFont.load_default()

def draw_text_center(draw, text, font, fill, y_pos, image_width):
    # Depending on pillow version, textsize or textbbox is used. Let's try textbbox first
    try:
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
    except AttributeError:
        text_width, _ = draw.textsize(text, font=font)
    
    x_pos = (image_width - text_width) // 2
    draw.text((x_pos, y_pos), text, font=font, fill=fill)

def get_product_info(filename):
    # Match filename to product
    for key, info in PRODUCTS.items():
        if key in filename.lower():
            return info
    
    # Fallback if not mapped perfectly
    base = filename.split('.')[0]
    name = base.replace('-', ' ').upper()
    return {"name": name, "type": "Premium Tohum"}

def create_banner(img_path, platform, size):
    width, height = size
    filename = os.path.basename(img_path)
    info = get_product_info(filename)
    
    # Create background (White/light gray with subtle green border)
    bg = Image.new('RGB', size, color="#ffffff")
    draw = ImageDraw.Draw(bg)
    
    # Draw border
    border_width = 15
    draw.rectangle(
        [border_width, border_width, width - border_width, height - border_width],
        outline="#155e30", width=5
    )
    
    # Draw top accent
    draw.rectangle([0, 0, width, 25], fill="#155e30")
    # Draw bottom accent
    draw.rectangle([0, height-60, width, height], fill="#155e30")
    
    # Load and resize product image
    try:
        product_img = Image.open(img_path).convert("RGBA")
        
        # Determine target size for the product image
        # Leave room for header and footer
        target_img_width = int(width * 0.7)
        target_img_height = int(height * 0.5)
        
        product_img.thumbnail((target_img_width, target_img_height), Image.Resampling.LANCZOS)
        
        # Paste product image in the center
        paste_x = (width - product_img.width) // 2
        paste_y = (height - product_img.height) // 2 + 30
        
        # If it's a jpeg, we can create a mask or just paste
        if img_path.lower().endswith('.jpeg') or img_path.lower().endswith('.jpg'):
             # Create simple soft mask to blend edges
             bg.paste(product_img, (paste_x, paste_y))
        else:
             # Transparent PNG or WEBP
             bg.paste(product_img, (paste_x, paste_y), product_img)
    except Exception as e:
        print(f"Error processing image {img_path}: {e}")
        return

    # Draw Texts
    font_large = get_font(int(height * 0.08), bold=True)
    font_medium = get_font(int(height * 0.05), bold=True)
    font_small = get_font(int(height * 0.04), bold=False)
    font_footer = get_font(int(height * 0.03), bold=False)
    
    # Header
    draw_text_center(draw, "VISTASEEDS - F1 HİBRİT TOHUM", font_small, "#155e30", int(height * 0.08), width)
    
    # Product Name
    draw_text_center(draw, info["name"], font_large, "#111111", int(height * 0.15), width)
    
    # Product Type
    draw_text_center(draw, info["type"], font_medium, "#444444", int(height * 0.25), width)
    
    # Footer
    draw_text_center(draw, "www.vistaseeds.com.tr", font_footer, "#ffffff", height - 45, width)
    
    # Save
    out_name = f"{filename.split('.')[0]}_{platform}.jpg"
    out_path = os.path.join(OUTPUT_DIR, out_name)
    bg.save(out_path, quality=90)
    print(f"Generated {out_path}")

def main():
    files = os.listdir(INPUT_DIR)
    img_files = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
    
    # Group by base product to avoid generating for every single shot if we want just one per product,
    # but the user might want all of them. Let's do all.
    for f in img_files:
        path = os.path.join(INPUT_DIR, f)
        for platform, size in SIZES.items():
            create_banner(path, platform, size)

if __name__ == "__main__":
    main()
