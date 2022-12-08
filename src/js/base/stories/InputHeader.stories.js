import React, { useState } from "react";
import { InputHeader } from "../InputHeader";

export default {
    title: "base/InputHeader",
    component: InputHeader,
    parameters: {},
    argTypes: {}
};

const Template = args => {
    const [value, setValue] = useState("Header 1");
    return <InputHeader id="name" value={value} onSubmit={value => setValue(value)} />;
};

export const inputHeader = Template.bind({});

inputHeader.args = {};
