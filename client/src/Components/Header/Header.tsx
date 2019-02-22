import { Identifiable, Styleable } from '@Common';
import { InternalLink } from '@Components';
import { AppBar, Avatar, Hidden, IconButton, Toolbar, Tooltip } from '@material-ui/core';
import { UnAuthenticated } from '@Modules';
import { CurrentUserQuery } from '@RadioGraphql';
import { classnames } from '@Themes';
import * as React from 'react';
import { MdMoreVert, MdVpnKey } from 'react-icons/md';
import { RouteComponentProps, withRouter } from 'react-router';
import { ErrorHeader } from './ErrorHeader';
import { Menu } from './Menu';
import { useStyles } from './styles';

const Header: React.FunctionComponent<CoreProps> = props => {
  const classes = useStyles();
  const {
    leftIcon,
    leftText,
    additionalRightIcons,
    history: { push }
  } = props;

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const openMenu = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const closeMenu = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const userQuery = CurrentUserQuery.useQuery({ suspend: false, notifyOnNetworkStatusChange: true });

  const menu = React.useMemo(() => {
    const { loading, error, data } = userQuery;
    if (loading || error || !data || (data && !data.currentUser.avatarUrl)) return <MdMoreVert />;
    return <Avatar src={data.currentUser.avatarUrl} className={classes.avatar} />;
  }, [userQuery, classes.avatar]);

  return (
    <ErrorHeader>
      <AppBar
        position={props.position || 'static'}
        className={classnames(classes.container, props.classes && props.classes.appBar)}
      >
        <Toolbar color={'primary'} className={classes.toolBarContainer}>
          <div className={classes.containerLeft}>
            {leftIcon}
            <Hidden xsDown>
              {leftText || (
                <InternalLink
                  href={'/'}
                  className={classes.homeButton}
                  TypographyProps={{
                    variant: 'h6',
                    color: 'inherit'
                  }}
                >
                  Home
                </InternalLink>
              )}
            </Hidden>
          </div>
          <div className={classes.containerRight}>
            {additionalRightIcons}
            <Hidden smDown>
              <UnAuthenticated disableLoading>
                <IconButton color={'inherit'} onClick={() => push('/login')}>
                  <Tooltip title={'Login'}>
                    <MdVpnKey />
                  </Tooltip>
                </IconButton>
              </UnAuthenticated>
            </Hidden>
            <IconButton aira-owns={openMenu ? 'menu-appbar' : null} color={'inherit'} onClick={openMenu}>
              <Tooltip title={'Menu'}>{menu}</Tooltip>
            </IconButton>
            <Menu anchorEl={anchorEl} onClose={closeMenu} />
          </div>
        </Toolbar>
      </AppBar>
    </ErrorHeader>
  );
};

interface CoreProps extends RouteComponentProps, Props {}

export default withRouter(Header);

export interface Props extends Identifiable, Styleable {
  leftIcon?: React.ReactNode;
  leftText?: React.ReactNode;
  additionalRightIcons?: React.ReactNode;
  position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
  classes?: { appBar: string };
}
