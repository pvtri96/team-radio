import { createStyles, Theme } from '@material-ui/core';

export const styles = ({ zIndex }: Theme) =>
  createStyles({
    playerContainer: {
      zIndex: zIndex.appBar,
      position: 'fixed'
    }
  });