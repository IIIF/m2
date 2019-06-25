import { createSelector } from 'reselect';
import { LanguageMap } from 'manifesto.js';
import flatten from 'lodash/flatten';
import Annotation from '../../lib/Annotation';
import { getCanvases } from './canvases';
import { getWindow } from './windows';
import { getManifestLocale } from './manifests';

const getSearchForWindow = createSelector(
  [
    (state, { windowId }) => windowId,
    state => state.searches,
  ],
  (windowId, searches) => {
    if (!windowId || !searches) return {};

    return searches[windowId];
  },
);

const getSearchForCompanionWindow = createSelector(
  [
    getSearchForWindow,
    (state, { companionWindowId }) => companionWindowId,
  ],
  (results, companionWindowId) => {
    if (!results || !companionWindowId) return undefined;
    return results[companionWindowId];
  },
);

const getSearchResponsesForCompanionWindow = createSelector(
  [
    getSearchForCompanionWindow,
  ],
  (results) => {
    if (!results) return [];
    return Object.values(results.data);
  },
);

export const getSearchQuery = createSelector(
  [
    getSearchForCompanionWindow,
  ],
  results => results && results.query,
);

export const getSearchIsFetching = createSelector(
  [
    getSearchResponsesForCompanionWindow,
  ],
  results => results.some(result => result.isFetching),
);

export const getNextSearchId = createSelector(
  [
    getSearchForCompanionWindow,
  ],
  (results) => {
    if (!results || !results.data) return undefined;

    const resultWithAnUnresolvedNext = Object.values(results.data).find(result => (
      !result.isFetching
        && result.json
        && result.json.next
        && !results.data[result.json.next]
    ));

    return resultWithAnUnresolvedNext
      && resultWithAnUnresolvedNext.json
      && resultWithAnUnresolvedNext.json.next;
  },
);

const getSearchHitsForCompanionWindow = createSelector(
  [
    getSearchResponsesForCompanionWindow,
  ],
  results => flatten(results.map((result) => {
    if (!result || !result.json || result.isFetching || !result.json.hits) return [];

    return result.json.hits;
  })),
);

export const getSortedSearchHitsForCompanionWindow = createSelector(
  [
    getSearchHitsForCompanionWindow,
    getCanvases,
    (state, { companionWindowId, windowId }) => annotationUri => getResourceAnnotationForSearchHit(
      state, { annotationUri, companionWindowId, windowId },
    ),
  ],
  (searchHits, canvases, annotationForSearchHit) => {
    if (!canvases || canvases.length === 0) return [];
    if (!searchHits || searchHits.length === 0) return [];
    const canvasIds = canvases.map(canvas => canvas.id);

    return [].concat(searchHits).sort((a, b) => {
      const hitA = annotationForSearchHit(a.annotations[0]);
      const hitB = annotationForSearchHit(b.annotations[0]);
      return canvasIds.indexOf(hitA.targetId) - canvasIds.indexOf(hitB.targetId);
    });
  },
);

/** convert search results to an annotation */
const searchResultsToAnnotation = (results) => {
  const annotations = results.map((result) => {
    if (!result || !result.json || result.isFetching || !result.json.resources) return undefined;
    const anno = new Annotation(result.json);
    return {
      id: anno.id,
      resources: anno.resources,
    };
  }).filter(a => a);

  return {
    id: (annotations.find(a => a.id) || {}).id,
    resources: flatten(annotations.map(a => a.resources)),
  };
};

const getSearchAnnotationsForCompanionWindow = createSelector(
  [
    getSearchResponsesForCompanionWindow,
  ],
  results => results && searchResultsToAnnotation(results),
);

export const getSortedSearchAnnotationsForCompanionWindow = createSelector(
  [
    getSearchAnnotationsForCompanionWindow,
    getCanvases,
  ],
  (searchAnnotations, canvases) => {
    if (!searchAnnotations
        || !searchAnnotations.resources
        || searchAnnotations.length === 0) return [];
    if (!canvases || canvases.length === 0) return [];
    const canvasIds = canvases.map(canvas => canvas.id);

    return [].concat(searchAnnotations.resources).sort(
      (annoA, annoB) => canvasIds.indexOf(annoA.targetId) - canvasIds.indexOf(annoB.targetId),
    );
  },
);

export const getSearchAnnotationsForWindow = createSelector(
  [
    getSearchForWindow,
  ],
  (results) => {
    if (!results) return [];
    const data = Object.values(results).map(r => Object.values(r.data));

    return data.map(d => searchResultsToAnnotation(d)).filter(a => a.resources.length > 0);
  },
);

export const getSelectedContentSearchAnnotationIds = createSelector(
  [
    getWindow,
    getSearchForCompanionWindow,
  ],
  (window, search) => (search && search.selectedContentSearchAnnotation)
    || (window && window.selectedContentSearchAnnotation)
    || [],
);

export const getSelectedContentSearchAnnotations = createSelector(
  [
    getSearchAnnotationsForWindow,
    getSelectedContentSearchAnnotationIds,
  ],
  (searchAnnotations, selectedAnnotationIds) => searchAnnotations.map(annotation => ({
    id: (annotation['@id'] || annotation.id),
    resources: annotation.resources.filter(
      r => selectedAnnotationIds && selectedAnnotationIds.includes(r.id),
    ),
  })).filter(val => val.resources.length > 0),
);

export const getResourceAnnotationForSearchHit = createSelector(
  [
    getSearchAnnotationsForCompanionWindow,
    (state, { annotationUri }) => annotationUri,
  ],
  (annotation, annotationUri) => annotation.resources.find(
    r => r.id === annotationUri,
  ),
);

export const getResourceAnnotationLabel = createSelector(
  [
    getResourceAnnotationForSearchHit,
    getManifestLocale,
  ],
  (resourceAnnotation, locale) => {
    if (
      !(resourceAnnotation && resourceAnnotation.resource && resourceAnnotation.resource.label)
    ) return [];

    return LanguageMap.parse(resourceAnnotation.resource.label, locale).map(label => label.value);
  },
);
