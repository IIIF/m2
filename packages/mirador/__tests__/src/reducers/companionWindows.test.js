import { companionWindowsReducer } from '../../../src/state/reducers/companionWindows';
import ActionTypes from '../../../src/state/actions/action-types';

describe('companionWindowsReducer', () => {
  describe('ADD_COMPANION_WINDOW', () => {
    it('adds a new companion window', () => {
      const action = {
        id: 'abc123',
        payload: { content: 'info', position: 'right' },
        type: ActionTypes.ADD_COMPANION_WINDOW,
      };
      const beforeState = {};
      const expectedState = {
        abc123: {
          content: 'info',
          position: 'right',
        },
      };
      expect(companionWindowsReducer(beforeState, action)).toEqual(expectedState);
    });
  });

  describe('ADD_WINDOW', () => {
    it('adds default companion window(s)', () => {
      const action = {
        companionWindows: [{
          content: 'info',
          id: 'banana',
          position: 'left',
        }, {
          content: 'canvas',
          id: 'Banane',
          position: 'right',
        }],
        type: ActionTypes.ADD_WINDOW,
      };
      const beforeState = {};
      const expectedState = {
        banana: {
          content: 'info',
          id: 'banana',
          position: 'left',
        },
        Banane: {
          content: 'canvas',
          id: 'Banane',
          position: 'right',
        },
      };
      expect(companionWindowsReducer(beforeState, action)).toEqual(expectedState);
    });
  });

  describe('UPDATE_COMPANION_WINDOW', () => {
    it('updates an existing companion window', () => {
      const action = {
        id: 'abc123',
        payload: { content: 'canvas', foo: 'bar' },
        type: ActionTypes.UPDATE_COMPANION_WINDOW,
      };
      const beforeState = {
        abc123: {
          content: 'info',
          position: 'right',
        },
      };
      const expectedState = {
        abc123: {
          content: 'canvas',
          foo: 'bar',
          position: 'right',
        },
      };
      expect(companionWindowsReducer(beforeState, action)).toEqual(expectedState);
    });
  });

  describe('REMOVE_COMPANION_WINDOW', () => {
    it('should remove a companion window', () => {
      const action = {
        id: 'abc123',
        type: ActionTypes.REMOVE_COMPANION_WINDOW,
      };
      const beforeState = {
        abc123: {
          content: 'info',
          position: 'right',
        },
      };
      const expectedState = {};
      expect(companionWindowsReducer(beforeState, action)).toEqual(expectedState);
    });
  });

  describe('REMOVE_WINDOW', () => {
    it('should remove a companion window', () => {
      const action = {
        type: ActionTypes.REMOVE_WINDOW,
        windowId: 'abc123',
      };
      const beforeState = {
        a: { windowId: 'abc123' },
        b: { windowId: 'abc123' },
        c: { windowId: 'other' },
      };
      const expectedState = { c: { windowId: 'other' } };
      expect(companionWindowsReducer(beforeState, action)).toEqual(expectedState);
    });
  });

  describe('TOGGLE_TOC_NODE', () => {
    const actionOpen = {
      id: 'cw123',
      payload: {
        '0-1': {
          expanded: true,
        },
      },
      type: ActionTypes.TOGGLE_TOC_NODE,
    };
    const actionClose = {
      id: 'cw123',
      payload: {
        '0-1': {
          expanded: false,
        },
      },
      type: ActionTypes.TOGGLE_TOC_NODE,
    };

    it('should add the id of a toggled node that do not exist in the state', () => {
      const emptyBeforeState = {
        cw123: {},
        cw456: {},
      };
      const expectedStateFromEmpty = {
        cw123: {
          tocNodes: {
            '0-1': { expanded: true },
          },
        },
        cw456: {},
      };
      expect(companionWindowsReducer(emptyBeforeState, actionOpen)).toEqual(expectedStateFromEmpty);

      const beforeState = {
        cw123: {
          tocNodes: {
            '0-0': { expanded: true },
            '0-2-0': { expanded: true },
          },
        },
        cw456: {},
      };
      const expectedStateAfterFilled = {
        cw123: {
          tocNodes: {
            '0-0': { expanded: true },
            '0-1': { expanded: true },
            '0-2-0': { expanded: true },
          },
        },
        cw456: {},
      };
      expect(companionWindowsReducer(beforeState, actionOpen)).toEqual(expectedStateAfterFilled);
    });

    it('should update expanded value for existing nodeIds in the state', () => {
      const stateWithTrue = {
        cw123: {
          tocNodes: {
            '0-0': { expanded: true },
            '0-1': { expanded: true },
            '0-2-0': { expanded: true },
          },
        },
        cw456: {},
      };

      const stateWithFalse = {
        cw123: {
          tocNodes: {
            '0-0': { expanded: true },
            '0-1': { expanded: false },
            '0-2-0': { expanded: true },
          },
        },
        cw456: {},
      };

      expect(companionWindowsReducer(stateWithTrue, actionOpen)).toEqual(stateWithTrue);
      expect(companionWindowsReducer(stateWithFalse, actionOpen)).toEqual(stateWithTrue);
      expect(companionWindowsReducer(stateWithTrue, actionClose)).toEqual(stateWithFalse);
      expect(companionWindowsReducer(stateWithFalse, actionClose)).toEqual(stateWithFalse);
    });
  });

  it('should handle IMPORT_MIRADOR_STATE', () => {
    expect(companionWindowsReducer({}, {
      state: { companionWindows: { new: 'stuff' } },
      type: ActionTypes.IMPORT_MIRADOR_STATE,
    })).toEqual({ new: 'stuff' });
  });
});
