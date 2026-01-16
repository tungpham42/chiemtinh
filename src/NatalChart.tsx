import React, { useMemo } from "react";
import { Typography, Tooltip } from "antd"; // Import Tooltip
import * as Astronomy from "astronomy-engine";
import dayjs from "dayjs";

const { Text } = Typography;

interface NatalChartProps {
  dob: dayjs.Dayjs;
  tob: dayjs.Dayjs;
}

// Dữ liệu 12 Cung Hoàng Đạo (Đã dịch)
const ZODIAC_SIGNS = [
  {
    name: "Aries",
    viName: "Bạch Dương",
    symbol: "♈",
    color: "#FF5733",
    start: 0,
    desc: "Con Cừu",
  },
  {
    name: "Taurus",
    viName: "Kim Ngưu",
    symbol: "♉",
    color: "#4CAF50",
    start: 30,
    desc: "Con Trâu",
  },
  {
    name: "Gemini",
    viName: "Song Tử",
    symbol: "♊",
    color: "#FFC107",
    start: 60,
    desc: "Song Sinh",
  },
  {
    name: "Cancer",
    viName: "Cự Giải",
    symbol: "♋",
    color: "#B23EFF",
    start: 90,
    desc: "Con Cua",
  },
  {
    name: "Leo",
    viName: "Sư Tử",
    symbol: "♌",
    color: "#FF9800",
    start: 120,
    desc: "Sư Tử",
  },
  {
    name: "Virgo",
    viName: "Xử Nữ",
    symbol: "♍",
    color: "#8BC34A",
    start: 150,
    desc: "Trinh Nữ",
  },
  {
    name: "Libra",
    viName: "Thiên Bình",
    symbol: "♎",
    color: "#03A9F4",
    start: 180,
    desc: "Cái Cân",
  },
  {
    name: "Scorpio",
    viName: "Bọ Cạp", // Hoặc Thiên Yết
    symbol: "♏",
    color: "#E91E63",
    start: 210,
    desc: "Bọ Cạp",
  },
  {
    name: "Sagittarius",
    viName: "Nhân Mã",
    symbol: "♐",
    color: "#9C27B0",
    start: 240,
    desc: "Cung Thủ",
  },
  {
    name: "Capricorn",
    viName: "Ma Kết",
    symbol: "♑",
    color: "#795548",
    start: 270,
    desc: "Con Dê",
  },
  {
    name: "Aquarius",
    viName: "Bảo Bình",
    symbol: "♒",
    color: "#00BCD4",
    start: 300,
    desc: "Người Mang Nước",
  },
  {
    name: "Pisces",
    viName: "Song Ngư",
    symbol: "♓",
    color: "#3F51B5",
    start: 330,
    desc: "Con Cá",
  },
];

// Dữ liệu Hành Tinh (Đã dịch)
const PLANETS = [
  { name: "Mặt Trời", key: Astronomy.Body.Sun, symbol: "☉", color: "#FFD700" },
  {
    name: "Mặt Trăng",
    key: Astronomy.Body.Moon,
    symbol: "☽",
    color: "#E0E0E0",
  },
  {
    name: "Sao Thủy",
    key: Astronomy.Body.Mercury,
    symbol: "☿",
    color: "#B0BEC5",
  },
  { name: "Sao Kim", key: Astronomy.Body.Venus, symbol: "♀", color: "#F48FB1" },
  { name: "Sao Hỏa", key: Astronomy.Body.Mars, symbol: "♂", color: "#EF5350" },
  {
    name: "Sao Mộc",
    key: Astronomy.Body.Jupiter,
    symbol: "♃",
    color: "#FFCA28",
  },
  {
    name: "Sao Thổ",
    key: Astronomy.Body.Saturn,
    symbol: "♄",
    color: "#8D6E63",
  },
];

