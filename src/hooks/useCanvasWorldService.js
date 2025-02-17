import { useSelector } from 'react-redux';

import CanvasWorld from '../lib/CanvasWorld';
import { getMiradorCanvasWrapper } from '../state/selectors/wrappers';

/** */
export default function useCanvasWorldService() {
  const getMiradorCanvas = useSelector(getMiradorCanvasWrapper);
  return { get: (canvases) => canvases && new CanvasWorld(canvases.map(getMiradorCanvas)) };
}
