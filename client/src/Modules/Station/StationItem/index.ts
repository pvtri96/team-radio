import { Identifiable, Styleable } from '@Common';
import { Props as InternalLinkProps } from '@Components/InternalLink/InternalLink';
import { SimpleStation } from './SimpleStation';
import { VerticalStation } from './VerticalStation';

export const StationItem = {
  SimpleStation,
  VerticalStation
};

export interface StationItemProps extends Identifiable, Styleable {
  station: {
    id: string;
    stationId: string;
    stationName: string;
    onlineCount: number;
    thumbnail?: string;
  };
  LinkProps?: Partial<InternalLinkProps>;
  onClick?(): void;
}
