import {render, RenderPosition, remove} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import {updateItem} from '../utils/util.js';
import {sortPointUp, sortTimeUp, sortPriceUp} from '../utils/util.js';
import {SortType} from '../const.js';
export default class BoardPresenter {
  //#sortComponent = new SortView();
  #sortComponent = null;
  #eventListView = new EventListView();
  #noPointComponent = new EmptyListView();

  #container = null;
  #pointsModel = null;
  #points = [];
  #pointPresenters = new Map();

  #currentSortType = SortType.DEFAULT;
  #sourcedBoardPoints = [];

  constructor({container, pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#points.sort(sortPointUp);
    this.#sourcedBoardPoints = [...this.#pointsModel.points];
    this.#renderBoard();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      eventListContainer: this.#eventListView.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
      pointsModel: this.#pointsModel
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.DEFAULT:
        this.#points.sort(sortPointUp);
        break;
      case SortType.TIME:
        this.#points.sort(sortTimeUp);
        break;
      case SortType.PRICE:
        this.#points.sort(sortPriceUp);
        break;
      default:
        this.#points = [...this.#sourcedBoardPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    // - Сортируем задачи
    // - Очищаем список
    // - Рендерим список заново
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });
    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderPoints() {
    this.#points
      .forEach((point) => this.#renderPoint(point));
  }

  #renderNoPoints() {
    render(this.#noPointComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#sortComponent);
  }

  #renderEventList() {
    render(this.#eventListView, this.#container);
    this.#renderPoints();
  }

  #renderBoard() {
    this.#renderSort();
    this.#renderEventList();

    if (this.#points.length === 0) {
      this.#renderNoPoints();
    }
  }
}
