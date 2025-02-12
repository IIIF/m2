import { useSelector } from 'react-redux';

import { getThumbnailFactory } from '../state/selectors/thumbnails';

/** */
export default function useThumbnailService(maxHeight, maxWidth) {
  return useSelector((state) => getThumbnailFactory(state, maxHeight, maxWidth), [maxHeight, maxWidth]);
}
