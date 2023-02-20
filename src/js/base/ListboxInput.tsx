import { ListboxInput as ReachListboxInput } from "@reach/listbox";
import styled from "styled-components/macro";

export const ListboxInput = styled(ReachListboxInput)`
    [data-reach-listbox-button][aria-expanded="true"] {
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }
`;
