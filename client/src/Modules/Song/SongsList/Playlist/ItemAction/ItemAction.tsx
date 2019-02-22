import { ErrorHelper } from '@Error';
import { useToggle } from '@Hooks';
import { Badge, Grid, IconButton, LinearProgress } from '@material-ui/core';
import { Authenticated, ToastContext, ToastSeverity } from '@Modules';
import { MutationFn } from 'react-apollo-hooks/lib/useMutation';
import { useAuthenticated } from '@Modules/Authentication/Authenticated';
import {
  CurrentUserQuery,
  DownVoteSongMutation,
  RealTimeStationPlaylistQuery,
  UpVoteSongMutation
} from '@RadioGraphql';
import { classnames } from '@Themes';
import * as React from 'react';
import { MdFavorite, MdThumbDown, MdThumbUp } from 'react-icons/md';
import { useStyles } from './styles';

const PlaylistItemAction: React.FunctionComponent<CoreProps> = props => {
  const classes = useStyles();
  const { song, currentPlayingSongId } = props;

  const [isMutating, isMutatingAction] = useToggle(false);

  const toastContext = React.useContext(ToastContext);

  const voteRating = React.useMemo<number>(() => {
    const upVotes = song.upVotes.length;
    const downVotes = song.downVotes.length;
    if (upVotes === 0 && downVotes === 0) return 50;
    return (upVotes / (upVotes + downVotes)) * 100;
  }, [song.upVotes, song.downVotes]);

  const upVote = UpVoteSongMutation.useMutation({ variables: { songId: props.song.id } });
  const downVote = DownVoteSongMutation.useMutation({ variables: { songId: props.song.id } });

  const getOnClickCallback = React.useCallback(
    (fn: MutationFn<any, any>) => async () => {
      try {
        isMutatingAction.toggleOn();
        await fn();
        isMutatingAction.toggleOff();
      } catch (e) {
        const gqlError = ErrorHelper.extractError(e);
        if (gqlError) toastContext.add({ message: gqlError.message, severity: ToastSeverity.ERROR });
      }
    },
    []
  );

  const { error, loading, data } = CurrentUserQuery.useQuery({ suspend: false });

  if (error || loading || !data) return null;

  return (
    <Grid container>
      <div>
        <Grid container>
          <Grid item xs={12}>
            <IconButton
              disabled={isMutating}
              className={classes.iconButton}
              onClick={getOnClickCallback(upVote)}
              color={song.upVotes.includes(data.currentUser.id) ? 'primary' : undefined}
            >
              <Badge badgeContent={`${song.upVotes.length}`} color={'primary'} classes={{ badge: classes.badge }}>
                <MdThumbUp />
              </Badge>
            </IconButton>
            <IconButton
              disabled={isMutating}
              className={classes.iconButton}
              onClick={getOnClickCallback(downVote)}
              color={song.downVotes.includes(data.currentUser.id) ? 'primary' : undefined}
            >
              <Badge badgeContent={`${song.downVotes.length}`} color={'primary'} classes={{ badge: classes.badge }}>
                <MdThumbDown />
              </Badge>
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <LinearProgress className={classes.linearProgress} variant={'determinate'} value={voteRating} />
          </Grid>
        </Grid>
      </div>
      <Authenticated>
        <IconButton className={classnames(classes.iconButton, classes.favoriteButton)}>
          <MdFavorite />
        </IconButton>
      </Authenticated>
    </Grid>
  );
};

interface CoreProps extends Props {}

export default PlaylistItemAction;

export interface Props {
  song: RealTimeStationPlaylistQuery.PlaylistSong;
  currentPlayingSongId?: string;
}
