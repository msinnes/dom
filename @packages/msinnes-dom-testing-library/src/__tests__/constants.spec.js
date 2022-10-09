import {
  WINDOW_EVENTS,
  FORM_EVENTS,
  KEYBOARD_EVENTS,
  MOUSE_EVENTS,
  MEDIA_EVENTS,
} from '../constants';

describe('constants', () => {
  describe('window events', () => {
    it('should match the snapshot', () => {
      expect(WINDOW_EVENTS).toMatchSnapshot();
    });
  });

  describe('form events', () => {
    it('should match the snapshot', () => {
      expect(FORM_EVENTS).toMatchSnapshot();
    });
  });

  describe('keyboard events', () => {
    it('should match the snapshot', () => {
      expect(KEYBOARD_EVENTS).toMatchSnapshot();
    });
  });

  describe('mouse events', () => {
    it('should match the snapshot', () => {
      expect(MOUSE_EVENTS).toMatchSnapshot();
    });
  });

  describe('media events', () => {
    it('should match the snapshot', () => {
      expect(MEDIA_EVENTS).toMatchSnapshot();
    });
  });
});