import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { Layer } from '@folio/stripes-components';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';
import { POLineForm } from '../POLine';

class LayerPOLine extends Component {
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
    this.connectedPOLineForm = this.props.stripes.connect(POLineForm);
  }

  updatePOLine(data) {
    console.log(data);
    this.props.parentMutator.poLine.PUT(data).then(() => {
      this.props.onCancel();
    });
  }

  render() {
    const { location } = this.props;
    const query = location.search ? queryString.parse(location.search) : {};

    return (
      <Fragment>
        <Layer isOpen={query.layer ? query.layer === 'edit-po-line' : false} label="Edit PO Line Dialog">
          <this.connectedPOLineForm onSubmit={(record) => { this.updatePOLine(record); }} {...this.props} />
        </Layer>
      </Fragment>
    );
  }
}

export default LayerPOLine;