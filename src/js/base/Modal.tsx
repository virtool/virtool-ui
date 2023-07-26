import "@reach/dialog/styles.css";
import React from "react";
import { ModalContent } from "./ModalContent";
import { ModalContext } from "./ModalContext";
import { ModalOverlay } from "./ModalOverlay";

type ModalProps = {
    children: React.ReactNode;
    color?: VTColor;
    size?: "sm" | "lg";
    label: string;
    show: boolean;
    onEnter?: () => void;
    onExited?: () => void;
    onHide: () => void;
};

type ModalState = {
    open: boolean;
    close: boolean;
};

export class Modal extends React.Component<ModalProps, ModalState> {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            close: false,
        };
    }

    static defaultProps = {
        size: "sm",
    };

    static getDerivedStateFromProps(props) {
        if (props.show === true) {
            return {
                open: true,
                close: false,
            };
        }
        if (props.show === false) {
            return { close: true };
        }
        return null;
    }

    onClose = () => {
        this.setState({ close: true });
    };

    onClosed = () => {
        if (this.state.close === true) {
            this.setState({ open: false, close: false });

            if (this.props.onExited) {
                this.props.onExited();
            }
        }
    };

    onOpen = () => {
        if (this.state.open === true && this.state.close === false && this.props.onEnter) {
            this.props.onEnter();
        }
    };

    render() {
        const contextValue = {
            color: this.props.color,
            onHide: this.props.onHide,
        };

        return (
            <ModalContext.Provider value={contextValue}>
                <ModalOverlay
                    isOpen={this.state.open}
                    close={this.state.close}
                    onAnimationEnd={this.onClosed}
                    onDismiss={() => {
                        this.props.onHide();
                        this.onClose();
                    }}
                >
                    <ModalContent
                        size={this.props.size}
                        aria-labelledby={this.props.label}
                        close={this.state.close}
                        onAnimationEnd={this.onClosed}
                        onAnimationStart={this.onOpen}
                    >
                        {this.props.children}
                    </ModalContent>
                </ModalOverlay>
            </ModalContext.Provider>
        );
    }
}
