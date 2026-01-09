const MAX_ENTROPY = 4.32;

type HmmEntropyIndicatorProps = {
    entropy: number;
};

/**
 * Inline indicator showing entropy value with a gradient scale
 * Blue = conserved, Orange = variable
 */
export function HmmEntropyIndicator({ entropy }: HmmEntropyIndicatorProps) {
    const percentage = Math.min((entropy / MAX_ENTROPY) * 100, 100);

    return (
        <div className="flex items-center gap-3">
            <div className="relative w-24 h-3 rounded bg-gradient-to-r from-blue-600 via-amber-500 to-orange-600">
                <div
                    className="absolute top-0 w-0.5 h-3 bg-white border border-gray-800 rounded-sm"
                    style={{ left: `${percentage}%` }}
                />
            </div>
            <span className="font-medium">{entropy}</span>
        </div>
    );
}
