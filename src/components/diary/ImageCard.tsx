type Props = {
  onClick?: () => void;
  imageUrl?: string;
  showDeleteButton?: boolean;
};

const ImageCard = ({ onClick, imageUrl, showDeleteButton = true }: Props) => {
  const handleXClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 클릭 이벤트 방지
    onClick?.();
  };

  return (
    <div className="relative">
      <svg
        width="380"
        height="350"
        viewBox="0 0 380 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_dd_1335_27203)">
          <rect
            width="360"
            height="329.4"
            transform="translate(10 8)"
            fill="white"
          />
          <rect x="10" y="8" width="360" height="329.4" fill="#EEF7FC" />

          {/* 이미지가 있으면 이미지 표시, 없으면 플레이스홀더 */}
          {imageUrl ? (
            <image
              href={imageUrl}
              x="10"
              y="8"
              width="360"
              height="329.4"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#imageClip)"
            />
          ) : (
            <path
              d="M211.893 184.079V160.534C211.893 158.375 210.127 156.609 207.969 156.609H172.651C170.492 156.609 168.727 158.375 168.727 160.534V184.079C168.727 186.237 170.492 188.003 172.651 188.003H207.969C210.127 188.003 211.893 186.237 211.893 184.079ZM183.442 173.287L188.348 179.193L195.215 170.344L204.045 182.117H176.575L183.442 173.287Z"
              fill="#CBD5DF"
            />
          )}

          {/* X 버튼 영역 - 편집 모드일 때만 표시 */}
          {showDeleteButton && (
            <g
              opacity="0.5"
              onClick={handleXClick}
              style={{ cursor: "pointer" }}
              className="cursor-pointer hover:opacity-70 transition-opacity"
            >
              <rect
                x="317.062"
                y="28"
                width="31.7647"
                height="31.7231"
                rx="15.8615"
                fill="#7D9AB2"
              />
              <path
                d="M327.005 37.5082C327.198 37.3149 327.511 37.315 327.704 37.5082L333.133 42.9543L338.396 37.6767C338.589 37.4833 338.901 37.4833 339.093 37.6767C339.286 37.87 339.286 38.183 339.093 38.3763L333.831 43.6548L339.301 49.1413C339.494 49.3346 339.494 49.6484 339.301 49.8418C339.108 50.0351 338.795 50.0351 338.602 49.8418L333.133 44.3553L327.288 50.2183C327.095 50.4116 326.782 50.4116 326.59 50.2183C326.397 50.025 326.397 49.7119 326.59 49.5186L332.434 43.6548L327.005 38.2087C326.813 38.0154 326.812 37.7015 327.005 37.5082Z"
                fill="white"
              />
            </g>
          )}
        </g>
        <defs>
          {/* 이미지 클리핑 경로 */}
          <clipPath id="imageClip">
            <rect x="10" y="8" width="360" height="329.4" rx="0" />
          </clipPath>

          <filter
            id="filter0_dd_1335_27203"
            x="-9.53674e-07"
            y="-9.53674e-07"
            width="380"
            height="349.398"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="4" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1335_27203"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="5" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
            />
            <feBlend
              mode="normal"
              in2="effect1_dropShadow_1335_27203"
              result="effect2_dropShadow_1335_27203"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect2_dropShadow_1335_27203"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default ImageCard;
