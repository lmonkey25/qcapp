import React, { PropTypes, Component } from 'react';
import { View, StyleSheet } from 'react-native';

import ProgressBar from 'ProgressBarAndroid';

export default class LoadingIndicator extends Component {
  constructor(props){
    super(props);
  }



  render() {
  	const colorProps = this.props.color ? {color: this.props.color} : {};
  	return (
  		<View style={[this.props.style, styles.container]}>
  			<ProgressBar styleAttr={this.props.isSmall ? 'Small' : 'Inverse'} {...colorProps} />
  		</View>
  	);
  }
};

LoadingIndicator.propTypes = {
    isSmall: PropTypes.bool,
    color: PropTypes.string,
    style: PropTypes.any
};
LoadingIndicator.defaultProps = {
    isSmall: false
};

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center'
  }
});
