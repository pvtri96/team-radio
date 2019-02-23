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
  }
}));
