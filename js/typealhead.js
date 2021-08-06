import { line_numbers } from './index.js';

console.log(line_numbers)


const typeahead = {
    selectedIndex: -1,
    init: function() {
      this.input = document.getElementById("typeahead");
      if (!this.input) return;
      this.resultHolder = document.getElementById("typeahead-results");
      this.input.addEventListener("input", this.handleInput.bind(this));
      this.input.addEventListener("keydown", this.handleKeydown.bind(this));
    },
    handleInput: function() {
      this.clearResults();
      const { value } = this.input;
      if (value.length < 1) return;
      const strongMatch = new RegExp("^" + value, "i");
      const weakMatch = new RegExp(value, "i");
      const results = recipes
        .filter(recipe => weakMatch.test(recipe.name))
        .sort((a, b) => {
          if (strongMatch.test(a.name) && !strongMatch.test(b.name)) return -1;
          if (!strongMatch.test(a.name) && strongMatch.test(b.name)) return 1;
          return a.name < b.name ? -1 : 1;
        });
      for (const recipe of results) {
        const item = document.createElement("li");
        const matchedText = weakMatch.exec(recipe.name)[0];
        item.innerHTML = recipe.name.replace(
          matchedText,
          "<strong>" + matchedText + "</strong>"
        );
        item.dataset.permalink = recipe.permalink;
        this.resultHolder.appendChild(item);
        item.addEventListener("click", this.handleClick);
      }
    },
    handleClick: function() {
      window.location.href = this.dataset.permalink;
    },
    getResults: function() {
      return this.resultHolder.children;
    },
    clearResults: function() {
      this.selectedIndex = -1;
      while (this.resultHolder.firstChild) {
        this.resultHolder.removeChild(this.resultHolder.firstChild);
      }
    },
    handleKeydown: function(event) {
      const { keyCode } = event;
      const results = this.getResults();
      if (keyCode === 40 && this.selectedIndex < results.length - 1) {
        this.selectedIndex++;
      } else if (keyCode === 38 && this.selectedIndex >= 0) {
        this.selectedIndex--;
      } else if (keyCode === 13 && results[this.selectedIndex]) {
        window.location.href = results[this.selectedIndex].dataset.permalink;
      }
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const selectedClass = "selected";
        if (i === this.selectedIndex) {
          result.classList.add(selectedClass);
        } else if (result.classList.contains(selectedClass)) {
          result.classList.remove(selectedClass);
        }
      }
    }
  };

  typeahead.init();

  function populateLines(theLines){
      console.log(theLines)
      theLines.forEach(line=>console.log(line))
  }

line_numbers.forEach(linedata => populateLines(linedata))