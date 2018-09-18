import { Authorization } from 'authProvider';
import * as React from 'react';
import { connect } from 'react-redux';

const { getResources, WithPermissions, MenuItemLink, Responsive } = require('react-admin');

const CoreMenu = ({ resources, onMenuClick, logout }: any) => {
  return (
    <div>
      {resources.map((resource: any) => {
        return (
          <WithPermissions
            key={resource.name}
            render={({ permissions }: { permissions: Authorization.Permissions }) => {
              if (resource.name === 'users' && !Authorization.isAdmin(permissions)) return null;
              return (
                <MenuItemLink
                  to={`/${resource.name}`}
                  primaryText={getMenuItemLabel(resource.name)}
                  leftIcon={React.createElement(resource.icon)}
                  onClick={onMenuClick}
                />
              );
            }}
          />
        );
      })}
      <Responsive small={logout} medium={null} />
    </div>
  );
};

function getMenuItemLabel(name: string) {
  switch (name) {
    case 'playlistSongs':
      return 'Playlist';
    case 'historySongs':
      return 'History';
    default:
      return name.charAt(0).toUpperCase() + name.slice(1);
  }
}

const mapStateToProps = (state: object) => ({
  resources: getResources(state)
});

export const Menu = connect(mapStateToProps)(CoreMenu);
