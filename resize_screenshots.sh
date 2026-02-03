#!/bin/bash

# Script to resize screenshots to App Store required size (1242 × 2688)
# Usage: ./resize_screenshots.sh [screenshot1.png] [screenshot2.png] ...

OUTPUT_DIR="$HOME/Desktop/App_Store_Screenshots"
mkdir -p "$OUTPUT_DIR"

# Required size for iPhone 6.5" Display
WIDTH=1242
HEIGHT=2688

echo "Resizing screenshots to ${WIDTH} × ${HEIGHT} pixels..."
echo "Output directory: $OUTPUT_DIR"
echo ""

# If files provided as arguments, use those; otherwise use all PNGs on Desktop
if [ $# -gt 0 ]; then
    FILES=("$@")
else
    FILES=("$HOME/Desktop"/*.png)
fi

for file in "${FILES[@]}"; do
    if [ ! -f "$file" ]; then
        continue
    fi
    
    filename=$(basename "$file")
    output="$OUTPUT_DIR/${filename%.png}_resized.png"
    
    echo "Processing: $filename"
    
    # Use sips (built into macOS) to resize
    sips -z $HEIGHT $WIDTH "$file" --out "$output" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Created: $output"
        
        # Verify size
        actual_width=$(sips -g pixelWidth "$output" | tail -1 | awk '{print $2}')
        actual_height=$(sips -g pixelHeight "$output" | tail -1 | awk '{print $2}')
        echo "   Size: ${actual_width} × ${actual_height}"
    else
        echo "❌ Failed to resize: $filename"
    fi
    echo ""
done

echo "Done! Resized screenshots are in: $OUTPUT_DIR"
