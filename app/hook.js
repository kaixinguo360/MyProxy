import Hello from './hello.js';
import React from 'react';
import { render } from 'react-dom';
import config from './config.json';

render(
  <Hello name={config.name} />,
  document.getElementById('root')
);
