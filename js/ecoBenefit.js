let currentWidth = 0;

const singleContainer = '.single-container';
const multiContainer = '.multi-container';

const getHorizontalChartHeight = (d) => Math.floor(parseFloat((d.length || d) * 30));

const getElementHeight = (e) => Math.floor(parseFloat($(e).height()));
const getElementWidth = (e) => Math.floor(parseFloat($(e).width()));

const getSVGHeight = (de) => Math.floor(parseFloat(de.node().getBBox().height));
const getSVGWidth = (de) => Math.floor(parseFloat(de.node().getBBox().width));

const sanitizeString = (s) => s.replace(/([^a-z0-9]+)/gi, '-').toLowerCase();
