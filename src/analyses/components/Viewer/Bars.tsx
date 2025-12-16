import { getBorder, getColor } from "@app/theme";
import styled from "styled-components";
import { BarsLegendItem } from "./BarsLegendItem";

const Bar = styled.div`
    border: ${getBorder};
    border-radius: ${(props) => props.theme.borderRadius.md};
    display: flex;
    height: 32px;
    margin-bottom: 15px;
    overflow: hidden;
    z-index: 10;
`;

type BarItemProps = {
    size: number;
};

const BarItem = styled.div<BarItemProps>`
    background-color: ${getColor};
    flex: ${(props) => props.size / 100} 0 auto;
`;

const EmptyBarItem = styled(BarItem)`
    background-color: ${(props) => props.theme.color.white};
    box-shadow: ${(props) => props.theme.boxShadow.inset};
`;

const StyledBars = styled.div`
    margin-bottom: 10px;
    position: relative;
`;

export function Bars({ empty, items }) {
    return (
        <StyledBars>
            <Bar>
                {items.map(({ color, count }) => (
                    <BarItem key={color} color={color} size={count} />
                ))}
                {empty && (
                    <EmptyBarItem key="empty" color="white" size={empty} />
                )}
            </Bar>
            <div>
                {items.map(({ color, count, title }) => (
                    <BarsLegendItem
                        key={color}
                        color={color}
                        count={count}
                        title={title}
                    />
                ))}
            </div>
        </StyledBars>
    );
}
