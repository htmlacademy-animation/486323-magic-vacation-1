class AccentTypographyBuild {
  constructor(
      elementSelector,
      timer,
      classForActivate,
      property,
      isOneLine = true
  ) {
    this._elementSelector = elementSelector;
    this._timer = timer;
    this._classForActivate = classForActivate;
    this._property = property;
    this._element = document.querySelector(this._elementSelector);
    this._timeOffset = 0;
    this._delay = 300;
    this._isOneLine = isOneLine;

    this.prePareText();
  }

  _addDelay(indexLetter, indexWord) {
    let delay = this._delay;
    if (this._isOneLine) {
      delay = 0;
    }
    if ((indexLetter + 1) % 3 === 0) {
      this._timeOffset = 50 + indexWord * delay;
    } else if ((indexLetter + 1) % 3 === 1) {
      this._timeOffset = 150 + indexWord * delay;
    } else if ((indexLetter + 1) % 3 === 2) {
      this._timeOffset = 100 + indexWord * delay;
    }
    return this._timeOffset;
  }

  createElement(letter, indexWord, indexLetter) {
    const span = document.createElement(`span`);
    span.textContent = letter;
    span.style.transition = `${this._property} ${this._timer}ms ease ${this._addDelay(indexLetter, indexWord)}ms`;
    // this._timeOffset += 20;
    return span;
  }

  prePareText() {
    if (!this._element) {
      return;
    }
    const text = this._element.textContent.trim().split(` `).filter((letter)=>letter !== ``);

    const content = text.reduce((fragmentParent, word, indexWord) => {
      const wordElement = Array.from(word).reduce((fragment, letter, indexLetter) => {
        fragment.appendChild(this.createElement(letter, indexWord, indexLetter));
        return fragment;
      }, document.createDocumentFragment());
      const wordContainer = document.createElement(`span`);
      wordContainer.classList.add(`animation-text__word`);
      wordContainer.appendChild(wordElement);
      fragmentParent.appendChild(wordContainer);
      return fragmentParent;
    }, document.createDocumentFragment());

    this._element.innerHTML = ``;
    this._element.appendChild(content);
  }

  runAnimation() {
    if (!this._element) {
      return;
    }
    this._element.classList.add(this._classForActivate);
  }

  destroyAnimation() {
    this._element.classList.remove(this._classForActivate);
  }
}

const animationTitle = new AccentTypographyBuild(
    `.animation-text.animation-text--title`,
    500,
    `active`,
    `transform`,
    false);

const animationDate = new AccentTypographyBuild(
    `.animation-text.animation-text--date`,
    300,
    `active`,
    `transform`);


export {
  AccentTypographyBuild,
  animationTitle,
  animationDate
};

