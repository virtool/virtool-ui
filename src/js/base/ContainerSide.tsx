import PropTypes from "prop-types";
import React from "react";

export function ContainerSide({ children, className = "" }) {
    return <div className={`flex-none ${className}`}>{children}</div>;
}

ContainerSide.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

ContainerSide.displayName = "ContainerSide";
