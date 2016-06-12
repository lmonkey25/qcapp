import React, { Component } from 'react';

import { PropTypes, ActivityIndicatorIOS, StyleSheet } from 'react-native';

export default class LoadingIndicator extends Component {
  constructor(props){
    super(props);
  }

  static propTypes = {
    isSmall: PropTypes.bool,
    color: PropTypes.string,
    style: PropTypes.any
  };

  static defaultProps = {
  	isSmall: false
  };

  render() {
  	const colorProps = this.props.color ? {color: this.props.color} : {};
  	return (
			<ActivityIndicatorIOS animating={true} size={this.props.isSmall ? 'small' : 'large'} style={this.props.style} {...colorProps} />
  	);
  }
};
