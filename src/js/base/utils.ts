import { DefaultTheme } from "styled-components";
import { getColor } from "../app/theme";

type getBadgeOrLabelColorProps = {
    color?: string;
    theme: DefaultTheme;
};

export function getBadgeOrLabelColor(props: getBadgeOrLabelColorProps): string {
    if (props.color) {
        return getColor(props);
    }

    return props.theme.color.greyDark;
}
