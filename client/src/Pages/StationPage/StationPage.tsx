import { Loading } from '@Components';
import { useMutedLocalStorage } from '@Hooks';
import {
  StationControllerContext,
  StationPlayer,
  StationPlayerControllerProvider,
  StationPlayerPositionContext,
  StationTab,
  useStationIO,
  useStationLayout
} from '@Modules';
import { useStyles } from '@Pages/StationPage/styles';
import { RealTimeStationQuery, RealTimeStationSubscription } from '@RadioGraphql';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

const StationPage: React.FunctionComponent<CoreProps> = props => {
  const classes = useStyles();

  const variables = React.useMemo<RealTimeStationQuery.Variables>(() => {
    return { stationId: props.match.params.stationId };
  }, [props.match.params.stationId]);

  const stationIOState = useStationIO(variables);

  const { data, loading, error } = RealTimeStationSubscription.useQueryWithSubscription({
    variables,
    suspend: false,
    notifyOnNetworkStatusChange: true
  });

  const stationName = React.useMemo(() => {
    if (!loading && !error) {
      return <span>{data && data.item.stationName}</span>;
    }
    return <Loading color={'inherit'} />;
  }, [data, loading, error]);

  const onlineAnonymous = React.useMemo<RealTimeStationQuery.OnlineAnonymous[]>(
    () => (data && data.item ? data.item.onlineAnonymous : []),
    [data]
  );
  const onlineUsers = React.useMemo<RealTimeStationQuery.OnlineUser[]>(
    () => (data && data.item ? data.item.onlineUsers : []),
    [data]
  );
  const onlineCount = React.useMemo<number>(() => (data && data.item ? data.item.onlineCount : 0), [data]);

  const [muted, setMuted] = useMutedLocalStorage<boolean>(false);

  const { getLayoutProps, Layout } = useStationLayout();

  return (
    <StationControllerContext.Provider
      value={{ muted, onlineAnonymous, onlineCount, onlineUsers, setMuted, isJoining: stationIOState.isJoining }}
    >
      <StationPlayerControllerProvider>
        <Layout {...getLayoutProps(stationName)} />
        <StationPlayerPositionContext.Consumer>
          {({ top, left, width, height }) => (
            <div style={{ top, left, width, height }} className={classes.playerContainer}>
              <StationPlayer params={props.match.params} />
            </div>
          )}
        </StationPlayerPositionContext.Consumer>
      </StationPlayerControllerProvider>
    </StationControllerContext.Provider>
  );
};

interface CoreProps extends RouteComponentProps<PageParams>, Props {}

export default withRouter(StationPage);

export interface PageParams {
  stationId: string;
  tab?: StationTab;
}
export interface Props {}
