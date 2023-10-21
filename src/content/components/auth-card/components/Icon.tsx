import { SvgIcon } from "@mui/material";
import React from "react";

const Icon = ({ size }: { size: number }) => {
  return (
    <SvgIcon sx={{ fontSize: size }}>
      <svg
        width="63"
        height="67"
        viewBox="0 0 63 67"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask id="mask0_3_118" maskUnits="userSpaceOnUse" x="0" y="7" width="63" height="60">
          <path d="M0 7.26917H62.92V66.7572H0V7.26917Z" fill="white" />
        </mask>
        <g mask="url(#mask0_3_118)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.49557 8.01991H35.2674L12.8044 36.9506C11.8213 38.2108 11.6604 39.8166 12.3695 41.2466C13.0785 42.6795 14.4489 43.5286 16.0577 43.5286H23.163L19.877 55.4214H8.18972L0.178741 66.2418C0.178741 49.2605 0.178741 32.2793 0.178741 15.301C0.178741 11.297 3.46774 8.01991 7.49557 8.01991ZM48.0093 8.01991H55.5346C59.5565 8.01991 62.8515 11.3 62.8515 15.301V48.1404C62.8515 52.1414 59.5565 55.4214 55.5346 55.4214H34.5404L50.2794 34.1681C51.2268 32.893 51.3549 31.314 50.6399 29.9019C49.9219 28.4927 48.5634 27.6586 46.9725 27.6586H40.4511L48.0093 8.01991Z"
            fill="#1C1D33"
          />
        </g>
        <mask id="mask1_3_118" maskUnits="userSpaceOnUse" x="15" y="0" width="33" height="67">
          <path d="M15.8075 0H47.0768V66.924H15.8075V0Z" fill="white" />
        </mask>
        <g mask="url(#mask1_3_118)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.0577 39.4472H28.5523L20.9763 66.8436L46.9725 31.743H34.4749L46.7104 -0.0268097L16.0577 39.4472Z"
            fill="#5271FF"
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default Icon;
