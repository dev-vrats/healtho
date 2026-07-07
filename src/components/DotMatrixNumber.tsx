import React from "react";

const DIGIT_MAP: Record<string, string[]> = {
  '0': ['01110','10001','10011','10101','11001','10001','01110'],
  '1': ['00100','01100','00100','00100','00100','00100','01110'],
  '2': ['01110','10001','00001','00010','00100','01000','11111'],
  '3': ['11111','00010','00100','00010','00001','10001','01110'],
  '4': ['00010','00110','01010','10010','11111','00010','00010'],
  '5': ['11111','10000','11110','00001','00001','10001','01110'],
  '6': ['00110','01000','10000','11110','10001','10001','01110'],
  '7': ['11111','00001','00010','00100','01000','01000','01000'],
  '8': ['01110','10001','10001','01110','10001','10001','01110'],
  '9': ['01110','10001','10001','01111','00001','00010','01100'],
  '.': ['00000','00000','00000','00000','00000','00110','00110'],
  '-': ['00000','00000','00000','11111','00000','00000','00000'],
};

interface DotMatrixNumberProps {
  value: number | string;
  dotSize?: number;
  gap?: number;
  color?: string;
  className?: string;
}

export function DotMatrixNumber({ 
  value, 
  dotSize = 6, 
  gap = 2, 
  color = 'currentColor',
  className
}: DotMatrixNumberProps) {
  const chars = String(value).split('');
  const cell = dotSize + gap;
  const charWidth = (ch: string) => ((DIGIT_MAP[ch]?.[0].length || 3) * cell) + cell;
  const totalWidth = chars.reduce((w, ch) => w + charWidth(ch), 0);

  return (
    <svg 
      height={cell * 7} 
      width={totalWidth} 
      role="img" 
      aria-label={String(value)}
      className={className}
      style={{ display: 'inline-block' }}
    >
      {chars.map((ch, ci) => {
        const rows = DIGIT_MAP[ch] || DIGIT_MAP['-'];
        const xOffset = chars.slice(0, ci).reduce((w, c) => w + charWidth(c), 0);
        return rows.map((row, ri) =>
          row.split('').map((bit, colI) =>
            bit === '1' ? (
              <circle
                key={`${ci}-${ri}-${colI}`}
                cx={xOffset + colI * cell + dotSize / 2}
                cy={ri * cell + dotSize / 2}
                r={dotSize / 2}
                fill={color}
              />
            ) : null
          )
        );
      })}
    </svg>
  );
}
