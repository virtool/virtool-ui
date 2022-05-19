import React from "react";
import { map } from "lodash-es";
import { LoadingPlaceholder } from "./index";
import styled from "styled-components";

export const getScrollRatio = () =>
    ((window.innerHeight + window.scrollY) / document.documentElement.scrollHeight).toFixed(1);

const StyledScrollList = styled.div`
    padding-bottom: 20px;
    position: relative;
    z-index: 0;
`;

export class ScrollList extends React.Component {
    componentDidMount() {
        window.addEventListener("scroll", this.onScroll);
        this.prevPage = 0;
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll);
    }

    onScroll = () => {
        if (
            this.props.page !== this.prevPage &&
            this.props.documents.length &&
            this.props.page < this.props.pageCount &&
            getScrollRatio() > 0.8
        ) {
            this.prevPage = this.props.page;
            this.props.onLoadNextPage(this.props.page + 1);
        }
    };

    render() {
        const { documents, renderRow, page, pageCount } = this.props;

        const entries = map(documents, (item, index) => renderRow(index));

        let loading;

        if (documents === null && page < pageCount) {
            loading = <LoadingPlaceholder margin="20px" />;
        }
        return (
            <StyledScrollList>
                {entries}
                {loading}
            </StyledScrollList>
        );
    }
}
