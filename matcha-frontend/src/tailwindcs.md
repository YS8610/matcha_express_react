────────────────────────────────────────────────────────────
                  Tailwind CSS v4 Cheatsheet
────────────────────────────────────────────────────────────

***Quick Setup***
────────────────────────────────────────────────────────────
1. **Installation & Initialization**
   - Install via npm:
     ```
     npm install -D tailwindcss@latest
     ```
   - Initialize your configuration:
     ```
     npx tailwindcss init
     ```
2. **Usage in your CSS**
   - Create your main CSS file and add:
     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```
3. **Build Process**
   - Use the CLI or integrate with your build tool to compile your CSS.

***Responsive Design & Breakpoints***
────────────────────────────────────────────────────────────
- **Default Breakpoints:**
  - `sm:` → min-width: 640px
  - `md:` → min-width: 768px
  - `lg:` → min-width: 1024px
  - `xl:` → min-width: 1280px
  - `2xl:` → min-width: 1536px
- **Usage Example:**
  - `sm:text-center` – Applies text centering at 640px and above.

***Spacing Utilities***
────────────────────────────────────────────────────────────
- **Margin & Padding:**
  - Margins: `m-0`, `m-1`, `m-2`, …, `m-64`, plus directional forms like `mt-4`, `mx-2`
  - Padding: `p-0`, `p-1`, `p-2`, …, `p-64`, with directional forms like `py-3`, `px-5`
- **Arbitrary Values:**
  - Example: `mt-[23px]` for custom spacing.

***Sizing Utilities***
────────────────────────────────────────────────────────────
- **Width & Height:**
  - Widths: `w-auto`, `w-full`, `w-screen`, fractions like `w-1/2`, `w-3/4`
  - Heights: `h-auto`, `h-full`, `h-screen`, custom values e.g., `h-[350px]`
- **Min/Max Sizing:**
  - `min-w-0`, `max-w-xs`, `max-h-full`, etc.

***Layout & Display***
────────────────────────────────────────────────────────────
- **Display Modes:**
  - `block`, `inline-block`, `inline`, `flex`, `inline-flex`, `grid`, `hidden`
- **Flex Utilities:**
  - Direction: `flex-row`, `flex-col`
  - Wrapping: `flex-wrap`, `flex-nowrap`
  - Alignment: `items-center`, `justify-between`, `justify-center`
- **Grid Utilities:**
  - Define columns: `grid-cols-1`, `grid-cols-2`, ..., `grid-cols-12`
  - Gaps: `gap-4`, `gap-x-6`, `gap-y-2`

***Typography***
────────────────────────────────────────────────────────────
- **Font Size:**
  - `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, up through `text-6xl`
- **Font Weight:**
  - `font-thin`, `font-light`, `font-normal`, `font-medium`, `font-semibold`, `font-bold`, `font-extrabold`, `font-black`
- **Text Alignment & Decoration:**
  - Alignment: `text-left`, `text-center`, `text-right`, `text-justify`
  - Decoration: `underline`, `line-through`, `no-underline`
- **Line Height & Letter Spacing:**
  - Line Height: `leading-none`, `leading-tight`, `leading-normal`, `leading-relaxed`
  - Letter Spacing: `tracking-tight`, `tracking-normal`, `tracking-wide`
- **Text Color:**
  - Examples: `text-gray-500`, `text-blue-600`, `text-red-500`

***Color, Background, & Accent***
────────────────────────────────────────────────────────────
- **Background Colors:**
  - `bg-white`, `bg-gray-200`, `bg-blue-500`, etc.
- **Text & Border Colors:**
  - `text-black`, `border-gray-300`, `hover:text-blue-500`
- **Accent Color (new in v4):**
  - Example: `accent-blue-500` applies an accent color to form elements.

***Border Utilities***
────────────────────────────────────────────────────────────
- **Border Width:**
  - `border`, `border-2`, `border-4`, `border-8`
- **Border Radius:**
  - `rounded` (default), `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full`
  - Directional: `rounded-tl`, `rounded-br`, etc.
- **Border Style & Color:**
  - Colors: `border-gray-400`, `border-blue-600`
  - Styles: (Note that Tailwind relies on your custom CSS if different border styles are needed.)

***Shadow & Effects***
────────────────────────────────────────────────────────────
- **Box Shadows:**
  - `shadow`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`
  - Inner shadow: `shadow-inner`
  - None: `shadow-none`
- **Opacity & Blend Modes:**
  - Opacity: `opacity-0`, `opacity-25`, `opacity-50`, `opacity-75`, `opacity-100`
  - Blend Modes: `mix-blend-normal`, `mix-blend-multiply`, `mix-blend-screen`
- **Filter Effects:**
  - `filter`, `blur-sm`, `blur`, `blur-lg`, `grayscale`, `sepia`

***Transitions & Transforms***
────────────────────────────────────────────────────────────
- **Transitions:**
  - Base: `transition`
  - Specific Properties: `transition-colors`, `transition-opacity`, `transition-transform`
  - Timing: `duration-200`, `duration-500`
  - Timing Functions: `ease-linear`, `ease-in`, `ease-out`, `ease-in-out`
- **Transforms:**
  - Enable transforms with: `transform`
  - Scale: `scale-50`, `scale-75`, `scale-90`, `scale-95`, `scale-100`, `scale-105`
  - Rotate: `rotate-45`, `rotate-90`, `rotate-180`
  - Skew: `skew-x-12`, `skew-y-12`
  - Translate: e.g., `translate-x-4`, `-translate-y-2`

***Positioning & Z-Index***
────────────────────────────────────────────────────────────
- **Positioning:**
  - `static`, `fixed`, `absolute`, `relative`, `sticky`
- **Z-Index:**
  - `z-0`, `z-10`, `z-20`, `z-30`, `z-40`, `z-50`

***Miscellaneous Utilities***
────────────────────────────────────────────────────────────
- **Overflow:**
  - `overflow-auto`, `overflow-hidden`, `overflow-scroll`, `overflow-visible`
- **Cursor & Pointer Events:**
  - Cursor: `cursor-pointer`, `cursor-default`, `cursor-wait`, `cursor-not-allowed`
  - Pointer events: `pointer-events-none`, `pointer-events-auto`
- **Flex Growth & Shrink:**
  - `flex-grow`, `flex-shrink`, `flex-initial`, `flex-1`
- **List Style:**
  - `list-none`, `list-disc`, `list-decimal`
- **Aspect Ratio (v4 Addition):**
  - `aspect-auto`, `aspect-square`, `aspect-video`

***Advanced Features & Arbitrary Values***
────────────────────────────────────────────────────────────
- **Arbitrary Value Support:**
  - Use square brackets for any custom value.
  - Examples: `mt-[23px]`, `w-[350px]`, `bg-[#1DA1F2]`
- **Container Queries (if enabled in config):**
  - New utility: `container` supports responsive container layouts.
  
────────────────────────────────────────────────────────────
                    End of Cheatsheet
────────────────────────────────────────────────────────────
