import throttle from 'lodash/throttle';
import {AccentTypographyBuild, animationTitle, animationDate} from "./accent-typography-build";

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 2000;
    this.FILL_TIMEOUT = 500;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);
    this.backgroundScreenElement = document.querySelector(`.page-fill`);

    this.activeScreen = 0;
    this.prevScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    const currentPosition = this.activeScreen;
    this.prevScreen = this.activeScreen;
    this.reCalculateActiveScreenPosition(evt.deltaY);
    if (currentPosition !== this.activeScreen) {
      this.changePageDisplay();
    }
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.prevScreen = this.activeScreen;
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.toggleBackgroundElement();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
    this.addMainTitleAnimation();
  }

  changeVisibilityDisplay() {
    this.screenElements.forEach((screen) => {
      screen.classList.add(`screen--hidden`);
      screen.classList.remove(`active`);
    });
    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    setTimeout(() => {
      this.screenElements[this.activeScreen].classList.add(`active`);
    }, 500);
    this.addSectionTitleAnimation();
  }

  toggleBackgroundElement() {
    if (this.screenElements[this.activeScreen].classList.contains(`screen--prizes`) &&
      this.screenElements[this.prevScreen].classList.contains(`screen--story`)) {
      this.backgroundScreenElement.classList.add(`is-show`);
      this.screenElements[this.prevScreen].classList.remove(`screen--hidden`);
      this.screenElements[this.activeScreen].classList.add(`screen--hidden`);
      setTimeout(() => {
        this.changeVisibilityDisplay();
        this.backgroundScreenElement.classList.remove(`is-show`);
        this.screenElements[this.prevScreen].classList.add(`screen--hidden`);
        this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
      }, this.FILL_TIMEOUT);
    } else {
      this.backgroundScreenElement.classList.remove(`is-show`);
      this.changeVisibilityDisplay();
    }
  }

  addMainTitleAnimation() {
    if (this.activeScreen === 0) {
      const title = document.querySelector(`.animation-text--title`);
      setTimeout(() => {
        animationTitle.runAnimation();
      }, 500);

      title.addEventListener(`transitionend`, () => {
        animationDate.runAnimation();
      });
    } else {
      animationTitle.destroyAnimation();
      animationDate.destroyAnimation();
    }
  }

  addSectionTitleAnimation() {
    if (this.screenElements[this.activeScreen].id) {
      const animationScreenTitle = new AccentTypographyBuild(
          `.animation-text.animation-text--${this.screenElements[this.activeScreen].id}`,
          200,
          `active`,
          `transform`);

      let screenTitle = document.querySelector(
          `.animation-text.animation-text--${this.screenElements[this.activeScreen].id}`);

      if (screenTitle && screenTitle.classList.contains(`active`)) {
        animationScreenTitle.destroyAnimation();
      }
      setTimeout(() => {
        animationScreenTitle.runAnimation();
      }, 500);
    }
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
