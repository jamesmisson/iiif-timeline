import React from "react";

interface IconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  fill?: string;
  style?: React.CSSProperties;
}

export const Folder: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  fill = "currentColor",
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    fill="none"
  >
    <g fill={fill}>
      <path
        d="M12.9,10.4l1.5,1.5H21v7.6H9v-9.2H12.9 M13.3,9.4h-0.4H9H8v1v9.2v1h1h12h1v-1v-7.6v-1h-1h-6.2
l-1.2-1.2L13.3,9.4L13.3,9.4z"
      />
      <path d="M21.5,20.1h-13V9.9h4.6l1.5,1.5h6.9V20.1z M9.5,19.1h11v-6.6h-6.3l-1.5-1.5H9.5V19.1z" />
    </g>
  </svg>
);

export const Settings: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  fill = "currentColor",
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    fill="none"
  >
    <path
      d="M20.5,13.5c-0.1-0.5-0.3-1-0.6-1.4l1.1-1.6C20.5,10,20,9.4,19.4,8.9L17.9,10
	c-0.4-0.3-0.9-0.4-1.4-0.6l-0.3-1.9c-0.8,0-1.6,0-2.4,0l-0.3,2c-0.5,0.1-1,0.3-1.4,0.6l-1.6-1.1C9.9,9.5,9.4,10,8.8,10.6l1.2,1.6
	c-0.3,0.4-0.4,0.9-0.6,1.4l-1.9,0.3c0,0.8,0,1.6,0,2.4l2,0.3c0.1,0.5,0.3,1,0.6,1.4l-1.2,1.6c0.6,0.6,1.1,1.1,1.7,1.7l1.6-1.2
	c0.4,0.2,0.9,0.4,1.4,0.5l0.3,1.9c0.8,0,1.6,0,2.4,0l0.3-2c0.5-0.1,0.9-0.3,1.4-0.6l1.6,1.2c0.6-0.6,1.1-1.1,1.7-1.7L20,17.8
	c0.2-0.4,0.4-0.9,0.5-1.4l1.9-0.3c0-0.8,0-1.6,0-2.4L20.5,13.5z M15,17.6c-3.3,0-3.3-5.2,0-5.2S18.3,17.6,15,17.6z"
      fill={fill}
    />
  </svg>
);

export const Share: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  fill = "currentColor",
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    fill="none"
  >
    <path
      d="M19.3,16.5c-0.8,0-1.4,0.3-1.9,0.8l-3.9-1.9c0-0.2,0.1-0.4,0.1-0.6c0,0,0-0.1,0-0.1l3.8-1.9
	c0.5,0.5,1.2,0.8,1.9,0.8c1.5,0,2.8-1.2,2.8-2.8C22,9.2,20.8,8,19.3,8s-2.8,1.2-2.8,2.8c0,0,0,0.1,0,0.1l-3.8,1.9
	c-0.5-0.5-1.2-0.8-1.9-0.8C9.2,12,8,13.2,8,14.8c0,1.5,1.2,2.8,2.8,2.8c0.6,0,1.1-0.2,1.6-0.5l4.2,2.1c0,0,0,0.1,0,0.1
	c0,1.5,1.2,2.8,2.8,2.8s2.8-1.2,2.8-2.8C22,17.7,20.8,16.5,19.3,16.5z"
      fill={fill}
    />
  </svg>
);

export const Previous: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  fill = "currentColor",
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    fill="none"
  >
    <g fill={fill}>
      <rect
        x="7.2"
        y="15"
        transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 12.7188 41.7206)"
        width="15.6"
        height="6.5"
      />

      <rect
        x="7.2"
        y="8.5"
        transform="matrix(0.7071 -0.7071 0.7071 0.7071 -3.932 14.0551)"
        width="15.6"
        height="6.5"
      />
    </g>
  </svg>
);

export const Next: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  fill = "currentColor",
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    fill="none"
  >
    <g fill={fill}>
      <rect
        x="7.2"
        y="15"
        transform="matrix(0.7071 -0.7071 0.7071 0.7071 -8.4945 15.9449)"
        width="15.6"
        height="6.5"
      />

      <rect
        x="7.2"
        y="8.5"
        transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 17.2813 30.7058)"
        width="15.6"
        height="6.5"
      />
    </g>
  </svg>
);

export const Fit: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  fill = "currentColor",
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    fill="none"
  >
    <g fill={fill}>
      <polygon
        points="8,8 8,9.1 8,12.8 8,13 8,17 8,19.2 8,22 10.1,22 13,22 13,20 10,20 10,17 10,13
10,12.8 10,10 13,10 13,8 10.8,8 "
      />
      <polygon
        points="20.9,8 17,8 17,10 20,10 20,12.9 20,13 20,17 20,17.1 20,20 17,20 17,22 20.2,22 22,22
22,19.9 22,17.1 22,17 22,13 22,12.9 22,9.8 22,8 "
      />
    </g>
  </svg>
);


export const ZoomIn: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  fill = "currentColor",
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    fill="none"
  >
    <polygon fill={fill} points="22,14 16,14 16,8 14,8 14,14 8,14 8,16 14,16 14,22 16,22 16,16 22,16 " />
  </svg>
);


export const ZoomOut: React.FC<IconProps> = ({
  className = "",
  width = 30,
  height = 30,
  fill = "currentColor",
  style = {},
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    fill="none"
  >
    <rect fill={fill} x="8" y="14" width="14" height="2" />
  </svg>
);