interface TicketSvgProps {
  width?: number;
  height?: number;
  className?: string;
  mainColor?: string;
  accentColor?: string;
  /** 좌우 톱니 위치 */
  side?: "left" | "right";
}

const TicketSvg = ({
  width = 444,
  height = 240,
  className = "",
  mainColor = "#CBD5DF",
  accentColor = "#A6BBCE",
  side = "left",
}: TicketSvgProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 444 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={
        side === "left"
          ? { transform: "scaleX(-1)", transition: "all 0.15s ease" }
          : { transition: "all 0.15s ease" }
      }
    >
      <path
        d="M435.941 0C440.36 0 443.942 3.58172 443.942 8V232C443.942 236.418 440.36 240 435.941 240H8C3.58173 240 2.25497e-07 236.418 0 232V8C3.60795e-06 3.58173 3.58172 6.03008e-08 8 0H324.085C324.118 3.66514 325.968 7.17505 329.241 9.76953C332.545 12.3884 337.028 13.8601 341.702 13.8613C346.376 13.8625 350.86 12.3926 354.166 9.77539C357.444 7.18047 359.298 3.66827 359.331 0H435.941ZM341.702 225.938C337.028 225.939 332.545 227.41 329.241 230.029C325.937 232.648 324.082 236.2 324.083 239.902L341.708 239.897L359.332 239.894C359.331 236.191 357.472 232.641 354.166 230.023C350.86 227.406 346.376 225.936 341.702 225.938Z"
        fill={mainColor}
        style={{ transition: "fill 0.15s ease" }}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M341.732 221.118V225.933H343.797V221.118H341.732ZM341.732 201.857V211.487H343.797V201.857H341.732ZM341.732 182.596V192.227H343.797V182.596H341.732ZM341.732 163.336V172.966H343.797V163.336H341.732ZM341.732 144.075V153.705H343.797V144.075H341.732ZM341.732 124.814V134.445H343.797V124.814H341.732ZM341.732 105.553V115.184H343.797V105.553H341.732ZM341.732 86.2927V95.923H343.797V86.2927H341.732ZM341.732 67.0319V76.6623H343.797V67.0319H341.732ZM341.732 47.7712V57.4016H343.797V47.7712H341.732ZM341.732 28.5105V38.1408H343.797V28.5105H341.732ZM341.732 14.0649V18.8801H343.797V14.0649H341.732Z"
        fill={accentColor}
        style={{ transition: "fill 0.15s ease" }}
      />
      <path
        d="M359.284 40.0001H421.229V44.3195H359.284V40.0001Z"
        fill={accentColor}
      />
      <path
        d="M359.284 49.1696H421.229V53.489H359.284V49.1696Z"
        fill={accentColor}
      />
      <path
        d="M359.284 55.1696H421.229V65.821H359.284V55.1696Z"
        fill={accentColor}
      />
      <path
        d="M359.284 68.8571H421.229V70.4813H359.284V68.8571Z"
        fill={accentColor}
      />
      <path
        d="M359.284 198.375H421.229V199.999H359.284V198.375Z"
        fill={accentColor}
      />
      <path
        d="M359.284 76.6696H421.229V80.989H359.284V76.6696Z"
        fill={accentColor}
      />
      <path
        d="M359.284 85.8438H421.229V87.9975H359.284V85.8438Z"
        fill={accentColor}
      />
      <path
        d="M359.284 90.2188H421.229V92.3725H359.284V90.2188Z"
        fill={accentColor}
      />
      <path
        d="M359.284 95.0223H421.229V99.3417H359.284V95.0223Z"
        fill={accentColor}
      />
      <path
        d="M359.284 101.54H421.229V111.156H359.284V101.54Z"
        fill={accentColor}
      />
      <path
        d="M359.284 113.277H421.229V115.595H359.284V113.277Z"
        fill={accentColor}
      />
      <path
        d="M359.284 122.522H421.229V126.842H359.284V122.522Z"
        fill={accentColor}
      />
      <path
        d="M359.284 129.188H421.229V133.507H359.284V129.188Z"
        fill={accentColor}
      />
      <path
        d="M359.284 138.683H421.229V147.369H359.284V138.683Z"
        fill={accentColor}
      />
      <path
        d="M359.284 150.031H421.229V154.351H359.284V150.031Z"
        fill={accentColor}
      />
      <path
        d="M359.284 159.214H421.229V163.534H359.284V159.214Z"
        fill={accentColor}
      />
      <path
        d="M359.284 171.509H421.229V175.828H359.284V171.509Z"
        fill={accentColor}
      />
      <path
        d="M359.284 177.549H421.229V181.869H359.284V177.549Z"
        fill={accentColor}
      />
      <path
        d="M359.284 186.719H421.229V191.038H359.284V186.719Z"
        fill={accentColor}
      />
    </svg>
  );
};

export default TicketSvg;
