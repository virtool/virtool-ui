import React from "react";

type ErrorBoundryState = {
    hasError: boolean;
    error: Error;
};

type ErrorBoundryProps = {
    children: React.ReactNode;
};

export class ErrorBoundary extends React.Component<ErrorBoundryProps, ErrorBoundryState> {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error: error };
    }

    render() {
        if (
            this.state.hasError &&
            this.state.error instanceof TypeError &&
            this.state.error.message.startsWith("Failed to fetch dynamically imported module:")
        ) {
            window.location.reload();
        }

        return this.props.children;
    }
}
