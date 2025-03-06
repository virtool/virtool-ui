import { Markdown } from "@/base";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta<typeof Markdown> = {
    title: "base/Markdown",
    component: Markdown,
};

export default meta;

type Story = StoryObj<typeof meta>;

const sampleMarkdown = `
# Sample Markdown

## Subheading

Here is a paragraph with some **bold text**, _italic text_, and \`inline code\`.

### Code Block Example

\`\`\`javascript
function greet() {
  console.log("Hello, world!");
}
\`\`\`

### Table Example

| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Row 1    | Data 1   | Data 1   |
| Row 2    | Data 2   | Data 2   |
| Row 3    | Data 3   | Data 3   |

### Link Example

[Virtool](https://www.virtool.ca/)
`;

function Template(args) {
    return <Markdown markdown={args.markdown} />;
}

export const SampleMarkdown: Story = {
    args: { markdown: sampleMarkdown },
    render: Template,
};
