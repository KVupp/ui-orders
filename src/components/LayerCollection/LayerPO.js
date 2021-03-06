import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import _ from 'lodash';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import { Layer } from '@folio/stripes-components';
import { ReceiveItems, Received } from '../Receive';
import { POForm } from '../PurchaseOrder';

class LayerPO extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    location: PropTypes.object.isRequired,
    stripes: PropTypes.object.isRequired,
    onCancel: PropTypes.func,
    parentResources: PropTypes.object.isRequired,
    parentMutator: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.transitionToParams = transitionToParams.bind(this);
    this.connectedPOForm = props.stripes.connect(POForm);
    this.connectedReceiveItems = props.stripes.connect(ReceiveItems);
    this.connectedReceived = props.stripes.connect(Received);
  }

  updatePO(data) {
    const deep = _.cloneDeep(data);
    delete deep.created_by_name;
    delete deep.assigned_to_user;
    delete deep.vendor_name;
    this.props.parentMutator.records.PUT(deep).then(() => {
      this.props.onCancel();
    });
  }

  updatePOLine(data) {
    this.props.parentMutator.poLine.PUT(data).then(() => {
      this.props.onCancel();
    });
  }

  render() {
    const { initialValues, location } = this.props;
    const query = location.search ? queryString.parse(location.search) : {};

    return (
      <div>
        <Layer isOpen={query.layer ? query.layer === 'edit' : false} label="Edit Order Dialog">
          <this.connectedPOForm initialValues={initialValues} onSubmit={(record) => { this.updatePO(record); }} {...this.props} />
        </Layer>
        <Layer isOpen={query.layer ? query.layer === 'receive-items' : false} label="Receive Items">
          <this.connectedReceiveItems openReceived={this.openReceived} {...this.props} />
        </Layer>
        <Layer isOpen={query.layer ? query.layer === 'received' : false} label="Received">
          <this.connectedReceived {...this.props} />
        </Layer>
      </div>
    );
  }
}

export default LayerPO;
