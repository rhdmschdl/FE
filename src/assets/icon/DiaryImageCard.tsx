type Props = {
  className?: string;
  size?: number | string;
  ariaLabel?: string;
  ariaHidden?: boolean;
  onClick?: () => void;
  color?: string;
};

const DiaryImageCard = ({
  className,
  size,
  ariaLabel,
  ariaHidden = true,
  onClick,
  color = "#99CCFF",
}: Props) => {
  const style =
    typeof size === "number"
      ? { width: size, height: size }
      : { width: size, height: size };
  return (
    <svg
      width="360"
      height="330"
      viewBox="0 0 360 330"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
      role={ariaHidden ? undefined : "img"}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      onClick={onClick}
    >
      <g clipPath="url(#clip0_1002_28689)">
        <g clipPath="url(#clip1_1002_28689)">
          <g filter="url(#filter0_di_1002_28689)">
            <path
              d="M182.843 10.8381C180.896 9.57297 178.386 9.57298 176.438 10.8381L-11.5607 132.947C-16.4701 136.135 -14.2119 143.758 -8.35779 143.758L367.639 143.758C373.493 143.758 375.751 136.135 370.842 132.947L182.843 10.8381Z"
              fill={color}
            />
          </g>
        </g>
        <path d="M0 125.398H360V329.398H0V125.398Z" fill={color} />
        <g filter="url(#filter1_dd_1002_28689)">
          <rect
            width="360"
            height="300"
            transform="translate(10 128)"
            fill="white"
          />
          <rect x="10" y="128" width="360" height="300" fill="#EEF7FC" />
          <path
            d="M181.227 158.344C182.607 158.344 183.726 159.463 183.727 160.844V177.727H200.609C201.99 177.727 203.109 178.846 203.109 180.227C203.109 181.607 201.99 182.727 200.609 182.727H183.727V199.609C183.726 200.99 182.607 202.109 181.227 202.109C179.846 202.109 178.727 200.99 178.727 199.609V182.727H161.844C160.463 182.726 159.344 181.607 159.344 180.227C159.344 178.846 160.463 177.727 161.844 177.727H178.727V160.844C178.727 159.463 179.846 158.344 181.227 158.344Z"
            fill="#CBD5DF"
          />
        </g>
        <g opacity="0.8" clipPath="url(#clip2_1002_28689)">
          <g filter="url(#filter2_di_1002_28689)">
            <path
              d="M180 227.398L0 331.321V123.475L180 227.398Z"
              fill={color}
            />
          </g>
          <g filter="url(#filter3_di_1002_28689)">
            <path
              d="M180 227.398L360 331.321V123.475L180 227.398Z"
              fill={color}
            />
          </g>
        </g>
        <g clipPath="url(#clip3_1002_28689)">
          <g filter="url(#filter4_di_1002_28689)">
            <path
              d="M177.157 197.08C179.104 195.815 181.614 195.815 183.562 197.08L371.561 319.189C376.47 322.378 374.212 330 368.358 330H-7.63906C-13.4932 330 -15.7514 322.378 -10.8419 319.189L177.157 197.08Z"
              fill={color}
            />
          </g>
        </g>
      </g>
      <defs>
        <filter
          id="filter0_di_1002_28689"
          x="-21.57"
          y="5.33063"
          width="397.861"
          height="143.947"
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
          <feOffset dx="-2.28" dy="0.48" />
          <feGaussianBlur stdDeviation="2.52" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1002_28689"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1002_28689"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="10.2" />
          <feGaussianBlur stdDeviation="0.36" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect2_innerShadow_1002_28689"
          />
        </filter>
        <filter
          id="filter1_dd_1002_28689"
          x="-9.53674e-07"
          y="120"
          width="380"
          height="320"
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
            result="effect1_dropShadow_1002_28689"
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
            in2="effect1_dropShadow_1002_28689"
            result="effect2_dropShadow_1002_28689"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_1002_28689"
            result="shape"
          />
        </filter>
        <filter
          id="filter2_di_1002_28689"
          x="-0.72"
          y="122.397"
          width="181.44"
          height="210.484"
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
          <feOffset dy="-0.36" />
          <feGaussianBlur stdDeviation="0.36" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1002_28689"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1002_28689"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1.56" />
          <feGaussianBlur stdDeviation="1.02" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect2_innerShadow_1002_28689"
          />
        </filter>
        <filter
          id="filter3_di_1002_28689"
          x="179.28"
          y="122.397"
          width="181.44"
          height="210.484"
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
          <feOffset dy="-0.36" />
          <feGaussianBlur stdDeviation="0.36" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1002_28689"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1002_28689"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1.56" />
          <feGaussianBlur stdDeviation="1.02" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect2_innerShadow_1002_28689"
          />
        </filter>
        <filter
          id="filter4_di_1002_28689"
          x="-23.5312"
          y="186.613"
          width="407.781"
          height="153.867"
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
          <feOffset dy="0.48" />
          <feGaussianBlur stdDeviation="5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1002_28689"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1002_28689"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1.8" />
          <feGaussianBlur stdDeviation="0.36" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect2_innerShadow_1002_28689"
          />
        </filter>
        <clipPath id="clip0_1002_28689">
          <rect width="360" height="329.4" fill="white" />
        </clipPath>
        <clipPath id="clip1_1002_28689">
          <rect
            width="360"
            height="134.4"
            fill="white"
            transform="matrix(-1 0 0 1 360 8.75781)"
          />
        </clipPath>
        <clipPath id="clip2_1002_28689">
          <rect
            width="360"
            height="204"
            fill="white"
            transform="translate(0 125.398)"
          />
        </clipPath>
        <clipPath id="clip3_1002_28689">
          <rect
            width="360"
            height="134.4"
            fill="white"
            transform="translate(0 195)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default DiaryImageCard;
