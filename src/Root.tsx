import React from "react";
import { Composition, Still } from "remotion";
import { Pipeline, PipelineEnd, PipelineMain, PL_FPS, PL_FRAMES } from "./Pipeline";

export const Root: React.FC = () => (
  <>
    <Composition id="Pipeline" component={Pipeline} durationInFrames={PL_FRAMES} fps={PL_FPS} width={1080} height={1350} />
    <Still id="PipelineMain" component={PipelineMain} width={1080} height={1350} />
    <Still id="PipelineEnd" component={PipelineEnd} width={1080} height={1350} />
  </>
);
