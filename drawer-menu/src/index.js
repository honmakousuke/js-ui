import helloContainer from './lib/hello-container';
import './assets/index.scss'; // scssファイルをimport

const app = document.getElementById('app');

app.appendChild(helloContainer());
