import { Loading } from '@Components';
import { Typography } from '@material-ui/core';
import { RealTimeStationsQuery, RealTimeStationsSubscription } from '@RadioGraphql';
import * as React from 'react';
import { StationsHelper } from 'team-radio-shared';
import { StationControllerContext } from '../StationContext';
import { StationItemProps } from '../StationItem';
import { useStyles } from './styles';

const StationList: React.FunctionComponent<CoreProps> = props => {
  const classes = useStyles();

  const { data, error, loading } = RealTimeStationsSubscription.useQueryWithSubscription({
    suspend: false,
    notifyOnNetworkStatusChange: true
  });

  const renderWrapper = React.useCallback(
    (children: (data: RealTimeStationsQuery.Station[]) => React.ReactElement<{}>) => {
      if (loading || !data) {
        return <Loading />;
      }

      if (error) {
        return (
          <Typography className={classes.error} color={'error'}>
            Error {error.message}
          </Typography>
        );
      }

      return children(data.items);
    },
    [classes, data, error, loading]
  );

  const { StationItem, onItemClick } = props;

  const { isJoining } = React.useContext(StationControllerContext);

  return renderWrapper(items => (
    <>
      {StationsHelper.sortRealTimeStations(items).map(station => (
        <StationItem
          key={station.id}
          station={station}
          onClick={onItemClick}
          LinkProps={{
            style: { cursor: isJoining ? 'progress' : 'pointer' },
            anchorProps: {
              onClick: e => {
                if (isJoining) e.preventDefault();
              }
            }
          }}
        />
      ))}
    </>
  ));
};

interface CoreProps extends Props {}

export default StationList;

export interface Props {
  StationItem: React.ComponentType<StationItemProps>;
  onItemClick?(): void;
  subscribeToStationsChanged?(): void;
}
