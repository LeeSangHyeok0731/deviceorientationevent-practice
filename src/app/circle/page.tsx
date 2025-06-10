"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";

interface DeviceOrientationEventWithPermission extends DeviceOrientationEvent {
  requestPermission?: () => Promise<"granted" | "denied">;
}

const TiltBall = () => {
  const [color, setColor] = useState<string>("hsl(0, 100%, 50%)");

  const [X, setX] = useState<number>();
  const [Y, setY] = useState<number>();

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta ?? 0;
      const gamma = event.gamma ?? 0;

      const x = Math.min(Math.max(gamma, -90), 90); // 좌우
      const y = Math.min(Math.max(beta, -90), 90);
      setX(x);
      setY(y);

      const hue = ((x + 90) / 180) * 360;
      const lightness = 50 + (y / 90) * 20;

      setColor(`hsl(${hue}, 100%, ${lightness}%)`);
    };

    const enableOrientation = async () => {
      const deviceOrientationEvent =
        DeviceOrientationEvent as unknown as DeviceOrientationEventWithPermission;

      if (
        typeof deviceOrientationEvent !== "undefined" &&
        deviceOrientationEvent.requestPermission
      ) {
        try {
          const response = await deviceOrientationEvent.requestPermission();
          if (response === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        } catch (e) {
          console.error("Permission denied:", e);
        }
      } else {
        window.addEventListener("deviceorientation", handleOrientation);
      }
    };

    enableOrientation();

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    <Container>
      <div>{X}</div>
      <div>{Y}</div>
      <Ball
        style={{
          backgroundColor: color,
        }}
      />
    </Container>
  );
};

export default TiltBall;

// ----------------- styled-components -----------------

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const Ball = styled.div`
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background-size: 400% 400%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;
