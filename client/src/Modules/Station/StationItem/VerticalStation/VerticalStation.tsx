import { InternalLink } from '@Components';
import { Typography } from '@material-ui/core';
import { classnames } from '@Themes';
import * as React from 'react';
import { StationItemProps } from '..';
import { useStyles } from './styles';

const VerticalStation: React.FunctionComponent<CoreProps> = props => {
  const classes = useStyles();
  const { station, onClick, id, style, className, LinkProps = {} } = props;

  return (
    <InternalLink href={`/station/${station.stationId}`} disableTypography {...LinkProps}>
      <div className={classnames(classes.stationContainer, className)} id={id} style={style} onClick={onClick}>
        <div className={classes.avatarContainer}>
          <img
            src={station.thumbnail || '/images/station_default_cover.png'}
            alt={station.stationId}
            className={classes.img}
          />
        </div>
        <div className={classes.stationInfo}>
          <Typography variant={'subtitle1'} color={'default'} className={classes.stationName}>
            {station.stationName}
          </Typography>
          <Typography variant={'body1'} className={classes.onlineNumber}>
            {station.onlineCount || 0} online
          </Typography>
        </div>
      </div>
    </InternalLink>
  );
};

interface CoreProps extends Props {}

export default VerticalStation;

export interface Props extends StationItemProps {}
