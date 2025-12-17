import { getBorder } from "@app/theme";
import Icon from "@base/Icon";
import { useEffect, useState } from "react";
import styled from "styled-components";

const StyledPathoscopeViewerScroller = styled.div`
    align-items: center;
    border: ${getBorder};
    border-radius: ${(props) => props.theme.borderRadius.lg};
    bottom: 30px;
    color: ${(props) => props.theme.color.greyDark};
    cursor: pointer;
    display: flex;
    height: 40px;
    justify-content: center;
    left: 30px;
    position: fixed;
    width: 40px;
    z-index: 1;

    &:hover {
        background-color: ${(props) => props.theme.color.greyLightest};
        color: ${(props) => props.theme.color.greyDarkest};
    }
`;

/** Button that scrolls the user to the top of the page */
export function PathoscopeViewerScroller() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShow(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (show) {
        return (
            <StyledPathoscopeViewerScroller
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
                <Icon name="arrow-up" />
            </StyledPathoscopeViewerScroller>
        );
    }

    return null;
}
