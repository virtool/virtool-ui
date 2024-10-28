import React from "react";

type ErrorBoundryState = {
    /* Indicates if any error has occured */
    hasError: boolean;
    /* the most recent error detected */
    error: Error;
};

type ErrorBoundryProps = {
    /* UI to render when no error is detected */
    children: React.ReactNode;
};

/**
 * Error handling component that refreshes the website when an old client version is detected
 */
export class ErrorBoundary extends React.Component<ErrorBoundryProps, ErrorBoundryState> {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
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
