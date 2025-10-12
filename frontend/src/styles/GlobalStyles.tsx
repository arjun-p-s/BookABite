/** @jsxImportSource @emotion/react */
import { css, Global, keyframes } from "@emotion/react";
import React from "react";

const float = keyframes`
  0%, 100% { transform: translateY(0px) translateX(0px); }
  50% { transform: translateY(-30px) translateX(30px); }
`;

const GlobalStyles: React.FC = () => (
  <Global
    styles={css`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          'Helvetica Neue', Arial, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        position: relative;
        overflow: hidden;
      }

      body::before {
        content: '';
        position: absolute;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
        border-radius: 50%;
        top: -150px;
        right: -150px;
        animation: ${float} 8s ease-in-out infinite;
      }

      body::after {
        content: '';
        position: absolute;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
        border-radius: 50%;
        bottom: -100px;
        left: -100px;
        animation: ${float} 10s ease-in-out infinite reverse;
      }
    `}
  />
);

export default GlobalStyles;
