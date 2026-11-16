#!/usr/bin/env bash
# Builds public/video/hero-scrub.mp4: the scroll-scrubbed copy of the hero film.
#
# Every frame is encoded as a keyframe, so the browser can seek to any frame,
# forwards or backwards, without decoding its neighbours. That is what keeps
# scrubbing smooth; a normal web encode (a keyframe every few seconds) stutters.
#
# Usage: scripts/encode-hero-scrub.sh [source.mp4]
# Needs GStreamer with the x264 and libav plugins (gst-launch-1.0).
set -euo pipefail
cd "$(dirname "$0")/.."

src="${1:-$(ls video/*.mp4 | head -n 1)}"
out="public/video/hero-scrub.mp4"

gst-launch-1.0 -q filesrc location="$src" ! qtdemux name=demux demux.video_0 \
  ! avdec_h264 ! videoconvert ! videorate ! "video/x-raw,format=I420,framerate=24/1" \
  ! x264enc key-int-max=1 pass=quant quantizer=25 speed-preset=veryslow \
  ! "video/x-h264,profile=high" ! mp4mux faststart=true ! filesink location="$out"

echo "Wrote $out ($(du -h "$out" | cut -f1))"
