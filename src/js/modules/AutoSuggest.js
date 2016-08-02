var AutoSuggest = (function(window, $) {
  'use strict';

  var publicAPI = {},
      _keys = {
        ESC: 27,
        TAB: 9,
        ENTER: 13,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
      },
      _moduleClass = 'autosuggest',
      _inputClass = 'autosuggest__input',
      _suggestionContainerClass = 'autosuggest__result',
      _suggestionClass = 'autosuggest__item',
      _linkClass = 'autosuggest__link',
      _selectedClass = 'is-selected',
      options = {
        delay: 250,
        isLocal: false,
        localData: null,
        limit: 2,
        noResultMsg: '#{query} tidak ditemukan.',
        ajaxSettings: {
          serviceURL: '',
          type: 'GET',
          paramName: 'input'
        }
      };

  function _lookupFilter (suggestion, queryLowerCase) {
    return suggestion.title.toLowerCase().indexOf(queryLowerCase) !== -1;
  }

  function _escapeRegExChars(value) {
    return value.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
  }

  publicAPI.init = function(userOpts){

    $.extend( options, userOpts );

    this.moduleEl = $('.'+_moduleClass).first();
    this.input = this.moduleEl.find('.autosuggest__input');
    this.input.attr('autocomplete', 'off');
    this.currentValue = this.input.val().trim();
    this.suggestionContainer = this.moduleEl.find('.'+_suggestionContainerClass);
    this.typingInterval = 0;
    this.intervalID = 0;
    this.visible = false;
    this.selectedIndex = -1;
    this.suggestions = [];

    this.bindEvents();

    console.log('Module initialize');
  }

  publicAPI.bindEvents = function () {
    this.moduleEl.on('keydown.autosuggest', '.'+_inputClass, this.keyDown.bind(this));
    this.moduleEl.on('keyup.autosuggest', '.'+_inputClass, this.keyUp.bind(this));
    this.moduleEl.on('blur.autosuggest', '.'+_inputClass, this.onBlur.bind(this));
    this.moduleEl.on('focus.autosuggest', '.'+_inputClass, this.onFocus.bind(this));

    this.suggestionContainer.on('mouseenter.autosuggest', '.'+_suggestionClass, this.mouseEnter.bind(this));
    this.suggestionContainer.on('mouseleave.autosuggest', '.'+_suggestionClass, this.mouseLeave.bind(this));
  }

  publicAPI.keyDown = function (e) {
    console.log('onKeydown');
    // If suggestions are hidden and user presses arrow down, display suggestions:
    if (!this.visible && this.suggestions.length > 0 && e.which === _keys.DOWN && this.currentValue) {
      this.show();
      return;
    }

    switch (e.which) {
      case _keys.ESC:
        // this.input.val(this.currentValue);
        console.log('escape');
        this.hide();
        break;
      case _keys.UP:
        console.log('move up');
        this.moveUp();
        break;
      case _keys.DOWN:
        console.log('move down');
        this.moveDown();
        break;
      case _keys.TAB:
        if (this.selectedIndex === -1 || this.visible) {
          this.hide();
          return;
        }
        break;
      case _keys.ENTER:
        if (this.selectedIndex !== -1 && this.visible) {
          e.preventDefault();
          e.stopPropagation();

          this.redirect(this.selectedIndex);
          return;
        }
        break;
      default:
        this.clearCountdown();
        return;
    }

    // Cancel event if function did not return:
    e.stopImmediatePropagation();
    e.preventDefault();
  }

  publicAPI.keyUp = function (e) {
    console.log('onKeyup');
    switch (e.which) {
      case _keys.UP:
      case _keys.RIGHT:
      case _keys.DOWN:
      case _keys.LEFT:
      case _keys.ESC:
      case _keys.ENTER:
        return;
    }

    if (this.currentValue !== this.input.val()) {
      console.log('value not same');
      this.startCountdown();
    }
  };

  publicAPI.moveUp = function () {
    console.log('onMoveUp');
    if (this.selectedIndex === -1) {
      return;
    }

    if (this.selectedIndex === 0) {
      // this.suggestionContainer.children().first().removeClass(_selectedClass);
      this.selectedIndex = this.suggestions.length - 1;

      this.activate(this.selectedIndex);
    } else {
      this.activate(this.selectedIndex - 1);
    }
  };

  publicAPI.moveDown =  function () {
    console.log('onMoveDown');

    if (this.selectedIndex === (this.suggestions.length - 1)) {
      this.selectedIndex = 0;
      this.activate(this.selectedIndex);
    } else {
      this.activate(this.selectedIndex + 1);
    }

  };

  publicAPI.onFocus = function (e) {
    console.log('onFocus');

    if (this.suggestions.length > 0) {
      this.show();
    }
  };

  publicAPI.onBlur = function (e) {
    console.log('onBlur');

    this.enableKillerFn();
  };

  publicAPI.killerFn = function (e) {
    console.log('onKillerFn');
    if (!$(e.target).closest('.'+_moduleClass).length) {
      this.killSuggestions();
      this.disableKillerFn();
    }
  };

  publicAPI.enableKillerFn = function () {
    console.log('enableKillerFn');
    var that = this;
    $(document).on('click.autosuggest', this.killerFn.bind(this));
  };

  publicAPI.disableKillerFn =  function () {
    console.log('disableKillerFn');
    var that = this;
    $(document).off('click.autosuggest', this.killerFn.bind(this));
  };

  publicAPI.killSuggestions = function () {
    console.log('killSuggestions');
    this.stopKillSuggestions();
    this.intervalID = window.setInterval(function () {
      if (this.visible) {
        this.hide();
      }

      this.stopKillSuggestions();
    }.bind(this), 50);
  };

  publicAPI.stopKillSuggestions = function () {
    console.log('stopKillSuggestions');
    window.clearInterval(this.intervalID);
  };

  publicAPI.activate = function (index) {

    var activeItem,
        selected = _selectedClass,
        container = this.suggestionContainer,
        children = container.children();

    container.find('.' + selected).removeClass(selected);

    this.selectedIndex = index;

    console.log('index', this.selectedIndex);

    if (this.selectedIndex !== -1 && children.length > this.selectedIndex) {
      // console.log(children.get(this.selectedIndex));
      // console.log(children.eq(this.selectedIndex));

      activeItem = children.eq(this.selectedIndex);
      activeItem.addClass(selected);
      this.input.val(activeItem.text());

      return;
    }

    return;
  };

  publicAPI.redirect = function (index) {
    var activeItem = this.suggestionContainer.find('.'+_selectedClass),
        url = activeItem.find('.'+_linkClass).attr('href');

    window.location.href = url;

  }

  publicAPI.startCountdown = function (e) {

    console.log('start countdown');

    this.clearCountdown();

    this.typingInterval = window.setTimeout(this.doneTyping.bind(this), options.delay);
  };

  publicAPI.clearCountdown = function (e) {
    console.log('clear countdown');

    window.clearTimeout(this.typingInterval);
  };

  publicAPI.doneTyping = function (e) {

    this.currentValue = this.input.val().trim();

    if(this.currentValue.length === 0) {
      this.clearSuggestions();

      return;
    }

    this.getSuggestions(this.currentValue);
    console.log('i\'m done typing, my value is: ', this.currentValue);
  };

  publicAPI.getSuggestions = function (query) {
    var self = this, suggestions;

    if (options.isLocal && options.localData) {
      suggestions = self.getSuggestionsLocal(query);
      self.insertSuggestions(suggestions, query);
    } else {
      var param = {};
      param[options.ajaxSettings.paramName] = query;

      $.ajax({
        url: options.ajaxSettings.serviceURL,
        type: options.ajaxSettings.type,
        dataType: 'json',
        data: param
      })
      .done(function(suggestions, textStatus, jqXHR ) {
        self.insertSuggestions(suggestions, query);
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      });

    }
  };

  publicAPI.insertSuggestions = function(suggestions, query) {
    var html = '';

    if(suggestions.results && suggestions.results.length > 0){
      $.each(suggestions.results, function(i, suggestion) {
        html += '<div class="autosuggest__item" data-index="'+i+'">';
          html += '<a href="'+suggestion.url+'" class="autosuggest__link">';
            html += this.formatResult(suggestion.title, query);
          html += '</a>';
        html += '</div>';
      }.bind(this));
    } else {
      html += '<div class="autosuggest__item">';
        html += '<div class="autosuggest__error">';
          if (options.noResultMsg.indexOf('#{query}') !== -1) {
            html += options.noResultMsg.replace("#{query}", '<strong>'+query+'</strong>');
          } else {
            html += options.noResultMsg;
          }
        html += '</div>';
      html += '</div>';
    }

    this.suggestions = suggestions.results;
    this.suggestionContainer.html(html);

    this.show();

    console.log(this.suggestions);
  };

  publicAPI.getSuggestionsLocal = function (query) {
    var queryLowerCase = query.toLowerCase(),
        limit = parseInt(options.limit, 10),
        data;

    data = {
      results: $.grep(options.localData, function (suggestion) {
        return _lookupFilter(suggestion, queryLowerCase);
      })
    };

    if (limit && data.results.length > limit) {
      data.results = data.results.slice(0, limit);
    }

    return data;
  };

  publicAPI.hide = function () {
    this.suggestionContainer.removeClass('is-active');
    this.visible = false;
    this.selectedIndex = -1;
  };

  publicAPI.show = function () {
    this.suggestionContainer.addClass('is-active');
    this.visible = true;

    var $activeItem = this.suggestionContainer.find('.'+_selectedClass);
    if($activeItem.length) {
      this.selectedIndex = parseInt($activeItem.data('index'), 10);
    }
  };

  publicAPI.mouseEnter = function (e) {
    var $this = $(e.target),
        $item;

    if ($this.hasClass('_suggestionClass')) {
      $item = $this;
    } else {
      $item = $this.closest('.'+_suggestionClass);
    }

    $item.addClass(_selectedClass);
  }

  publicAPI.mouseLeave = function () {
    this.suggestionContainer.children('.' + _selectedClass).removeClass(_selectedClass);
  }

  publicAPI.clearSuggestions = function (e) {
    this.suggestionContainer.html('');
    this.suggestions = [];
  };

  publicAPI.formatResult = function (suggestion, currentValue) {
    // Do not replace anything if there current value is empty
    if (!currentValue) {
      return suggestion;
    }

    var pattern = '(' + _escapeRegExChars(currentValue) + ')';

    // return suggestion
    return suggestion
      .replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/&lt;(\/?strong)&gt;/g, '<$1>');
  };

  return publicAPI;

}(window, jQuery));
