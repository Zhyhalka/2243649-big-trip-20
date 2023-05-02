import {render, RenderPosition} from './render.js';
import FilterView from './view/filter-view.js';
import InfoView from './view/info-view.js';
import BoardPresenter from './presenter/board-presenter.js';

const tripMainElement = document.querySelector('.trip-main');
const tripControlsFilter = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const boardPresenter = new BoardPresenter({container: tripEvents});

render(new InfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), tripControlsFilter);

boardPresenter.init();
