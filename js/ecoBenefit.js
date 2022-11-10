let currentWidth = 0;

const singleContainer = '.single-container';
const multiContainer = '.multi-container';

const getHeight = (d) => parseFloat(d.length || d) * 30;
const getWidth = (e) => parseFloat(d3.select(e).style('width'));

const sanitizeString = (s) => s.replace(/([^a-z0-9]+)/gi, '-').toLowerCase();
