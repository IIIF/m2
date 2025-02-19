import * as actions from '../../../src/state/actions';
import ActionTypes from '../../../src/state/actions/action-types';

describe('search actions', () => {
  describe('requestSearch', () => {
    it('requests an search from given a url', () => {
      const query = 'search terms';
      const windowId = 'foo';
      const companionWindowId = 'abc123';
      const searchId = 'search?page=1';
      const expectedAction = {
        companionWindowId,
        query,
        searchId,
        type: ActionTypes.REQUEST_SEARCH,
        windowId,
      };
      expect(
        actions.requestSearch(windowId, companionWindowId, searchId, query),
      ).toEqual(expectedAction);
    });
  });
  describe('receiveSearch', () => {
    it('recieves an search', () => {
      const windowId = 'foo';
      const companionWindowId = 'abc123';
      const searchId = 'search?page=1';
      const json = {
        companionWindowId,
        content: 'search request',
      };
      const expectedAction = {
        companionWindowId,
        searchId,
        searchJson: json,
        type: ActionTypes.RECEIVE_SEARCH,
        windowId,
      };
      expect(
        actions.receiveSearch(windowId, companionWindowId, searchId, json),
      ).toEqual(expectedAction);
    });

    it('provides the first annotation id and its canvas', () => {
      const windowId = 'foo';
      const companionWindowId = 'abc123';
      const searchId = 'search?page=1';
      const json = {
        resources: [
          {
            '@id': 'abc123',
            on: 'http://iiif.io/api/presentation/2.0/example/fixtures/canvas/15/c2.json#0,2,4,5',
          },
        ],
      };
      expect(
        actions.receiveSearch(windowId, companionWindowId, searchId, json),
      ).toEqual({
        companionWindowId,
        searchId,
        searchJson: json,
        type: ActionTypes.RECEIVE_SEARCH,
        windowId,
      });
    });
  });

  describe('removeSearch', () => {
    it('sends the remove search action', () => {
      const windowId = 'foo';
      const companionWindowId = 'abc123';
      const expectedAction = {
        companionWindowId,
        type: ActionTypes.REMOVE_SEARCH,
        windowId,
      };
      expect(actions.removeSearch(windowId, companionWindowId)).toEqual(expectedAction);
    });
  });

  describe('fetchSearch', () => {
    describe('success response', () => {
      it('dispatches the REQUEST_SEARCH action', () => {
        const actual = actions.fetchSearch(
          'windowId',
          'companionWindowId',
          'searchId',
          'search terms',
        );
        expect(actual).toEqual({
          companionWindowId: 'companionWindowId',
          query: 'search terms',
          searchId: 'searchId',
          type: 'mirador/REQUEST_SEARCH',
          windowId: 'windowId',
        });
      });
    });
  });
  describe('setContentSearchCurrentAnnotation', () => {
    it('dispatches the SET_CONTENT_SEARCH_CURRENT_ANNOTATIONS action', () => {
      const windowId = 'foo';
      const companionWindowId = 'cwid';
      const annotationIds = ['abc123'];
      expect(
        actions.setContentSearchCurrentAnnotation(windowId, companionWindowId, annotationIds),
      ).toEqual({
        annotationIds,
        companionWindowId,
        type: ActionTypes.SET_CONTENT_SEARCH_CURRENT_ANNOTATIONS,
        windowId,
      });
    });
  });
});
