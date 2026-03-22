export interface MainMenuDebugWarpOption {
  id: string;
  label: string;
  module: string;
  waypoint?: string | null;
}

export const KOTOR_MAIN_MENU_DEBUG_WARP_OPTIONS: MainMenuDebugWarpOption[] = [
  {
    id: 'dantooine',
    label: 'Dantooine Jedi Enclave (danm14aa)',
    module: 'danm14aa',
    waypoint: null,
  },
];

export function isMainMenuDebugWarpEnabled(
  locationSearch = '',
  hostname = '',
): boolean {
  const normalizedHostname = hostname.toLowerCase();
  if (
    normalizedHostname === 'localhost' ||
    normalizedHostname === '127.0.0.1' ||
    normalizedHostname === '::1'
  ) {
    return true;
  }

  const query = new URLSearchParams(locationSearch);
  const debugWarp = (query.get('debugWarp') ?? query.get('debug') ?? '').toLowerCase();
  return ['1', 'true', 'mainmenu', 'menuwarp'].includes(debugWarp);
}
