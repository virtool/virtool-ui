import React from "react";
import { APIKeyAdministratorInfo, mapStateToProps } from "../CreateInfo";
import { screen } from "@testing-library/react";

describe("<APIKeyAdministratorInfo />", () => {
    it("should render when administrator", () => {
        renderWithProviders(<APIKeyAdministratorInfo administrator />);
        expect(
            screen.getByText("You are an administrator and can create API keys with any permissions you want.")
        ).toBeInTheDocument();
    });

    it("should not render message when not an administrator", () => {
        renderWithProviders(<APIKeyAdministratorInfo administrator={false} />);
        expect(
            screen.queryByText("You are an administrator and can create API keys with any permissions you want.")
        ).not.toBeInTheDocument();
    });
});

describe("mapStateToProps()", () => {
    it.each([true, false])("should return props with [administrator=%p]", administrator => {
        const state = {
            account: {
                administrator
            }
        };
        const props = mapStateToProps(state);
        expect(props).toEqual({
            administrator
        });
    });
});
