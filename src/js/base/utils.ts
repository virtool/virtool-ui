import { DefaultTheme } from "styled-components";
import { getColor } from "../app/theme";

type getBadgeOrLabelColorProps = {
    color?: string;
    theme: DefaultTheme;
};

export function getBadgeOrLabelColor(props: getBadgeOrLabelColorProps): string {
    return getColor(props) || props.theme.color.greyDark;
}
