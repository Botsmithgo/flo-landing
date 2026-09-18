import React from 'react';
import { MARKET } from '../assets';
import { C, FONT, alpha } from '../utils/colors';
import { E, ramp, sprSnap, stagger } from '../utils/easing';
import { Mono, Odometer } from './Typography';

/**
 * MARKET INTELLIGENCE.
 *
 * The brief's trap here is the SaaS dashboard, so this beat is built as a
 * *chart hanging in space*, not a card in a UI. No panels, no rounded
 * containers, no drop shadows on white. Three elements only: a line, a ledger,
 * and a number. Everything else is negative space.
 *
 * The line is drawn with straight segments, not a smoothed spline — real price
 * history is angular, and a suspiciously smooth curve reads as decoration.
 *
 * ── On the shape of this particular line ─────────────────────────────────────
 * An earlier version of this beat plotted a tidy twenty-point curve that rose
 * from left to right. It looked better. It was also invented, and it argued the
 * opposite of what MAZI exists to say.
 *
 * The real rung has four verified sales: $63, $58, $186, $85. That is a spike,
 * not a rise, and the spike IS the pitch — the same card at the same grade
 * traded at three times the price inside six weeks, which is exactly why a
 * single "what it's worth" number is a lie and a *range* is the product. So the
 * density that used to come from fake points now comes from real furniture:
 * the Estimated Market Range drawn as a band behind the line, and each real
 * sale marked and priced. Four points, richly presented, rather than twenty
 * points that never happened.
 */

type GraphProps = {
  frame: number;
  start: number;
  width: number;
  height: number;
  /** Override the draw progress (0–1). Defaults to an internal ramp. */
  progress?: number;
  series?: readonly number[];
  /** Time position of each point, 0–1. Defaults to even spacing by index. */
  xs?: readonly number[];
  color?: string;
  /** Estimated Market Range as [low, high], normalised 0–1 like `series`. */
  band?: readonly [number, number];
  /** Real prices for each point, drawn at the markers once the line passes. */
  labels?: readonly number[];
  /** Top of the value axis, for the band's own labels. */
  axisMax?: number;
};

