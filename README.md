# WebGPU Depth Effect

A Next.js demo showcasing an interactive depth-based visual effect using WebGPU, Three.js, and custom shaders. The effect combines texture mapping with depth and edge information to create dynamic visual flows that respond to mouse movement.

## Features

- **WebGPU Rendering**: Utilizes modern WebGPU for high-performance graphics
- **Interactive Configuration Panel**: Real-time adjustment of all visual parameters
- **Interactive Mouse Effects**: Visual effects respond to cursor position with adjustable sensitivity
- **Depth-based Animation**: Animated flow effects based on depth mapping with customizable timing
- **Edge Enhancement**: Edge detection integration for enhanced visual definition
- **Custom Shaders**: Built with Three.js TSL (Three.js Shading Language)
- **Bloom Post-Processing**: Real-time bloom effects with adjustable intensity
- **Color Customization**: RGB mask color controls for creative visual effects

## Tech Stack

- **Next.js** - React framework
- **Three.js WebGPU** - 3D graphics library with WebGPU support
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **GSAP** - Animation library for smooth transitions and effects
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

## Interactive Configuration Panel

The demo features a comprehensive real-time configuration panel accessible via the hamburger menu in the top-right corner. All changes are applied instantly without requiring page refresh.

### Configuration Options

#### Visual Effects
- **Effect Intensity** (0.000 - 0.100, default: 0.010)
  - Controls the displacement strength of the depth-based texture warping
  - Higher values create more dramatic visual distortion
  - Range: 0 to 0.1 with 0.001 precision

- **Brightness** (0.1 - 2.0, default: 0.3)
  - Adjusts the overall brightness of the base texture
  - Values above 1.0 create overexposed, ethereal effects
  - Range: 0.1 to 2.0 with 0.1 increments

- **Flow Smoothness** (0.001 - 0.100, default: 0.002)
  - Controls the gradient smoothness of the animated flow effect
  - Lower values create sharper flow boundaries
  - Higher values create more diffuse, soft flow transitions
  - Range: 0.001 to 0.1 with 0.001 precision

#### Color Customization
- **Mask Color (RGB)** (0.0 - 1.0 each channel, default: R:1.0, G:0.0, B:0.1)
  - **Red Channel**: Controls red component of the color overlay
  - **Green Channel**: Controls green component of the color overlay
  - **Blue Channel**: Controls blue component of the color overlay
  - Each channel adjustable from 0.0 to 1.0 with 0.1 increments
  - Creates tinted effects that blend with the flow animation

#### Animation Controls
- **Animation Duration** (1.0 - 10.0 seconds, default: 4.0)
  - Sets the duration for one complete flow animation cycle
  - Shorter durations create faster, more energetic effects
  - Longer durations create slower, more meditative flows
  - Range: 1 to 10 seconds with 0.5 second increments

- **Animation Type** (default: Power3 Out)
  - **Power3 Out**: Smooth deceleration (default)
  - **Power2 Out**: Moderate deceleration
  - **Back Out**: Slight overshoot effect
  - **Elastic Out**: Bouncy, spring-like effect
  - **Bounce Out**: Multiple bounce effect
  - **Linear**: Constant speed, no easing

#### Interaction Settings
- **Mouse Sensitivity** (0.1 - 3.0, default: 1.5)
  - Controls responsiveness to mouse/cursor movement
  - Lower values create subtle interaction
  - Higher values create dramatic cursor-following effects
  - Range: 0.1 to 3.0 with 0.1 increments

#### Post-Processing
- **Post-processing Strength** (0.0 - 2.0, default: 2.0)
  - Controls the intensity of the bloom post-processing effect
  - 0.0 disables bloom entirely
  - Values above 1.0 create intense, cinematic glow effects
  - Range: 0 to 2.0 with 0.1 increments

### Default Configuration

```typescript
const defaultSettings = {
  strength: 0.01,                    // Effect intensity
  brightness: 0.3,                   // Base texture brightness
  flowSmoothness: 0.002,            // Flow gradient smoothness
  maskColor: { r: 1, g: 0, b: 0.1 }, // Red-tinted mask
  animationDuration: 4,              // 4-second animation cycle
  animationEase: 'power3.out',       // Smooth deceleration
  pointerSensitivity: 1.5,           // Moderate mouse response
  postProcessingStrength: 2          // Full bloom effect
};
```

## How It Works

The effect combines multiple techniques with real-time configurability:

1. **Texture Displacement**: The base texture is displaced based on depth information and mouse position (adjustable via Effect Intensity and Mouse Sensitivity)
2. **Flow Animation**: A progress uniform creates animated flow effects across the depth map (controlled by Animation Duration and Type)
3. **Edge Masking**: Edge detection data creates selective visual enhancements (modified by Mask Color settings)
4. **Blend Modes**: Screen blending combines the base texture with generated masks (affected by Brightness and Flow Smoothness)
5. **Post-Processing Pipeline**: Bloom effects enhance bright areas (controlled by Post-processing Strength)

### Key Shader Components

The shader system uses the following uniforms, all controllable via the configuration panel:

- `uPointer` - Mouse position uniform for interactive displacement (scaled by Mouse Sensitivity)
- `uProgress` - Animated progress value for flow effects (timing controlled by Animation Duration/Type)
- `tDepthMap` - Depth information texture
- `tEdgeMap` - Edge detection texture
- `strength` - Displacement intensity (Effect Intensity setting)
- `brightness` - Texture brightness multiplier (Brightness setting)
- `flowSmoothness` - Flow gradient control (Flow Smoothness setting)
- `maskColor` - RGB color values for tinting (Mask Color settings)

### Post-Processing Effects

The demo includes a fully configurable WebGPU post-processing pipeline:

- **Bloom Effect**: Enhances bright areas with adjustable intensity
- **Additive Blending**: Combines original scene with bloom
- **Real-time Processing**: Maintains 60fps performance
- **Dynamic Control**: Bloom strength adjustable from 0 (disabled) to 2 (maximum)

## Browser Support

Requires a browser with WebGPU support:
- Chrome/Chromium 113+
- Firefox 121+
- Safari 18+

## Performance Notes

- WebGPU provides significant performance benefits over WebGL
- The effect maintains 60fps on modern hardware with full post-processing
- Real-time configuration changes have minimal performance impact
- Texture sizes should be optimized for web delivery
- Configuration panel uses hardware-accelerated animations via GSAP

## Asset Dimensions

The demo is optimized for **1600x900** images. For different aspect ratios, update the `WIDTH` and `HEIGHT` constants in the source code.

## License

MIT License - Feel free to use this code in your own projects.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.