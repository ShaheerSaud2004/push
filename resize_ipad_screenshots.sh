#!/bin/bash

# Script to resize screenshots to iPad App Store required sizes
# Usage: ./resize_ipad_screenshots.sh [screenshot1.png] [screenshot2.png] ...

OUTPUT_DIR="$HOME/Desktop/iPad_App_Store_Screenshots"
mkdir -p "$OUTPUT_DIR"

# Required sizes for iPad 12.9" or 13" Display
# Options: 2064 × 2752px, 2752 × 2064px, 2048 x 2732px, or 2732 x 2048px
# Using portrait: 2048 x 2732px (most common)
WIDTH=2048
HEIGHT=2732

echo "Resizing screenshots to iPad size: ${WIDTH} × ${HEIGHT} pixels..."
echo "Output directory: $OUTPUT_DIR"
echo ""

# If files provided as arguments, use those; otherwise use all PNGs on Desktop
if [ $# -gt 0 ]; then
    FILES=("$@")
else
    FILES=("$HOME/Desktop/App_Store_Screenshots"/*.png)
fi

for file in "${FILES[@]}"; do
    if [ ! -f "$file" ]; then
        continue
    fi
    
    filename=$(basename "$file")
    output="$OUTPUT_DIR/${filename%.png}_ipad_${WIDTH}x${HEIGHT}.png"
    
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

echo "Done! Resized iPad screenshots are in: $OUTPUT_DIR"
echo ""
echo "Note: iPad accepts these sizes:"
echo "  - 2064 × 2752px (portrait)"
echo "  - 2752 × 2064px (landscape)"
echo "  - 2048 × 2732px (portrait) ← Used this"
echo "  - 2732 × 2048px (landscape)"
echo ""
echo "If you need a different size, edit the WIDTH and HEIGHT variables in this script."
