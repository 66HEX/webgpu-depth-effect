# WebGPU Depth Effect

A Next.js demo showcasing an interactive depth-based visual effect using WebGPU, Three.js, and custom shaders. The effect combines texture mapping with depth and edge information to create dynamic visual flows that respond to mouse movement.

## Features

- **WebGPU Rendering**: Utilizes modern WebGPU for high-performance graphics
- **Interactive Mouse Effects**: Visual effects respond to cursor position
- **Depth-based Animation**: Animated flow effects based on depth mapping
- **Edge Enhancement**: Edge detection integration for enhanced visual definition
- **Custom Shaders**: Built with Three.js TSL (Three.js Shading Language)
- **Bloom Post-Processing**: Real-time bloom effects for enhanced visual appeal

## Tech Stack

- **Next.js** - React framework
- **Three.js WebGPU** - 3D graphics library with WebGPU support
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **GSAP** - Animation library
- **Tailwind CSS** - Styling

## Required Assets

The demo requires three specific image assets in the `/assets` folder:

1. **raw.jpg** - Base texture image
2. **depth.png** - Depth map (grayscale image representing depth information)
3. **edge.jpg** - Edge map (detected edges from the base image)

### Generating Assets

#### Edge Map Generation

Generate an edge map from your base image using OpenCV:

```bash
python3 -c "
import cv2
import numpy as np
image = cv2.imread('raw.jpg')
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
edges = cv2.Canny(gray, 30, 100)
edges = cv2.GaussianBlur(edges, (3, 3), 0)
cv2.imwrite('edge.jpg', edges)
print('Edge map saved as edge.jpg')
"
```

**Prerequisites**: Install OpenCV with `brew install opencv` (macOS) or `pip install opencv-python`

#### Depth Map Generation

For depth map generation, I recommend using **Depth Anything V2**:

🔗 **[Depth Anything V2 - Hugging Face Space](https://huggingface.co/spaces/depth-anything/Depth-Anything-V2)**

1. Upload your `raw.jpg` image to the Depth Anything V2 space
2. Download the generated depth map
3. Save it as `depth.png` in your assets folder

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure you have the required assets:
   ```
   /assets/
   ├── raw.jpg      # Your base texture
   ├── depth.png    # Generated depth map
   └── edge.jpg     # Generated edge map
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## How It Works

The effect combines multiple techniques:

1. **Texture Displacement**: The base texture is displaced based on depth information and mouse position
2. **Flow Animation**: A progress uniform creates animated flow effects across the depth map
3. **Edge Masking**: Edge detection data is used to create selective visual enhancements
4. **Blend Modes**: Screen blending combines the base texture with generated masks
5. **Post-Processing Pipeline**: Bloom effects enhance bright areas for a more cinematic look

### Key Shader Components

- `uPointer` - Mouse position uniform for interactive displacement
- `uProgress` - Animated progress value for flow effects
- `tDepthMap` - Depth information texture
- `tEdgeMap` - Edge detection texture
- `strength` - Displacement intensity (default: 0.01)

### Post-Processing Effects

The demo includes a custom WebGPU post-processing pipeline featuring:

- **Bloom Effect**: Enhances bright areas with a glowing effect
- **Additive Blending**: Combines the original scene with bloom for enhanced luminosity
- **Real-time Processing**: Renders at 60fps with minimal performance impact

#### Post-Processing Parameters

```typescript
<PostProcessing 
  strength={1}      // Bloom intensity (0-5, default: 1)
  threshold={0.2}   // Brightness threshold for bloom (0-1, default: 0.2)
/>
```

- **strength**: Controls how intense the bloom effect appears
- **threshold**: Determines which areas are bright enough to bloom (lower = more bloom)

## Browser Support

Requires a browser with WebGPU support:
- Chrome/Chromium 113+
- Firefox 121+
- Safari 18+

## Customization

### Adjusting Visual Parameters

- **Displacement strength**: Modify the `strength` value (default: 0.01)
- **Flow speed**: Change the GSAP animation `duration` (default: 4 seconds)
- **Color tinting**: Adjust the `vec3(0.4, 0.8, 0.5)` values for different color effects
- **Smoothstep range**: Modify `smoothstep(0, 0.02, ...)` for different flow widths

### Post-Processing Customization

- **Bloom intensity**: Adjust the `strength` prop (0-5, higher = more intense bloom)
- **Bloom threshold**: Modify the `threshold` prop (0-1, lower = more areas bloom)
- **Bloom radius**: Currently set to 0.5, can be modified in the bloom() function call

### Asset Dimensions

The demo is optimized for **1600x900** images. For different aspect ratios, update the `WIDTH` and `HEIGHT` constants.

## Performance Notes

- WebGPU provides significant performance benefits over WebGL
- The effect runs at 60fps on modern hardware with post-processing enabled
- Bloom post-processing adds minimal overhead thanks to WebGPU's efficiency
- Texture sizes should be optimized for web delivery (consider using compressed formats)
- Post-processing pipeline is optimized for real-time rendering

## License

MIT License - Feel free to use this code in your own projects.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.