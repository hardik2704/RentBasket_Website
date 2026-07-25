import { useEffect, useRef, useState } from "react";

// Safari cannot decode VP9-with-alpha WebM, so a transparent hero video renders
// as an opaque black box there. Everywhere else the WebM plays natively in a
// plain <video> with no JS involved.
//
// For Safari only, fall back to a "packed" H.264 MP4 that stacks the colour
// frame on top of a white-on-black alpha matte (so it is 2x the source height),
// and recombine the halves into a real alpha channel on a <canvas> at runtime.
// The packed file is ~2.4x the size of the WebM, so it is never fetched on
// browsers that don't need it.
const isSafari = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const webkitNotChrome = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
  // iPadOS 13+ reports a desktop UA, so sniff for a touch-capable "Mac".
  const iPadOS = /Mac/.test(ua) && navigator.maxTouchPoints > 1;
  return webkitNotChrome || iPadOS;
};

const VERTEX_SHADER = `
  attribute vec2 a_pos;
  varying vec2 v_uv;
  void main() {
    v_uv = vec2((a_pos.x + 1.0) * 0.5, (1.0 - a_pos.y) * 0.5);
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`;

// Top half of the packed frame is colour, bottom half is the matte; the matte's
// luminance becomes the alpha channel.
const FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 v_uv;
  uniform sampler2D u_tex;
  void main() {
    vec3 color = texture2D(u_tex, vec2(v_uv.x, v_uv.y * 0.5)).rgb;
    float alpha = texture2D(u_tex, vec2(v_uv.x, v_uv.y * 0.5 + 0.5)).r;
    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

const compile = (gl, type, src) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
};

// Builds the video + canvas imperatively and drives the GL loop. Kept outside
// React's render path on purpose: React re-rendering or swapping the canvas
// node underneath a live WebGL context leaves it drawing into a detached
// buffer, which produces a silently blank canvas.
const mountPlayer = (host, packedSrc, ariaLabel, onFail) => {
  const video = document.createElement("video");
  video.src = packedSrc;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.autoplay = true;
  video.preload = "auto";
  video.setAttribute("aria-hidden", "true");
  video.style.cssText =
    "position:absolute;top:0;left:0;width:100%;height:auto;opacity:0;pointer-events:none;";
  host.appendChild(video);

  const canvas = document.createElement("canvas");
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", ariaLabel ?? "");
  canvas.style.cssText = "display:block;width:100%;height:auto;";
  host.appendChild(canvas);

  let frame = null;
  let disposed = false;
  let gl = null;

  const start = () => {
    if (disposed || !video.videoWidth) return;

    // WebKit reports videoWidth/videoHeight scaled to the element's layout box
    // rather than the intrinsic size, so those values can't be trusted to size
    // the canvas. The shader samples in normalised UVs and the matte is always
    // exactly the bottom half, so the canvas only needs the right aspect ratio:
    // derive it from the packed frame's own ratio at a fixed width.
    const aspect = video.videoWidth / (video.videoHeight / 2);
    canvas.width = 1920;
    canvas.height = Math.round(1920 / aspect);

    gl = canvas.getContext("webgl", {
      premultipliedAlpha: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    if (!gl) return onFail();

    const program = gl.createProgram();
    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return onFail();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return onFail();
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // The shader premultiplies itself; don't let the upload do it again.
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.viewport(0, 0, canvas.width, canvas.height);

    const render = () => {
      if (disposed) return;
      if (video.readyState >= 2) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      frame = requestAnimationFrame(render);
    };
    render();
  };

  const onLoaded = () => start();
  if (video.readyState >= 2 && video.videoWidth) {
    start();
  } else {
    video.addEventListener("loadeddata", onLoaded, { once: true });
  }
  video.play().catch(() => {});

  return () => {
    disposed = true;
    if (frame) cancelAnimationFrame(frame);
    video.removeEventListener("loadeddata", onLoaded);
    video.pause();
    video.remove();
    canvas.remove();
  };
};

const AlphaVideo = ({ webmSrc, packedSrc, className, ariaLabel }) => {
  const [useCanvas, setUseCanvas] = useState(false);
  const [failed, setFailed] = useState(false);
  const hostRef = useRef(null);

  useEffect(() => {
    setUseCanvas(isSafari());
  }, []);

  useEffect(() => {
    if (!useCanvas || failed) return;
    const host = hostRef.current;
    if (!host) return;
    return mountPlayer(host, packedSrc, ariaLabel, () => setFailed(true));
  }, [useCanvas, failed, packedSrc, ariaLabel]);

  // Non-Safari, or WebGL unavailable: native transparent WebM, no JS in the
  // render path. `failed` lands here too — an opaque mascot beats an empty hero.
  if (!useCanvas || failed) {
    return (
      <video
        src={webmSrc}
        className={className}
        autoPlay
        loop
        muted
        playsInline
        aria-label={ariaLabel}
      />
    );
  }

  return <div ref={hostRef} className={`relative ${className ?? ""}`} />;
};

export default AlphaVideo;
