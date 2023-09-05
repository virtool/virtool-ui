import React, { useState } from "react";
import { BoxGroup } from "../BoxGroup";
import { BoxGroupHeader } from "../BoxGroupHeader";
import { BoxGroupSearch } from "../BoxGroupSearch";

export default {
    title: "base/BoxGroupSearch",
    component: BoxGroupSearch,

    parameters: {
        docs: {
            description: {
                component: "A search bar component useful for filtering or searching for items.",
            },
        },
    },
};

const Template = args => {
    const [value, setValue] = useState("");
    return (
        <BoxGroup>
            <BoxGroupHeader>Manage Samples</BoxGroupHeader>
            <BoxGroupSearch {...args} value={value} onChange={setValue} />
        </BoxGroup>
    );
};

export const sampleBoxGroupSearch = Template.bind({});

sampleBoxGroupSearch.args = {
    placeholder: "Filter Samples",
    autoFocus: false,
};
