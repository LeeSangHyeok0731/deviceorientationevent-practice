"use client";

import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

interface DeviceOrientationEventWithPermission extends DeviceOrientationEvent {
  requestPermission?: () => Promise<"granted" | "denied">;
}

const TiltBall = () => {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [X, setX] = useState<number>();
  const [Y, setY] = useState<number>();

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta ?? 0;
      const gamma = event.gamma ?? 0;

      const x = Math.max(-90, Math.min(90, gamma));
      const y = Math.max(-90, Math.min(90, beta));
      setX(x);
      setY(y);

      setPosition({ x, y });
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
        // Android, Desktop 등
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
          transform: `translate(${position.x * 2}px, ${position.y * 2}px)`,
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

const rainbow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Ball = styled.div`
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(
    45deg,
    red,
    orange,
    yellow,
    green,
    blue,
    indigo,
    violet
  );
  background-size: 400% 400%;
  animation: ${rainbow} 5s linear infinite;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;
