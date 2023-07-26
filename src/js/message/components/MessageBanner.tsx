import React, { FunctionComponent, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getColor, getFontWeight } from "../../app/theme";
import { getInstanceMessage } from "../actions";

export const StyledMessageBanner = styled.div`
    background-color: ${getColor};
    color: ${props => props.theme.color.white};
    font-weight: ${getFontWeight("thick")};\
    padding: 5px 15px;
`;

type NavBannerProps = {
    active: boolean;
    color: string;
    loaded: boolean;
    message: string;
    onLoad: () => undefined;
};

const MessageBanner: FunctionComponent<NavBannerProps> = ({ color, loaded, message, onLoad }) => {
    useEffect(() => onLoad(), [loaded, message]);

    if (loaded && message) {
        return <StyledMessageBanner color={color}>{message}</StyledMessageBanner>;
    }

    return null;
};

function mapStateToProps(state) {
    return {
        color: state.instanceMessage.color,
        loaded: state.instanceMessage.loaded,
        message: state.instanceMessage.message,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onLoad: () => dispatch(getInstanceMessage()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageBanner);
