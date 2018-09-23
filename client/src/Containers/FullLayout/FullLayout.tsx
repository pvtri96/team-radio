import { Container, Identifiable, Styleable } from 'Common';
import { Footer, Header } from 'Components';
import React from 'react';

export class CoreFullLayout extends React.Component<FullLayout.CoreProps, FullLayout.States> {
  public render() {
    return (
      <React.Fragment>
        <Header />
        {this.props.children}
        <Footer />
      </React.Fragment>
    );
  }
}

export const FullLayout: React.ComponentType<FullLayout.Props> = CoreFullLayout;

export namespace FullLayout {
  export interface CoreProps extends Props {}

  export interface Props extends Styleable, Identifiable, Container {}

  export interface States {}
}
