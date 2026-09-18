import { Config } from '@remotion/cli/config';

/**
 * MAZI — render config.
 *
 * The film leans on SVG filters, blend modes and layered blurs. Those are all
 * GPU-accelerated in Chrome when ANGLE is available, and painfully slow when
 * it isn't — hence the explicit GL renderer.
 */
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('angle');
Config.setConcurrency(2);
// Quality: the film is mostly dark gradients, which are the first thing to
// band under aggressive compression.
Config.setCrf(16);
