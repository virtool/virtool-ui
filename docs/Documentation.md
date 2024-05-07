# Documentation

## Functions

For non-component functions we follow the [TSDoc](https://tsdoc.org/) standard.
So a function would be documented as:

```typescript
/**
* Find the smallest number in an array
* 
* @remarks overrides default JS behaviour of returning zero on an empty array
* 
* @param nums - the numbers to search through
* @returns the smallest element in the list
*/
function findSmallestSafe(nums: number[]): number | undefined {
  if (arr.length === 0) return undefined;

  return Math.min(...arr);
}
```

There is no need to include the type as part of the docstring:

```typescript
// Good
/**
 * @param nums - the numbers to search through
*/

// Bad
/**
 * @param nums - the array of numbers to search through
*/
```

## Components

React components are documented with their prop typed and a docstring that only contains a description of the component.

typically being a single line description.

```typescript
type BasicButtonProps = {
    /* text to display inside the button */
    message: string,
    /* callback function to call when the button is clicked*/
    onClick: () => void
}


/** A simple button */
function BasicButton(message: string, onClick: () => void ): React.Element {
  return <Button onClick={onClick}>{message}</Button>
}
```

The descriptions should describe what is displayed. 

```typescript
// Good
/** A simple button */

// Bad
/** A function that renders a button */

// Bad
/** Renders a simple button */
```

Some components are incorrectly documented with TSDoc like this:

```typescript
/**
* A simple button 
* 
* @param props - the components parameters
* @returns A simple button
*/
function BasicButton({message, onClick}: {message: string, onClick: () => void } ): React.Element {
  return <Button onClick={onClick}>{message}</Button>
}
```

Update them when found.

