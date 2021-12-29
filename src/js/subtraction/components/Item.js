import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../app/theme";
import { Icon, LinkBox, Loader } from "../../base";
import { SubtractionAttribution } from "./Attribution";

export const SubtractionItemIcon = ({ ready }) => {
    if (ready) {
        return <Icon name="check" color="green" />;
    }

    return <Loader size="14px" color="primary" />;
};

const StyledSubtractionItemHeader = styled.div`
    align-items: center;
    display: flex;
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};

    > span:last-child {
        margin-left: auto;
    }
`;

export const SubtractionItem = ({ id, user, name, ready, created_at }) => {
    return (
        <LinkBox key={id} to={`/subtractions/${id}`}>
            <StyledSubtractionItemHeader>
                <span>{name}</span>
                <span>
                    <SubtractionItemIcon ready={ready} /> {ready ? "Ready" : "Creating"}
                </span>
            </StyledSubtractionItemHeader>
            <SubtractionAttribution handle={user.handle} time={created_at} />
        </LinkBox>
    );
};

export const mapStateToProps = (state, props) => {
    const { id, user, name, ready, created_at } = state.subtraction.documents[props.index];
    return {
        id,
        user,
        created_at,
        name,
        ready
    };
};

export default connect(mapStateToProps)(SubtractionItem);
