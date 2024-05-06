# Documentation

As part of ensuring readable code, it is important to ensure that functions are 
given relevant docstrings

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
  if (arr.length === 0) return undefined; // Handle empty array case

  return Math.min(...arr);
}
```

Deliberately absent in the docstring is any direct information about the `type` of the variables.
For the array of numbers we could have written:

```typescript
/**
 * @param nums - the numbers to search through
*/
```

While not wrong, the specifying that the collection of numbers is an `array` is redundant
with the typescript and therefore is excluded.

## Components

Documenting react components via TSDoc faithfully yields suboptimal docstrings like: 

```typescript

  /**
   * A simple button 
   * 
   * @param props - the components paramters
   * @returns A simple button
   */
  function BasicButton({message, onClick}: {message: string, onClick: () => void } ): React.Element {
  return <Button onClick={onClick}>{message}</Button>
}
```
This method of documentation results in:
 1. A unhelpful description of params 
 2. Redundancy between the component description at the top and `@returns`

For this reason we are moving to instead document components by defining the props
as a new type and documenting the component with a single line:

```typescript
type BasicButtonProps = {
    /* text to display inside the button */
    message: string,
    /* callback function to click on when the button is pressed*/
    onClick:() => void
}


  /** A simple button */
  function BasicButton(message: string, onClick: () => void ): React.Element {
  return <Button onClick={onClick}>{message}</Button>
}
```

