import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Table } from "../Table";

const meta: Meta<typeof Table> = {
    component: Table,
    id: "table",
    title: "base/Table",
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Default: Story = {
    render: () => (
        <Table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Phone</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>John Doe</td>
                    <td>555-555-5555</td>
                </tr>
                <tr>
                    <td>Jane Doe</td>
                    <td>555-555-5555</td>
                </tr>
            </tbody>
        </Table>
    ),
};
