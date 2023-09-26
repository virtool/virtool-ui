import { useQuery } from "react-query";
import { Request } from "../app/request";

function fetchFirstUser() {
    // alert("fetch users success");
    return Request.get("").then(response => {
        return response.body;
    });
}

export function useFetchFirstUser() {
    return useQuery("first_user", fetchFirstUser);
}
