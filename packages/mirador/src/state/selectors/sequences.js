import { createSelector } from 'reselect';
import { TreeNode } from 'manifesto.js';
import {
  getManifestoInstance,
} from './manifests';
import { getWindow } from './getters';

/**
 * Returns the sequences for a given windowId
 * @param {object} state
 * @param {object} props
 * @param {string} props.windowId
 * @returns {Array}
 */
export const getSequences = createSelector(
  [getManifestoInstance],
  (manifest) => {
    if (!manifest || !manifest.getTopRanges) return null;

    const topRangesOrRoot = manifest.getTopRanges();
    const v2TopRanges = topRangesOrRoot.filter(r => r.getProperty('viewingHint') === 'top');
    let v3RangeSequences = [];

    if (v2TopRanges.length === 0 && topRangesOrRoot.length === 1) {
      v3RangeSequences = topRangesOrRoot[0].getRanges().filter(r => r.getBehavior() === 'sequence');
    }

    const sequences = [].concat(
      // v2: multi-sequence manifests, or v3: items
      manifest.getSequences(),
      // v3: all top-level ranges with behavior=sequence
      v3RangeSequences,
    );

    return sequences;
  },
);

/**
 * Returns the sequence for a given windowId
 * @param {object} state
 * @param {object} props
 * @param {string} props.windowId
 * @returns {Array}
 */
export const getSequence = createSelector(
  [
    getSequences,
    getWindow,
    (state, { sequenceId }) => sequenceId,
  ],
  (sequences, window, sequenceId) => {
    if (!sequences) return null;

    if (sequenceId || (window && window.sequenceId)) {
      const currentSequence = sequences.find(s => s.id === (sequenceId || window.sequenceId));

      if (currentSequence) return currentSequence;
    }

    return sequences[0];
  },
);

/**
 * Return the canvas index for a certain window.
 * @param {Object} state
 * @param {string} windowId
 * @returns {number}
 */
export const getCanvasIndex = createSelector(
  [
    getWindow,
    getSequence,
  ],
  (window, sequence) => (
    (sequence && window && window.canvasId
      && sequence.getCanvasById(window.canvasId))
    || {}).index || 0,
);

/**
 * Returns the viewing hint for the first sequence in the manifest or the manifest.
 * @param {object} state
 * @param {object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @returns {number}
 */
export const getSequenceViewingHint = createSelector(
  [getSequence, getManifestoInstance],
  (sequence, manifest) => {
    if (!manifest) return null;
    const viewingHint = (sequence && sequence.getViewingHint())
      || manifest.getViewingHint();
    if (viewingHint) return viewingHint;
    return null;
  },
);

/**
 * @param {object} state
 * @param {string} windowId
 * @return {string|null}
 */
export const getSequenceViewingDirection = createSelector(
  [getWindow, getSequence, getManifestoInstance],
  (window, sequence, manifest) => {
    const viewingDirection = (window && window.viewingDirection)
      || (sequence && sequence.getViewingDirection())
      || (manifest && manifest.getViewingDirection());
    if (viewingDirection) return viewingDirection;
    return null;
  },
);

/**
 * Returns the behaviors viewing hint for the manifest
 * @param {Object} state
 * @param {Object} props
 * @param {string} props.manifestId
 * @param {string} props.windowId
 * @return {number}
 */
export const getSequenceBehaviors = createSelector(
  [getSequence, getManifestoInstance],
  (sequence, manifest) => {
    if (!manifest || !sequence) return [];
    const sequenceBehaviors = sequence && sequence.getProperty('behavior');

    if (sequenceBehaviors) {
      if (Array.isArray(sequenceBehaviors)) return sequenceBehaviors;
      return [sequenceBehaviors];
    }

    const behaviors = manifest.getProperty('behavior');

    if (!behaviors) return [];
    if (Array.isArray(behaviors)) return behaviors;
    return [behaviors];
  },
);

/**
 * Retruns a sequence tree structure.
 * @param {object} state
 * @param {object} props
 * @param {string} props.windowId
 * @returns {object}
 */
export const getSequenceTreeStructure = createSelector(
  [getSequence, getManifestoInstance],
  (sequence, manifest) => {
    if (sequence && sequence.getProperty('type') && sequence.isRange()) return sequence.getTree(new TreeNode('root'));

    return manifest && manifest.getDefaultTree();
  },
);