const NatalChart: React.FC<NatalChartProps> = ({ dob, tob }) => {
  // 1. Tính toán vị trí các hành tinh
  const planetaryPositions = useMemo(() => {
    const dateObj = dob
      .hour(tob.hour())
      .minute(tob.minute())
      .second(0)
      .toDate();

    return PLANETS.map((planet) => {
      const vector = Astronomy.GeoVector(planet.key, dateObj, true);
      let longitude = Math.atan2(vector.y, vector.x) * (180 / Math.PI);
      if (longitude < 0) longitude += 360;

      // Tìm hành tinh nằm ở cung nào
      const signIndex = Math.floor(longitude / 30);
      const signData = ZODIAC_SIGNS[signIndex];
      const signName = signData?.viName || "";

      return {
        ...planet,
        degree: longitude,
        sign: signName,
      };
    });
  }, [dob, tob]);

  // Cấu hình SVG
  const size = 320;
  const center = size / 2;
  const radius = size / 2 - 10;
  const innerRadius = radius - 40;

  const getCoordinates = (degree: number, r: number) => {
    const radians = -degree * (Math.PI / 180);
    return {
      x: center + r * Math.cos(radians),
      y: center + r * Math.sin(radians),
    };
  };

  return (
    <div style={{ textAlign: "center", margin: "20px 0" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Vòng nền Zodiac */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#b23eff"
          strokeWidth="1"
          opacity={0.3}
        />
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="none"
          stroke="#b23eff"
          strokeWidth="1"
          opacity={0.3}
        />

        {/* Render Cung Hoàng Đạo kèm Tooltips */}
        {ZODIAC_SIGNS.map((sign) => {
          const startCoords = getCoordinates(sign.start, radius);
          const textCoords = getCoordinates(sign.start + 15, radius - 20);

          return (
            <g key={sign.name}>
              <line
                x1={center}
                y1={center}
                x2={startCoords.x}
                y2={startCoords.y}
                stroke="#b23eff"
                strokeWidth="0.5"
                opacity={0.2}
              />

              <Tooltip
                title={`${sign.viName}: ${sign.desc}`}
                color={sign.color}
              >
                <text
                  x={textCoords.x}
                  y={textCoords.y}
                  fill={sign.color}
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontFamily: '"Cinzel Decorative", cursive',
                    cursor: "help",
                  }}
                >
                  {sign.symbol}
                </text>
              </Tooltip>
            </g>
          );
        })}

        {/* Render Hành Tinh kèm Tooltips chi tiết */}
        {planetaryPositions.map((planet, index) => {
          const planetRadius = innerRadius - 20 - (index % 2) * 15;
          const coords = getCoordinates(planet.degree, planetRadius);

          return (
            <Tooltip
              key={planet.name}
              title={
                <div style={{ textAlign: "center" }}>
                  <strong>{planet.name}</strong>
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>
                    {/* Dịch: 15° tại Bạch Dương */}
                    {Math.floor(planet.degree)}° tại {planet.sign}
                  </div>
                </div>
              }
              color="#1B2735"
              overlayInnerStyle={{ border: `1px solid ${planet.color}` }}
            >
              <g style={{ cursor: "pointer" }}>
                <line
                  x1={center}
                  y1={center}
                  x2={coords.x}
                  y2={coords.y}
                  stroke={planet.color}
                  strokeWidth="1"
                  opacity={0.3}
                  strokeDasharray="2,2"
                />
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="10"
                  fill="#1B2735"
                  stroke={planet.color}
                  strokeWidth="1"
                />
                <text
                  x={coords.x}
                  y={coords.y + 1}
                  fill={planet.color}
                  fontSize="14"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {planet.symbol}
                </text>
              </g>
            </Tooltip>
          );
        })}

        {/* Tâm Mặt Trời */}
        <circle cx={center} cy={center} r="5" fill="#ffd700" opacity={0.8} />
      </svg>

      <div style={{ marginTop: 10 }}>
        <Text style={{ color: "#bfa5d6", fontSize: "12px" }}>
          Di chuột vào các biểu tượng để xem chi tiết
        </Text>
      </div>
    </div>
  );
};

export default NatalChart;
