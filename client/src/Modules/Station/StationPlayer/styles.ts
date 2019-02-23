import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: 'inherit',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    padding: spacing.largeUnit,
    backgroundColor: palette.common.transparent(0.3),
    color: palette.common.white
  }
}));
