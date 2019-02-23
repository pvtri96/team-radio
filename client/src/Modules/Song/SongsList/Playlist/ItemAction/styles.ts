import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles(({ palette, spacing, typography, breakpoints }: Theme) => ({
  iconButton: {
    fontSize: typography.body1.fontSize,
    marginRight: spacing.smallUnit,
    marginLeft: spacing.smallUnit,
    padding: spacing.unit,
    [breakpoints.down('lg')]: {
      padding: spacing.smallUnit
    }
  },
  favoriteButton: {
    marginBottom: 1
  },
  badge: {
    top: 8,
    right: -10,
    background: 'inherit',
    color: palette.text.primary,
    [breakpoints.down('lg')]: {
      right: -6,
      fontSize: 9
    }
  },
  linearProgress: {
    height: 1
  }
}));