export const MarketGraph: React.FC<GraphProps> = ({
  frame,
  start,
  width,
  height,
  progress,
  series = MARKET.series,
  xs = MARKET.seriesX,
  color = C.trust,
  band,
  labels,
  axisMax = 200,
}) => {
  const p = progress ?? ramp(frame, start, 34, E.glide);
  const pad = height * 0.1;
  const innerH = height - pad * 2;

  const at = (i: number) => (xs && xs.length === series.length ? xs[i] : i / (series.length - 1));
  const pts = series.map((v, i) => ({
    x: at(i) * width,
    y: pad + (1 - v) * innerH,
  }));

  const d = pts.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ');
  const areaD = `${d} L${width} ${height} L0 ${height} Z`;

  // Head of the draw, so a light can ride the line as it's laid down.
  // Walk the segments by their real widths, so the head travels at a constant
  // speed across the frame rather than pausing on the long early stretch.
  let i0 = 0;
  while (i0 < series.length - 2 && at(i0 + 1) < p) i0 += 1;
  const i1 = Math.min(series.length - 1, i0 + 1);
  const span = Math.max(1e-6, at(i1) - at(i0));
  const ft = Math.max(0, Math.min(1, (p - at(i0)) / span));
  const hx = pts[i0].x + (pts[i1].x - pts[i0].x) * ft;
  const hy = pts[i0].y + (pts[i1].y - pts[i0].y) * ft;

  const gid = `mg-${Math.round(width)}-${Math.round(height)}`;

  return (
    <svg width={width} height={height} style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id={`${gid}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={alpha(color, 0.34)} />
          <stop offset="60%" stopColor={alpha(color, 0.06)} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <linearGradient id={`${gid}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={alpha(color, 0.45)} />
          <stop offset="72%" stopColor={color} />
          <stop offset="100%" stopColor={C.trustIce} />
        </linearGradient>
        <clipPath id={`${gid}-clip`}>
          <rect x={0} y={-height} width={width * p} height={height * 3} />
        </clipPath>
      </defs>

      {/*
        The Estimated Market Range, behind everything.

        This is the product's actual answer to "what is it worth" — a band, not
        a number — so it belongs in the picture rather than only in the readout.
        It also does the compositional job the fake twenty-point curve used to
        do: it gives the plot area something to be, so four points read as a
        measurement against a range instead of as a sparse line.
      */}
      {band ? (
        <g opacity={ramp(frame, start + 2, 20, E.out)}>
          <rect
            x={0}
            y={pad + (1 - band[1]) * innerH}
            width={width}
            height={Math.max(1, (band[1] - band[0]) * innerH)}
            fill={alpha(color, 0.09)}
          />
          {[band[0], band[1]].map((b, i) => (
            <line
              key={i}
              x1={0}
              y1={pad + (1 - b) * innerH}
              x2={width}
              y2={pad + (1 - b) * innerH}
              stroke={alpha(color, 0.34)}
              strokeWidth={1}
              strokeDasharray="5 5"
            />
          ))}
          <text
            x={4}
            y={pad + (1 - band[1]) * innerH - 6}
            fill={alpha(color, 0.72)}
            fontFamily={FONT.mono}
            fontSize={Math.max(8, height * 0.075)}
            letterSpacing={1.4}
          >
            {`RANGE $${(band[0] * axisMax).toFixed(2)}–$${(band[1] * axisMax).toFixed(2)}`}
          </text>
        </g>
      ) : null}

      {/* Reference hairlines — three, unlabelled except the top. */}
      {[0.12, 0.5, 0.88].map((t, i) => (
        <line
          key={i}
          x1={0}
          y1={pad + t * innerH}
          x2={width}
          y2={pad + t * innerH}
          stroke={alpha(C.smoke, 0.34)}
          strokeWidth={1}
          strokeDasharray="2 7"
          opacity={ramp(frame, start + i * 2, 12, E.out)}
        />
      ))}

      <g clipPath={`url(#${gid}-clip)`}>
        <path d={areaD} fill={`url(#${gid}-area)`} />
        <path
          d={d}
          fill="none"
          stroke={`url(#${gid}-line)`}
          strokeWidth={2.4}
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 ${height * 0.05}px ${alpha(color, 0.8)})` }}
        />
        {/* data ticks */}
        {pts.map((pt, i) => (
          <rect
            key={i}
            x={pt.x - 0.6}
            y={pt.y - 3}
            width={1.2}
            height={6}
            fill={alpha(C.trustIce, 0.5)}
          />
        ))}
      </g>

      {/* Each verified sale, marked and priced. Every one of these is a row. */}
      {labels
        ? pts.map((pt, i) => {
            const shown = p > (i / (series.length - 1)) * 0.98 + 0.01;
            if (!shown) return null;
            const a = ramp(frame, start + 6 + i * 4, 12, E.out);
            return (
              <g key={i} opacity={a}>
                <circle cx={pt.x} cy={pt.y} r={2.6} fill={C.trustIce} />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={6}
                  fill="none"
                  stroke={alpha(color, 0.45)}
                  strokeWidth={1}
                />
                <text
                  x={pt.x}
                  y={pt.y - 12}
                  textAnchor={i === 0 ? 'start' : i === pts.length - 1 ? 'end' : 'middle'}
                  fill={alpha(C.bone, 0.82)}
                  fontFamily={FONT.mono}
                  fontSize={Math.max(8, height * 0.08)}
                  letterSpacing={0.6}
                >
                  {`$${labels[i]}`}
                </text>
              </g>
            );
          })
        : null}

      {/* Drawing head */}
      {p > 0.02 && p < 0.995 ? (
        <>
          <circle cx={hx} cy={hy} r={4} fill="#FFFFFF" />
          <circle cx={hx} cy={hy} r={12} fill="none" stroke={alpha(C.trustIce, 0.4)} strokeWidth={1} />
          <line x1={hx} y1={hy} x2={hx} y2={height} stroke={alpha(color, 0.3)} strokeWidth={1} />
        </>
      ) : null}

      {/* Terminal marker — the current value */}
      {p >= 0.995 ? (
        <g>
          <circle
            cx={pts[pts.length - 1].x}
            cy={pts[pts.length - 1].y}
            r={5 + sprSnap(frame - start - 34) * 2}
            fill={C.goldDeep}
          />
          <circle
            cx={pts[pts.length - 1].x}
            cy={pts[pts.length - 1].y}
            r={10 + ((frame - start - 34) % 26) * 1.4}
            fill="none"
            stroke={alpha(C.goldDeep, Math.max(0, 0.5 - ((frame - start - 34) % 26) * 0.019))}
            strokeWidth={1.2}
          />
        </g>
      ) : null}
    </svg>
  );
};

/**
 * The comparable-sales ledger. Rows arrive bottom-up on a stagger, mono, with
 * the price right-aligned on a tabular figure so the column edge is dead
 * straight. The straightness is the entire point — it says "record", not "UI".
 */
type Comp = { date: string; grade: string; price: number; venue: string };

export const CompLedger: React.FC<{
  frame: number;
  start: number;
  width: number;
  scale?: number;
  rows?: readonly Comp[];
}> = ({ frame, start, width, scale = 1, rows = MARKET.comps }) => (
  <div style={{ width }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: 8 * scale,
        borderBottom: `1px solid ${alpha(C.smoke, 0.5)}`,
        marginBottom: 10 * scale,
        opacity: ramp(frame, start, 10, E.out),
      }}
    >
      <Mono size={10 * scale} color={alpha(C.muted, 0.9)} tracking={3 * scale}>
        COMPARABLE SALES
      </Mono>
      <Mono size={10 * scale} color={alpha(C.muted, 0.6)} tracking={3 * scale}>
        {MARKET.windowLabel}
      </Mono>
    </div>

    {rows.map((row, i) => {
      const d = start + 4 + stagger(i, 3.4);
      const p = ramp(frame, d, 11, E.out);
      const isLast = i === rows.length - 1;
      return (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            padding: `${5 * scale}px 0`,
            opacity: p,
            transform: `translateY(${(1 - p) * 10 * scale}px)`,
          }}
        >
          <span style={{ display: 'flex', gap: 14 * scale, alignItems: 'baseline' }}>
            <Mono size={11.5 * scale} color={alpha(C.muted, 0.95)} tracking={1.8 * scale}>
              {row.date}
            </Mono>
            <Mono
              size={11.5 * scale}
              color={isLast ? C.trust : alpha(C.faint, 1)}
              tracking={1.8 * scale}
            >
              {row.grade}
            </Mono>
          </span>
          <span
            style={{
              fontFamily: FONT.mono,
              fontSize: 14 * scale,
              color: isLast ? C.goldDeep : C.paperInk,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: 0.6 * scale,
            }}
          >
            ${row.price.toLocaleString('en-US')}
          </span>
        </div>
      );
    })}
  </div>
);

/** The headline number. Amber — one of only two places in the film it appears. */
export const Valuation: React.FC<{
  frame: number;
  start: number;
  size: number;
  scale?: number;
}> = ({ frame, start, size, scale = 1 }) => {
  const labelIn = ramp(frame, start - 6, 12, E.out);
  const deltaIn = ramp(frame, start + 16, 14, E.out);

  return (
    <div>
      <div style={{ opacity: labelIn, marginBottom: 10 * scale }}>
        <Mono size={11 * scale} color={alpha(C.muted, 0.9)} tracking={4.4 * scale}>
          VERIFIED SALE
        </Mono>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 18 * scale,
          filter: `drop-shadow(0 0 ${size * 0.22}px ${alpha(C.goldDeep, 0.28)})`,
        }}
      >
        <Odometer
          frame={frame}
          start={start}
          value={MARKET.value}
          size={size}
          prefix={MARKET.currency}
          color={C.gold}
          weight={700}
        />
        {/*
          Not a percentage change. MAZI does not publish a single "what it's
          worth" — it publishes a range, and the range is the product. Showing
          the band next to the last sale is the honest version of this frame and
          it is also the more interesting one: the number that just landed sits
          inside a spread the viewer can see.
        */}
        <span
          style={{
            opacity: deltaIn,
            transform: `translateY(${(1 - deltaIn) * 8 * scale}px)`,
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: 7 * scale,
          }}
        >
          <Mono size={11 * scale} color={C.faint} tracking={2.4 * scale} weight={500}>
            {MARKET.rangeLabel}
          </Mono>
          <Mono size={16 * scale} color={C.goldDeep} tracking={0.6 * scale} weight={500}>
            {`$${MARKET.rangeLow.toLocaleString('en-US')}–$${MARKET.rangeHigh.toLocaleString('en-US')}`}
          </Mono>
        </span>
      </div>

      <div style={{ display: 'flex', gap: 34 * scale, marginTop: 20 * scale, opacity: deltaIn }}>
        <Stat label="LAST SALE" value={`$${MARKET.lastSale.toLocaleString('en-US')}`} scale={scale} />
        <Stat label="VERIFIED" value={`${MARKET.rungSales} SALES`} scale={scale} />
        <Stat label="WINDOW" value={MARKET.windowLabel} scale={scale} />
      </div>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: string; scale: number }> = ({
  label,
  value,
  scale,
}) => (
  <div>
    <div style={{ marginBottom: 5 * scale }}>
      <Mono size={9.5 * scale} color={alpha(C.faint, 1)} tracking={2.6 * scale}>
        {label}
      </Mono>
    </div>
    <div
      style={{
        fontFamily: FONT.mono,
        fontSize: 17 * scale,
        color: C.paperInk,
        letterSpacing: 0.8 * scale,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {value}
    </div>
  </div>
);
