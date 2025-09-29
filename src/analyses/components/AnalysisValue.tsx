import { cn } from "@app/utils";

export default function AnalysisValue({ color, label, value }) {
    return (
        <div className="flex flex-col w-22">
            <span
                className={cn(
                    {
                        "text-blue-700": color === "blue",
                        "text-green-700": color === "green",
                        "text-red-700": color === "red",
                    },
                    "font-bold",
                )}
            >
                {value}
            </span>
            <small className="font-medium mt-1.5 text-gray-500">{label}</small>
        </div>
    );
}
