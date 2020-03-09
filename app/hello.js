import React, { Component } from 'react';
import styles from './hello.css';

export default class Hello extends Component {
  render = () =>
    <div className={styles['hello-text']}>
      Hello, {this.props.name}
    </div>;
}
