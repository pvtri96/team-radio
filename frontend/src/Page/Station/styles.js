export default ({ breakpoints, palette, spacing }) => ({
  containerWrapper: {
    width: '100%',
    margin: 0,
    paddingBottom: 50, // Footer height
  },
  container: {
    margin: 'auto',
    [breakpoints.up('lg')]: {
      minWidth: 1024,
      maxWidth: 1280,
    },
  },
  switcherContainer: {
    margin: 'auto',
    padding: '0 !important',
    marginTop: 56,
    background: palette.lightGrey['500'],
    marginBottom: 20,
  },
  switcherContent: {
    width: '100%',
    margin: 'auto',
    [breakpoints.up('lg')]: {
      minWidth: 1024,
      maxWidth: 1280,
    },
  },
  content: {
    height: 300,
    [breakpoints.up('md')]: {
      height: 600,
    },
  },
  nowPlayingHeader: {
    display: 'flex',
  },
  nowPlayingActions: {
    display: 'flex',
    marginLeft: spacing.baseMargin,
    flexDirection: 'row',
  },
  nowPlaying: {},
  playlistHeader: {
    padding: spacing.baseMargin,
  },
  playlistMenuItem: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  emptyNowPlayingImage: {
    width: '100%',
  },
  emptyNowPlaying: {
    height: 0,
  },
  emptyPlaylist: {
    height: 0,
  },
  switchedTitle: {
    color: palette.primary['500'],
  },
  tabLabel: {
    fontSize: '1.425rem',
    fontFamily: 'Lato',
    // fontWeight: 'bold',
    color: 'rgba(0,0,0,0.54)',
    textTransform: 'none',
  },
});
