import CanvasWorld from '../../src/lib/CanvasWorld';
import MiradorCanvas from '../../src/lib/MiradorCanvas';

/** wrap a manifesto canvas as mirador canvas  */
export const wrapCanvas = (c) => new MiradorCanvas(c);

/** CanvasWorld factory function provided by container */
export const getCanvasWorld = (canvases) => new CanvasWorld(canvases.map(wrapCanvas));
