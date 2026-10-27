import "server-only";
import {
  ChannelNotBroadcasting,
  GetChannelCommand,
  GetStreamCommand,
  GetStreamKeyCommand,
  IvsClient,
  ListStreamKeysCommand,
  ResourceNotFoundException,
  StopStreamCommand,
} from "@aws-sdk/client-ivs";
import { isIvsConfigured } from "@/lib/digital-stage/mode";
import { LiveVideoError, type ChannelInfo, type ChannelStreamStatus, type LiveVideoService, type StreamKeyReveal } from "./types";

/**
 * AWS IVS implementation using the official SDK. Credentials come from the
 * environment only (see .env.example). A single client is cached per server
 * instance.
 *
 * Future: recordings (RecordingConfiguration on the channel), per-entertainer
 * channels (one ChannelInfo per entertainer instead of per venue) and IVS
 * Real-Time stages all plug in behind this same interface.
 */

let cachedClient: IvsClient | null = null;

function getClient(): IvsClient {
  if (!isIvsConfigured()) {
    throw new LiveVideoError("AWS IVS is not configured on this server.", "not_configured");
  }
  if (cachedClient) return cachedClient;
  const useChain = process.env.AWS_USE_DEFAULT_CREDENTIAL_CHAIN === "true";
  cachedClient = new IvsClient({
    region: process.env.AWS_REGION,
    ...(useChain
      ? {}
      : {
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          },
        }),
  });
  return cachedClient;
}

function translate(error: unknown, what: string): never {
  if (error instanceof LiveVideoError) throw error;
  if (error instanceof ResourceNotFoundException) {
    throw new LiveVideoError(`${what}: channel not found.`, "not_found");
  }
  const name = (error as { name?: string })?.name ?? "";
  if (name === "AccessDeniedException" || name === "UnrecognizedClientException" || name === "InvalidSignatureException") {
    throw new LiveVideoError(`${what}: AWS rejected the credentials or permissions.`, "denied");
  }
  console.error(`[ivs] ${what} failed`, error);
  throw new LiveVideoError(`${what}: the video provider returned an error.`, "provider");
}

export const ivsService: LiveVideoService = {
  get configured() {
    return isIvsConfigured();
  },

  async getChannel(channelArn): Promise<ChannelInfo> {
    try {
      const { channel } = await getClient().send(new GetChannelCommand({ arn: channelArn }));
      if (!channel?.arn) throw new LiveVideoError("Channel lookup returned nothing.", "not_found");
      return {
        arn: channel.arn,
        name: channel.name ?? null,
        ingestEndpoint: channel.ingestEndpoint ?? null,
        playbackUrl: channel.playbackUrl ?? null,
        type: channel.type ?? null,
        latencyMode: channel.latencyMode ?? null,
      };
    } catch (error) {
      translate(error, "Get channel");
    }
  },

  async getStreamStatus(channelArn): Promise<ChannelStreamStatus> {
    try {
      const { stream } = await getClient().send(new GetStreamCommand({ channelArn }));
      return {
        state: stream?.state === "LIVE" ? "live" : "offline",
        health: stream?.health ?? null,
        viewerCount: typeof stream?.viewerCount === "number" ? stream.viewerCount : null,
        startedAt: stream?.startTime ? new Date(stream.startTime).toISOString() : null,
      };
    } catch (error) {
      // IVS reports "not broadcasting" as an error; for us it is simply offline.
      if (error instanceof ChannelNotBroadcasting) {
        return { state: "offline", health: null, viewerCount: null, startedAt: null };
      }
      translate(error, "Get stream status");
    }
  },

  async revealStreamKey(channelArn): Promise<StreamKeyReveal> {
    try {
      const client = getClient();
      const [{ streamKeys }, channel] = await Promise.all([
        client.send(new ListStreamKeysCommand({ channelArn })),
        this.getChannel(channelArn),
      ]);
      const summary = streamKeys?.[0];
      if (!summary?.arn) throw new LiveVideoError("This channel has no stream key. Create one in the IVS console.", "not_found");
      const { streamKey } = await client.send(new GetStreamKeyCommand({ arn: summary.arn }));
      if (!streamKey?.value) throw new LiveVideoError("Stream key value was not returned.", "provider");
      return {
        streamKey: streamKey.value,
        streamKeyArn: streamKey.arn ?? null,
        ingestEndpoint: channel.ingestEndpoint,
        rtmpsUrl: channel.ingestEndpoint ? `rtmps://${channel.ingestEndpoint}:443/app/` : null,
        simulated: false,
      };
    } catch (error) {
      translate(error, "Reveal stream key");
    }
  },

  async stopStream(channelArn): Promise<void> {
    try {
      await getClient().send(new StopStreamCommand({ channelArn }));
    } catch (error) {
      if (error instanceof ChannelNotBroadcasting) return;
      translate(error, "Stop stream");
    }
  },
};
