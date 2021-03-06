// Libraries
import React, { PureComponent } from 'react';

// Components
import { getAngularLoader, AngularComponent } from '@grafana/runtime';
import { EditorTabBody } from './EditorTabBody';
import './../../panel/GeneralTabCtrl';

// Types
import { PanelModel } from '../state/PanelModel';
import { DataLink } from '@grafana/data';
import { PanelOptionsGroup, DataLinksEditor } from '@grafana/ui';
import { getPanelLinksVariableSuggestions } from 'app/features/panel/panellinks/link_srv';

interface Props {
  panel: PanelModel;
}

export class GeneralTab extends PureComponent<Props> {
  element: any;
  component: AngularComponent;

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    if (!this.element) {
      return;
    }

    const { panel } = this.props;

    const loader = getAngularLoader();
    const template = '<panel-general-tab />';
    const scopeProps = {
      ctrl: {
        panel: panel,
      },
    };

    this.component = loader.load(this.element, scopeProps, template);
  }

  componentWillUnmount() {
    if (this.component) {
      this.component.destroy();
    }
  }

  onDataLinksChanged = (links: DataLink[]) => {
    this.props.panel.links = links;
    this.props.panel.render();
    this.forceUpdate();
  };

  render() {
    const { panel } = this.props;
    const suggestions = getPanelLinksVariableSuggestions();

    return (
      <EditorTabBody heading="一般" toolbarItems={[]}>
        <>
          <div ref={element => (this.element = element)} />
          <PanelOptionsGroup title="面板链接">
            <DataLinksEditor
              value={panel.links}
              onChange={this.onDataLinksChanged}
              suggestions={suggestions}
              maxLinks={10}
            />
          </PanelOptionsGroup>
        </>
      </EditorTabBody>
    );
  }
}
