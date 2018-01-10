import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withRouter from 'react-router-dom/withRouter';
import { addSong } from 'Redux/api/currentStation/actions';
import { replayRequest } from 'Redux/page/station/actions';
import Grid from 'material-ui/Grid';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import withStyles from 'material-ui/styles/withStyles';
import classNames from 'classnames';
import { Images } from 'Theme';
import styles from './styles';

/* eslint-disable no-shadow */
/* eslint-disable camelcase */
class HistoryItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      replay: false,
    };

    this._onReplayClick = this._onReplayClick.bind(this);
  }

  _onReplayClick() {
    const {
      addSong,
      replayRequest,
      match: { params: { stationId } },
      userId,
      url,
      title,
      thumbnail,
    } = this.props;
    addSong({
      songUrl: url,
      title,
      thumbnail,
      stationId,
      userId,
    });
    replayRequest();
  }

  render() {
    const { thumbnail, title, creator, classes } = this.props;
    return (
      <Grid container className={classNames(classes.container)}>
        <Grid item xs={3} className={classes.thumbnail}>
          <img className={classes.img} src={thumbnail} />
        </Grid>
        <Grid item xs={9} className={classes.info}>
          <Grid container>
            <Grid item xs={9}>
              <div className={classes.name}>{title}</div>
              {creator && (
                <div className={classes.creator}>
                  Added by
                  <Tooltip placement={'bottom'} title={creator.name}>
                    <img
                      src={creator.avatar_url || Images.avatar.default}
                      className={classes.creatorAvatar}
                      onClick={this._onCreatorIconClicked}
                    />
                  </Tooltip>
                </div>
              )}
            </Grid>
            <Grid item xs={3} className={classes.replayContainer}>
              <IconButton color="default" onClick={this._onReplayClick}>
                replay
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

HistoryItem.propTypes = {
  classes: PropTypes.any,
  url: PropTypes.string,
  thumbnail: PropTypes.string,
  title: PropTypes.any,
  creator: PropTypes.object,
  addSong: PropTypes.func,
  match: PropTypes.any,
  userId: PropTypes.any,
  replayRequest: PropTypes.func,
};

const mapStateToProps = ({ api }) => ({
  userId: api.user.data.userId,
});

const mapDispatchToProps = dispatch => ({
  addSong: option => dispatch(addSong(option)),
  replayRequest: () => dispatch(replayRequest()),
});

export default compose(
  withStyles(styles),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(HistoryItem);
