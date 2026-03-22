import {
  isMainMenuDebugWarpEnabled,
  KOTOR_MAIN_MENU_DEBUG_WARP_OPTIONS,
} from "./mainMenuDebugWarp";

describe('mainMenuDebugWarp', () => {
  it('enables debug warp automatically for localhost development builds', () => {
    expect(isMainMenuDebugWarpEnabled('', 'localhost')).toBe(true);
    expect(isMainMenuDebugWarpEnabled('', '127.0.0.1')).toBe(true);
  });

  it('enables debug warp through explicit query parameters', () => {
    expect(isMainMenuDebugWarpEnabled('?debugWarp=1', 'example.com')).toBe(true);
    expect(isMainMenuDebugWarpEnabled('?debug=true', 'example.com')).toBe(true);
    expect(isMainMenuDebugWarpEnabled('?debug=mainmenu', 'example.com')).toBe(true);
  });

  it('keeps the Dantooine debug destination stable', () => {
    expect(KOTOR_MAIN_MENU_DEBUG_WARP_OPTIONS).toEqual([
      expect.objectContaining({
        id: 'dantooine',
        module: 'danm14aa',
      }),
    ]);
  });
});
