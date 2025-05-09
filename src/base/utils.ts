import { getColor, theme } from "@app/theme";

type getBadgeOrLabelColorProps = {
    color?: string;
};

export function getBadgeOrLabelColor(props: getBadgeOrLabelColorProps): string {
    if (props.color) {
        return getColor({ color: props.color, theme });
    }

    return theme.color.greyDark;
}
