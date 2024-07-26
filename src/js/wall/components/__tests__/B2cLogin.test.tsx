import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setupTests";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import B2CLogin from "../B2CLogin";

describe("<B2CLogin />", () => {
    let props;
    let myFunc;

    beforeEach(() => {
        props = {
            onSetLogin: vi.fn(),
        };

        window.virtool = {
            b2c: {
                use: true,
                userflow: "test_userflow",
                tenant: "test_tenant",
                clientId: "test_clientId",
                scope: "test_scope",
                APIClientId: "test_APIClientId",
            },
        };

        myFunc = vi.fn();

        window.msalInstance = {
            loginPopup: async LoginRequestInfo => {
                myFunc(LoginRequestInfo);
                return { account: "test_account" };
            },
            setActiveAccount: vi.fn(),
        };
    });

    it("should render", () => {
        renderWithProviders(<B2CLogin {...props} />);
        expect(screen.getByText("Sign in with your work account")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    });
    it("should call b2c with correct information", async () => {
        renderWithProviders(<B2CLogin {...props} />);
        await userEvent.click(screen.getByRole("button", { name: "Sign in" }));
        await waitFor(() => {
            expect(myFunc).toHaveBeenCalledWith({
                scopes: ["https://test_tenant.onmicrosoft.com/test_APIClientId/test_scope"],
            });
            expect(window.msalInstance.setActiveAccount).toHaveBeenCalledWith("test_account");
        });
    });
});
