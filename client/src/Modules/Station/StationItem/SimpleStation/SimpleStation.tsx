import { InternalLink } from '@Components';
import { Typography } from '@material-ui/core';
import { classnames } from '@Themes';
import * as React from 'react';
import { StationItemProps } from '..';
import { useStyles } from './styles';

const SimpleStation: React.FunctionComponent<CoreProps> = props => {
  const { station, id, style, className, LinkProps } = props;
  const classes = useStyles();

  return (
    <InternalLink href={`./station/${station.stationId}`} disableTypography {...LinkProps}>
      <div id={id} className={classnames(classes.stationContainer, className)} style={style}>
        <div className={classes.avatarContainer}>
          <img
            src={station.thumbnail || '/images/station_default_cover.png'}
            alt={station.stationId}
            className={classes.img}
          />
          <Typography variant={'body1'} className={classes.onlineNumber}>
            {station.onlineCount} online
          </Typography>
        </div>
        <Typography variant={'subtitle1'} color={'textPrimary'} className={classes.stationName}>
          {station.stationName}
        </Typography>
      </div>
    </InternalLink>
  );
};

interface CoreProps extends Props {}

export default SimpleStation;

export interface Props extends StationItemProps {}
