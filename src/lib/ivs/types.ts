/** Provider-neutral shape of what the app needs from a live video channel. */

export interface ChannelInfo {
  arn: string;
  name: string | null;
  /** RTMPS/WebRTC ingest host, e.g. abc123.global-contribute.live-video.net */
  ingestEndpoint: string | null;
  playbackUrl: string | null;
  type: string | null;
  latencyMode: string | null;
}

export interface ChannelStreamStatus {
  state: "live" | "offline";
  health: string | null;
  viewerCount: number | null;
  startedAt: string | null;
}

export interface StreamKeyReveal {
  streamKey: string;
  streamKeyArn: string | null;
  ingestEndpoint: string | null;
  /** Full RTMPS URL for OBS-style encoders. */
  rtmpsUrl: string | null;
  /** True when the values are placeholders (demo mode). */
  simulated: boolean;
}

/**
 * Live video provider boundary. Implemented by `ivsService` (AWS IVS via the
 * official SDK) and `simulatedIvsService` (demo mode). Every method is
 * server-side only; the browser never holds AWS credentials.
 */
export interface LiveVideoService {
  readonly configured: boolean;
  getChannel(channelArn: string): Promise<ChannelInfo>;
  getStreamStatus(channelArn: string): Promise<ChannelStreamStatus>;
  revealStreamKey(channelArn: string): Promise<StreamKeyReveal>;
  stopStream(channelArn: string): Promise<void>;
}

export class LiveVideoError extends Error {
  constructor(
    message: string,
    public readonly code: "not_configured" | "not_found" | "provider" | "denied" = "provider",
  ) {
    super(message);
    this.name = "LiveVideoError";
  }
}
