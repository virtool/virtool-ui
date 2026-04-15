# Remove styled-components

Migrate all styled-components to Tailwind CSS utility classes and remove the
styled-components dependency.

## Decisions

- Use Tailwind's default color scale — no custom color tokens.
- Non-standard spacing maps to the nearest Tailwind default.
- The only custom theme token is `--color-virtool` in `src/app/style.css`.
- No `theme.ts` imports should appear in migrated code — only Tailwind utility classes.

## Theme Token Mapping

Canonical mapping from `src/app/theme.ts` tokens to Tailwind default utilities.

### Colors

| Theme Token | Hex | Tailwind Class |
| --- | --- | --- |
| black | #000000 | `black` |
| white | #fff | `white` |
| blue | #0B7FE5 | `blue-600` |
| blueDark | #0862C4 | `blue-700` |
| blueDarkest | #033384 | `blue-900` |
| blueLight | #6AC4F7 | `blue-300` |
| blueLightest | #CDF1FD | `blue-100` |
| green | #1DAD57 | `green-600` |
| greenDark | #159455 | `green-700` |
| greenDarkest | #096449 | `green-900` |
| greenLight | #73E68A | `green-300` |
| greenLightest | #D1FAD1 | `green-100` |
| grey | #A0AEC0 | `gray-400` |
| greyDark | #718096 | `gray-500` |
| greyDarkest | #4A5568 | `gray-600` |
| greyLight | #CBD5E0 | `gray-300` |
| greyLightest | #EDF2F7 | `gray-100` |
| greyHover | #F7FAFC | `gray-50` |
| orange | #F7A000 | `amber-500` |
| orangeLight | #FCD265 | `amber-300` |
| orangeLightest | #FEF4CB | `amber-100` |
| orangeDark | #D48100 | `amber-600` |
| orangeDarkest | #B16600 | `amber-700` |
| primary | #3C8786 | `teal-600` |
| primaryDark | #2B6E74 | `teal-700` |
| primaryDarkest | #1E5661 | `teal-800` |
| primaryLight | #6AB7AF | `teal-400` |
| primaryLightest | #E8F5F5 | `teal-50` |
| purple | #9F7AEA | `purple-400` |
| purpleDark | #805AD5 | `purple-600` |
| purpleDarkest | #553C9A | `purple-800` |
| purpleLight | #D6BCFA | `purple-300` |
| purpleLightest | #FAF5FF | `purple-50` |
| red | #E0282E | `red-600` |
| redDark | #C01D30 | `red-700` |
| redDarkest | #A11431 | `red-800` |
| redLight | #F58E7C | `red-300` |
| redLightest | #FDE1D3 | `red-100` |
| yellow | #FFE030 | `yellow-400` |
| yellowLight | #FFF082 | `yellow-200` |
| yellowLightest | #FFFBD5 | `yellow-50` |
| yellowDark | #DBBC23 | `yellow-500` |
| yellowDarkest | #B79A18 | `yellow-600` |

### Font Sizes

| Theme Token | Value | Tailwind Class |
| --- | --- | --- |
| xs | 10px | `text-xs` (12px — nearest default) |
| sm | 12px | `text-xs` |
| md | 14px | `text-sm` |
| lg | 16px | `text-base` |
| xl | 24px | `text-2xl` |
| xxl | 32px | `text-3xl` |

### Font Weights

| Theme Token | Value | Tailwind Class |
| --- | --- | --- |
| normal | 400 | `font-normal` |
| thick | 500 | `font-medium` |
| bold | 700 | `font-bold` |

### Border Radii

| Theme Token | Value | Tailwind Class |
| --- | --- | --- |
| sm | 3px | `rounded` (4px) |
| md | 6px | `rounded-md` (6px) |
| lg | 10px | `rounded-lg` (8px) |

### Box Shadows

| Theme Token | Tailwind Class |
| --- | --- |
| xs | `shadow-xs` |
| sm | `shadow-sm` |
| md | `shadow-md` |
| lg | `shadow-lg` |
| input | `shadow-inner` (approximate) |
| inset | `shadow-inner` |

### Spacing / Gap

| Theme Token | Value | Tailwind Class |
| --- | --- | --- |
| column | 15px | `gap-4` (16px) |
| text | 5px | `gap-1` (4px) |

## Helper Function Replacements

### `getRing(color)`

Returns `box-shadow: 0 0 0 2px <color>`.

**Tailwind replacement:** `ring-2 ring-{color}`

```diff
- box-shadow: ${getRing("primary")};
+ className="ring-2 ring-teal-600"
```

### `getActiveShadow({ active, theme })`

Returns `box-shadow: inset 3px 0 0 <primary>` when active, `none` otherwise.

**Tailwind replacement:** Conditional `border-l-3 border-teal-600`

```diff
- box-shadow: ${getActiveShadow};
+ className={active ? "border-l-3 border-teal-600" : ""}
```

### `getBorder({ theme })`

Returns `1px solid <greyLight>`.

**Tailwind replacement:** `border border-gray-300`

```diff
- border: ${getBorder};
+ className="border border-gray-300"
```

### `getColor({ color, theme })`

Returns the named color hex value from the theme.

**Tailwind replacement:** Use the direct Tailwind color class from the color mapping
table above. The utility prefix depends on the CSS property being set:

- `color` -> `text-{tailwind-color}`
- `background-color` -> `bg-{tailwind-color}`
- `border-color` -> `border-{tailwind-color}`

```diff
- color: ${getColor};  /* with color="red" */
+ className="text-red-600"
```

### `getFontSize(size)`

Returns the pixel font size from the theme.

**Tailwind replacement:** Use the direct `text-*` class from the font size mapping
table above.

```diff
- font-size: ${getFontSize("md")};
+ className="text-sm"
```

### `getFontWeight(weight)`

Returns the numeric font weight from the theme.

**Tailwind replacement:** Use the direct `font-*` class from the font weight mapping
table above.

```diff
- font-weight: ${getFontWeight("thick")};
+ className="font-medium"
```

### Shorthand Objects

The shorthand objects exported from `theme.ts` (`border`, `borderRadius`, `boxShadow`,
`fontWeight`) follow the same mappings as their corresponding sections above.
