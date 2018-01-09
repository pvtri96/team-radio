import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withRouter from 'react-router-dom/withRouter';
import { NavBar, Footer } from 'Component';
import { withNotification } from 'Component/Notification';
import Backdrop from './Backdrop';
import SectionCover from './SectionCover';
import SectionContent from './SectionContent';
import Stations from './Stations';

class Landing extends Component {
  componentWillReceiveProps(nextProps) {
    const { history } = this.props;
    const currentStationId =
      this.props.currentStation.station &&
      this.props.currentStation.station.station_id;
    const nextStationId =
      nextProps.currentStation.station &&
      nextProps.currentStation.station.station_id;
    if (currentStationId !== nextStationId) {
      history.push(`/station/${nextStationId}`);
    }
  }

  render() {
    return [
      <NavBar key={1} />,
      <Backdrop key={2} />,
      <Stations key={3} />,
      <SectionCover key={4} />,
      <SectionContent key={5} />,
      <Footer key={6} />,
    ];
  }
}

Landing.propTypes = {
  notification: PropTypes.object,
  currentStation: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = state => ({
  currentStation: state.api.currentStation,
});

export default compose(connect(mapStateToProps), withRouter, withNotification)(
  Landing,
);
