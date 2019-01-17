import { Badge, IconButton, Tooltip } from '@material-ui/core';
import * as React from 'react';
import { MdShare as ShareIcon, MdVolumeOff as MuteIcon, MdVolumeUp as UnMuteIcon } from 'react-icons/md';
import { TiUser as UserIcon } from 'react-icons/ti';
import { StationController } from '../StationContext';
import { useStyles } from './styles';

export const StationToolbar: React.FunctionComponent<CoreProps> = props => {
  const classes = useStyles();

  return (
    <StationController.Consumer>
      {({ muted, onlineCount, setState }) => (
        <>
          <IconButton color={'inherit'} onClick={() => setState({ muted: !muted })}>
            <Tooltip title={'Mute/Unmute'}>{muted ? <MuteIcon /> : <UnMuteIcon />}</Tooltip>
          </IconButton>
          <IconButton color={'inherit'}>
            <Tooltip title={'Share'}>
              <ShareIcon />
            </Tooltip>
          </IconButton>
          <IconButton color={'inherit'} className={classes.onlineIcon}>
            <Tooltip title={`${onlineCount} online users`}>
              <Badge badgeContent={onlineCount} color="primary" classes={{ badge: classes.onlineBadge }}>
                <UserIcon />
              </Badge>
            </Tooltip>
          </IconButton>
        </>
      )}
    </StationController.Consumer>
  );
};

interface CoreProps extends Props {}

export default StationToolbar;

export interface Props {}
