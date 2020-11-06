virtool-ui
----------

A UI component library for Virtool.

## Quick Start

1. Clone repository
   ```shell script
   git clone https://github.com/virtool/virtool-ui.git
   ```
   
2. Install packages
   ```shell script
   npm i
   ```
   
3. [Run storybook](https://storybook.js.org/docs/react/get-started/install)
   ```shell script
   npm run storybook
   ```

## Tips

##### Wrap with [`<ThemeProvider>`](https://styled-components.com/docs/api#themeprovider) in stories

This makes the theming accessible to any styled components in the tree. Theme is found at `src/theme.js`.

```javascript
export default {
  title: "Example/Alert",
  component: Alert
};

const Template = (args) => (
  <ThemeProvider theme={theme}>
    <Alert {...args}>Test</Alert>
  </ThemeProvider>
);
```