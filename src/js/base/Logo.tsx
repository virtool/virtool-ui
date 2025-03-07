import { getColor } from "@app/theme";
import React from "react";
import styled from "styled-components";

const clipPath = `M 235.00977 45.240234 L 224.64258 66.671875 L 186.9375 70.472656 L 175.11914 51.697266 L 148.99219 58.945312 
    L 151.82031 81.373047 L 120.04102 98.623047 L 102.16602 82.363281 L 79.050781 101.22656 L 92.351562 121.46875 
    L 69.505859 149.15625 L 47.076172 141.58789 L 32.525391 166.91797 L 52.255859 180.93555 L 41.355469 216.05469 
    L 17.802734 216.85742 L 15.412109 249.60547 L 37.554688 253.75977 L 41.355469 291.46484 L 21.628906 301.99609 
    L 32.638672 332.50781 L 52.255859 326.58398 L 69.505859 358.36328 L 53.646484 376.79102 L 71.736328 399.89062 
    L 92.351562 386.05273 L 120.04102 408.89648 L 114.68945 433.35938 L 136.87695 445.32422 L 151.82031 426.14648 
    L 186.9375 437.04883 L 190.23633 461.24805 L 214.27539 462.41992 L 224.64258 440.84961 L 262.34766 437.04883 
    L 275.83594 457.51367 L 301.91211 449.46289 L 297.4668 426.14648 L 329.24609 408.89648 L 349.15234 425.12695 
    L 368.18555 408.14648 L 356.93555 386.05273 L 379.78125 358.36328 L 404.98242 368.15039 L 417.68555 344.48438 
    L 397.0293 326.58398 L 407.93164 291.46484 L 432.5 288.90625 L 433.67383 262.27734 L 411.73242 253.75977 
    L 407.93164 216.05469 L 427.81445 203.06445 L 419.47656 178.43359 L 397.0293 180.93555 L 379.78125 149.15625 
    L 395.79297 130.07812 L 380.41992 110.97656 L 356.93555 121.46875 L 329.24609 98.623047 L 335.33594 73.050781 
    L 313.14844 63.304688 L 297.4668 81.373047 L 262.34766 70.472656 L 259.30078 46.783203 L 235.00977 45.240234 z 
    M 82.472656 190.00781 L 119.82227 190.00781 L 158.04102 296.36133 L 196.16211 190.00781 L 233.51172 190.00781 
    L 180.14258 334.09766 L 135.84375 334.09766 L 82.472656 190.00781 z M 235.3457 190.00781 L 368.14453 190.00781 
    L 368.14453 218.0918 L 320.37109 218.0918 L 320.37109 334.09766 L 283.21484 334.09766 L 283.21484 218.0918 
    L 235.3457 218.0918 L 235.3457 190.00781 z`;

const gear = `
    M 235.00977 45.240234 L 224.64258 66.671875 L 186.9375 70.472656 L 175.11914 51.697266 L 148.99219 58.945312 
    L 151.82031 81.373047 L 120.04102 98.623047 L 102.16602 82.363281 L 79.050781 101.22656 L 92.351562 121.46875 
    L 69.505859 149.15625 L 47.076172 141.58789 L 32.525391 166.91797 L 52.255859 180.93555 L 41.355469 216.05469 
    L 17.802734 216.85742 L 15.412109 249.60547 L 37.554688 253.75977 L 41.355469 291.46484 L 21.628906 301.99609 
    L 32.638672 332.50781 L 52.255859 326.58398 L 69.505859 358.36328 L 53.646484 376.79102 L 71.736328 399.89062 
    L 92.351562 386.05273 L 120.04102 408.89648 L 114.68945 433.35938 L 136.87695 445.32422 L 151.82031 426.14648 
    L 186.9375 437.04883 L 190.23633 461.24805 L 214.27539 462.41992 L 224.64258 440.84961 L 262.34766 437.04883 
    L 275.83594 457.51367 L 301.91211 449.46289 L 297.4668 426.14648 L 329.24609 408.89648 L 349.15234 425.12695 
    L 368.18555 408.14648 L 356.93555 386.05273 L 379.78125 358.36328 L 404.98242 368.15039 L 417.68555 344.48438 
    L 397.0293 326.58398 L 407.93164 291.46484 L 432.5 288.90625 L 433.67383 262.27734 L 411.73242 253.75977 
    L 407.93164 216.05469 L 427.81445 203.06445 L 419.47656 178.43359 L 397.0293 180.93555 L 379.78125 149.15625 
    L 395.79297 130.07812 L 380.41992 110.97656 L 356.93555 121.46875 L 329.24609 98.623047 L 335.33594 73.050781 
    L 313.14844 63.304688 L 297.4668 81.373047 L 262.34766 70.472656 L 259.30078 46.783203 L 235.00977 45.240234 z
`;

const StyledLogo = styled.div`
    align-items: center;
    color: currentColor;
    display: flex;
    justify-content: center;
    max-width: 200px;
    margin: 8px 8px 0 0;

    path {
        fill: ${getColor};
        fill-opacity: 1;
        stroke: none;
        stroke-width: 1;
        stroke-miterlimit: 4;
        stroke-dasharray: none;
        stroke-dashoffset: 0;
    }
`;

interface LogoProps {
    className?: string;
    height?: number;
    color?: string;
}

/**
 * Virtool's logo
 *
 * @param className - the class name to apply to the logo
 * @param height - the height of the logo
 * @param color - the color of the logo
 * @returns Virtool's logo
 */
export default function Logo({ className, height = 30, color }: LogoProps) {
    return (
        <StyledLogo className={className} color={color}>
            <svg id="svg2" viewBox="0 0 512 512" height={height}>
                <defs id="defs125">
                    <clipPath id="clipPath4140">
                        <path d={clipPath} />
                    </clipPath>
                </defs>
                <path id="path4138-2" d={gear} clipPath="url(#clipPath4140)" />
            </svg>
        </StyledLogo>
    );
}
