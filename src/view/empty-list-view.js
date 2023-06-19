import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const NoPointTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

function createEmptyListTemplate(filterType) {
  const noPointTextValue = NoPointTextType[filterType];
  return (
    `<p class="trip-events__msg">${noPointTextValue}</p>
    `
  );
}

export default class EmptyListView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
  }
}
