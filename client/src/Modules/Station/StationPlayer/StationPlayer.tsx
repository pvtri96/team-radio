import { Card, Typography, withStyles, WithStyles } from '@material-ui/core';
import { Identifiable, ReactSubscriptionComponent, Styleable } from 'Common';
import { Loading, Player } from 'Components';
import {
  getSubscribeToMoreOptionsForRealTimeStationPlayerSubscription,
  RealTimeStationPlayerQueryPlayer,
  RealTimeStationPlayerQueryVariables,
  ReportUnavailableSongMutation,
  withRealTimeStationPlayerQuery,
  WithRealTimeStationPlayerQueryProps
} from 'RadioGraphql';
import * as React from 'react';
import { StationController } from '../StationContext';
import { styles } from './styles';

class StationPlayer extends ReactSubscriptionComponent<CoreProps> {
  public render() {
    const { id, style, className } = this.props;
    return this.renderPlayerWrapper(data => (
      <StationController.Consumer>
        {({ muted }) => (
          <ReportUnavailableSongMutation>
            {reportUnavailableSong => (
              <Player
                id={id}
                style={style}
                className={className}
                url={data && data.playing && data.playing.url}
                height="100%"
                width="100%"
                currentlyPlayedAt={data && data.currentlyPlayingAt / 1000}
                playing
                muted={muted}
                onPlayerError={(errorCode: number, url: string) => {
                  console.error(`Error while playing video`, errorCode, url);
                  reportUnavailableSong({
                    variables: { errorCode, url, stationId: this.props.params.stationId }
                  });
                }}
              />
            )}
          </ReportUnavailableSongMutation>
        )}
      </StationController.Consumer>
    ));
  }

  protected getSubscribeToMoreOptions = () => {
    return getSubscribeToMoreOptionsForRealTimeStationPlayerSubscription(this.props.params);
  };

  private renderPlayerWrapper = (children: (data?: RealTimeStationPlayerQueryPlayer) => React.ReactNode) => {
    const { classes, data } = this.props;
    let content: React.ReactNode;
    console.log(data && data.StationPlayer && data.StationPlayer.playing);

    if (data.error) {
      console.error(data.error);
      // Error
      content = <Typography color={'error'}>Error {data.error.message}</Typography>;
    } else if (data.loading) {
      // Loading
      content = <Loading />;
    } else if (!data.StationPlayer.playing && !data.StationPlayer.playlistCount) {
      // No playing song and no song in playlist
      content = <Typography>No song, add a new one to start listening.</Typography>;
    } else if (data.StationPlayer.nextSongThumbnail) {
      // Display next song thumbnail if there is one in response
      content = <img src={data.StationPlayer.nextSongThumbnail} className={classes.thumbnail} />;
    }
    return (
      <Card className={classes.container}>
        {children(data.StationPlayer)}
        {content && <div className={classes.overlayContainer}>{content}</div>}
      </Card>
    );
  };
}

interface CoreProps extends WithRealTimeStationPlayerQueryProps, WithStyles<typeof styles>, Props {}

export default withRealTimeStationPlayerQuery<Props>({
  options: (props: Props) => ({ variables: props.params, fetchPolicy: 'network-only' })
})(withStyles(styles)(StationPlayer));

export interface Props extends Identifiable, Styleable {
  params: RealTimeStationPlayerQueryVariables;
}
