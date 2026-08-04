# Type and spacing scale

## The root belongs to the reader

`html` is at `font-size: 100%`. It used to be `14px`, which discards the
font-size preference a reader sets in their browser — an accessibility setting
a low-vision reader depends on, and one a px root overrides outright.

`100%` is already the initial value, so the rule earns its place by saying so
explicitly. Don't delete it, and don't put a length back on `html`. The app's
own base size lives on `body` instead, as `var(--text-base)`; without it, text
carrying no size class of its own would take the reader's figure rather than
the app's.

## The 0.875 override

The app was drawn against that 14px root, so every rem-valued token Tailwind
ships is overridden in `@theme` at 0.875 of its stock value. Against a 16px
default that renders exactly what the 14px root did — the shrink moved off the
root and onto the scale.

That move is the point. On the root, the shrink applied to everything at once
and could only be removed the same way. On the scale it can be walked back a
token at a time, which is a separate pass still to come.

Five families are overridden, and they are overridden together:

| Family | Drives |
| --- | --- |
| `--text-*` | `text-xs` … `text-9xl` |
| `--spacing` | every `p-*`, `m-*`, `gap-*`, `size-*`, `w-*`, `h-*`, `max-h-*` … |
| `--container-*` | `max-w-xs` … `max-w-7xl` |
| `--breakpoint-*` | the `sm:` … `2xl:` variants |
| `--radius-*` | `rounded-xs` … `rounded-4xl` |

Leaving a family out is not a smaller change than including it — it is an
unannounced visual change riding along inside a pass whose whole claim is that
nothing moves. Breakpoints are the sharpest case: left at stock, `2xl:` would
have gone from 1344px to 1536px, which hides the pathoscope panel labels on a
1440px screen.

Line heights and letter spacing are **not** overridden and must not be. Tailwind
states line heights as unitless ratios and letter spacing in `em`, so both
already follow whatever font size they land on.

## A class does not render its documented px figure

Against a 16px default:

| Class | Tailwind docs | Here |
| --- | --- | --- |
| `text-xs` | 12px | 10.5px |
| `text-sm` | 14px | 12.25px |
| `text-base` | 16px | 14px |
| `p-4` | 16px | 14px |
| `gap-2` | 8px | 7px |
| `md:` | 768px | 672px |
| `2xl:` | 1536px | 1344px |

So don't reason from the px column of the Tailwind documentation, and don't
convert a design's px figure into a class by dividing it by 4. Multiply by
0.875 first, or work in the class scale directly and check the result.

## Anything that holds text is sized in rem

A px figure reserving space for text is correct only at the default preference.
A reader who has asked for larger text overruns it, and the text spills out of
whatever was meant to contain it. Size it in `rem` and it grows with them.

px stays right for a graphic that holds no text. `PathoscopeCoverageChart` is
the worked example of both halves at once:

- its label row and its headroom are `"1.125rem"`, because a caption sits in
  one and the depth label in the other;
- its plot area is a px number, because a coverage curve is a graphic with no
  text in it, and the path geometry is built against a px width measured off
  the container.

That component also shows the one real constraint on the rule. Headroom used to
be reserved inside the panel's `<svg>`, and an SVG coordinate cannot carry a
CSS unit — so it moved out into a spacer element beside the svg. The spacer sits
inside the panel rather than on the box around it, so a panel's hover and focus
styling still covers it; held on the box it left a strip along the top that no
panel covered and that stayed unhighlighted while the panel below it was
hovered.

## Known px holdouts

These are px today and will misbehave at a large preference. They are known,
not overlooked, and each needs more than a unit swap:

- **Virtualized row heights** — `NuvsList` (`ROW_HEIGHT = 75`) and
  `IsolateList` (`ROW_HEIGHT = 48`) feed a virtualizer's `estimateSize`. The
  scroll geometry is tied to the constant, so scaling it needs measured rows or
  a resolved px-per-rem, not a rem string.
- **`lengthMinWidth`** in `PathoscopeCoverageChart` — a px threshold compared
  against a measured px panel width, deciding whether a panel is wide enough to
  carry both its label and its length. The text either side of the comparison
  scales and the threshold does not, so at a large preference a panel just over
  the cutoff draws a length it cannot fit.
- **`InitialIcon`** — sets avatar font sizes in px, so initials don't scale.
  Arguably correct for a fixed-size avatar.
