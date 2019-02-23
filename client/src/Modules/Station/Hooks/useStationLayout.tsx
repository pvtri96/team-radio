import { DefaultStationLayoutProps, StationLayout } from '@Containers';
import { useToggle } from '@Hooks';
import * as React from 'react';
import { StationChatBox } from '../StationChatBox';
import { StationItem } from '../StationItem';
import { StationList } from '../StationList';
import { StationSongs } from '../StationSongs';
import { StationSongSearch } from '../StationSongSearch';
import { StationToolbar } from '../StationToolbar';

export function useStationLayout() {
  const [drawerState, drawerAction] = useToggle(false);

  const Layout = React.useMemo(() => {
    // TODO: any other layouts?
    switch (true) {
      default:
        return StationLayout.DefaultLayout;
    }
  }, []);
  const getLayoutProps = React.useCallback<(title: React.ReactNode) => DefaultStationLayoutProps>(
    title => {
      return {
        title,
        stationChatBox: <StationChatBox />,
        stationSongs: <StationSongs />,
        stationSongSearch: <StationSongSearch />,
        toolbar: <StationToolbar />,
        stations: <StationList StationItem={StationItem.VerticalStation} onItemClick={drawerAction.toggleOff} />,
        drawer: {
          open: drawerState,
          onClose: () => drawerAction.toggleOff(),
          onOpen: () => drawerAction.toggleOn(),
          toggle: () => drawerAction.toggle()
        }
      };
    },
    [drawerState]
  );

  return {
    Layout,
    getLayoutProps
  };
}
