import "server-only";
import type { ChannelInfo, ChannelStreamStatus, LiveVideoService, StreamKeyReveal } from "./types";

/**
 * Demo-mode stand-in. Returns clearly labelled placeholders and never opens a
 * network connection. The "stream status" mirrors whatever the demo stage
 * says, so the dashboard and viewer agree with each other.
 */
export function createSimulatedIvsService(isStageLive: () => boolean): LiveVideoService {
  return {
    configured: false,

    async getChannel(channelArn): Promise<ChannelInfo> {
      return {
        arn: channelArn,
        name: "Simulated channel",
        ingestEndpoint: null,
        playbackUrl: null,
        type: "SIMULATED",
        latencyMode: null,
      };
    },

    async getStreamStatus(): Promise<ChannelStreamStatus> {
      const live = isStageLive();
      return {
        state: live ? "live" : "offline",
        health: live ? "SIMULATED" : null,
        viewerCount: null,
        startedAt: null,
      };
    },

    async revealStreamKey(): Promise<StreamKeyReveal> {
      return {
        streamKey: "DEMO-MODE-NO-REAL-STREAM-KEY",
        streamKeyArn: null,
        ingestEndpoint: null,
        rtmpsUrl: null,
        simulated: true,
      };
    },

    async stopStream(): Promise<void> {
      /* nothing to stop */
    },
  };
}
